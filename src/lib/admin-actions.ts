"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createSupabaseServer } from "./supabase/server";
import { createPublicClient } from "./supabase/public";
import { getIsAdmin } from "./admin";
import { standGenerationAllowed } from "./env";
import { APP_BASE } from "./brand";

export type GeneratedStand = { code: string; secret: string };
export type GenerateState = {
  error?: string;
  rows?: GeneratedStand[];
  label?: string | null;
} | null;

export type AdminActionState = {
  error?: string;
  success?: boolean;
  info?: string;
} | null;

const ERR: Record<string, string> = {
  not_admin: "Accès réservé aux administrateurs.",
  not_super_admin: "Action réservée au super-administrateur.",
  invalid_count: "Indiquez un nombre entre 1 et 500.",
  batch_not_draft: "Ce lot n'est plus modifiable.",
  batch_not_found: "Lot introuvable.",
  stand_not_found: "Présentoir introuvable.",
  stand_already_assigned: "Ce présentoir est déjà attribué.",
  new_stand_not_found: "Aucun présentoir vierge avec ce code.",
  new_stand_not_blank: "Le présentoir de remplacement doit être vierge.",
  stand_not_activated: "Ce présentoir n'est pas activé.",
  stand_replaced: "Ce présentoir a déjà été remplacé.",
  establishment_not_found: "Établissement introuvable.",
  invalid_status: "Statut invalide.",
};

function mapErr(message: string | undefined): string {
  if (!message) return "Opération impossible. Réessayez.";
  const key = Object.keys(ERR).find((k) => message.includes(k));
  return key ? ERR[key] : "Opération impossible. Réessayez.";
}

export async function generateStandsAction(
  _prev: GenerateState,
  formData: FormData,
): Promise<GenerateState> {
  // Environment guard: never generate real, physical identifiers from a
  // preview/test deployment (all environments share one Supabase project).
  if (!standGenerationAllowed()) {
    return {
      error:
        "Génération désactivée hors production (protection anti-doublons). " +
        "Pour générer en local, définissez REVIU_ALLOW_STAND_GENERATION=true.",
    };
  }

  const count = Number.parseInt(String(formData.get("count") ?? ""), 10);
  const label = String(formData.get("label") ?? "").trim() || null;
  if (!Number.isFinite(count) || count < 1 || count > 500) {
    return { error: "Indiquez un nombre entre 1 et 500." };
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.rpc("generate_stands", {
    p_count: count,
    p_label: label,
  });
  if (error) return { error: mapErr(error.message) };
  revalidatePath("/admin");
  return { rows: (data ?? []) as GeneratedStand[], label };
}

export async function validateBatchAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const batchId = String(formData.get("batch_id") ?? "");
  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("admin_validate_batch", {
    p_batch: batchId,
  });
  if (error) return { error: mapErr(error.message) };
  revalidatePath("/admin");
  return { success: true, info: "Lot validé et verrouillé." };
}

export async function setStandStatusAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const standId = String(formData.get("stand_id") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim() || null;
  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("admin_set_stand_status", {
    p_stand: standId,
    p_status: status,
    p_note: note,
  });
  if (error) return { error: mapErr(error.message) };
  revalidatePath("/admin/stands");
  return { success: true, info: "Statut mis à jour." };
}

export async function replaceStandAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const oldId = String(formData.get("stand_id") ?? "");
  const newCode = String(formData.get("new_code") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim() || null;
  if (!newCode) return { error: "Indiquez le code du présentoir de remplacement." };
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.rpc("admin_replace_stand", {
    p_old: oldId,
    p_new_code: newCode,
    p_reason: reason,
  });
  if (error) return { error: mapErr(error.message) };
  revalidatePath("/admin/stands");
  return { success: true, info: `Présentoir remplacé par ${String(data)}.` };
}

// --- Comptes clients --------------------------------------------------------

export async function updateAccountAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("admin_update_account", {
    p_org: String(formData.get("org_id") ?? ""),
    p_org_name: String(formData.get("org_name") ?? ""),
    p_est_name: String(formData.get("est_name") ?? ""),
    p_full_name: String(formData.get("full_name") ?? ""),
  });
  if (error) return { error: mapErr(error.message) };
  revalidatePath("/admin/accounts");
  return { success: true, info: "Compte mis à jour." };
}

export async function setAccountDisabledAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const disabled = String(formData.get("disabled") ?? "") === "true";
  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("admin_set_account_disabled", {
    p_org: String(formData.get("org_id") ?? ""),
    p_disabled: disabled,
  });
  if (error) return { error: mapErr(error.message) };
  revalidatePath("/admin/accounts");
  return { success: true, info: disabled ? "Compte désactivé." : "Compte réactivé." };
}

export async function deleteAccountAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("admin_delete_account", {
    p_org: String(formData.get("org_id") ?? ""),
  });
  if (error) return { error: mapErr(error.message) };
  revalidatePath("/admin/accounts");
  return { success: true, info: "Compte supprimé (présentoirs retirés)." };
}

export async function assignStandAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("admin_assign_stand", {
    p_code: String(formData.get("code") ?? "").trim(),
    p_establishment_id: String(formData.get("establishment_id") ?? ""),
  });
  if (error) return { error: mapErr(error.message) };
  revalidatePath("/admin/accounts");
  revalidatePath("/admin/stands");
  return { success: true, info: "Présentoir attribué." };
}

/**
 * Renvoi d'un e-mail d'activation / invitation : envoie un lien de connexion
 * (magic link) à l'e-mail du compte. Réservé aux administrateurs.
 */
export async function resendActivationAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await getIsAdmin())) return { error: ERR.not_admin };
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Adresse e-mail manquante." };
  const h = await headers();
  const origin = h.get("origin") ?? APP_BASE;
  // persistSession:false → n'affecte pas la session admin en cours.
  const supabase = createPublicClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/dashboard` },
  });
  if (error) return { error: "Envoi impossible. Réessayez." };
  return { success: true, info: `Lien d'activation envoyé à ${email}.` };
}
