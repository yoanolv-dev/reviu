"use client";

import { useActionState } from "react";
import { signUpAction } from "@/lib/auth-actions";
import { Field } from "@/components/ui/field";

export function SignupForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signUpAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      <Field
        label="Votre nom"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="Camille Durand"
      />
      <Field
        label="E-mail"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="vous@exemple.fr"
      />
      <Field
        label="Mot de passe"
        name="password"
        type="password"
        required
        autoComplete="new-password"
        placeholder="8 caractères minimum"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.info && <p className="text-sm text-brand">{state.info}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-11 items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
      >
        {pending ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}
