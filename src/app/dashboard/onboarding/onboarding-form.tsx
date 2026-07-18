"use client";

import { useActionState } from "react";
import { createEstablishmentAction } from "@/lib/dashboard-actions";
import { Field } from "@/components/ui/field";

export function OnboardingForm() {
  const [state, action, pending] = useActionState(
    createEstablishmentAction,
    null,
  );
  return (
    <form action={action} className="flex flex-col gap-4">
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
        hint="Optionnel maintenant, requis pour activer la redirection."
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-11 items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
      >
        {pending ? "Création…" : "Créer mon établissement"}
      </button>
    </form>
  );
}
