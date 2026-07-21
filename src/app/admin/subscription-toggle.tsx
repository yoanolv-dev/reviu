"use client";

import { useActionState } from "react";
import { setSubscriptionAction } from "@/lib/admin-actions";
import { isEntitled } from "@/lib/subscription";

/**
 * Bascule d'abonnement (simulation) : Actif <-> Inactif.
 * Sera remplacée par le statut Stripe réel (webhooks) en Phase 2.
 */
export function SubscriptionToggle({
  standId,
  status,
}: {
  standId: string;
  status: string;
}) {
  const [state, action, pending] = useActionState(setSubscriptionAction, null);
  const entitled = isEntitled(status);
  const next = entitled ? "inactive" : "active";
  return (
    <form action={action}>
      <input type="hidden" name="stand_id" value={standId} />
      <input type="hidden" name="status" value={next} />
      <button
        type="submit"
        disabled={pending}
        title={entitled ? "Désactiver l'abonnement" : "Activer l'abonnement (simulé)"}
        className={
          entitled
            ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
            : "rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:bg-line-soft disabled:opacity-50"
        }
      >
        {pending ? "…" : entitled ? "Abonné ✓" : "Activer"}
      </button>
      {state?.error && (
        <p className="mt-1 text-[11px] text-red-600">{state.error}</p>
      )}
    </form>
  );
}
