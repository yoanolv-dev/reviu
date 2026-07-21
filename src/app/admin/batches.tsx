"use client";

import { useActionState } from "react";
import { validateBatchAction } from "@/lib/admin-actions";
import type { BatchRow } from "@/lib/admin";
import { formatDate } from "@/components/dashboard/ui";

const BATCH_STATUS: Record<string, { label: string; className: string }> = {
  draft: { label: "Brouillon", className: "bg-line-soft text-ink-soft" },
  validated: { label: "Validé", className: "bg-blue-50 text-blue-700" },
  exported: { label: "Exporté (verrouillé)", className: "bg-emerald-50 text-emerald-700" },
};

function ValidateButton({ batchId }: { batchId: string }) {
  const [state, action, pending] = useActionState(validateBatchAction, null);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !confirm(
            "Valider ce lot ? Il sera verrouillé : ses présentoirs ne pourront plus être supprimés ni modifiés.",
          )
        )
          e.preventDefault();
      }}
    >
      <input type="hidden" name="batch_id" value={batchId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-line-soft disabled:opacity-50"
      >
        {pending ? "…" : "Valider"}
      </button>
      {state?.error && <span className="ml-2 text-xs text-red-600">{state.error}</span>}
    </form>
  );
}

function ExportLink({ batch }: { batch: BatchRow }) {
  const exported = batch.status === "exported";
  return (
    <a
      href={`/admin/export?batch=${batch.id}`}
      onClick={(e) => {
        if (
          !exported &&
          !confirm(
            "Exporter le fichier fournisseur ? Le lot sera verrouillé définitivement (les identifiants deviennent physiques).",
          )
        )
          e.preventDefault();
      }}
      className="rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-strong"
    >
      {exported ? "Ré-télécharger .xlsx" : "Exporter .xlsx"}
    </a>
  );
}

export function BatchList({ batches }: { batches: BatchRow[] }) {
  if (batches.length === 0) {
    return (
      <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
        Aucun lot pour l&apos;instant. Générez un premier lot ci-dessus.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {batches.map((b) => {
        const s = BATCH_STATUS[b.status] ?? BATCH_STATUS.draft;
        return (
          <li
            key={b.id}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-ink">
                  {b.label || "Lot sans nom"}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}
                >
                  {s.label}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {b.quantity} présentoir{b.quantity > 1 ? "s" : ""} · {b.activated}{" "}
                activé{b.activated > 1 ? "s" : ""} · créé le{" "}
                {formatDate(b.created_at)}
                {b.exported_at ? ` · exporté le ${formatDate(b.exported_at)}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {b.status === "draft" && <ValidateButton batchId={b.id} />}
              <ExportLink batch={b} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
