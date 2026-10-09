"use server";

import { revalidatePath } from "next/cache";
import { adminDb, requireAdmin } from "./admin-server";
import { normalizeReviewUrl, REVIEW_URL_ERROR } from "./review-url";
import type { AdminActionState } from "./admin-actions";

/**
 * Actions de l'admin sur un client, à distance : commerce (nom, lien d'avis,
 * mode de scan...) et lien propre à un présentoir. Chaque modification est
 * tracée dans le journal (stand_audit) avec l'e-mail de l'admin.
 */

const NOT_ADMIN: AdminActionState = { error: "Accès réservé aux administrateurs." };
const NO_DB: AdminActionState = { error: "Service indisponible (clé serveur manquante)." };

function refresh(orgId: string | null) {
  revalidatePath("/admin");
  revalidatePath("/admin/stands");
  revalidatePath("/admin/accounts");
  if (orgId) revalidatePath(`/admin/accounts/${orgId}`);
}

/** Commerce d'un client : nom, lien d'avis, mode de scan, message, retour privé. */
export async function adminUpdateEstablishmentAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  if (!admin) return NOT_ADMIN;
  const db = adminDb();
  if (!db) return NO_DB;

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return { error: "Le nom du commerce est requis." };
  const url = normalizeReviewUrl(String(formData.get("google_review_url") ?? ""));
  if (!url.ok) return { error: REVIEW_URL_ERROR };

  const { data: before } = await db
    .from("establishments")
    .select("org_id,google_review_url")
    .eq("id", id)
    .maybeSingle<{ org_id: string; google_review_url: string | null }>();
  if (!before) return { error: "Commerce introuvable." };

  const { error } = await db
    .from("establishments")
    .update({
      name,
      google_review_url: url.url,
      scan_mode: formData.get("scan_mode") === "page" ? "page" : "direct",
      welcome_message: String(formData.get("welcome_message") ?? "").trim() || null,
      feedback_enabled: formData.get("feedback_enabled") === "on",
    })
    .eq("id", id);
  if (error) {
    return {
      error: error.message.includes("invalid_review_url")
        ? REVIEW_URL_ERROR
        : "Enregistrement impossible. Réessayez.",
    };
  }

  // Présentoirs qui gardaient une copie de l'ancien lien (anciennes
  // activations) : ils suivent désormais le lien du commerce.
  if (before.google_review_url && before.google_review_url !== url.url) {
    await db
      .from("stands")
      .update({ target_url: null })
      .eq("establishment_id", id)
      .eq("target_url", before.google_review_url);
  }

  await db.from("stand_audit").insert({
    action: "admin_edit_establishment",
    detail: {
      establishment: id,
      name,
      from_url: before.google_review_url,
      to_url: url.url,
    },
    actor: admin.id,
    actor_email: admin.email,
  });

  refresh(before.org_id);
  return { success: true, info: "Commerce mis à jour. Les présentoirs suivent le nouveau lien." };
}

/** Lien propre à un présentoir (vide = suit le lien du commerce). */
export async function adminSetStandLinkAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  if (!admin) return NOT_ADMIN;
  const db = adminDb();
  if (!db) return NO_DB;

  const standId = String(formData.get("stand_id") ?? "");
  const url = normalizeReviewUrl(String(formData.get("target_url") ?? ""));
  if (!url.ok) return { error: REVIEW_URL_ERROR };

  const { data: before } = await db
    .from("stands")
    .select("org_id,target_url")
    .eq("id", standId)
    .maybeSingle<{ org_id: string | null; target_url: string | null }>();
  if (!before) return { error: "Présentoir introuvable." };

  const { error } = await db.from("stands").update({ target_url: url.url }).eq("id", standId);
  if (error) {
    return {
      error: error.message.includes("invalid_review_url")
        ? REVIEW_URL_ERROR
        : "Enregistrement impossible. Réessayez.",
    };
  }
  await db.from("stand_audit").insert({
    stand_id: standId,
    action: "admin_set_link",
    detail: { from: before.target_url, to: url.url },
    actor: admin.id,
    actor_email: admin.email,
  });

  refresh(before.org_id);
  return {
    success: true,
    info: url.url ? "Lien du présentoir mis à jour." : "Le présentoir suit le lien du commerce.",
  };
}
