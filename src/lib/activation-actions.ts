"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "./supabase/server";
import { getMyEstablishments, type MyEstablishment } from "./dashboard";
import { createSupabaseAdmin } from "./supabase/admin";
import {
  normalizeEmail,
  sendLoginCode,
  verifyLoginCode,
  currentOrigin,
} from "./auth-code";
import { clientKey, rateCount, rateRecord } from "./rate-limit";
import { normalizeReviewUrl, REVIEW_URL_ERROR } from "./review-url";
import { notifyActivation } from "./activation-notify";
import { CONTACT_EMAIL, CONTACT_PHONE } from "./brand";
import type { FormState } from "./form";

/**
 * Activation d'un présentoir (parcours « scan » et rattachement depuis
 * l'espace). Règles de sécurité :
 * - le secret imprimé sur le présentoir n'est valable que tant que le
 *   présentoir est vierge, et ses essais sont limités ;
 * - l'adresse e-mail est VÉRIFIÉE par un code avant toute activation : le
 *   présentoir est toujours rattaché au compte de la personne connectée ;
 * - l'activation passe exclusivement par le serveur (RPC réservée au service
 *   role), qui notifie l'admin et le commerçant.
 */

const CONTACT = CONTACT_PHONE
  ? `${CONTACT_PHONE.display} ou ${CONTACT_EMAIL}`
  : CONTACT_EMAIL;

const ERRORS: Record<string, string> = {
  stand_not_found: "Ce présentoir est introuvable.",
  stand_already_assigned: `Ce présentoir est déjà activé. S'il est à vous et que vous ne l'avez pas activé vous-même, contactez-nous : ${CONTACT}.`,
  invalid_pin:
    "Code secret incorrect. Il est imprimé sur le présentoir, à côté du QR code (8 caractères).",
  secret_missing: `Ce présentoir doit être activé par notre équipe. Contactez-nous : ${CONTACT}.`,
  establishment_not_owned: "Commerce introuvable sur votre compte.",
  name_required: "Renseignez le nom de votre commerce.",
  invalid_review_url: REVIEW_URL_ERROR,
  account_disabled: `Votre compte est suspendu. Contactez-nous : ${CONTACT}.`,
  not_authenticated: "Votre session a expiré. Recommencez l'activation.",
};

function mapError(message: string | undefined, fallback: string): string {
  if (!message) return fallback;
  const key = Object.keys(ERRORS).find((k) => message.includes(k));
  return key ? ERRORS[key] : fallback;
}

const LOCKED =
  "Trop d'essais de code secret. Patientez une heure, ou contactez-nous si le problème persiste.";

/** Limites du secret : 15 erreurs / heure par IP, 30 / heure par présentoir. */
async function secretLocked(code: string, ip: string): Promise<boolean> {
  const [byIp, byStand] = await Promise.all([
    rateCount("secret_fail_ip", ip, 3600),
    rateCount("secret_fail_stand", code, 3600),
  ]);
  return byIp >= 15 || byStand >= 30;
}

async function recordSecretFailure(code: string, ip: string): Promise<void> {
  await Promise.all([
    rateRecord("secret_fail_ip", ip),
    rateRecord("secret_fail_stand", code),
  ]);
}

/** Code du présentoir, saisi seul ou collé avec son adresse (r.reviu.fr/…). */
function cleanCode(input: string): string {
  const raw = input.trim().toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
  return raw.slice(raw.lastIndexOf("/") + 1);
}

// ---- Étape 1 : secret + e-mail -> envoi du code ----------------------------
export async function requestActivationCode(input: {
  code: string;
  pin: string;
  email: string;
}): Promise<{ ok: true; email: string; codeLength: number } | { ok: false; error: string }> {
  const code = cleanCode(input.code);
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "Renseignez une adresse e-mail valide." };
  if (!input.pin.trim()) {
    return { ok: false, error: "Saisissez le code secret imprimé sur le présentoir." };
  }

  const admin = createSupabaseAdmin();
  if (!admin) {
    return { ok: false, error: "Service momentanément indisponible. Réessayez plus tard." };
  }
  const ip = await clientKey();
  if (await secretLocked(code, ip)) return { ok: false, error: LOCKED };

  const { error } = await admin.rpc("check_stand_secret", {
    p_code: code,
    p_pin: input.pin,
  });
  if (error) {
    if (error.message.includes("invalid_pin")) await recordSecretFailure(code, ip);
    return { ok: false, error: mapError(error.message, "Vérification impossible. Réessayez.") };
  }

  const sent = await sendLoginCode({
    email,
    purpose: "activation",
    next: `/activer/${code}`,
  });
  if (!sent.ok) return sent;
  return { ok: true, email, codeLength: sent.codeLength };
}

