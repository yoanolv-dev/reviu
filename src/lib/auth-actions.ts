"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "./supabase/server";
import type { FormState } from "./form";

/** Destination post-auth : chemin interne fourni via `next`, sinon le dashboard. */
function safeNext(formData: FormData): string {
  const raw = String(formData.get("next") ?? "");
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
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
  redirect(safeNext(formData));
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
  redirect(safeNext(formData));
}

export async function signOutAction() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}
