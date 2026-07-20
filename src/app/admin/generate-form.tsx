"use client";

import { useActionState } from "react";
import { generateStandsAction, type GeneratedStand } from "@/lib/admin-actions";
import { Field } from "@/components/ui/field";

const REDIRECT_BASE =
  process.env.NEXT_PUBLIC_REDIRECT_BASE ?? "https://r.reviu.fr";

function csvCell(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function downloadBatchCsv(batch: GeneratedStand[]) {
  const header = ["code", "pin", "nfc_url", "qr_url"];
  const rows = [
    header,
    ...batch.map((b) => [
      b.code,
      b.pin,
      `${REDIRECT_BASE}/${b.code}?s=nfc`,
      `${REDIRECT_BASE}/${b.code}?s=qr`,
    ]),
  ];
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `reviu-lot-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function GenerateForm() {
  const [state, action, pending] = useActionState(generateStandsAction, null);
  const batch = state?.batch ?? [];

  return (
    <div className="flex flex-col gap-4">
      <form action={action} className="flex flex-col gap-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="sm:w-36">
            <Field
              label="Nombre"
              name="count"
              type="number"
              min={1}
              max={500}
              required
              defaultValue={10}
            />
          </div>
          <div className="flex-1">
            <Field
              label="Lot (optionnel)"
              name="label"
              placeholder="Commande fournisseur — mars"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
          >
            {pending ? "Génération…" : "Générer"}
          </button>
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state?.success && (
          <p className="text-sm text-emerald-600">{state.info}</p>
        )}
      </form>

      {batch.length > 0 && (
        <div className="rounded-2xl border border-brand/30 bg-brand-soft/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-sm font-semibold text-ink">
                Codes + PIN à transmettre au fournisseur
              </h3>
              <p className="mt-0.5 text-xs text-amber-700">
                Notez-les ou exportez-les maintenant : les PIN ne seront plus
                affichés ensuite.
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadBatchCsv(batch)}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-line-soft"
            >
              Télécharger le CSV (codes + PIN)
            </button>
          </div>
          <div className="mt-4 max-h-64 overflow-auto rounded-xl border border-line bg-surface">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-line-soft text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Code</th>
                  <th className="px-4 py-2.5 font-medium">PIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {batch.map((b) => (
                  <tr key={b.code}>
                    <td className="px-4 py-2 font-mono font-medium text-ink">
                      {b.code}
                    </td>
                    <td className="px-4 py-2 font-mono tracking-widest text-ink">
                      {b.pin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
