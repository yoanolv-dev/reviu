"use client";

import { useState, useTransition, type FormEvent } from "react";
import { activateStand } from "@/lib/activation-actions";
import { StarMark } from "@/components/ui/logo";
import { Field } from "@/components/ui/field";
import { APP_BASE, REDIRECT_BASE } from "@/lib/brand";

type Step = "config" | "done";

const card =
  "pop elev w-full max-w-sm rounded-3xl border border-line bg-surface p-6 sm:p-8";
const primaryBtn =
  "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-white shadow-[0_10px_22px_-10px_var(--color-brand)] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-[0_16px_30px_-12px_var(--color-brand)] disabled:opacity-50";

export function ActivateFlow({ code }: { code: string }) {
  const [step, setStep] = useState<Step>("config");
  const [name, setName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submitConfig(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await activateStand({ code, pin, email, name, googleUrl });
      if (res.ok) setStep("done");
      else setError(res.error);
    });
  }

  // ---- Étape 1 : configuration ---------------------------------------------
  if (step === "config") {
    return (
      <div className={card}>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          <StarMark className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-center font-display text-xl font-semibold text-ink">
          Configurez votre présentoir
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Reliez ce présentoir à votre commerce en une minute.
        </p>
        <form onSubmit={submitConfig} className="mt-6 flex flex-col gap-4">
          <Field
            label="Nom du commerce"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Le Comptoir de Camille"
          />
          <Field
            label="Lien de votre page d'avis Google"
            name="google_review_url"
            type="url"
            value={googleUrl}
            onChange={(e) => setGoogleUrl(e.target.value)}
            placeholder="https://g.page/r/…"
            hint="Là où vos clients laisseront leur avis."
          />
          <Field
            label="Votre e-mail"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            hint="Pour retrouver votre présentoir et le gérer plus tard."
          />
          <Field
            label="Secret d'activation"
            name="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="ABCD1234"
            autoCapitalize="characters"
            className="font-mono uppercase tracking-wider"
            hint="Imprimé à côté du QR code, sur votre présentoir - il ne figure pas dans le QR code lui-même."
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={pending} className={primaryBtn}>
            {pending ? "Activation…" : "Activer mon présentoir"}
          </button>
        </form>
      </div>
    );
  }

  // ---- Étape 2 : confirmation ----------------------------------------------
  const publicUrl = `${REDIRECT_BASE.replace(/^https?:\/\//, "")}/${code}`;
  return (
    <div className={`${card} text-center`}>
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
        <StarMark className="h-6 w-6" />
      </div>
      <h1 className="mt-5 font-display text-xl font-semibold text-ink">
        Présentoir activé&nbsp;!
      </h1>
      <p className="mt-2 text-sm text-muted">
        Votre présentoir redirige déjà vos clients. Retrouvez vos statistiques et
        modifiez votre lien à tout moment depuis votre espace Reviu inclus.
      </p>
      <div className="mt-5 rounded-xl border border-line bg-canvas px-4 py-3">
        <p className="text-xs text-muted">Adresse de votre présentoir</p>
        <p className="mt-0.5 font-mono text-sm font-medium text-ink">{publicUrl}</p>
      </div>
      <a href={`${APP_BASE}/login`} className={`${primaryBtn} mt-6`}>
        Accéder à mon espace
      </a>
      <p className="mt-3 text-xs text-muted">
        Connectez-vous avec {email || "votre e-mail"} pour gérer votre présentoir.
      </p>
    </div>
  );
}
