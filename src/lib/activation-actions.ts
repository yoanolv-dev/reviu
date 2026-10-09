"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "./supabase/server";
import { getMyEstablishments, type MyEstablishment } from "./dashboard";
import { createSupabaseAdmin } from "./supabase/admin";
import {
  normalizeEmail,
  sendLoginCode,
  verifyCodeWithoutSession,
  verifyLoginCode,
  currentOrigin,
} from "./auth-code";
import {
  createActivationTicket,
  readActivationTicket,
  ticketAvailable,
} from "./activation-ticket";
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

/** Erreur affichable + code stable (le client réagit au code, pas au texte). */
export type ActionError = { ok: false; error: string; code?: string };

function fail(message: string | undefined, fallback: string): ActionError {
  const key = message ? Object.keys(ERRORS).find((k) => message.includes(k)) : undefined;
  return key ? { ok: false, error: ERRORS[key], code: key } : { ok: false, error: fallback };
}

const LOCKED =
  "Trop d'essais de code secret. Patientez une heure, ou contactez-nous si le problème persiste.";

/**
 * Limites du secret (erreurs / heure) : 15 par IP, 10 par couple présentoir +
 * IP, 100 par présentoir toutes IP confondues. Le code du présentoir étant
 * public, un plafond par présentoir trop bas permettrait à un tiers de bloquer
 * l'activation du vrai commerçant ; avec 32^8 secrets possibles, 100 essais par
 * heure restent sans risque.
 */
async function secretLocked(code: string, ip: string): Promise<boolean> {
  const [byIp, byStandIp, byStand] = await Promise.all([
    rateCount("secret_fail_ip", ip, 3600),
    rateCount("secret_fail_stand_ip", `${code}|${ip}`, 3600),
    rateCount("secret_fail_stand", code, 3600),
  ]);
  return byIp >= 15 || byStandIp >= 10 || byStand >= 100;
}

async function recordSecretFailure(code: string, ip: string): Promise<void> {
  await Promise.all([
    rateRecord("secret_fail_ip", ip),
    rateRecord("secret_fail_stand_ip", `${code}|${ip}`),
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
}): Promise<{ ok: true; email: string; codeLength: number } | ActionError> {
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
  if (await secretLocked(code, ip)) return { ok: false, error: LOCKED, code: "locked" };

  const { error } = await admin.rpc("check_stand_secret", {
    p_code: code,
    p_pin: input.pin,
  });
  if (error) {
    if (error.message.includes("invalid_pin")) await recordSecretFailure(code, ip);
    return fail(error.message, "Vérification impossible. Réessayez.");
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
}): Promise<{ ok: true; email: string; establishments: MyEstablishment[] } | ActionError> {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "Adresse e-mail invalide." };
  const res = await verifyLoginCode(email, input.token, { notifyNewAccount: false });
  if (!res.ok) return res;
  return { ok: true, email, establishments: await getMyEstablishments(res.supabase) };
}

// ---- Étape 2 bis : code donné par un commerçant à son revendeur -------------
/**
 * Un revendeur (ou l'admin en démo) installe le présentoir chez un client : le
 * client reçoit le code et le lui donne. Le code est vérifié SANS ouvrir de
 * session sur ce téléphone ; un jeton signé (30 min, lié au présentoir) permet
 * ensuite d'activer le présentoir dans l'espace du client.
 */
export async function verifyActivationCodeForOther(input: {
  code: string;
  email: string;
  token: string;
}): Promise<
  { ok: true; email: string; ticket: string; establishments: MyEstablishment[] } | ActionError
