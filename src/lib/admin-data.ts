import { adminDb } from "./admin-server";
import type { EstablishmentRow } from "./dashboard";

/**
 * Lectures de l'admin (service role, sans RLS). À n'appeler qu'après
 * `requireAdmin()` (voir src/lib/admin-server.ts).
 */

const DAY_MS = 86_400_000;
const PAGE = 1000; // plafond de lignes par requête de l'API Supabase

function sinceIso(days: number): string {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

function db() {
  const client = adminDb();
  // Affiché par src/app/admin/error.tsx avec une explication en français.
  if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY manquante");
  return client;
}

export type ScanRow = { stand_id: string; kind: string; created_at: string };

/** Jours calendaires (Europe/Paris) des N derniers jours, du plus ancien à aujourd'hui. */
export function lastDays(days: number): string[] {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const [y, m, d] = [get("year"), get("month"), get("day")];
  const out: string[] = [];
  // Arithmétique de calendrier (et non « - 24 h ») : aucun jour sauté ou doublé
  // aux changements d'heure.
  for (let i = days - 1; i >= 0; i--) {
    out.push(new Date(Date.UTC(y, m - 1, d - i)).toISOString().slice(0, 10));
  }
  return out;
}

const parisDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }); // AAAA-MM-JJ

/** Scans (vues et clics) depuis N jours, éventuellement limités à des présentoirs. */
export async function scansSince(days: number, standIds?: string[]): Promise<ScanRow[]> {
  if (standIds && standIds.length === 0) return [];
  const out: ScanRow[] = [];
  // Borne calculée une fois (+ 1 jour de marge pour couvrir le premier jour
  // calendaire entier) ; tri stable par id pour une pagination sans trou.
  const since = sinceIso(days + 1);
  for (let page = 0; page < 50; page++) {
    let q = db()
      .from("scans")
      .select("stand_id,kind,created_at")
      .gte("created_at", since)
      .order("id", { ascending: true })
      .range(page * PAGE, page * PAGE + PAGE - 1);
    if (standIds) q = q.in("stand_id", standIds);
    const { data, error } = await q;
    if (error || !data) break;
    out.push(...(data as ScanRow[]));
    if (data.length < PAGE) break;
  }
  return out;
}

export type StandCounts = Record<string, { views: number; clicks: number }>;

export function countByStand(rows: ScanRow[]): StandCounts {
  const out: StandCounts = {};
  for (const r of rows) {
    const c = (out[r.stand_id] ??= { views: 0, clicks: 0 });
    if (r.kind === "click") c.clicks++;
    else if (r.kind === "view") c.views++;
  }
  return out;
}

export type DayPoint = { day: string; views: number; clicks: number };

/** Ne garde que les scans des N derniers jours calendaires (Europe/Paris). */
export function withinDays(rows: ScanRow[], days: number): ScanRow[] {
  const keep = new Set(lastDays(days));
  return rows.filter((r) => keep.has(parisDay.format(new Date(r.created_at))));
}

/** Série quotidienne sur N jours (jours sans scan inclus, à zéro). */
export function dailySeries(rows: ScanRow[], days: number): DayPoint[] {
  const points = new Map<string, DayPoint>(
    lastDays(days).map((day) => [day, { day, views: 0, clicks: 0 }]),
  );
  for (const r of rows) {
    const p = points.get(parisDay.format(new Date(r.created_at)));
    if (!p) continue;
    if (r.kind === "click") p.clicks++;
    else if (r.kind === "view") p.views++;
  }
  return [...points.values()];
}

async function countScans(kind: "view" | "click", days: number): Promise<number> {
  const { count } = await db()
    .from("scans")
    .select("id", { count: "exact", head: true })
    .eq("kind", kind)
    .gte("created_at", sinceIso(days));
  return count ?? 0;
}

// ---- Tickets -----------------------------------------------------------------

export type TicketStatus = "open" | "answered" | "closed";

export interface TicketRow {
  id: string;
  org_id: string | null;
  user_id: string;
  email: string;
  subject: string;
  stand_code: string | null;
  status: TicketStatus;
  last_author: "client" | "admin";
  created_at: string;
  updated_at: string;
  /** Nom du commerce du client (pour le reconnaître dans les listes). */
  commerce?: string | null;
}

export interface TicketMessage {
  id: string;
  author: "client" | "admin";
  author_email: string | null;
  body: string;
  created_at: string;
}

const TICKET_COLS =
  "id,org_id,user_id,email,subject,stand_code,status,last_author,created_at,updated_at";

