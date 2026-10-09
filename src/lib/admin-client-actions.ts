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

type AuditRow = {
  stand_id?: string;
  action: string;
  detail: Record<string, unknown>;
  actor: string;
  actor_email: string | null;
};

/** Journal : une erreur d'écriture ne bloque pas l'action mais reste visible dans les logs. */
async function audit(db: NonNullable<ReturnType<typeof adminDb>>, rows: AuditRow[]) {
  const { error } = await db.from("stand_audit").insert(rows);
  if (error) console.error("[admin] stand_audit insert failed:", error.message);
}

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
  let released: { id: string }[] = [];
  if (before.google_review_url && before.google_review_url !== url.url) {
    const { data } = await db
      .from("stands")
      .update({ target_url: null })
      .eq("establishment_id", id)
      .eq("target_url", before.google_review_url)
      .select("id");
    released = data ?? [];
  }

  await audit(db, [
    {
      action: "admin_edit_establishment",
      detail: {
        establishment: id,
        name,
        from_url: before.google_review_url,
        to_url: url.url,
      },
      actor: admin.id,
      actor_email: admin.email,
    },
    // Une ligne par présentoir dont le lien change, pour son historique.
    ...released.map((s) => ({
      stand_id: s.id,
      action: "admin_set_link",
      detail: { from: before.google_review_url, to: null, via: "establishment" },
      actor: admin.id,
      actor_email: admin.email,
    })),
  ]);

  refresh(before.org_id);
  const linkChanged = (before.google_review_url ?? null) !== url.url;
  return {
    success: true,
    info: linkChanged
      ? "Commerce mis à jour. Les présentoirs sans lien propre utilisent le nouveau lien."
      : "Commerce mis à jour.",
  };
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
  await audit(db, [
    {
      stand_id: standId,
      action: "admin_set_link",
      detail: { from: before.target_url, to: url.url },
      actor: admin.id,
      actor_email: admin.email,
    },
  ]);

  refresh(before.org_id);
  return {
    success: true,
    info: url.url ? "Lien du présentoir mis à jour." : "Le présentoir suit le lien du commerce.",
  };
}
