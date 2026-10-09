"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "./supabase/server";
import {
  afterEmailVerified,
  normalizeEmail,
  safeNext,
  sendLoginCode,
  sendPasswordHelp,
  verifyLoginCode,
} from "./auth-code";
import type { FormState } from "./form";

export async function signInAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-mail ou mot de passe incorrect." };
  // Rattache les présentoirs activés en self-service, une seule fois à la
  // connexion (idempotent), plutôt qu'à chaque chargement du dashboard.
  await supabase.rpc("bind_account");
  redirect("/dashboard");
}

/**
 * Connexion sans mot de passe, étape 1 : envoi d'un code à 6 chiffres (et d'un
 * lien direct) par e-mail. Crée le compte s'il n'existe pas encore : un
 * commerçant qui a activé un présentoir retrouve ainsi son espace avec son
 * seul e-mail (bind_account rattache ses présentoirs à la connexion).
 */
export async function requestLoginCodeAction(input: {
  email: string;
}): Promise<{ ok: true; email: string; codeLength: number } | { ok: false; error: string }> {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "Renseignez une adresse e-mail valide." };
  const res = await sendLoginCode({ email, purpose: "login", next: "/dashboard" });
  if (!res.ok) return res;
  return { ok: true, email, codeLength: res.codeLength };
}

/** Connexion sans mot de passe, étape 2 : vérification du code. */
export async function verifyLoginCodeAction(input: {
  email: string;
  token: string;
}): Promise<{ ok: false; error: string }> {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "Adresse e-mail invalide." };
  const res = await verifyLoginCode(email, input.token, { notifyNewAccount: true });
  if (!res.ok) return { ok: false, error: res.error };
  redirect("/dashboard");
}

/**
 * Lien reçu par e-mail (/auth/confirm) : la vérification se fait au clic sur
 * un bouton (POST) et non à l'ouverture de la page, car certains antivirus de
 * messagerie ouvrent les liens à l'avance et les « consommeraient ».
 */
export async function confirmEmailLinkAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const tokenHash = String(formData.get("token_hash") ?? "");
  const type = String(formData.get("type") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));
  if (!tokenHash || (type !== "email" && type !== "recovery")) {
    return { error: "Lien invalide. Demandez un nouveau code depuis la page de connexion." };
  }
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
  if (error) {
    // Lien déjà utilisé (ex. le code a été saisi avant) mais session ouverte
    // sur cet appareil : on continue simplement.
    if (type === "email") {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) redirect(next);
    }
    return {
      error: next.startsWith("/activer/")
        ? "Ce lien a expiré ou a déjà servi. Revenez à la page d'activation pour recevoir un nouveau code."
        : "Ce lien a expiré ou a déjà servi. Demandez un nouveau code depuis la page de connexion.",
    };
  }
  await afterEmailVerified(supabase, data.user, { notifyNewAccount: !next.startsWith("/activer/") });
  redirect(type === "recovery" ? "/reset-password" : next);
}

export async function signOutAction() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * « Mot de passe oublié ». Message toujours neutre : on ne révèle jamais si
 * l'adresse existe (anti-énumération). Lien de réinitialisation si le compte
 * existe ; code de connexion si l'adresse a activé un présentoir sans jamais
 * avoir créé de compte (sinon ce parcours était une impasse).
 */
export async function sendPasswordResetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) return { error: "Renseignez une adresse e-mail valide." };
  await sendPasswordHelp(email);
  return {
    info: "Si un compte existe pour cette adresse, un e-mail vient de vous être envoyé (lien de réinitialisation, ou code de connexion si vous n'aviez pas encore de mot de passe).",
  };
}

/**
 * Définition du nouveau mot de passe (session de récupération active).
 */
export async function updatePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }
  if (password !== confirm) {
    return { error: "Les deux mots de passe ne correspondent pas." };
  }
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error:
        "Lien de réinitialisation invalide ou expiré. Redemandez-en un depuis « Mot de passe oublié ».",
    };
  }
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Mise à jour impossible. Réessayez." };
  redirect("/dashboard");
}
