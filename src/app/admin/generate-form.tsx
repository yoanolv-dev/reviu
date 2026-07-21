"use client";

import { useActionState } from "react";
import { generateStandsAction } from "@/lib/admin-actions";
import { Field } from "@/components/ui/field";

export function GenerateForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(generateStandsAction, null);
  const rows = state?.rows ?? [];

  return (
    <div className="flex flex-col gap-4">
      {!enabled && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Génération réelle désactivée dans cet environnement (protection
          anti-doublons). Elle n&apos;est active qu&apos;en production.
        </p>
      )}
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
            {pending ? "Génération…" : "Générer le lot"}
          </button>
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      </form>

      {rows.length > 0 && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-900">
            {rows.length} présentoir(s) généré(s)
            {state?.label ? ` — lot « ${state.label} »` : ""}. Les secrets
            d&apos;activation sont aussi récupérables à tout moment via
            l&apos;export du lot.
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-emerald-200 bg-surface">
            <table className="w-full min-w-[280px] text-sm">
              <thead className="bg-emerald-100/60 text-left text-xs uppercase tracking-wide text-emerald-900/70">
                <tr>
                  <th className="px-4 py-2 font-medium">Code public</th>
                  <th className="px-4 py-2 font-medium">Secret d&apos;activation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-mono">
                {rows.map((r) => (
                  <tr key={r.code}>
                    <td className="px-4 py-2 font-medium text-ink">{r.code}</td>
                    <td className="px-4 py-2 tracking-wider text-ink">
                      {r.secret}
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
