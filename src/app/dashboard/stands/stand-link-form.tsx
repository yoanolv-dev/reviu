"use client";

import { useActionState } from "react";
import { setStandTargetAction } from "@/lib/dashboard-actions";

export function StandLinkForm({
  standId,
  current,
}: {
  standId: string;
  current: string | null;
}) {
  const [state, action, pending] = useActionState(setStandTargetAction, null);
  return (
    <form
      action={action}
      className="mt-4 flex flex-col gap-2 border-t border-line pt-4"
    >
      <input type="hidden" name="stand_id" value={standId} />
      <label className="text-xs font-medium uppercase tracking-wide text-muted">
        Lien de redirection
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="target_url"
          type="url"
          defaultValue={current ?? ""}
          placeholder="https://g.page/r/…"
          className="h-10 flex-1 rounded-xl border border-line bg-canvas px-3 text-sm text-ink outline-none transition-colors focus:border-brand"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-10 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-line-soft disabled:opacity-50"
        >
          {pending ? "…" : "Enregistrer"}
        </button>
      </div>
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-xs text-emerald-600">Lien mis à jour.</p>
      )}
    </form>
  );
}
