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
  const pin = String(formData.get("pin") ?? "").trim();
  const estId = String(formData.get("establishment_id") ?? "");
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
      invalid_pin: "Code PIN incorrect (il figure sous le présentoir).",
    };
    const known = Object.keys(map).find((k) => error.message.includes(k));
    return { error: known ? map[known] : "Impossible de rattacher ce présentoir." };
  }
  revalidatePath("/dashboard/stands");
  return { success: true };
}

/**
 * Activation self-service d'un présentoir en un écran : crée (ou réutilise)
 * l'établissement du marchand, puis rattache le présentoir via son PIN.
 */
export async function activateStandAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const code = String(formData.get("code") ?? "").trim();
  const pin = String(formData.get("pin") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const googleUrl = String(formData.get("google_review_url") ?? "").trim();
  if (!code) return { error: "Code du présentoir manquant." };
  if (!pin) return { error: "Entrez le PIN figurant sous le présentoir." };

  // Réutilise le premier établissement du marchand, sinon en crée un.
  let estId: string;
  const { data: est } = await supabase
    .from("establishments")
    .select("id")
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (est) {
    estId = est.id as string;
    if (googleUrl) {
      await supabase
        .from("establishments")
        .update({ google_review_url: googleUrl })
        .eq("id", estId);
    }
  } else {
    if (!name) return { error: "Indiquez le nom de votre établissement." };
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
      if (error || !created) {
        return { error: error?.message ?? "Création impossible." };
      }
      orgId = created.id as string;
    }
    const { data: newEst, error: e2 } = await supabase
      .from("establishments")
      .insert({ org_id: orgId, name, google_review_url: googleUrl || null })
      .select("id")
      .single();
    if (e2 || !newEst) return { error: e2?.message ?? "Création impossible." };
    estId = newEst.id as string;
  }

  const { error } = await supabase.rpc("claim_stand", {
    p_code: code,
    p_establishment_id: estId,
    p_pin: pin,
  });
  if (error) {
    const map: Record<string, string> = {
      establishment_not_owned: "Établissement introuvable.",
      stand_not_found: "Aucun présentoir avec ce code.",
      stand_already_assigned: "Ce présentoir est déjà activé.",
      invalid_pin: "PIN incorrect (il figure sous le présentoir).",
    };
    const known = Object.keys(map).find((k) => error.message.includes(k));
    return { error: known ? map[known] : "Activation impossible." };
  }
  redirect("/dashboard/stands");
}
