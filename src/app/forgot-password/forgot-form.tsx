"use client";

import { useActionState } from "react";
import { sendPasswordResetAction } from "@/lib/auth-actions";
import { Field } from "@/components/ui/field";

export function ForgotForm() {
  const [state, action, pending] = useActionState(sendPasswordResetAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field
        label="E-mail"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="vous@exemple.fr"
        hint="Nous vous enverrons un lien pour définir un nouveau mot de passe."
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.info && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {state.info}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-11 items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Envoyer le lien de réinitialisation"}
      </button>
    </form>
  );
}
