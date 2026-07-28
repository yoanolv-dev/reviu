"use client";

import { useActionState } from "react";
import { setStandTargetAction } from "@/lib/dashboard-actions";
import { openBillingPortalAction } from "@/lib/stripe-actions";

export function StandManage({
  standId,
  subscribed,
  targetUrl,
}: {
  standId: string;
  subscribed: boolean;
  targetUrl: string | null;
}) {
  const [portalState, portalAction, portalPending] = useActionState(
    openBillingPortalAction,
    null,
  );
  const [tgtState, tgtAction, tgtPending] = useActionState(
    setStandTargetAction,
    null,
  );

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
      {/* Modification du lien — incluse avec la plaque, sans frais supplémentaires.
          L'adresse encodée QR/NFC du présentoir, elle, ne change jamais. */}
      <form action={tgtAction} className="flex flex-col gap-2">
        <label className="text-xs font-medium text-ink-soft">
          Lien du présentoir
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            name="target_url"
            defaultValue={targetUrl ?? ""}
            placeholder="https://g.page/r/…"
            className="h-10 flex-1 rounded-xl border border-line bg-canvas px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
          />
          <input type="hidden" name="stand_id" value={standId} />
          <button
            type="submit"
            disabled={tgtPending}
            className="flex h-10 items-center justify-center rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-line-soft disabled:opacity-50"
          >
            {tgtPending ? "…" : "Mettre à jour"}
          </button>
        </div>
        {tgtState?.error && (
          <p className="text-sm text-red-600">{tgtState.error}</p>
        )}
        {tgtState?.info && (
          <p className="text-sm text-emerald-600">{tgtState.info}</p>
        )}
      </form>

      {/* Ancien abonnement de suivi : accès au portail pour les comptes encore
          abonnés (facture, résiliation). Plus proposé aux nouveaux comptes. */}
      {subscribed && (
        <form action={portalAction}>
          <input type="hidden" name="stand_id" value={standId} />
          <button
            type="submit"
            disabled={portalPending}
            className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline disabled:opacity-50"
          >
            {portalPending ? "Ouverture…" : "Gérer mon ancien abonnement (facture, résiliation)"}
          </button>
          {portalState?.error && (
            <p className="mt-1 text-sm text-red-600">{portalState.error}</p>
          )}
        </form>
      )}
    </div>
  );
}
