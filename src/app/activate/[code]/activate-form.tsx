"use client";

import { useActionState } from "react";
import { activateStandAction } from "@/lib/dashboard-actions";
import { Field } from "@/components/ui/field";

export function ActivateForm({
  code,
  hasEstablishment,
}: {
  code: string;
  hasEstablishment: boolean;
}) {
  const [state, action, pending] = useActionState(activateStandAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="code" value={code} />
      {!hasEstablishment && (
        <Field
          label="Nom de l'établissement"
          name="name"
          required
          placeholder="Le Comptoir de Camille"
        />
      )}
      <Field
        label="Lien d'avis Google"
        name="google_review_url"
        type="url"
        placeholder="https://g.page/r/…"
        hint={
          hasEstablishment
            ? "Laissez vide pour conserver votre lien actuel."
            : "Là où le présentoir redirige vos clients."
        }
      />
      <Field
        label="PIN du présentoir"
        name="pin"
        required
        autoComplete="off"
        placeholder="ex. K7QM2P"
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
