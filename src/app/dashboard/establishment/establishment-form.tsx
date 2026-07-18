"use client";

import { useActionState } from "react";
import { updateEstablishmentAction } from "@/lib/dashboard-actions";
import { Field, TextArea } from "@/components/ui/field";
import type { EstablishmentRow } from "@/lib/dashboard";

export function EstablishmentForm({ est }: { est: EstablishmentRow }) {
  const [state, action, pending] = useActionState(
    updateEstablishmentAction,
    null,
  );
  return (
    <form
      action={action}
      className="flex max-w-xl flex-col gap-5 rounded-3xl border border-line bg-surface p-6"
    >
      <input type="hidden" name="id" value={est.id} />
      <Field
        label="Nom de l'établissement"
        name="name"
        required
        defaultValue={est.name}
      />
      <Field
        label="Lien d'avis Google"
        name="google_review_url"
        type="url"
        defaultValue={est.google_review_url ?? ""}
        placeholder="https://g.page/r/…"
        hint="Le bouton « Laisser un avis » redirige ici."
      />
      <Field
        label="Google Place ID (optionnel)"
        name="google_place_id"
        defaultValue={est.google_place_id ?? ""}
        placeholder="ChIJ…"
      />
      <TextArea
        label="Message d'accueil"
        name="welcome_message"
        rows={3}
        defaultValue={est.welcome_message ?? ""}
        placeholder="Merci de votre visite !"
      />
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="feedback_enabled"
          defaultChecked={est.feedback_enabled}
          className="h-4 w-4 accent-brand"
        />
        <span className="text-sm text-ink-soft">
          Proposer un canal de retour privé (conforme)
        </span>
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-emerald-600">Modifications enregistrées.</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-fit items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
