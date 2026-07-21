"use client";

import { useActionState } from "react";
import {
  ownerSetSubscriptionAction,
  setStandTargetAction,
} from "@/lib/dashboard-actions";
import { SUBSCRIPTION } from "@/lib/brand";

export function StandManage({
  standId,
  subscribed,
  targetUrl,
}: {
  standId: string;
  subscribed: boolean;
  targetUrl: string | null;
}) {
  const [subState, subAction, subPending] = useActionState(
    ownerSetSubscriptionAction,
    null,
  );
  const [tgtState, tgtAction, tgtPending] = useActionState(
    setStandTargetAction,
    null,
  );

  if (!subscribed) {
    return (
      <div className="mt-4 border-t border-line pt-4">
        <form action={subAction} className="flex flex-col gap-2">
          <input type="hidden" name="stand_id" value={standId} />
          <input type="hidden" name="action" value="subscribe" />
          <button
            type="submit"
            disabled={subPending}
            className="flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
          >
            {subPending
              ? "…"
              : `S'abonner au suivi — ${SUBSCRIPTION.priceLabel}/${SUBSCRIPTION.period}`}
          </button>
          <p className="text-xs text-muted">
            Statistiques + modification illimitée du lien. Sans engagement.
          </p>
          {subState?.error && (
            <p className="text-sm text-red-600">{subState.error}</p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
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

      <form action={subAction}>
        <input type="hidden" name="stand_id" value={standId} />
        <input type="hidden" name="action" value="cancel" />
        <button
          type="submit"
          disabled={subPending}
          className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline disabled:opacity-50"
        >
          {subPending ? "…" : "Se désabonner"}
        </button>
        {subState?.error && (
          <p className="mt-1 text-sm text-red-600">{subState.error}</p>
        )}
      </form>
    </div>
  );
}
