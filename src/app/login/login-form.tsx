"use client";

import { useActionState } from "react";
import { signInAction } from "@/lib/auth-actions";
import { Field } from "@/components/ui/field";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signInAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}
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
        autoComplete="current-password"
        placeholder="••••••••"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-11 items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
