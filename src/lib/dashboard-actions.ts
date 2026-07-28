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

  const scanMode = formData.get("scan_mode") === "page" ? "page" : "direct";
  const patch = {
    name,
    google_review_url:
      String(formData.get("google_review_url") ?? "").trim() || null,
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
      invalid_pin: "Code PIN d'activation incorrect (il figure à côté du QR code, sur le présentoir).",
    };
    const known = Object.keys(map).find((k) => error.message.includes(k));
    return { error: known ? map[known] : "Impossible de rattacher ce présentoir." };
  }
  revalidatePath("/dashboard/stands");
  return { success: true };
}

/** Abonnement simulé piloté depuis le dashboard (gardé par la propriété du compte). */
export async function ownerSetSubscriptionAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServer();
  const standId = String(formData.get("stand_id") ?? "");
  const action = String(formData.get("action") ?? "");
  if (action !== "subscribe" && action !== "cancel") {
    return { error: "Action invalide." };
  }
  const { error } = await supabase.rpc("owner_set_subscription", {
    p_stand_id: standId,
    p_action: action,
  });
  if (error) {
    if (error.message.includes("stand_not_owned")) {
      return { error: "Présentoir introuvable sur votre compte." };
    }
    return { error: "Opération impossible. Réessayez." };
  }
  revalidatePath("/dashboard/stands");
  revalidatePath("/dashboard");
  return {
    success: true,
    info: action === "subscribe" ? "Suivi activé." : "Abonnement résilié.",
  };
}

/** Modifie le lien d'un présentoir (réservé aux présentoirs suivis). */
export async function setStandTargetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServer();
  const standId = String(formData.get("stand_id") ?? "");
  const url = String(formData.get("target_url") ?? "").trim();
  const { error } = await supabase.rpc("set_stand_target", {
    p_stand_id: standId,
    p_url: url,
  });
  if (error) {
    if (error.message.includes("subscription_required")) {
      // La modification du lien est désormais incluse : ce verrou doit être
      // retiré côté base (RPC set_stand_target). En attendant, message neutre.
      return {
        error:
          "La mise à jour du lien n'a pas pu être enregistrée pour le moment. Réessayez, ou écrivez-nous à contact@reviu.fr.",
      };
    }
    if (error.message.includes("stand_not_owned")) {
      return { error: "Présentoir introuvable sur votre compte." };
    }
    return { error: "Modification impossible. Réessayez." };
  }
  revalidatePath("/dashboard/stands");
  return { success: true, info: "Lien mis à jour." };
}
