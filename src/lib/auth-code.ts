import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { createSupabaseAdmin } from "./supabase/admin";
import { createSupabaseServer } from "./supabase/server";
import { sendEmail } from "./email";
import { authCodeEmail, esc, passwordResetEmail } from "./email-templates";
import { clientKey, emailKey, rateAllow, rateCount, rateRecord } from "./rate-limit";
import { ADMIN_NOTIFY_EMAIL, APP_BASE } from "./brand";

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

/**
 * Destination après connexion : uniquement des pages de l'app connues
 * (évite les redirections ouvertes, y compris les variantes « /\t/site.fr »
 * que les navigateurs lisent comme « //site.fr »).
 */
export function safeNext(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || /[^\x21-\x7e]|\\/.test(next)) return fallback;
  if (!/^\/(dashboard(\/[a-z-]*)?|activer\/[a-z0-9]{1,32}|reset-password)$/.test(next)) {
    return fallback;
  }
  return next;
}

/**
 * Limites d'envoi. L'IP est vérifiée d'abord (15 / heure) ; les limites par
 * adresse (1 / 50 s, 6 / heure) ne comptent que les e-mails réellement envoyés :
 * un tiers ne peut pas épuiser le quota d'un commerçant depuis une IP bloquée.
 */
async function sendBlocked(email: string): Promise<string | null> {
  const ip = await clientKey();
  if (!(await rateAllow("code_send_ip", ip, 3600, 15))) {
    return "Trop de demandes depuis votre connexion. Réessayez dans une heure.";
  }
  const key = emailKey(email);
  const [burst, hourly] = await Promise.all([
    rateCount("code_send_burst", key, 50),
    rateCount("code_send_email", key, 3600),
  ]);
  if (burst >= 1) {
    return "Un code vient d'être envoyé. Patientez quelques secondes avant d'en demander un autre.";
  }
  if (hourly >= 6) return "Trop de codes demandés pour cette adresse. Réessayez dans une heure.";
  return null;
}

async function recordSend(email: string): Promise<void> {
  const key = emailKey(email);
  await Promise.all([
    rateRecord("code_send_burst", key),
    rateRecord("code_send_email", key),
  ]);
}

/**
 * Compte créé mais jamais confirmé (ex. inscription avec mot de passe faite par
 * un tiers avec l'adresse du commerçant) : son mot de passe est remplacé par
 * une valeur aléatoire AVANT l'envoi du code. Quand le vrai propriétaire de
 * l'adresse confirmera avec ce code, aucun mot de passe connu d'un tiers ne
 * restera valable. Un compte non confirmé n'a aucune session : rien à perdre.
 */
async function neutralizeUnconfirmedPassword(
  admin: NonNullable<ReturnType<typeof createSupabaseAdmin>>,
  email: string,
): Promise<boolean> {
  const { data: userId, error } = await admin.rpc("auth_unconfirmed_user_id", {
    p_email: email,
  });
  if (error) {
    console.error("[auth-code] auth_unconfirmed_user_id", error.message);
    return false;
  }
  if (!userId) return true;
  const { error: upd } = await admin.auth.admin.updateUserById(String(userId), {
    password: randomBytes(32).toString("base64url"),
  });
  if (upd) {
    console.error("[auth-code] updateUserById", upd.message);
    return false;
  }
  return true;
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
    const blocked = await sendBlocked(opts.email);
    if (blocked) return { ok: false, error: blocked };
  }

  if (!(await neutralizeUnconfirmedPassword(admin, opts.email))) {
    return { ok: false, error: "Envoi impossible. Réessayez dans un instant." };
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
  let sent = await sendEmail({ to: opts.email, subject, html });
  if (!sent && process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
    // En local sans Resend : le code s'affiche dans le terminal du serveur.
    console.info(`[auth-code] DEV ${opts.email} : code ${props.email_otp} - ${link}`);
    sent = true;
  }
  if (!sent) {
    return { ok: false, error: "L'e-mail n'a pas pu partir. Réessayez dans un instant." };
  }
  await recordSend(opts.email);
  return { ok: true, codeLength: props.email_otp.length };
}

type ServerClient = Awaited<ReturnType<typeof createSupabaseServer>>;

