"use client";

import { useActionState } from "react";
import { generateStandsAction } from "@/lib/admin-actions";
import { Field } from "@/components/ui/field";

export function GenerateForm() {
  const [state, action, pending] = useActionState(generateStandsAction, null);
  const rows = state?.rows ?? [];
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

      {rows.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            {rows.length} présentoir(s) généré(s). Notez bien les PIN&nbsp;: ils
            ne seront plus jamais réaffichés (seul un hachage est conservé).
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-amber-200 bg-surface">
            <table className="w-full min-w-[280px] text-sm">
              <thead className="bg-amber-100/60 text-left text-xs uppercase tracking-wide text-amber-900/70">
                <tr>
                  <th className="px-4 py-2 font-medium">Code</th>
                  <th className="px-4 py-2 font-medium">PIN d&apos;activation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-mono">
                {rows.map((r) => (
                  <tr key={r.code}>
                    <td className="px-4 py-2 font-medium text-ink">{r.code}</td>
                    <td className="px-4 py-2 tracking-wider text-ink">
                      {r.pin}
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