> {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "Adresse e-mail invalide." };
  if (!ticketAvailable()) {
    return { ok: false, error: "Service momentanément indisponible. Réessayez plus tard." };
  }
  const res = await verifyCodeWithoutSession(email, input.token);
  if (!res.ok) return res;
  const { data } = await res.client
    .from("establishments")
    .select("id,name,google_review_url")
    .order("created_at");
  const establishments: MyEstablishment[] = (data ?? []).map((e) => ({
    id: e.id as string,
    name: e.name as string,
    googleReviewUrl: (e.google_review_url as string | null) ?? null,
  }));
  return {
    ok: true,
    email: res.email,
    ticket: createActivationTicket({ uid: res.userId, email: res.email, code: cleanCode(input.code) }),
    establishments,
  };
}

// ---- Étape 3 : activation par le compte connecté (ou avec un jeton) --------
type ActivationOk = {
  ok: true;
  establishmentName: string;
  email: string;
  /** Faux si aucun lien d'avis n'est encore enregistré (rien à rediriger). */
  hasGoogleLink: boolean;
};

async function activateForCurrentUser(input: {
  code: string;
  pin: string;
  establishmentId?: string | null;
  name?: string;
  googleUrl?: string;
  /** Jeton « pour un autre commerçant » ; sinon, la session de ce navigateur. */
  ticket?: string | null;
  via: "scan" | "dashboard" | "tiers";
}): Promise<ActivationOk | ActionError> {
  const code = cleanCode(input.code);
  if (!code) return { ok: false, error: "Saisissez le code du présentoir." };

  // Compte bénéficiaire : celui du jeton (code donné par le commerçant), ou
  // celui de la session, avec une adresse vérifiée (codes e-mail : toujours).
  let user: { id: string; email: string } | null = null;
  if (input.ticket) {
    const t = readActivationTicket(input.ticket, code);
    user = t ? { id: t.uid, email: t.email } : null;
    if (!user) {
      return {
        ok: false,
        error: "Délai dépassé. Recommencez l'activation pour ce commerçant.",
        code: "not_authenticated",
      };
    }
  } else {
    const supabase = await createSupabaseServer();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();
    if (sessionUser?.email && sessionUser.email_confirmed_at) {
      user = { id: sessionUser.id, email: sessionUser.email };
    }
  }
  if (!user) return { ok: false, error: ERRORS.not_authenticated, code: "not_authenticated" };

  if (!input.pin.trim()) {
    return { ok: false, error: "Saisissez le code secret imprimé sur le présentoir." };
  }

  let googleUrl: string | null = null;
  if (!input.establishmentId) {
    if (!input.name?.trim()) return { ok: false, error: ERRORS.name_required, code: "name_required" };
    const url = normalizeReviewUrl(input.googleUrl ?? "");
    if (!url.ok) return { ok: false, error: REVIEW_URL_ERROR, code: "invalid_review_url" };
    googleUrl = url.url;
  }

  const admin = createSupabaseAdmin();
  if (!admin) {
    return { ok: false, error: "Service momentanément indisponible. Réessayez plus tard." };
  }
  const ip = await clientKey();
  if (await secretLocked(code, ip)) return { ok: false, error: LOCKED, code: "locked" };

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
    return fail(error.message, "Activation impossible. Réessayez.");
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
  // Depuis l'espace uniquement : sur la page de scan, revalidatePath
  // re-rendrait la page en cours (Next 16) pendant l'écran de réussite.
  if (input.via === "dashboard") revalidatePath("/dashboard/stands");
  return {
    ok: true,
    establishmentName: res.establishment_name ?? "",
    email,
    hasGoogleLink: Boolean(res.google_url),
  };
}

/**
 * Activation depuis la page de scan : pour le compte connecté, ou pour un autre
 * commerçant avec le jeton obtenu par son code (`ticket`).
 */
export async function completeActivation(input: {
  code: string;
  pin: string;
  establishmentId?: string | null;
  name?: string;
  googleUrl?: string;
  ticket?: string | null;
}): Promise<ActivationOk | ActionError> {
  return activateForCurrentUser({ ...input, via: input.ticket ? "tiers" : "scan" });
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
  // Sur ce navigateur seulement : le compte reste connecté sur ses autres appareils.
  await supabase.auth.signOut({ scope: "local" });
}