/**
 * Après une vérification réussie (code ou lien) : rattache les présentoirs
 * activés avec cette adresse avant la création du compte, et prévient l'admin
 * d'un tout nouveau compte (adresse confirmée à l'instant).
 */
export async function afterEmailVerified(
  supabase: ServerClient,
  user: User | null,
  opts: { notifyNewAccount: boolean },
): Promise<void> {
  await supabase.rpc("bind_account");
  if (!opts.notifyNewAccount || !user?.email || !user.email_confirmed_at) return;
  const confirmedAgo = Date.now() - Date.parse(user.email_confirmed_at);
  if (!(confirmedAgo >= 0 && confirmedAgo < 5 * 60_000)) return;
  const email = user.email;
  after(() =>
    sendEmail({
      to: ADMIN_NOTIFY_EMAIL,
      subject: `Nouveau compte reviu - ${email}`,
      html: `<p>Nouveau compte confirmé sur reviu (connexion par code e-mail).</p>
<ul>
  <li><strong>E-mail :</strong> ${esc(email)}</li>
  <li><strong>Date :</strong> ${esc(new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }))}</li>
</ul>`,
    }).then(() => undefined),
  );
}

/**
 * Vérifie le code saisi et ouvre la session (cookies) sur ce navigateur.
 * Limites : 40 essais / 15 min par IP, 8 par couple adresse + IP, 30 par
 * adresse (un tiers ne peut pas bloquer seul la connexion d'un commerçant).
 */
export async function verifyLoginCode(
  email: string,
  token: string,
  opts: { notifyNewAccount: boolean },
): Promise<{ ok: true; supabase: ServerClient } | { ok: false; error: string }> {
  const blocked = await verifyBlocked(email, token);
  if (blocked) return { ok: false, error: blocked };

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: token.replace(/\D/g, ""),
    type: "email",
  });
  if (error) return { ok: false, error: WRONG_CODE };
  await afterEmailVerified(supabase, data.user, opts);
  return { ok: true, supabase };
}

// Supabase renvoie la même erreur pour un code faux ou expiré.
const WRONG_CODE =
  "Code incorrect ou expiré. Vérifiez le dernier e-mail reçu (seul le plus récent fonctionne), ou demandez un nouveau code.";

/** Format du code et limites de saisie ; renvoie un message si refusé. */
async function verifyBlocked(email: string, token: string): Promise<string | null> {
  if (token.replace(/\D/g, "").length < 6) return "Saisissez le code reçu par e-mail.";
  const tooMany = "Trop d'essais. Patientez un quart d'heure, puis demandez un nouveau code.";
  const ip = await clientKey();
  if (!(await rateAllow("code_verify_ip", ip, 900, 40))) return tooMany;
  const key = emailKey(email);
  if (!(await rateAllow("code_verify_email_ip", `${key}|${ip}`, 900, 8))) return tooMany;
  if (!(await rateAllow("code_verify_email", key, 900, 30))) return tooMany;
  return null;
}

/**
 * Vérifie le code d'un TIERS (le commerçant d'un revendeur) sans toucher à la
 * session de ce navigateur : client Supabase éphémère, rien n'est écrit dans
 * les cookies. Renvoie ce client (connecté en tant que le commerçant, en
 * mémoire seulement) pour lire ses commerces.
 */
export async function verifyCodeWithoutSession(
  email: string,
  token: string,
): Promise<
  | { ok: true; client: SupabaseClient; userId: string; email: string }
  | { ok: false; error: string }
> {
  const blocked = await verifyBlocked(email, token);
  if (blocked) return { ok: false, error: blocked };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return { ok: false, error: "Service momentanément indisponible. Réessayez plus tard." };
  }
  const client = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await client.auth.verifyOtp({
    email,
    token: token.replace(/\D/g, ""),
    type: "email",
  });
  if (error || !data.user?.email || !data.session) return { ok: false, error: WRONG_CODE };
  // Rattache les présentoirs activés avec cette adresse avant la création du compte.
  await client.rpc("bind_account");
  return { ok: true, client, userId: data.user.id, email: data.user.email };
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
  if (await sendBlocked(email)) return;

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
    if (await sendEmail({ to: email, subject, html })) await recordSend(email);
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
