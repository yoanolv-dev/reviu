import Link from "next/link";
import { listAllStands, listBatches } from "@/lib/admin";
import { standGenerationAllowed } from "@/lib/env";
import { StatCard } from "@/components/dashboard/ui";
import { GenerateForm } from "./generate-form";
import { BatchList } from "./batches";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [stands, batches] = await Promise.all([listAllStands(1000), listBatches()]);
  const blank = stands.filter((s) => s.status === "blank").length;
  const active = stands.filter((s) => s.status === "active").length;
  const genOn = standGenerationAllowed();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          Admin
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink">
          Génération des présentoirs
        </h1>
        <p className="mt-2 text-sm text-muted">
          Lots de codes uniques et permanents + secret d&apos;activation, prêts
          pour votre fournisseur.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Présentoirs" value={stands.length} />
        <StatCard label="Vierges" value={blank} />
        <StatCard label="Actifs" value={active} />
        <StatCard label="Lots" value={batches.length} />
      </div>

      <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="font-display text-base font-semibold text-ink">
          Générer un lot
        </h2>
        <p className="mt-1 text-sm text-muted">
          Chaque présentoir reçoit un code public à 7 caractères, permanent et
          non modifiable, et un secret d&apos;activation à 8 caractères (à
          imprimer discrètement, jamais dans le QR/NFC).
        </p>
        <div className="mt-4">
          <GenerateForm enabled={genOn} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">
            Lots de production
          </h2>
          <div className="flex flex-wrap gap-2">
            <a
              href="/admin/export"
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-line-soft"
            >
              Export global (.xlsx)
            </a>
            <Link
              href="/admin/print"
              className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
            >
              Feuille QR à imprimer
            </Link>
          </div>
        </div>
        <BatchList batches={batches} />
      </section>
    </div>
  );
}