export async function listTickets(filter: "todo" | "all"): Promise<TicketRow[]> {
  let q = db().from("support_tickets").select(TICKET_COLS).order("updated_at", {
    ascending: false,
  });
  if (filter === "todo") q = q.eq("status", "open");
  const { data } = await q.limit(300);
  const rows = (data ?? []) as TicketRow[];

  const orgIds = [...new Set(rows.map((t) => t.org_id).filter((v): v is string => !!v))];
  if (orgIds.length === 0) return rows;
  const { data: ests } = await db()
    .from("establishments")
    .select("org_id,name")
    .in("org_id", orgIds)
    .order("created_at");
  const names = new Map<string, string>();
  for (const e of (ests ?? []) as { org_id: string; name: string }[]) {
    if (!names.has(e.org_id) && e.name) names.set(e.org_id, e.name);
  }
  return rows.map((t) => ({ ...t, commerce: t.org_id ? (names.get(t.org_id) ?? null) : null }));
}

export async function getTicketWithMessages(
  id: string,
): Promise<{ ticket: TicketRow; messages: TicketMessage[] } | null> {
  const { data: ticket } = await db()
    .from("support_tickets")
    .select(TICKET_COLS)
    .eq("id", id)
    .maybeSingle<TicketRow>();
  if (!ticket) return null;
  const { data: messages } = await db()
    .from("support_messages")
    .select("id,author,author_email,body,created_at")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });
  return { ticket, messages: (messages ?? []) as TicketMessage[] };
}

// ---- Accueil -----------------------------------------------------------------

export interface Overview {
  clients: number;
  activeStands: number;
  blankStands: number;
  views7: number;
  clicks7: number;
  views30: number;
  clicks30: number;
  openTickets: TicketRow[];
  noLink: { code: string; orgId: string | null; name: string }[];
  recent: {
    code: string;
    orgId: string | null;
    name: string;
    email: string | null;
    at: string;
    action: string;
  }[];
}

export async function getOverview(): Promise<Overview> {
  const client = db();
  const [clients, active, blank, views7, clicks7, views30, clicks30, openTickets] =
    await Promise.all([
      client.from("organizations").select("id", { count: "exact", head: true }),
      client.from("stands").select("id", { count: "exact", head: true }).eq("status", "active"),
      client.from("stands").select("id", { count: "exact", head: true }).eq("status", "blank"),
      countScans("view", 7),
      countScans("click", 7),
      countScans("view", 30),
      countScans("click", 30),
      listTickets("todo"),
    ]);

  // Présentoirs actifs qui ne redirigent nulle part (ni lien propre, ni lien
  // du commerce) : à corriger en priorité. Filtré par la base (inner join).
  const { data: activeRows } = await client
    .from("stands")
    .select("code,org_id,establishments!inner(name,google_review_url)")
    .eq("status", "active")
    .is("target_url", null)
    .is("establishments.google_review_url", null)
    .limit(100);
  const noLink = ((activeRows ?? []) as unknown as {
    code: string;
    org_id: string | null;
    establishments: { name: string } | null;
  }[]).map((s) => ({ code: s.code, orgId: s.org_id, name: s.establishments?.name ?? "" }));

  const { data: audit } = await client
    .from("stand_audit")
    .select("stand_id,action,actor_email,created_at")
    .in("action", ["activated", "assigned"])
    .order("created_at", { ascending: false })
    .limit(8);
  const auditRows = (audit ?? []) as {
    stand_id: string | null;
    action: string;
    actor_email: string | null;
    created_at: string;
  }[];
  const ids = auditRows.map((a) => a.stand_id).filter((x): x is string => Boolean(x));
  const { data: standRows } = ids.length
    ? await client
        .from("stands")
        .select("id,code,org_id,establishments(name)")
        .in("id", ids)
    : { data: [] };
  const byId = new Map(
    ((standRows ?? []) as unknown as {
      id: string;
      code: string;
      org_id: string | null;
      establishments: { name: string } | null;
    }[]).map((s) => [s.id, s]),
  );
  const recent = auditRows.flatMap((a) => {
    const s = a.stand_id ? byId.get(a.stand_id) : undefined;
    if (!s) return [];
    return [
      {
        code: s.code,
        orgId: s.org_id,
        name: s.establishments?.name ?? "",
        email: a.actor_email,
        at: a.created_at,
        action: a.action,
      },
    ];
  });

  return {
    clients: clients.count ?? 0,
    activeStands: active.count ?? 0,
    blankStands: blank.count ?? 0,
    views7,
    clicks7,
    views30,
    clicks30,
    openTickets,
    noLink,
    recent,
  };
}

