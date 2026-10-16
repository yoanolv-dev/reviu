"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "./supabase/server";
import { normalizeReviewUrl, REVIEW_URL_ERROR } from "./review-url";
import type { FormState } from "./form";

// Longueurs maximales des champs saisis par le commerçant (affichés sur la
// page publique du présentoir et dans les e-mails).
const MAX_NAME = 150;
const MAX_WELCOME = 600;
const TOO_LONG = "Texte trop long. Raccourcissez-le puis réessayez.";

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
  if (name.length > MAX_NAME) return { error: TOO_LONG };
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
    if (error || !created) {
      console.error("[dashboard] création organisation", error?.message);
      return { error: "Création impossible. Réessayez." };
    }
    orgId = created.id as string;
  }

  const { error: e2 } = await supabase
    .from("establishments")
    .insert({ org_id: orgId, name, google_review_url: googleUrl });
  if (e2) {
    if (e2.message.includes("invalid_review_url")) return { error: REVIEW_URL_ERROR };
    console.error("[dashboard] création établissement", e2.message);
    return { error: "Création impossible. Réessayez." };
  }
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
  const welcome = String(formData.get("welcome_message") ?? "").trim();
  const placeId = String(formData.get("google_place_id") ?? "").trim();
  if (name.length > MAX_NAME || welcome.length > MAX_WELCOME || placeId.length > 300) {
    return { error: TOO_LONG };
  }
  const color = String(formData.get("brand_color") ?? "");

  const url = normalizeReviewUrl(String(formData.get("google_review_url") ?? ""));
  if (!url.ok) return { error: REVIEW_URL_ERROR };

  // Lien actuel : les présentoirs qui en gardaient une copie (anciennes
  // activations) suivront désormais le nouveau lien du commerce.
  const { data: before } = await supabase
    .from("establishments")
    .select("google_review_url")
    .eq("id", id)
    .maybeSingle<{ google_review_url: string | null }>();

  const scanMode = formData.get("scan_mode") === "page" ? "page" : "direct";
  const patch = {
    name,
    google_review_url: url.url,
    google_place_id: placeId || null,
    welcome_message: welcome || null,
    brand_color: /^#[0-9a-f]{6}$/i.test(color) ? color : "#1b4dff",
    feedback_enabled: formData.get("feedback_enabled") === "on",
    scan_mode: scanMode,
  };
  const { error } = await supabase
    .from("establishments")
    .update(patch)
    .eq("id", id);
  if (error) {
    if (error.message.includes("invalid_review_url")) return { error: REVIEW_URL_ERROR };
    console.error("[dashboard] mise à jour établissement", error.message);
    return { error: "Enregistrement impossible. Réessayez." };
  }
  const oldUrl = before?.google_review_url ?? null;
  if (oldUrl && oldUrl !== url.url) {
    const { data: copies } = await supabase
      .from("stands")
      .select("id")
      .eq("establishment_id", id)
      .eq("target_url", oldUrl);
    for (const s of copies ?? []) {
      await supabase.rpc("set_stand_target", { p_stand_id: s.id as string, p_url: "" });
    }
    revalidatePath("/dashboard/stands");
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
