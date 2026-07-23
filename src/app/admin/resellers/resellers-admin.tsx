"use client";

import { useActionState } from "react";
import {
  createResellerAction,
  assignStandsAction,
  assignBatchAction,
} from "@/lib/reseller-actions";
import type { ResellerAdminRow } from "@/lib/reseller";

type BatchOption = {
  id: string;
  label: string | null;
  quantity: number;
  status: string;
};

const input =
  "h-10 w-full rounded-xl border border-line bg-canvas px-3 text-sm text-ink outline-none transition-colors focus:border-brand";
const btn =
  "inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50";

function Feedback({
  state,
}: {
  state: { error?: string; success?: boolean; info?: string } | null;
}) {
  if (state?.error) return <p className="text-sm text-red-600">{state.error}</p>;
  if (state?.success)
    return <p className="text-sm text-emerald-600">{state.info}</p>;
  return null;
}

export function ResellersAdmin({
  resellers,
  batches,
}: {
  resellers: ResellerAdminRow[];
  batches: BatchOption[];
}) {
  const [createState, createAction, creating] = useActionState(
    createResellerAction,
    null,
  );
  const [codesState, codesAction, assigningCodes] = useActionState(
    assignStandsAction,
    null,
  );
  const [batchState, batchAction, assigningBatch] = useActionState(
    assignBatchAction,
    null,
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Créer un revendeur */}
      <section className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Créer / mettre à jour un revendeur
        </h2>
        <p className="mt-1 text-sm text-muted">
          Le revendeur doit déjà avoir un compte reviu (même e-mail).
        </p>
        <form action={createAction} className="mt-4 flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="email"
              type="email"
              required
              placeholder="E-mail du revendeur"
              className={input}
            />
            <input name="name" placeholder="Nom (optionnel)" className={input} />
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" disabled={creating} className={btn}>
              {creating ? "…" : "Enregistrer le revendeur"}
            </button>
            <Feedback state={createState} />
          </div>
          <p className="text-xs text-muted">
            Un code de parrainage lui est attribué. Sa rémunération se fait à la
            revente physique du présentoir (marge) — rien à gérer ici.
          </p>
        </form>
      </section>

      {/* Attribuer des présentoirs */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Attribuer par codes
          </h2>
          <form action={codesAction} className="mt-4 flex flex-col gap-3">
            <select name="reseller_id" required className={input} defaultValue="">
              <option value="" disabled>
                Choisir un revendeur…
              </option>
              {resellers.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.email ?? r.code} ({r.code})
                </option>
              ))}
            </select>
            <textarea
              name="codes"
              required
              rows={4}
              placeholder="Codes des présentoirs, séparés par des espaces ou des retours à la ligne"
              className="w-full rounded-xl border border-line bg-canvas px-3 py-2 font-mono text-sm uppercase text-ink outline-none transition-colors focus:border-brand"
            />
            <div className="flex items-center gap-4">
              <button type="submit" disabled={assigningCodes} className={btn}>
                {assigningCodes ? "…" : "Attribuer"}
              </button>
              <Feedback state={codesState} />
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Attribuer un lot entier
          </h2>
          <form action={batchAction} className="mt-4 flex flex-col gap-3">
            <select name="reseller_id" required className={input} defaultValue="">
              <option value="" disabled>
                Choisir un revendeur…
              </option>
              {resellers.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.email ?? r.code} ({r.code})
                </option>
              ))}
            </select>
            <select name="batch_id" required className={input} defaultValue="">
              <option value="" disabled>
                Choisir un lot…
              </option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label ?? b.id.slice(0, 8)} — {b.quantity} présentoirs (
                  {b.status})
                </option>
              ))}
            </select>
            <div className="flex items-center gap-4">
              <button type="submit" disabled={assigningBatch} className={btn}>
                {assigningBatch ? "…" : "Attribuer le lot"}
              </button>
              <Feedback state={batchState} />
            </div>
          </form>
        </div>
      </section>

      {/* Tableau des revendeurs */}
      <section>
        <h2 className="font-display text-lg font-semibold text-ink">
          Revendeurs ({resellers.length})
        </h2>
        {resellers.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
            Aucun revendeur pour l&apos;instant.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-line-soft text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Revendeur</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Présentoirs</th>
                  <th className="px-4 py-3 font-medium">Commerçants abonnés</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {resellers.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-ink">
                      {r.display_name ? (
                        <>
                          <span className="font-medium">{r.display_name}</span>
                          <br />
                          <span className="text-xs text-muted">{r.email}</span>
                        </>
                      ) : (
                        r.email ?? "—"
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-brand">{r.code}</td>
                    <td className="px-4 py-3 tabular-nums text-ink-soft">
                      {r.total_stands}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink-soft">
                      {r.active_subs}
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
