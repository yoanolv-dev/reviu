"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "./supabase/server";
import type { FormState } from "./form";

/**
 * Actions d'administration du programme revendeur. Les RPC appelées sont
 * SECURITY DEFINER et vérifient elles-mêmes `is_admin()` : cette couche ne fait
 * que collecter le formulaire, appeler la fonction et traduire les erreurs.
 */

const ERR: Record<string, string> = {
  not_admin: "Accès réservé aux administrateurs.",
  user_not_found:
    "Aucun compte avec cet e-mail. Le revendeur doit d'abord créer son compte.",
  reseller_not_found: "Revendeur introuvable.",
};

function mapErr(message: string | undefined): string {
  if (!message) return "Opération impossible. Réessayez.";
  const key = Object.keys(ERR).find((k) => message.includes(k));
  return key ? ERR[key] : "Opération impossible. Réessayez.";
}

/** Crée (ou met à jour) un revendeur à partir de l'e-mail d'un compte existant. */
export async function createResellerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!email) return { error: "Indiquez l'e-mail du revendeur." };

  const supabase = await createSupabaseServer();
  // Modèle « marge physique » : pas de commission. Le RPC garde un défaut en
  // base (dormant), on ne le pilote pas depuis l'interface.
  const { data, error } = await supabase.rpc("admin_create_reseller", {
    p_email: email,
    p_name: name || null,
  });
  if (error) return { error: mapErr(error.message) };

  const row = (Array.isArray(data) ? data[0] : data) as
    | { id: string; code: string }
    | undefined;
  revalidatePath("/admin/resellers");
  return {
    success: true,
    info: row?.code
      ? `Revendeur prêt. Code de parrainage : ${row.code}`
      : "Revendeur enregistré.",
  };
}

/** Attribue une liste de présentoirs (par code) à un revendeur. */
export async function assignStandsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const resellerId = String(formData.get("reseller_id") ?? "");
  if (!resellerId) return { error: "Sélectionnez un revendeur." };
  const codes = String(formData.get("codes") ?? "")
    .split(/[\s,;]+/)
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
  if (codes.length === 0) return { error: "Indiquez au moins un code." };

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.rpc("admin_assign_stands", {
    p_reseller: resellerId,
    p_codes: codes,
  });
  if (error) return { error: mapErr(error.message) };
  revalidatePath("/admin/resellers");
  return { success: true, info: `${Number(data ?? 0)} présentoir(s) attribué(s).` };
}

/** Attribue tous les présentoirs d'un lot à un revendeur. */
export async function assignBatchAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const resellerId = String(formData.get("reseller_id") ?? "");
  const batchId = String(formData.get("batch_id") ?? "");
  if (!resellerId) return { error: "Sélectionnez un revendeur." };
  if (!batchId) return { error: "Sélectionnez un lot." };

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.rpc("admin_assign_batch", {
    p_reseller: resellerId,
    p_batch: batchId,
  });
  if (error) return { error: mapErr(error.message) };
  revalidatePath("/admin/resellers");
  return { success: true, info: `${Number(data ?? 0)} présentoir(s) attribué(s).` };
}