// ---- Fiche client ------------------------------------------------------------

export interface ClientStand {
  id: string;
  code: string;
  status: string;
  target_url: string | null;
  establishment_id: string | null;
  activated_at: string | null;
  status_note: string | null;
  views30: number;
  clicks30: number;
}

export interface ClientFeedback {
  id: string;
  rating: number | null;
  message: string | null;
  created_at: string;
  establishment_id: string | null;
}

export interface ClientDetail {
  org: { id: string; name: string; disabled: boolean; created_at: string; owner_id: string | null };
  email: string | null;
  fullName: string | null;
  establishments: EstablishmentRow[];
  stands: ClientStand[];
  days: DayPoint[];
  views30: number;
  clicks30: number;
  viewsAll: number;
  clicksAll: number;
  feedback: ClientFeedback[];
  tickets: TicketRow[];
}

export async function getClientDetail(orgId: string): Promise<ClientDetail | null> {
  const client = db();
  const { data: org } = await client
    .from("organizations")
    .select("id,name,disabled,created_at,owner_id,customer_id")
    .eq("id", orgId)
    .maybeSingle<{
      id: string;
      name: string;
      disabled: boolean | null;
      created_at: string;
      owner_id: string | null;
      customer_id: string | null;
    }>();
  if (!org) return null;

  const [{ data: ests }, { data: stands }, customer] = await Promise.all([
    client.from("establishments").select("*").eq("org_id", orgId).order("created_at"),
    client
      .from("stands")
      .select("id,code,status,target_url,establishment_id,activated_at,status_note")
      .eq("org_id", orgId)
      .order("activated_at", { ascending: true }),
    org.customer_id
      ? client
          .from("customers")
          .select("email,full_name")
          .eq("id", org.customer_id)
          .maybeSingle<{ email: string; full_name: string | null }>()
      : Promise.resolve({ data: null }),
  ]);

  let email = customer.data?.email ?? null;
  let fullName = customer.data?.full_name ?? null;
  if (!email && org.owner_id) {
    const { data } = await client.auth.admin.getUserById(org.owner_id);
    email = data.user?.email ?? null;
  }
  if (!fullName && org.owner_id) {
    const { data } = await client
      .from("profiles")
      .select("full_name")
      .eq("id", org.owner_id)
      .maybeSingle<{ full_name: string | null }>();
    fullName = data?.full_name ?? null;
  }

  const standRows = (stands ?? []) as Omit<ClientStand, "views30" | "clicks30">[];
  const standIds = standRows.map((s) => s.id);
  const estIds = ((ests ?? []) as EstablishmentRow[]).map((e) => e.id);

  const countAll = async (kind: "view" | "click") => {
    if (!standIds.length) return 0;
    const { count } = await client
      .from("scans")
      .select("id", { count: "exact", head: true })
      .in("stand_id", standIds)
      .eq("kind", kind);
    return count ?? 0;
  };

  const [rows30, viewsAll, clicksAll, feedback, tickets] = await Promise.all([
    scansSince(30, standIds),
    countAll("view"),
    countAll("click"),
    estIds.length
      ? client
          .from("feedback")
          .select("id,rating,message,created_at,establishment_id")
          .in("establishment_id", estIds)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] }),
    client
      .from("support_tickets")
      .select(TICKET_COLS)
      .eq("org_id", orgId)
      .order("updated_at", { ascending: false })
      .limit(20),
  ]);

  // Même fenêtre (30 jours calendaires) pour la série et les compteurs.
  const window30 = withinDays(rows30, 30);
  const counts = countByStand(window30);
  const days = dailySeries(window30, 30);
  return {
    org: {
      id: org.id,
      name: org.name,
      disabled: Boolean(org.disabled),
      created_at: org.created_at,
      owner_id: org.owner_id,
    },
    email,
    fullName,
    establishments: (ests ?? []) as EstablishmentRow[],
    stands: standRows.map((s) => ({
      ...s,
      views30: counts[s.id]?.views ?? 0,
      clicks30: counts[s.id]?.clicks ?? 0,
    })),
    days,
    views30: days.reduce((a, d) => a + d.views, 0),
    clicks30: days.reduce((a, d) => a + d.clicks, 0),
    viewsAll,
    clicksAll,
    feedback: (feedback.data ?? []) as ClientFeedback[],
    tickets: (tickets.data ?? []) as TicketRow[],
  };
}
