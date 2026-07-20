"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "./supabase/server";
import type { FormState } from "./form";

export async function createEstablishmentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const googleUrl = String(formData.get("google_review_url") ?? "").trim();
  if (!name) return { error: "Le nom de l'établissement est requis." };

  let orgId: string;
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (org) {
    orgId = org.id as string;
  } else {
    const { data: created, error } = await supabase
      .from("organizations")
      .insert({ name, owner_id: user.id })
      .select("id")
      .single();
    if (error || !created) return { error: error?.message ?? "Création impossible." };
    orgId = created.id as string;
  }

  const { error: e2 } = await supabase
    .from("establishments")
    .insert({ org_id: orgId, name, google_review_url: googleUrl || null });
  if (e2) return { error: e2.message };
  redirect("/dashboard");
}

export async function updateEstablishmentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServer();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Le nom est requis." };

  const patch = {
    name,
    google_review_url:
      String(formData.get("google_review_url") ?? "").trim() || null,
    google_place_id: String(formData.get("google_place_id") ?? "").trim() || null,
    welcome_message: String(formData.get("welcome_message") ?? "").trim() || null,
    brand_color: String(formData.get("brand_color") ?? "#1b4dff"),
    feedback_enabled: formData.get("feedback_enabled") === "on",
  };
  const { error } = await supabase
    .from("establishments")
    .update(patch)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/establishment");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function claimStandAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServer();
  const code = String(formData.get("code") ?? "").trim();
  const estId = String(formData.get("establishment_id") ?? "");
  const pin = String(formData.get("pin") ?? "").trim().toUpperCase();
  if (!code) return { error: "Entrez le code du présentoir." };

  const { error } = await supabase.rpc("claim_stand", {
    p_code: code,
    p_establishment_id: estId,
    p_pin: pin || null,
  });
  if (error) {
    const map: Record<string, string> = {
      establishment_not_owned: "Établissement introuvable.",
      stand_not_found: "Aucun présentoir avec ce code.",
      stand_already_assigned: "Ce présentoir est déjà rattaché à un compte.",
      invalid_pin: "Code PIN incorrect. Il figure avec le présentoir.",
    };
    const known = Object.keys(map).find((k) => error.message.includes(k));
    return { error: known ? map[known] : "Impossible de rattacher ce présentoir." };
  }
  revalidatePath("/dashboard/stands");
  return { success: true };
}

/**
 * Activation d'un présentoir à réception (parcours /activate/[code]).
 * Crée l'établissement si l'utilisateur n'en a pas encore, puis rattache le
 * présentoir de façon unique (garde SQL blank -> active) avec vérification du PIN.
 */
export async function activateStandAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const code = String(formData.get("code") ?? "").trim();
  if (!user) redirect(`/login?next=/activate/${encodeURIComponent(code)}`);
  if (!code) return { error: "Code du présentoir manquant." };
  const pin = String(formData.get("pin") ?? "").trim().toUpperCase();

  // 1) S'assurer que l'utilisateur dispose d'un établissement (sinon le créer).
  let estId: string;
  const { data: est } = await supabase
    .from("establishments")
    .select("id")
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (est) {
    estId = est.id as string;
  } else {
    const name = String(formData.get("name") ?? "").trim();
    const googleUrl = String(formData.get("google_review_url") ?? "").trim();
    if (!name) return { error: "Le nom de l'établissement est requis." };

    let orgId: string;
    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .order("created_at")
      .limit(1)
      .maybeSingle();
    if (org) {
      orgId = org.id as string;
    } else {
      const { data: created, error } = await supabase
        .from("organizations")
        .insert({ name, owner_id: user.id })
        .select("id")
        .single();
      if (error || !created)
        return { error: error?.message ?? "Création impossible." };
      orgId = created.id as string;
    }

    const { data: newEst, error: e2 } = await supabase
      .from("establishments")
      .insert({ org_id: orgId, name, google_review_url: googleUrl || null })
      .select("id")
      .single();
    if (e2 || !newEst)
      return { error: e2?.message ?? "Création de l'établissement impossible." };
    estId = newEst.id as string;
  }

  // 2) Activation unique du présentoir, PIN à l'appui.
  const { error } = await supabase.rpc("claim_stand", {
    p_code: code,
    p_establishment_id: estId,
    p_pin: pin || null,
  });
  if (error) {
    const map: Record<string, string> = {
      establishment_not_owned: "Établissement introuvable.",
      stand_not_found: "Aucun présentoir avec ce code.",
      stand_already_assigned: "Ce présentoir est déjà activé.",
      invalid_pin: "Code PIN incorrect. Il figure avec le présentoir.",
    };
    const known = Object.keys(map).find((k) => error.message.includes(k));
    return { error: known ? map[known] : "Activation impossible." };
  }

  revalidatePath("/dashboard/stands");
  revalidatePath("/dashboard");
  redirect("/dashboard/stands");
}
