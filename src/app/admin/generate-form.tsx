"use client";

import { useActionState } from "react";
import { generateStandsAction } from "@/lib/admin-actions";
import { Field } from "@/components/ui/field";
import { standUrl } from "@/lib/qr";
import type { GeneratedStand } from "@/lib/form";

function downloadSupplierFile(stands: GeneratedStand[]) {
  const esc = (v: string) =>
    /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  const rows = [["code", "url_qr", "url_nfc", "pin"]];
  for (const s of stands) {
    rows.push([s.code, standUrl(s.code, "qr"), standUrl(s.code, "nfc"), s.pin]);
  }
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  // BOM pour qu'Excel ouvre correctement en UTF-8.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reviu-lot-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function GenerateForm() {
  const [state, action, pending] = useActionState(generateStandsAction, null);
  const stands = state?.stands ?? [];

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

      {stands.length > 0 && (
        <div className="rounded-2xl border border-line bg-canvas p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-ink">
              {stands.length} présentoir(s) généré(s)
            </p>
            <button
              type="button"
              onClick={() => downloadSupplierFile(stands)}
              className="flex h-10 items-center justify-center rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-line-soft"
            >
              Télécharger le fichier fournisseur (CSV)
            </button>
          </div>
          <p className="mt-1 text-xs text-amber-600">
            Les PIN ne sont affichés qu&apos;une seule fois. Téléchargez le
            fichier maintenant pour votre fournisseur.
          </p>
          <div className="mt-3 max-h-56 overflow-auto rounded-xl border border-line bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-surface text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Code</th>
                  <th className="px-3 py-2 font-medium">PIN</th>
                  <th className="px-3 py-2 font-medium">URL</th>
                </tr>
              </thead>
              <tbody>
                {stands.map((s) => (
                  <tr key={s.code} className="border-t border-line">
                    <td className="px-3 py-1.5 font-mono text-ink">{s.code}</td>
                    <td className="px-3 py-1.5 font-mono tracking-widest text-ink">
                      {s.pin}
                    </td>
                    <td className="px-3 py-1.5 font-mono text-xs text-muted">
                      {standUrl(s.code)}
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
