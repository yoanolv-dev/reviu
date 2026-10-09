import { headers } from "next/headers";
import { createSupabaseAdmin } from "./supabase/admin";
import { createSupabaseServer } from "./supabase/server";
import { sendEmail } from "./email";
import { authCodeEmail, passwordResetEmail } from "./email-templates";
import { clientKey, rateAllow } from "./rate-limit";
import { APP_BASE } from "./brand";

/**
 * Connexion par code à 6 chiffres envoyé par e-mail (sans mot de passe).
 *
 * Le code est généré par Supabase (`auth.admin.generateLink`, qui crée le
 * compte s'il n'existe pas encore) et envoyé par NOTRE e-mail (Resend) : aucun
 * modèle Supabase à modifier. L'e-mail contient aussi un lien direct
 * (`/auth/confirm?token_hash=…`) qui, contrairement à l'ancien lien magique,
 * fonctionne sur n'importe quel appareil ou navigateur.
 */

export type CodeRequestResult =
  | { ok: true; codeLength: number }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(input: string): string | null {
  const email = input.trim().toLowerCase();
  return EMAIL_RE.test(email) && email.length <= 254 ? email : null;
}

/**
 * Origine des liens envoyés par e-mail : celle de la page d'où vient la
 * demande (prod, préversion Vercel ou local), à condition qu'elle corresponde
 * à l'hôte servi ; sinon l'adresse de l'app.
 */
export async function currentOrigin(): Promise<string> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host === host) return origin;
    } catch {
      // origine illisible : adresse de l'app
    }
  }
  return APP_BASE;
}

/** Redirection interne uniquement (évite les redirections ouvertes). */
export function safeNext(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}

/** Limites d'envoi : 1 code / 50 s et 6 / heure par adresse, 15 / heure par IP. */
async function sendAllowed(email: string): Promise<string | null> {
  const ip = await clientKey();
  if (!(await rateAllow("code_send_burst", email, 50, 1))) {
    return "Un code vient d'être envoyé. Patientez quelques secondes avant d'en demander un autre.";
  }
  if (!(await rateAllow("code_send_email", email, 3600, 6))) {
    return "Trop de codes demandés pour cette adresse. Réessayez dans une heure.";
  }
  if (!(await rateAllow("code_send_ip", ip, 3600, 15))) {
    return "Trop de demandes depuis votre connexion. Réessayez dans une heure.";
  }
  return null;
}

/** Envoie un code de connexion (et le lien direct) à l'adresse indiquée. */
export async function sendLoginCode(opts: {
  email: string;
  purpose: "activation" | "login";
  next: string;
  skipRateLimit?: boolean;
}): Promise<CodeRequestResult> {
  const admin = createSupabaseAdmin();
  if (!admin) {
    return { ok: false, error: "Service momentanément indisponible. Réessayez plus tard." };
  }
  if (!opts.skipRateLimit) {
    const limited = await sendAllowed(opts.email);
    if (limited) return { ok: false, error: limited };
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: opts.email,
  });
  const props = data?.properties;
  if (error || !props?.email_otp || !props.hashed_token) {
    console.error("[auth-code] generateLink", error?.message);
    return { ok: false, error: "Envoi impossible. Vérifiez l'adresse et réessayez." };
  }

  const origin = await currentOrigin();
  const link =
    `${origin}/auth/confirm?token_hash=${encodeURIComponent(props.hashed_token)}` +
    `&type=email&next=${encodeURIComponent(safeNext(opts.next))}`;
  const { subject, html } = authCodeEmail({
    code: props.email_otp,
    link,
    purpose: opts.purpose,
  });
  const sent = await sendEmail({ to: opts.email, subject, html });
  if (!sent) {
    return { ok: false, error: "L'e-mail n'a pas pu partir. Réessayez dans un instant." };
  }
  return { ok: true, codeLength: props.email_otp.length };
}

/**
 * Vérifie le code saisi et ouvre la session (cookies) sur ce navigateur.
 * Limites : 8 essais / 15 min par adresse, 40 / 15 min par IP.
 */
export async function verifyLoginCode(
  email: string,
  token: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const code = token.replace(/\D/g, "");
  if (code.length < 6) return { ok: false, error: "Saisissez le code reçu par e-mail." };

  const ip = await clientKey();
  if (
    !(await rateAllow("code_verify_email", email, 900, 8)) ||
    !(await rateAllow("code_verify_ip", ip, 900, 40))
  ) {
    return {
      ok: false,
      error: "Trop d'essais. Patientez un quart d'heure, puis demandez un nouveau code.",
    };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
  if (error) {
    const expired = error.code === "otp_expired" || /expired/i.test(error.message);
    return {
      ok: false,
      error: expired
        ? "Ce code a expiré ou a été remplacé par un plus récent. Demandez-en un nouveau."
        : "Code incorrect. Vérifiez le dernier e-mail reçu.",
    };
  }
  // Rattache les présentoirs activés avec cette adresse avant la création du compte.
  await supabase.rpc("bind_account");
  return { ok: true };
}

/**
 * « Mot de passe oublié » : lien de réinitialisation si le compte existe ; si
 * l'adresse n'a encore jamais eu de compte mais a activé un présentoir (ancien
 * parcours), on envoie un code de connexion à la place. Rien sinon. Le message
 * affiché reste neutre dans tous les cas.
 */
export async function sendPasswordHelp(email: string): Promise<void> {
  const admin = createSupabaseAdmin();
  if (!admin) return;
  if (await sendAllowed(email)) return;

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  });
  const hashed = data?.properties?.hashed_token;
  if (!error && hashed) {
    const origin = await currentOrigin();
    const link =
      `${origin}/auth/confirm?token_hash=${encodeURIComponent(hashed)}` +
      `&type=recovery&next=${encodeURIComponent("/reset-password")}`;
    const { subject, html } = passwordResetEmail(link);
    await sendEmail({ to: email, subject, html });
    return;
  }

  const { data: customer } = await admin
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (customer) {
    await sendLoginCode({ email, purpose: "login", next: "/dashboard", skipRateLimit: true });
  }
}
