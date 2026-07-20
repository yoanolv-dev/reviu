"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "./supabase/server";
import type { FormState } from "./form";

/**
 * N'autorise qu'un chemin interne relatif comme cible de redirection
 * post-connexion (protège des open redirects). Repli : /dashboard.
 */
function safeNext(raw: FormDataEntryValue | null): string {
  const v = typeof raw === "string" ? raw : "";
  if (v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\")) return v;
  return "/dashboard";
}

export async function signInAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-mail ou mot de passe incorrect." };
  redirect(safeNext(formData.get("next")));
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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };
  if (!data.session) {
    return {
      info: "Compte créé. Vérifiez votre e-mail pour confirmer, puis connectez-vous.",
    };
  }
  redirect(safeNext(formData.get("next")));
}

export async function signOutAction() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}
