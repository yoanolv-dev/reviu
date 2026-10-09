import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-server";
import { getOverview } from "@/lib/admin-data";
import { StatCard } from "@/components/dashboard/ui";
import { TicketStatusBadge, formatDateTime } from "@/components/support/thread";

export const dynamic = "force-dynamic";

/**
 * Accueil de l'admin : les chiffres clés et ce qui demande une action
 * (demandes de support, présentoirs sans lien, dernières activations).
 */
export default async function AdminHome() {
  if (!(await requireAdmin())) redirect("/dashboard");
  const o = await getOverview();
  const conv30 = o.views30 > 0 ? Math.round((o.clicks30 / o.views30) * 100) : 0;
  const todo = o.openTickets.length + o.noLink.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Accueil</h1>
          <p className="mt-1 text-sm text-muted">
            {todo === 0
              ? "Rien à traiter pour le moment."
              : `${todo} point${todo > 1 ? "s" : ""} à traiter ci-dessous.`}
          </p>
        </div>
        <form action="/admin/accounts" className="flex w-full gap-2 sm:w-80">
          <input
            name="q"
            placeholder="Client, e-mail ou code présentoir"
            aria-label="Rechercher un client"
            className="h-10 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-sm text-ink outline-none placeholder:text-muted focus:border-brand"
          />
          <button
            type="submit"
            className="h-10 rounded-full bg-ink px-4 text-sm font-medium text-white hover:bg-ink-soft"
          >
            Chercher
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Clients" value={o.clients} />
        <StatCard label="Présentoirs actifs" value={o.activeStands} />
        <StatCard label="Scans (30 j)" value={o.views30} />
        <StatCard label="Vers Google (30 j)" value={`${o.clicks30} · ${conv30} %`} />
      </div>
      <p className="-mt-5 text-xs text-muted">
        7 derniers jours : {o.views7} scans, {o.clicks7} clics vers Google ·{" "}
        {o.blankStands} présentoirs vierges en stock.
      </p>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Demandes de support à traiter"
          action={{ href: "/admin/support", label: "Tout le support" }}
        >
          {o.openTickets.length === 0 ? (
            <Empty>Aucune demande en attente.</Empty>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {o.openTickets.slice(0, 6).map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/admin/support/${t.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:text-brand"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">
                        {t.subject}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {t.email} · {formatDateTime(t.updated_at)}
                      </span>
                    </span>
                    <TicketStatusBadge status={t.status} admin />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Présentoirs actifs sans lien d'avis">
          {o.noLink.length === 0 ? (
            <Empty>Tous les présentoirs actifs redirigent vers Google.</Empty>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {o.noLink.slice(0, 8).map((s) => (
                <li key={s.code}>
                  <ClientLink orgId={s.orgId}>
                    <span className="font-mono text-sm text-ink">{s.code}</span>
                    <span className="truncate text-xs text-muted">
                      {s.name || "Sans nom"} · ajouter le lien
                    </span>
                  </ClientLink>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <Panel title="Dernières activations" action={{ href: "/admin/history", label: "Journal" }}>
        {o.recent.length === 0 ? (
          <Empty>Aucune activation récente.</Empty>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {o.recent.map((r) => (
              <li key={`${r.code}-${r.at}`}>
                <ClientLink orgId={r.orgId}>
                  <span className="min-w-0 truncate text-sm text-ink">
                    <span className="font-mono">{r.code}</span> · {r.name || "Sans nom"}
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {r.action === "assigned" ? "Attribué" : "Activé"} le{" "}
                    {formatDateTime(r.at)}
                  </span>
                </ClientLink>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
        {action && (
          <Link href={action.href} className="text-sm text-brand hover:underline">
            {action.label}
          </Link>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-3 text-sm text-muted">{children}</p>;
}

function ClientLink({ orgId, children }: { orgId: string | null; children: React.ReactNode }) {
  const cls = "flex items-center justify-between gap-3 py-3";
  return orgId ? (
    <Link href={`/admin/accounts/${orgId}`} className={`${cls} hover:text-brand`}>
      {children}
    </Link>
  ) : (
    <div className={cls}>{children}</div>
  );
}
