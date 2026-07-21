"use client";

import { useState, useTransition, type FormEvent } from "react";
import { activateStand, setSelfSubscription } from "@/lib/activation-actions";
import { StarMark } from "@/components/ui/logo";
import { Field } from "@/components/ui/field";
import { APP_BASE, REDIRECT_BASE, SUBSCRIPTION } from "@/lib/brand";

type Step = "config" | "offer" | "done";

const card =
  "w-full max-w-sm rounded-3xl border border-line bg-surface p-8 shadow-sm";
const primaryBtn =
  "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50";
const ghostBtn =
  "flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-muted transition-colors hover:bg-line-soft hover:text-ink";

export function ActivateFlow({ code }: { code: string }) {
  const [step, setStep] = useState<Step>("config");
  const [name, setName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submitConfig(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await activateStand({ code, pin, email, name, googleUrl });
      if (res.ok) setStep("offer");
      else setError(res.error);
    });
  }

  function subscribe() {
    setError(null);
    startTransition(async () => {
      const res = await setSelfSubscription({ code, pin, action: "subscribe" });
      if (res.ok) {
        setSubscribed(true);
        setStep("done");
      } else setError(res.error);
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
            label="Code d'activation (PIN)"
            name="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="ABC123"
            className="font-mono uppercase tracking-wider"
            hint="Il figure sous le présentoir."
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={pending} className={primaryBtn}>
            {pending ? "Activation…" : "Activer mon présentoir"}
          </button>
        </form>
      </div>
    );
  }

  // ---- Étape 2 : offre d'abonnement (sans obligation) ----------------------
  if (step === "offer") {
    return (
      <div className={card}>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <StarMark className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-center font-display text-xl font-semibold text-ink">
          Présentoir activé&nbsp;!
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Passez au suivi pour tirer le meilleur de votre présentoir.
        </p>

        <div className="mt-6 rounded-2xl border border-brand/30 bg-brand-soft p-5">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-base font-semibold text-ink">
              Suivi reviu
            </span>
            <span className="font-display text-lg font-semibold text-ink">
              {SUBSCRIPTION.priceLabel}
              <span className="text-sm font-normal text-muted">
                /{SUBSCRIPTION.period}
              </span>
            </span>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {SUBSCRIPTION.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-ink-soft">
                <StarMark className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={subscribe}
          disabled={pending}
          className={`${primaryBtn} mt-5`}
        >
          {pending ? "…" : `S'abonner à ${SUBSCRIPTION.priceLabel}/${SUBSCRIPTION.period}`}
        </button>
        <button
          type="button"
          onClick={() => setStep("done")}
          disabled={pending}
          className={`${ghostBtn} mt-2`}
        >
          Plus tard, merci
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Sans engagement. Résiliable à tout moment.
        </p>
      </div>
    );
  }

  // ---- Étape 3 : confirmation ----------------------------------------------
  const publicUrl = `${REDIRECT_BASE.replace(/^https?:\/\//, "")}/${code}`;
  return (
    <div className={`${card} text-center`}>
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
        <StarMark className="h-6 w-6" />
      </div>
      <h1 className="mt-5 font-display text-xl font-semibold text-ink">
        Tout est prêt
      </h1>
      <p className="mt-2 text-sm text-muted">
        {subscribed
          ? "Votre suivi est actif : retrouvez vos statistiques sur votre compte."
          : "Votre présentoir redirige déjà vos clients. Vous pourrez activer le suivi à tout moment."}
      </p>
      <div className="mt-5 rounded-xl border border-line bg-canvas px-4 py-3">
        <p className="text-xs text-muted">Adresse de votre présentoir</p>
        <p className="mt-0.5 font-mono text-sm font-medium text-ink">{publicUrl}</p>
      </div>
      <a href={`${APP_BASE}/login`} className={`${primaryBtn} mt-6`}>
        Accéder à mon compte
      </a>
      <p className="mt-3 text-xs text-muted">
        Connectez-vous avec {email || "votre e-mail"} pour gérer votre présentoir.
      </p>
    </div>
  );
}
