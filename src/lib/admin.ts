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
