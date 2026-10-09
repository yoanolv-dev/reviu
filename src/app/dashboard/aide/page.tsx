import Link from "next/link";
import { listMyTickets } from "@/lib/support";
import { getStands } from "@/lib/dashboard";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/brand";
import { TicketStatusBadge, formatDateTime } from "@/components/support/thread";
import { NewTicketForm } from "./forms";

export const metadata = { title: "Aide - reviu" };

export default async function HelpPage() {
  const [tickets, stands] = await Promise.all([listMyTickets(), getStands()]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Aide</h1>
        <p className="mt-2 text-sm text-muted">
          Une question, un souci avec un présentoir ? Écrivez-nous : nous vous
          répondons par e-mail et ici.
          {CONTACT_PHONE ? ` Urgent : ${CONTACT_PHONE.display}.` : ""}
        </p>
      </div>

      <section className="rounded-3xl border border-line bg-surface p-6">
        <h2 className="font-display text-base font-semibold text-ink">Nouvelle demande</h2>
        <div className="mt-4">
          <NewTicketForm standCodes={stands.map((s) => s.code)} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-ink">Vos demandes</h2>
        {tickets.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
            Aucune demande pour le moment.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {tickets.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/dashboard/aide/${t.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand/40"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">
                      {t.subject}
                    </span>
                    <span className="text-xs text-muted">
                      Mis à jour le {formatDateTime(t.updated_at)}
                    </span>
                  </span>
                  <TicketStatusBadge status={t.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted">
          Vous pouvez aussi écrire à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
