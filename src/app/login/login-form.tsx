"use client";

import { useActionState, useState } from "react";
import { signInAction, sendMagicLinkAction } from "@/lib/auth-actions";
import { Field } from "@/components/ui/field";

const primaryBtn =
  "mt-1 flex h-11 items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50";
const switchBtn =
  "text-center text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline";

export function LoginForm() {
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [pwState, pwAction, pwPending] = useActionState(signInAction, null);
  const [mlState, mlAction, mlPending] = useActionState(
    sendMagicLinkAction,
    null,
  );

  if (mode === "magic") {
    return (
      <div className="flex flex-col gap-4">
        <form action={mlAction} className="flex flex-col gap-4">
          <Field
            label="E-mail"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.fr"
            hint="Nous vous enverrons un lien de connexion — sans mot de passe."
          />
          {mlState?.error && (
            <p className="text-sm text-red-600">{mlState.error}</p>
          )}
          {mlState?.info && (
            <p className="text-sm text-emerald-600">{mlState.info}</p>
          )}
          <button type="submit" disabled={mlPending} className={primaryBtn}>
            {mlPending ? "Envoi…" : "Recevoir un lien de connexion"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={switchBtn}
        >
          Utiliser un mot de passe
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form action={pwAction} className="flex flex-col gap-4">
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
        {pwState?.error && (
          <p className="text-sm text-red-600">{pwState.error}</p>
        )}
        <button type="submit" disabled={pwPending} className={primaryBtn}>
          {pwPending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setMode("magic")}
        className={switchBtn}
      >
        Se connecter sans mot de passe (lien magique)
      </button>
    </div>
  );
}
