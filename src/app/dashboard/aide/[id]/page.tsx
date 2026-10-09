import Link from "next/link";
import { notFound } from "next/navigation";
import { getMyTicket } from "@/lib/support";
import { Thread, TicketStatusBadge } from "@/components/support/thread";
import { ReplyForm } from "../forms";

export const metadata = { title: "Aide - reviu" };

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getMyTicket(id);
  if (!data) notFound();
  const { ticket, messages } = data;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/dashboard/aide" className="text-sm text-brand hover:underline">
        ← Toutes vos demandes
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="min-w-0 font-display text-2xl font-semibold text-ink [overflow-wrap:anywhere]">
          {ticket.subject}
        </h1>
        <TicketStatusBadge status={ticket.status} />
      </div>
      {ticket.stand_code && (
        <p className="-mt-3 text-sm text-muted">
          Présentoir : <span className="font-mono">{ticket.stand_code}</span>
        </p>
      )}
      <Thread messages={messages} viewer="client" />
      <section className="rounded-3xl border border-line bg-surface p-6">
        {ticket.status === "closed" && (
          <p className="mb-4 text-sm text-muted">
            Cette demande est clôturée. Écrire un message la rouvrira.
          </p>
        )}
        <ReplyForm ticketId={ticket.id} />
      </section>
    </div>
  );
}
