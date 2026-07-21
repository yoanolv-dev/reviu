import { createSupabaseServer } from "./supabase/server";

export interface EstablishmentRow {
  id: string;
  org_id: string;
  name: string;
  google_place_id: string | null;
  google_review_url: string | null;
  logo_url: string | null;
  brand_color: string;
  welcome_message: string | null;
  feedback_enabled: boolean;
  created_at: string;
}

export interface StandRow {
  id: string;
  code: string;
  status: string;
  target_type: string;
  org_id: string | null;
  establishment_id: string | null;
  label: string | null;
  created_at: string;
  activated_at: string | null;
  target_url: string | null;
  batch_id?: string | null;
  replaced_by?: string | null;
  status_note?: string | null;
  status_changed_at?: string | null;
}

export interface FeedbackRow {
  id: string;
  rating: number | null;
  message: string | null;
  created_at: string;
}

export interface DashContext {
  orgId: string;
  orgName: string;
  establishment: EstablishmentRow | null;
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getMyContext(): Promise<DashContext | null> {
  const supabase = await createSupabaseServer();
  // bind_account() (rattachement des présentoirs self-service au compte) n'est
  // plus appelé ici : il l'est une seule fois à la connexion, pas à chaque
  // chargement de page (c'était une écriture répétée inutile).
  const { data: org } = await supabase
    .from("organizations")
    .select("id,name")
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (!org) return null;
  const { data: est } = await supabase
    .from("establishments")
    .select("*")
    .eq("org_id", org.id)
    .order("created_at")
    .limit(1)
    .maybeSingle<EstablishmentRow>();
  return {
    orgId: org.id as string,
    orgName: org.name as string,
    establishment: est ?? null,
  };
}

export async function getStats() {
  const supabase = await createSupabaseServer();
  // Un seul aller-retour, agrégé côté SQL (au lieu de 2 requêtes count).
  const { data } = await supabase
    .rpc("my_stats")
    .maybeSingle<{ views: number; clicks: number }>();
  const v = Number(data?.views ?? 0);
  const c = Number(data?.clicks ?? 0);
  return { views: v, clicks: c, conversion: v > 0 ? Math.round((c / v) * 100) : 0 };
}

export async function getStands(): Promise<StandRow[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("stands")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as StandRow[];
}

export async function getScanCounts(): Promise<Record<string, number>> {
  const supabase = await createSupabaseServer();
  // Agrégation SQL (GROUP BY) au lieu de rapatrier toutes les lignes de scans.
  const { data } = await supabase.rpc("my_scan_counts");
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { stand_id: string; views: number }[]) {
    counts[row.stand_id] = Number(row.views);
  }
  return counts;
}

/** Statut d'abonnement par présentoir (stand_id → status). RLS : présentoirs du compte. */
export async function getSubscriptions(): Promise<Record<string, string>> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("subscriptions")
    .select("stand_id,status");
  const map: Record<string, string> = {};
  for (const row of (data ?? []) as { stand_id: string; status: string }[]) {
    map[row.stand_id] = row.status;
  }
  return map;
}

/** Un présentoir est « suivi » si son abonnement est actif (ou en essai). */
export function isTracked(status: string | undefined): boolean {
  return status === "active" || status === "trialing";
}

export async function getFeedback(
  estId: string,
  limit = 50,
): Promise<FeedbackRow[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("feedback")
    .select("id,rating,message,created_at")
    .eq("establishment_id", estId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as FeedbackRow[];
}
