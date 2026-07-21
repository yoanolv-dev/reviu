import { createSupabaseServer } from "./supabase/server";
import type { StandRow } from "./dashboard";

export async function getIsAdmin(): Promise<boolean> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}

export async function listAllStands(limit = 300): Promise<StandRow[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("admin_list_stands", { p_limit: limit });
  return (data ?? []) as StandRow[];
}

/** Statut d'abonnement de tous les présentoirs (stand_id -> status), admin only. */
export async function listSubscriptions(): Promise<Record<string, string>> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("admin_list_subscriptions");
  const map: Record<string, string> = {};
  for (const row of (data ?? []) as { stand_id: string; status: string }[]) {
    map[row.stand_id] = row.status;
  }
  return map;
}
