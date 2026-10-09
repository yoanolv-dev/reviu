import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-server";
import { getTicketWithMessages } from "@/lib/admin-data";
import { Thread, TicketStatusBadge, formatDateTime } from "@/components/support/thread";
import { AdminReplyForm } from "./reply-form";

export const dynamic = "force-dynamic";

export default async function AdminTicketPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) redirect("/dashboard");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const data = await getTicketWithMessages(id);
  if (!data) notFound();
  const { ticket, messages } = data;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/support" className="text-sm text-brand hover:underline">
        ← Support
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-ink">{ticket.subject}</h1>
          <p className="mt-1 text-sm text-muted">
            {ticket.email}
            {ticket.stand_code ? (
              <>
                {" "}· présentoir{" "}
                <Link
                  href={`/admin/stands?q=${encodeURIComponent(ticket.stand_code)}`}
                  className="font-mono text-brand hover:underline"
                >
                  {ticket.stand_code}
                </Link>
              </>
            ) : null}{" "}
            · ouverte le {formatDateTime(ticket.created_at)}
          </p>
          {ticket.org_id && (
            <Link
              href={`/admin/accounts/${ticket.org_id}`}
              className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
            >
              Ouvrir la fiche client
            </Link>
          )}
        </div>
        <TicketStatusBadge status={ticket.status} admin />
      </div>
      <Thread messages={messages} viewer="admin" />
      <section className="rounded-3xl border border-line bg-surface p-6">
        <AdminReplyForm ticketId={ticket.id} closed={ticket.status === "closed"} />
      </section>
    </div>
  );
}
