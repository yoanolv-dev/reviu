"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminDb, requireAdmin } from "./admin-server";
import { getCurrentUser, getMyContext } from "./dashboard";
import { currentOrigin } from "./auth-code";
import { rateAllow } from "./rate-limit";
import { sendEmail } from "./email";
import { supportToAdminEmail, supportToClientEmail } from "./email-templates";
import { ADMIN_NOTIFY_EMAIL } from "./brand";
import type { FormState } from "./form";
import type { AdminActionState } from "./admin-actions";

/**
 * Tickets de support. Le commerçant écrit depuis son espace (Aide), l'admin
 * répond depuis /admin/support ; chaque message part aussi par e-mail. Les
 * tables ne sont accessibles qu'au serveur (service role) : le commerçant ne
 * voit que ses propres tickets (filtre sur son identifiant de session).
 */

const UNAVAILABLE = "Service indisponible pour le moment. Écrivez-nous par e-mail.";

async function currentMerchant() {
  const user = await getCurrentUser();
  if (!user?.email) return null;
  const ctx = await getMyContext();
  return { id: user.id, email: user.email, orgId: ctx?.orgId ?? null };
}

function cleanBody(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim().slice(0, 5000);
}

// ---- Côté commerçant ---------------------------------------------------------

export async function createTicketAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const me = await currentMerchant();
  if (!me) redirect("/login");
  const db = adminDb();
  if (!db) return { error: UNAVAILABLE };

  const body = cleanBody(formData.get("message"));
  if (!body) return { error: "Décrivez votre demande." };
  const subject =
    String(formData.get("subject") ?? "").trim().slice(0, 200) ||
    body.split("\n")[0].slice(0, 80);
  const standCode = String(formData.get("stand_code") ?? "").trim().toLowerCase() || null;

  if (!(await rateAllow("ticket_create", me.id, 86_400, 10))) {
    return { error: "Vous avez ouvert beaucoup de demandes aujourd'hui. Réessayez demain." };
  }

  const { data: ticket, error } = await db
    .from("support_tickets")
    .insert({
      org_id: me.orgId,
      user_id: me.id,
      email: me.email,
      subject,
      stand_code: standCode,
      status: "open",
      last_author: "client",
    })
    .select("id")
    .single<{ id: string }>();
  if (error || !ticket) return { error: UNAVAILABLE };
  await db.from("support_messages").insert({
    ticket_id: ticket.id,
    author: "client",
    author_email: me.email,
    body,
  });

  const origin = await currentOrigin();
  after(async () => {
    const mail = supportToAdminEmail({
      subject,
      body,
      email: me.email,
      isNew: true,
      link: `${origin}/admin/support/${ticket.id}`,
    });
    await sendEmail({ to: ADMIN_NOTIFY_EMAIL, ...mail, replyTo: me.email });
  });
  revalidatePath("/dashboard/aide");
  redirect(`/dashboard/aide/${ticket.id}`);
}

export async function replyTicketAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const me = await currentMerchant();
  if (!me) redirect("/login");
  const db = adminDb();
  if (!db) return { error: UNAVAILABLE };

  const ticketId = String(formData.get("ticket_id") ?? "");
  const body = cleanBody(formData.get("message"));
  if (!body) return { error: "Écrivez votre message." };
  const { data: ticket } = await db
    .from("support_tickets")
    .select("id,subject")
    .eq("id", ticketId)
    .eq("user_id", me.id)
    .maybeSingle<{ id: string; subject: string }>();
  if (!ticket) return { error: "Demande introuvable." };
  if (!(await rateAllow("ticket_message", me.id, 3600, 30))) {
    return { error: "Trop de messages envoyés. Réessayez dans un moment." };
  }

  await db.from("support_messages").insert({
    ticket_id: ticket.id,
    author: "client",
    author_email: me.email,
    body,
  });
  await db
    .from("support_tickets")
    .update({ status: "open", last_author: "client", updated_at: new Date().toISOString() })
    .eq("id", ticket.id);

  const origin = await currentOrigin();
  after(async () => {
    const mail = supportToAdminEmail({
      subject: ticket.subject,
      body,
      email: me.email,
      isNew: false,
      link: `${origin}/admin/support/${ticket.id}`,
    });
    await sendEmail({ to: ADMIN_NOTIFY_EMAIL, ...mail, replyTo: me.email });
  });
  revalidatePath(`/dashboard/aide/${ticket.id}`);
  revalidatePath("/dashboard/aide");
  return { success: true };
}

// ---- Côté admin ----------------------------------------------------------------

export async function adminReplyTicketAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Accès réservé aux administrateurs." };
  const db = adminDb();
  if (!db) return { error: UNAVAILABLE };

  const ticketId = String(formData.get("ticket_id") ?? "");
  const body = cleanBody(formData.get("message"));
  const close = formData.get("close") === "on";
  if (!body) return { error: "Écrivez une réponse." };
  const { data: ticket } = await db
    .from("support_tickets")
    .select("id,subject,email,org_id")
    .eq("id", ticketId)
    .maybeSingle<{ id: string; subject: string; email: string; org_id: string | null }>();
  if (!ticket) return { error: "Demande introuvable." };

  await db.from("support_messages").insert({
    ticket_id: ticket.id,
    author: "admin",
    author_email: admin.email,
    body,
  });
  await db
    .from("support_tickets")
    .update({
      status: close ? "closed" : "answered",
      last_author: "admin",
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticket.id);

  const origin = await currentOrigin();
  after(async () => {
    const mail = supportToClientEmail({
      subject: ticket.subject,
      body,
      link: `${origin}/dashboard/aide/${ticket.id}`,
    });
    await sendEmail({ to: ticket.email, ...mail, replyTo: ADMIN_NOTIFY_EMAIL });
  });
  revalidatePath(`/admin/support/${ticket.id}`);
  revalidatePath("/admin/support");
  revalidatePath("/admin");
  if (ticket.org_id) revalidatePath(`/admin/accounts/${ticket.org_id}`);
  return { success: true, info: "Réponse envoyée au commerçant (e-mail)." };
}

export async function adminSetTicketStatusAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Accès réservé aux administrateurs." };
  const db = adminDb();
  if (!db) return { error: UNAVAILABLE };
  const ticketId = String(formData.get("ticket_id") ?? "");
  const status = formData.get("status") === "open" ? "open" : "closed";
  await db
    .from("support_tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", ticketId);
  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath("/admin/support");
  revalidatePath("/admin");
  return { success: true, info: status === "closed" ? "Demande clôturée." : "Demande rouverte." };
}
