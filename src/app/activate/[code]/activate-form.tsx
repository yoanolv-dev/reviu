"use client";

import { useActionState } from "react";
import { activateStandAction } from "@/lib/dashboard-actions";
import { Field } from "@/components/ui/field";

export function ActivateForm({
  code,
  needEstablishment,
  establishmentName,
}: {
  code: string;
  needEstablishment: boolean;
  establishmentName?: string | null;
}) {
  const [state, action, pending] = useActionState(activateStandAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="code" value={code} />

      {needEstablishment ? (
        <>
          <Field
            label="Nom de l'établissement"
            name="name"
            required
            placeholder="Le Comptoir de Camille"
          />
          <Field
            label="Lien d'avis Google"
            name="google_review_url"
            type="url"
            placeholder="https://g.page/r/…"
            hint="Destination du QR / NFC après activation."
          />
        </>
      ) : (
        establishmentName && (
          <p className="rounded-xl border border-line bg-canvas px-3.5 py-3 text-sm text-ink-soft">
            Rattaché à{" "}
            <span className="font-medium text-ink">{establishmentName}</span>.
          </p>
        )
      )}

      <Field
        label="Code PIN"
        name="pin"
        required
        autoCapitalize="characters"
        autoComplete="off"
        maxLength={6}
        placeholder="À 6 caractères"
        hint="Fourni avec le présentoir."
        className="uppercase tracking-widest placeholder:tracking-normal"
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-11 items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
      >
        {pending ? "Activation…" : "Activer le présentoir"}
      </button>
    </form>
  );
}
