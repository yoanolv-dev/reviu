"use client";

import { useActionState } from "react";
import { generateStandsAction } from "@/lib/admin-actions";
import { Field } from "@/components/ui/field";

export function GenerateForm() {
  const [state, action, pending] = useActionState(generateStandsAction, null);
  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="sm:w-36">
          <Field
            label="Nombre"
            name="count"
            type="number"
            min={1}
            max={500}
            required
            defaultValue={10}
          />
        </div>
        <div className="flex-1">
          <Field
            label="Lot (optionnel)"
            name="label"
            placeholder="Commande fournisseur — mars"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
        >
          {pending ? "Génération…" : "Générer"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-600">{state.info}</p>}
    </form>
  );
}
