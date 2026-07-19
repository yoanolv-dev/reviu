"use client";

import { useActionState } from "react";
import { generateStandsAction } from "@/lib/admin-actions";
import { REDIRECT_BASE } from "@/lib/brand";
import { Field } from "@/components/ui/field";

/** CSV de provisioning (code, PIN, URL) — à transmettre au fournisseur pour l'impression. */
function downloadCsv(rows: { code: string; pin: string }[]) {
  const header = "code,pin,url";
  // Codes/PIN sont strictement alphanumériques : aucun échappement CSV nécessaire.
  const body = rows
    .map((r) => `${r.code},${r.pin},${REDIRECT_BASE}/${r.code}`)
    .join("\n");
  const blob = new Blob([`${header}\n${body}\n`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reviu-codes-pins.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function GenerateForm() {
  const [state, action, pending] = useActionState(generateStandsAction, null);
  const generated = state?.generated ?? [];

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
      </form>

      {generated.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {generated.length} présentoir(s) généré(s)
              </p>
              <p className="mt-0.5 text-xs text-amber-800">
                ⚠️ Les PIN ne sont affichés qu&apos;une seule fois. Téléchargez-les
                ou notez-les maintenant : ils sont ensuite irrécupérables.
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadCsv(generated)}
              className="flex h-9 shrink-0 items-center justify-center rounded-full bg-amber-900 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-950"
            >
              Télécharger le CSV
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-amber-200 bg-white">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-amber-100/80 text-left text-xs uppercase tracking-wide text-amber-900">
                <tr>
                  <th className="px-4 py-2 font-medium">Code</th>
                  <th className="px-4 py-2 font-medium">PIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {generated.map((s) => (
                  <tr key={s.code}>
                    <td className="px-4 py-2 font-mono font-medium text-ink">
                      {s.code}
                    </td>
                    <td className="px-4 py-2 font-mono tracking-widest text-ink">
                      {s.pin}
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
