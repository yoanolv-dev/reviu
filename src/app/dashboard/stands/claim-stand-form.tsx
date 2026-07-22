"use client";

import { useActionState } from "react";
import { claimStandAction } from "@/lib/dashboard-actions";

export function ClaimStandForm({
  establishmentId,
}: {
  establishmentId: string;
}) {
  const [state, action, pending] = useActionState(claimStandAction, null);
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="establishment_id" value={establishmentId} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="code"
          required
          placeholder="Code du présentoir"
          className="h-11 flex-1 rounded-xl border border-line bg-canvas px-3.5 font-mono text-sm text-ink outline-none transition-colors placeholder:font-sans placeholder:text-muted focus:border-brand"
        />
        <input
          name="pin"
          placeholder="Secret"
          autoCapitalize="characters"
          className="h-11 rounded-xl border border-line bg-canvas px-3.5 font-mono text-sm uppercase tracking-wider text-ink outline-none transition-colors placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus:border-brand sm:w-32"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
        >
          {pending ? "…" : "Rattacher"}
        </button>
      </div>
      <p className="text-xs text-muted">
        Le code figure dans le QR&nbsp;; le secret d&apos;activation est imprimé
        sous le présentoir.
      </p>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-emerald-600">
          Présentoir rattaché et activé.
        </p>
      )}
    </form>
  );
}
