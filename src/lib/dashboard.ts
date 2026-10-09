import { cache } from "react";
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
  scan_mode: string;
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

// Mémoïsé par requête (React cache) : plusieurs appels dans un même rendu
// (layout + page) ne déclenchent qu'une seule validation getUser() réseau.
export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export async function getMyContext(): Promise<DashContext | null> {
  const supabase = await createSupabaseServer();
  // bind_account() (rattachement des présentoirs self-service au compte) n'est
  // plus appelé ici : il l'est une seule fois à la connexion, pas à chaque
  // chargement de page (c'était une écriture répétée inutile).
  //
  // Organisations + établissements (+ nombre de présentoirs) en UNE requête
  // (embedding PostgREST).
  const { data: orgs } = await supabase
    .from("organizations")
    .select("id,name,created_at,establishments(*,stands(count))")
    .order("created_at")
    .returns<
      {
        id: string;
        name: string;
        created_at: string;
        establishments: (EstablishmentRow & { stands?: { count: number }[] })[] | null;
      }[]
    >();
  if (!orgs?.length) return null;

  // L'espace gère un établissement : celui qui porte le plus de présentoirs
  // (à égalité, le plus ancien). Un compte qui a d'abord créé un établissement
  // vide puis activé un présentoir ailleurs voit ainsi le bon.
  let best: { org: (typeof orgs)[number]; est: EstablishmentRow; stands: number } | null =
    null;
  for (const org of orgs) {
    for (const row of org.establishments ?? []) {
      const { stands, ...est } = row;
      const count = Number(stands?.[0]?.count ?? 0);
      if (
        !best ||
        count > best.stands ||
        (count === best.stands && est.created_at < best.est.created_at)
      ) {
        best = { org, est, stands: count };
      }
    }
  }
  if (!best) return { orgId: orgs[0].id, orgName: orgs[0].name, establishment: null };
  return { orgId: best.org.id, orgName: best.org.name, establishment: best.est };
}

/** Commerce du compte, tel que proposé lors de l'activation d'un présentoir. */
export interface MyEstablishment {
  id: string;
  name: string;
  googleReviewUrl: string | null;
}

/**
 * Commerces du compte connecté, du plus ancien au plus récent (RLS). Accepte le
 * client qui vient d'ouvrir la session (même requête), sinon en crée un.
 */
export async function getMyEstablishments(
  client?: Awaited<ReturnType<typeof createSupabaseServer>>,
): Promise<MyEstablishment[]> {
  const supabase = client ?? (await createSupabaseServer());
  const { data } = await supabase
    .from("establishments")
    .select("id,name,google_review_url")
    .order("created_at");
  return (data ?? []).map((e) => ({
    id: e.id as string,
    name: e.name as string,
    googleReviewUrl: (e.google_review_url as string | null) ?? null,
  }));
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
