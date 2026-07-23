"use client";

import { useActionState } from "react";
import { relanceUnsubscribedAction } from "@/lib/emailing-actions";
import type { UnsubscribedContact } from "@/lib/emailing";

export function EmailingAdmin({
  contacts,
}: {
  contacts: UnsubscribedContact[];
}) {
  const [state, action, pending] = useActionState(relanceUnsubscribedAction, null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-ink">
            {contacts.length}
          </p>
          <p className="text-sm text-muted">
            commerçant{contacts.length > 1 ? "s" : ""} sans abonnement actif
          </p>
        </div>
        <form action={action} className="flex flex-col items-start gap-2">
          <button
            type="submit"
            disabled={pending || contacts.length === 0}
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
          >
            {pending ? "Envoi en cours…" : "Relancer par e-mail"}
          </button>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          {state?.success && (
            <p className="text-sm text-emerald-600">{state.info}</p>
          )}
        </form>
      </div>

      <p className="text-xs text-muted">
        Chaque commerçant reçoit une proposition d&apos;abonnement au suivi (2,99
        €/mois, sans engagement) avec un lien vers son espace. Une seule adresse
        par envoi (dédupliqué).
      </p>

      {contacts.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-line-soft text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Commerçant</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Présentoirs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {contacts.map((c) => (
                <tr key={c.org_id}>
                  <td className="px-4 py-3 text-ink">
                    {c.full_name ? (
                      <>
                        <span className="font-medium">{c.full_name}</span>
                        <br />
                        <span className="text-xs text-muted">{c.org_name}</span>
                      </>
                    ) : (
                      c.org_name
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{c.email}</td>
                  <td className="px-4 py-3 tabular-nums text-ink-soft">
                    {c.stand_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
