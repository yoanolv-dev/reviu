import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-server";
import { listTickets } from "@/lib/admin-data";
import { TicketStatusBadge, formatDateTime } from "@/components/support/thread";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ vue?: string }>;
}) {
  if (!(await requireAdmin())) redirect("/dashboard");
  const { vue } = await searchParams;
  const filter = vue === "tout" ? "all" : "todo";
  const tickets = await listTickets(filter);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Support</h1>
        <p className="mt-1 text-sm text-muted">
          Les demandes envoyées par les commerçants depuis leur espace (Aide).
          Votre réponse leur part aussi par e-mail.
        </p>
      </div>
      <div className="flex gap-2">
        <Tab href="/admin/support" active={filter === "todo"}>
          À traiter
        </Tab>
        <Tab href="/admin/support?vue=tout" active={filter === "all"}>
          Toutes
        </Tab>
      </div>
      {tickets.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
          {filter === "todo" ? "Aucune demande à traiter." : "Aucune demande."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tickets.map((t) => (
            <li key={t.id}>
              <Link
                href={`/admin/support/${t.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand/40"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">{t.subject}</span>
                  <span className="block truncate text-xs text-muted">
                    {t.email}
                    {t.stand_code ? ` · ${t.stand_code}` : ""} · {formatDateTime(t.updated_at)}
                  </span>
                </span>
                <TicketStatusBadge status={t.status} admin />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-ink text-white" : "border border-line bg-surface text-ink-soft hover:bg-line-soft",
      )}
    >
      {children}
    </Link>
  );
}