// ---- Étape 2 : code reçu -> session ouverte --------------------------------
export async function verifyActivationCode(input: {
  email: string;
  token: string;
}): Promise<
  { ok: true; email: string; establishments: MyEstablishment[] } | { ok: false; error: string }
> {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "Adresse e-mail invalide." };
  const res = await verifyLoginCode(email, input.token);
  if (!res.ok) return res;
  return { ok: true, email, establishments: await getMyEstablishments() };
}

// ---- Étape 3 : activation par le compte connecté ---------------------------
type ActivationOk = {
  ok: true;
  establishmentName: string;
  email: string;
};

async function activateForCurrentUser(input: {
  code: string;
  pin: string;
  establishmentId?: string | null;
  name?: string;
  googleUrl?: string;
  via: "scan" | "dashboard";
}): Promise<ActivationOk | { ok: false; error: string }> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, error: ERRORS.not_authenticated };

  const code = cleanCode(input.code);
  if (!code) return { ok: false, error: "Saisissez le code du présentoir." };
  if (!input.pin.trim()) {
    return { ok: false, error: "Saisissez le code secret imprimé sur le présentoir." };
  }

  let googleUrl: string | null = null;
  if (!input.establishmentId) {
    if (!input.name?.trim()) return { ok: false, error: ERRORS.name_required };
    const url = normalizeReviewUrl(input.googleUrl ?? "");
    if (!url.ok) return { ok: false, error: REVIEW_URL_ERROR };
    googleUrl = url.url;
  }

  const admin = createSupabaseAdmin();
  if (!admin) {
    return { ok: false, error: "Service momentanément indisponible. Réessayez plus tard." };
  }
  const ip = await clientKey();
  if (await secretLocked(code, ip)) return { ok: false, error: LOCKED };

  const { data, error } = await admin.rpc("activate_stand_verified", {
    p_user_id: user.id,
    p_email: user.email,
    p_code: code,
    p_pin: input.pin,
    p_establishment_id: input.establishmentId || null,
    p_name: input.name?.trim() || null,
    p_google_url: googleUrl,
    p_via: input.via,
  });
  if (error) {
    if (error.message.includes("invalid_pin")) await recordSecretFailure(code, ip);
    return { ok: false, error: mapError(error.message, "Activation impossible. Réessayez.") };
  }

  const res = (data ?? {}) as {
    code?: string;
    establishment_name?: string;
    google_url?: string | null;
    new_establishment?: boolean;
    stands_on_account?: number;
  };
  const origin = await currentOrigin();
  const email = user.email;
  // E-mails envoyés après la réponse : l'écran de succès s'affiche sans attendre.
  after(() =>
    notifyActivation({
      code: res.code ?? code,
      email,
      establishmentName: res.establishment_name ?? input.name?.trim() ?? "",
      googleUrl: res.google_url ?? null,
      newEstablishment: Boolean(res.new_establishment),
      standsOnAccount: Number(res.stands_on_account ?? 1),
      via: input.via,
      origin,
    }),
  );
  revalidatePath("/dashboard/stands");
  revalidatePath("/dashboard");
  return { ok: true, establishmentName: res.establishment_name ?? "", email };
}

/** Activation depuis la page de scan (le compte est déjà connecté). */
export async function completeActivation(input: {
  code: string;
  pin: string;
  establishmentId?: string | null;
  name?: string;
  googleUrl?: string;
}): Promise<ActivationOk | { ok: false; error: string }> {
  return activateForCurrentUser({ ...input, via: "scan" });
}

/** « Rattacher un présentoir » depuis l'espace (formulaire du tableau de bord). */
export async function claimStandAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const res = await activateForCurrentUser({
    code: String(formData.get("code") ?? ""),
    pin: String(formData.get("pin") ?? ""),
    establishmentId: String(formData.get("establishment_id") ?? "") || null,
    via: "dashboard",
  });
  if (!res.ok) return { error: res.error };
  return { success: true };
}

/** « Ce n'est pas mon compte » sur la page d'activation. */
export async function signOutForActivation(): Promise<void> {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
}
