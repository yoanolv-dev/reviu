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
