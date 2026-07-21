"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServer } from "./supabase/server";
import { APP_BASE } from "./brand";
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

export async function signUpAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("name") ?? "").trim();
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }
  const supabase = await createSupabaseServer();
  const h = await headers();
  const origin = h.get("origin") ?? APP_BASE;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      // Le lien de confirmation passe par /auth/callback : l'utilisateur est
      // connecté directement après avoir confirmé son e-mail.
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });
  if (error) return { error: error.message };
  if (!data.session) {
    return {
      info: "Compte créé. Vérifiez votre e-mail pour confirmer votre inscription.",
    };
  }
  redirect("/dashboard");
}

/**
 * Connexion sans mot de passe (lien magique) : permet de revenir retrouver ses
 * présentoirs activés en self-service. Au retour sur /dashboard, bind_account()
 * rattache automatiquement le compte aux présentoirs déjà configurés.
 */
export async function sendMagicLinkAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Renseignez votre e-mail." };
  const supabase = await createSupabaseServer();
  const h = await headers();
  const origin = h.get("origin") ?? APP_BASE;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/dashboard` },
  });
  if (error) return { error: "Envoi impossible. Réessayez dans un instant." };
  return {
    info: "Lien de connexion envoyé. Consultez votre boîte e-mail pour vous connecter.",
  };
}

export async function signOutAction() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Envoi du lien de réinitialisation. Message toujours neutre : on ne révèle
 * jamais si l'adresse existe ou non (anti-énumération de comptes).
 */
export async function sendPasswordResetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const neutral: FormState = {
    info: "Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé.",
  };
  if (!email) return { error: "Renseignez votre e-mail." };
  const supabase = await createSupabaseServer();
  const h = await headers();
  const origin = h.get("origin") ?? APP_BASE;
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });
  // On ignore volontairement l'erreur éventuelle pour ne rien divulguer.
  return neutral;
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
