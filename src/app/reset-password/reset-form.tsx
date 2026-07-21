"use client";

import { useActionState } from "react";
import { updatePasswordAction } from "@/lib/auth-actions";
import { Field } from "@/components/ui/field";

export function ResetForm() {
  const [state, action, pending] = useActionState(updatePasswordAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field
        label="Nouveau mot de passe"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        placeholder="••••••••"
        hint="Au moins 8 caractères."
      />
      <Field
        label="Confirmer le mot de passe"
        name="confirm"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        placeholder="••••••••"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-11 items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Définir le mot de passe"}
      </button>
    </form>
  );
}
