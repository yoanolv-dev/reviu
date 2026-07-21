import { createSupabaseServer } from "./supabase/server";
import { isEntitled } from "./subscription";

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

/** Statistiques agrégées, restreintes aux présentoirs passés (abonnés). */
export async function getStats(standIds: string[]) {
  if (standIds.length === 0) return { views: 0, clicks: 0, conversion: 0 };
  const supabase = await createSupabaseServer();
  const [views, clicks] = await Promise.all([
    supabase
      .from("scans")
      .select("*", { count: "exact", head: true })
      .eq("kind", "view")
      .in("stand_id", standIds),
    supabase
      .from("scans")
      .select("*", { count: "exact", head: true })
      .eq("kind", "click")
      .in("stand_id", standIds),
  ]);
  const v = views.count ?? 0;
  const c = clicks.count ?? 0;
  return { views: v, clicks: c, conversion: v > 0 ? Math.round((c / v) * 100) : 0 };
}

/** Statut d'abonnement par présentoir (stand_id -> status), limité par RLS au propriétaire. */
export async function getSubscriptionMap(): Promise<Record<string, string>> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from("subscriptions").select("stand_id,status");
  const map: Record<string, string> = {};
  for (const row of (data ?? []) as { stand_id: string; status: string }[]) {
    map[row.stand_id] = row.status;
  }
  return map;
}

/** Présentoirs abonnés du compte + drapeau premium global. */
export async function getEntitlement(): Promise<{
  subscribedStandIds: string[];
  hasPremium: boolean;
}> {
  const map = await getSubscriptionMap();
  const subscribedStandIds = Object.keys(map).filter((id) =>
    isEntitled(map[id]),
  );
  return { subscribedStandIds, hasPremium: subscribedStandIds.length > 0 };
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
  const { data } = await supabase.from("scans").select("stand_id").eq("kind", "view");
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { stand_id: string }[]) {
    counts[row.stand_id] = (counts[row.stand_id] ?? 0) + 1;
  }
  return counts;
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
