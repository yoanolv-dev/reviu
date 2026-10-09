import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-server";
import { getClientDetail } from "@/lib/admin-data";
import { getIsSuperAdmin } from "@/lib/admin";
import { StatCard, formatDate } from "@/components/dashboard/ui";
import { Stars } from "@/components/ui/stars";
import { ScansChart } from "@/components/admin/scans-chart";
import { TicketStatusBadge, formatDateTime } from "@/components/support/thread";
import {
  AssignStandForm,
  DeleteAccount,
  EstablishmentAdminForm,
  QuickActions,
  StandRow,
} from "./client-forms";

export const dynamic = "force-dynamic";

/**
 * Fiche client : tout ce qui concerne un commerçant sur une seule page, et
 * modifiable à distance (commerce, liens, présentoirs, compte, support).
 */
export default async function ClientPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  if (!(await requireAdmin())) redirect("/dashboard");
  const { orgId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(orgId)) notFound();
  const [c, isSuperAdmin] = await Promise.all([getClientDetail(orgId), getIsSuperAdmin()]);
  if (!c) notFound();

  const main = c.establishments[0] ?? null;
  const title = main?.name || c.org.name || "Sans nom";
  const conv = c.views30 > 0 ? Math.round((c.clicks30 / c.views30) * 100) : 0;
  const urlByEst = new Map(c.establishments.map((e) => [e.id, e.google_review_url]));

  return (
    <div className="flex flex-col gap-8">
      <Link href="/admin/accounts" className="text-sm text-brand hover:underline">
        ← Tous les clients
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
            {c.org.disabled && (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                Suspendu
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            {c.email ?? "e-mail inconnu"}
            {c.fullName ? ` · ${c.fullName}` : ""} · client depuis le{" "}
            {formatDate(c.org.created_at)}
          </p>
        </div>
        <QuickActions orgId={c.org.id} email={c.email} disabled={c.org.disabled} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Scans (30 j)" value={c.views30} />
        <StatCard label="Vers Google (30 j)" value={c.clicks30} />
        <StatCard label="Taux (30 j)" value={`${conv} %`} />
        <StatCard label="Scans depuis le début" value={c.viewsAll} />
      </div>

      <ScansChart days={c.days} />

      <Section title="Commerce">
        {c.establishments.length === 0 ? (
          <p className="text-sm text-muted">Aucun commerce créé pour ce compte.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {c.establishments.map((e) => (
              <EstablishmentAdminForm key={e.id} est={e} />
            ))}
          </div>
        )}
      </Section>

      <Section title={`Présentoirs (${c.stands.length})`}>
        {c.stands.length === 0 ? (
          <p className="text-sm text-muted">Aucun présentoir sur ce compte.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {c.stands.map((s) => (
              <StandRow
                key={s.id}
                stand={s}
                commerceUrl={s.establishment_id ? (urlByEst.get(s.establishment_id) ?? null) : null}
              />
            ))}
          </ul>
        )}
        {main && (
          <div className="mt-4 border-t border-line pt-4">
            <p className="mb-2 text-xs font-medium text-ink-soft">
              Ajouter un présentoir vierge à ce commerce
            </p>
            <AssignStandForm establishmentId={main.id} />
          </div>
        )}
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Support">
          {c.tickets.length === 0 ? (
            <p className="text-sm text-muted">Aucune demande.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {c.tickets.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/admin/support/${t.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:text-brand"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-ink">{t.subject}</span>
                      <span className="text-xs text-muted">{formatDateTime(t.updated_at)}</span>
                    </span>
                    <TicketStatusBadge status={t.status} admin />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Retours privés">
          {c.feedback.length === 0 ? (
            <p className="text-sm text-muted">Aucun retour privé.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {c.feedback.map((f) => (
                <li key={f.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    {f.rating ? (
                      <Stars count={f.rating} size={13} />
                    ) : (
                      <span className="text-xs text-muted">Sans note</span>
                    )}
                    <span className="text-xs text-muted">{formatDate(f.created_at)}</span>
                  </div>
                  {f.message && <p className="mt-1 text-sm text-ink">{f.message}</p>}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      {isSuperAdmin && (
        <Section title="Zone sensible">
          <p className="mb-2 text-xs text-muted">
            Supprime le compte et retire ses présentoirs. Préférez « Suspendre le
            compte » si vous hésitez.
          </p>
          <DeleteAccount orgId={c.org.id} />
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="mb-4 font-display text-base font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}
