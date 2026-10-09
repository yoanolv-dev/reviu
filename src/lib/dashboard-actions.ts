"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "./supabase/server";
import { normalizeReviewUrl, REVIEW_URL_ERROR } from "./review-url";
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
  if (!name) return { error: "Le nom de l'établissement est requis." };
  const url = normalizeReviewUrl(String(formData.get("google_review_url") ?? ""));
  if (!url.ok) return { error: REVIEW_URL_ERROR };
  const googleUrl = url.url;

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
    .insert({ org_id: orgId, name, google_review_url: googleUrl });
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

  const url = normalizeReviewUrl(String(formData.get("google_review_url") ?? ""));
  if (!url.ok) return { error: REVIEW_URL_ERROR };

  const scanMode = formData.get("scan_mode") === "page" ? "page" : "direct";
  const patch = {
    name,
    google_review_url: url.url,
    google_place_id: String(formData.get("google_place_id") ?? "").trim() || null,
    welcome_message: String(formData.get("welcome_message") ?? "").trim() || null,
    brand_color: String(formData.get("brand_color") ?? "#1b4dff"),
    feedback_enabled: formData.get("feedback_enabled") === "on",
    scan_mode: scanMode,
  };
  const { error } = await supabase
    .from("establishments")
    .update(patch)
    .eq("id", id);
  if (error) {
    if (error.message.includes("invalid_review_url")) return { error: REVIEW_URL_ERROR };
    return { error: error.message };
  }
  revalidatePath("/dashboard/establishment");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Modifie le lien de redirection d'un présentoir. Inclus avec la plaque (espace
 * Reviu, sans abonnement) : le RPC set_stand_target ne vérifie plus que la
 * propriété du présentoir. L'adresse encodée QR/NFC (`code`) reste immuable.
 */
export async function setStandTargetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServer();
  const standId = String(formData.get("stand_id") ?? "");
  const url = normalizeReviewUrl(String(formData.get("target_url") ?? ""));
  if (!url.ok) return { error: REVIEW_URL_ERROR };
  const { error } = await supabase.rpc("set_stand_target", {
    p_stand_id: standId,
    p_url: url.url ?? "",
  });
  if (error) {
    if (error.message.includes("stand_not_owned")) {
      return { error: "Présentoir introuvable sur votre compte." };
    }
    if (error.message.includes("invalid_review_url")) return { error: REVIEW_URL_ERROR };
    return { error: "Modification impossible. Réessayez." };
  }
  revalidatePath("/dashboard/stands");
  return { success: true, info: "Lien mis à jour." };
}
