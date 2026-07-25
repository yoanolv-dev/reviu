import { createSupabaseServer } from "./supabase/server";

/**
 * Programme revendeur (phase 2 - modèle « marge physique »).
 *
 * Le revendeur gagne sa marge en revendant le présentoir physique (acheté
 * remisé en pack). L'abonnement de suivi reste vendu par reviu, en direct : le
 * revendeur n'y touche pas. Ce portail est donc purement informatif - il montre
 * au revendeur l'impact de son activité (présentoirs placés, activés, abonnés),
 * sans notion de commission. L'attribution présentoir → revendeur se fait côté
 * admin ; les données passent par des RPC SECURITY DEFINER.
 *
 * (La base conserve un champ `commission_cents` dormant, non utilisé ici, au cas
 * où un programme de commission serait réactivé plus tard.)
 */

export interface ResellerOverview {
  reseller_id: string;
  code: string;
  display_name: string | null;
  total_stands: number;
  deployed_stands: number;
  active_subs: number;
}

export interface ResellerStand {
  code: string;
  status: string;
  deployed: boolean;
  sub_active: boolean;
  activated_at: string | null;
}

export interface ResellerAdminRow {
  id: string;
  user_id: string | null;
  email: string | null;
  code: string;
  display_name: string | null;
  active: boolean;
  total_stands: number;
  active_subs: number;
  created_at: string;
}

/** Le compte connecté est-il un revendeur ? (lecture légère, via RLS self-select). */
export async function getIsReseller(): Promise<boolean> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("resellers")
    .select("id")
    .eq("active", true)
    .maybeSingle<{ id: string }>();
  return Boolean(data);
}

/** Fiche du revendeur connecté, ou null s'il n'est pas revendeur. */
export async function getResellerOverview(): Promise<ResellerOverview | null> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("reseller_overview");
  const row = (Array.isArray(data) ? data[0] : data) as ResellerOverview | undefined;
  return row ?? null;
}

/** Présentoirs attribués au revendeur connecté. */
export async function getResellerStands(): Promise<ResellerStand[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("reseller_stands");
  return (data ?? []) as ResellerStand[];
}

/** Liste des revendeurs (admin). */
export async function listResellers(): Promise<ResellerAdminRow[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("admin_list_resellers");
  return (data ?? []) as ResellerAdminRow[];
}
