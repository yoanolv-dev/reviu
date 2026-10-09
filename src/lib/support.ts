import { adminDb } from "./admin-server";
import { getCurrentUser } from "./dashboard";
import type { TicketMessage, TicketRow } from "./admin-data";

/**
 * Lectures des tickets côté commerçant : service role, mais toujours filtrées
 * sur l'identifiant de la session (le commerçant ne voit que ses demandes).
 */

const COLS =
  "id,org_id,user_id,email,subject,stand_code,status,last_author,created_at,updated_at";

export async function listMyTickets(): Promise<TicketRow[]> {
  const user = await getCurrentUser();
  const db = adminDb();
  if (!user || !db) return [];
  const { data } = await db
    .from("support_tickets")
    .select(COLS)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(100);
  return (data ?? []) as TicketRow[];
}

export async function getMyTicket(
  id: string,
): Promise<{ ticket: TicketRow; messages: TicketMessage[] } | null> {
  const user = await getCurrentUser();
  const db = adminDb();
  if (!user || !db || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data: ticket } = await db
    .from("support_tickets")
    .select(COLS)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<TicketRow>();
  if (!ticket) return null;
  const { data: messages } = await db
    .from("support_messages")
    .select("id,author,author_email,body,created_at")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });
  return { ticket, messages: (messages ?? []) as TicketMessage[] };
}
