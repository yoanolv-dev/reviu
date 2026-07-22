import { createSupabaseServer } from "./supabase/server";
import type { StandRow } from "./dashboard";

export async function getIsAdmin(): Promise<boolean> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}

export async function getIsSuperAdmin(): Promise<boolean> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.rpc("is_super_admin");
  if (error) return false;
  return data === true;
}

export async function listAllStands(limit = 300): Promise<StandRow[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("admin_list_stands", { p_limit: limit });
  return (data ?? []) as StandRow[];
}

export interface BatchRow {
  id: string;
  label: string | null;
  status: "draft" | "validated" | "exported";
  quantity: number;
  created_at: string;
  validated_at: string | null;
  exported_at: string | null;
  activated: number;
}

export async function listBatches(): Promise<BatchRow[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("admin_list_batches");
  return (data ?? []) as BatchRow[];
}

export interface StandFull {
  id: string;
  code: string;
  status: string;
  batch_label: string | null;
  org_id: string | null;
  establishment_id: string | null;
  establishment_name: string | null;
  owner_email: string | null;
  target_url: string | null;
  activated_at: string | null;
  status_note: string | null;
  created_at: string;
  sub_status: string | null;
}

export async function listStandsFull(limit = 500): Promise<StandFull[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("admin_list_stands_full", {
    p_limit: limit,
    p_search: null,
  });
  return (data ?? []) as StandFull[];
}

export interface AuditRow {
  id: number;
  stand_id: string | null;
  code: string | null;
  batch_id: string | null;
  action: string;
  detail: Record<string, unknown> | null;
  actor_email: string | null;
  created_at: string;
}

export async function listAudit(limit = 200): Promise<AuditRow[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("admin_list_audit", { p_limit: limit });
  return (data ?? []) as AuditRow[];
}

export interface CustomerRow {
  org_id: string;
  org_name: string;
  establishment_id: string | null;
  establishment_name: string | null;
  email: string | null;
  full_name: string | null;
  disabled: boolean;
  stand_count: number;
  active_count: number;
  tracked_count: number;
  created_at: string;
}

export async function listCustomers(): Promise<CustomerRow[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("admin_list_customers", { p_search: null });
  return (data ?? []) as CustomerRow[];
}
