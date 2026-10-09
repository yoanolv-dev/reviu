"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition, type FormEvent } from "react";
import {
  signInAction,
  requestLoginCodeAction,
  verifyLoginCodeAction,
} from "@/lib/auth-actions";
import { Field } from "@/components/ui/field";

const primaryBtn =
  "mt-1 flex h-11 items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50";
const switchBtn =
  "text-center text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline disabled:opacity-50";

/**
 * Connexion par défaut SANS mot de passe : e-mail -> code à 6 chiffres reçu par
 * e-mail (ou lien direct dans le même e-mail). Le mot de passe reste possible
 * pour ceux qui en ont défini un.
 */
export function LoginForm({
  initialEmail = "",
  allowPassword = true,
}: {
  initialEmail?: string;
  allowPassword?: boolean;
}) {
  const [mode, setMode] = useState<"code" | "password">("code");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [codeLength, setCodeLength] = useState(6);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [pwState, pwAction, pwPending] = useActionState(signInAction, null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function sendCode(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const res = await requestLoginCodeAction({ email });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setEmail(res.email);
      setCodeLength(res.codeLength);
      setCooldown(50);
      setOtp("");
      if (step === "otp") setInfo("Nouveau code envoyé. Seul le dernier reçu fonctionne.");
      setStep("otp");
    });
  }

  function verify(token: string) {
    setError(null);
    setInfo(null);
    startTransition(async () => {
      // En cas de succès, l'action redirige vers le tableau de bord.
      const res = await verifyLoginCodeAction({ email, token });
      if (res && !res.ok) setError(res.error);
    });
  }

  if (mode === "password") {
    return (
      <div className="flex flex-col gap-4">
        <form action={pwAction} className="flex flex-col gap-4">
          <Field
            label="E-mail"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
          />
          <div className="flex flex-col gap-1.5">
            <Field
              label="Mot de passe"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <Link
              href="/forgot-password"
              className="self-end text-xs text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          {pwState?.error && (
            <p role="alert" className="text-sm text-red-600">
              {pwState.error}
            </p>
          )}
          <button type="submit" disabled={pwPending} className={primaryBtn}>
            {pwPending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <button type="button" onClick={() => setMode("code")} className={switchBtn}>
          Recevoir plutôt un code par e-mail
        </button>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Code envoyé à <span className="font-medium text-ink-soft">{email}</span>.
          Saisissez-le ci-dessous, ou touchez « Ouvrir mon espace » dans
          l&apos;e-mail. Rien reçu ? Regardez dans vos courriers indésirables.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verify(otp);
          }}
          className="flex flex-col gap-4"
        >
          <input
            name="otp"
            value={otp}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
              setOtp(digits);
              if (digits.length === codeLength && !pending) verify(digits);
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            autoFocus
            placeholder={"0".repeat(codeLength)}
            aria-label="Code reçu par e-mail"
            aria-invalid={Boolean(error)}
            className="h-14 w-full rounded-xl border border-line bg-surface px-3.5 text-center font-mono text-2xl font-semibold tracking-[0.4em] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-line focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)]"
          />
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          {info && (
            <p aria-live="polite" className="text-sm text-emerald-600">
              {info}
            </p>
          )}
          <button
            type="submit"
            disabled={pending || otp.length < codeLength}
            className={primaryBtn}
          >
            {pending ? "Vérification…" : "Se connecter"}
          </button>
        </form>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => sendCode()}
            disabled={pending || cooldown > 0}
            className={switchBtn}
          >
            {cooldown > 0 ? `Renvoyer (${cooldown} s)` : "Renvoyer le code"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setError(null);
              setInfo(null);
            }}
            disabled={pending}
            className={switchBtn}
          >
            Modifier l&apos;e-mail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={sendCode} className="flex flex-col gap-4">
        <Field
          label="E-mail"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.fr"
          hint="Nous vous envoyons un code de connexion. Pas de mot de passe à retenir."
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending} className={primaryBtn}>
          {pending ? "Envoi…" : "Recevoir mon code"}
        </button>
      </form>
      {allowPassword && (
        <button type="button" onClick={() => setMode("password")} className={switchBtn}>
          Se connecter avec un mot de passe
        </button>
      )}
    </div>
  );
}
