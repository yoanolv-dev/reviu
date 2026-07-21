import Link from "next/link";
import { listAllStands } from "@/lib/admin";
import { standUrl } from "@/lib/qr";
import { StatCard, StatusBadge } from "@/components/dashboard/ui";
import { GenerateForm } from "./generate-form";

export default async function AdminPage() {
  const stands = await listAllStands(300);
  const blank = stands.filter((s) => s.status === "blank").length;
  const active = stands.filter((s) => s.status === "active").length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          Admin
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink">
          Générateur de présentoirs
        </h1>
        <p className="mt-2 text-sm text-muted">
          Créez des lots de codes uniques + QR vectoriels prêts pour votre
          fournisseur.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total présentoirs" value={stands.length} />
        <StatCard label="Vierges" value={blank} />
        <StatCard label="Actifs" value={active} />
      </div>

      <section className="rounded-3xl border border-line bg-surface p-6">
        <h2 className="font-display text-base font-semibold text-ink">
          Générer un lot
        </h2>
        <p className="mt-1 text-sm text-muted">
          Chaque présentoir reçoit un code à 7 caractères non devinable et un PIN
          d&apos;activation (affiché une seule fois — non re-consultable ensuite).
        </p>
        <div className="mt-4">
          <GenerateForm />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">
            Présentoirs
          </h2>
          <div className="flex gap-2">
            <a
              href="/admin/export"
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-line-soft"
            >
              Export CSV fournisseur
            </a>
            <Link
              href="/admin/print"
              className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
            >
              Feuille QR à imprimer
            </Link>
          </div>
        </div>

        {stands.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
            Aucun présentoir. Générez un premier lot ci-dessus.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-line-soft text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">QR</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">URL</th>
                  <th className="px-4 py-3 font-medium">SVG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {stands.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/admin/qr/${s.code}`}
                        alt={`QR ${s.code}`}
                        className="h-12 w-12"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-ink">
                      {s.code}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      {standUrl(s.code).replace(/^https?:\/\//, "")}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/admin/qr/${s.code}`}
                        download={`reviu-${s.code}.svg`}
                        className="text-brand hover:underline"
                      >
                        Télécharger
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
