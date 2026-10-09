"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  requestActivationCode,
  verifyActivationCode,
  completeActivation,
  signOutForActivation,
} from "@/lib/activation-actions";
import type { MyEstablishment } from "@/lib/dashboard";
import { LogoBadge } from "@/components/ui/logo";
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/utils";

/**
 * Parcours d'activation d'un présentoir vierge :
 * 1. code secret (imprimé sur le présentoir) + e-mail -> envoi d'un code ;
 * 2. code reçu par e-mail -> l'e-mail est vérifié, l'espace est ouvert ;
 * 3. choix du commerce (existant ou nouveau) -> présentoir activé.
 * Déjà connecté sur ce téléphone : on passe directement à l'étape 3, avec le
 * code secret.
 */

type Step = "start" | "code" | "commerce" | "done";

const RESEND_DELAY = 50;

const card =
  "pop elev w-full max-w-sm rounded-3xl border border-line bg-surface p-6 sm:p-8";
const primaryBtn =
  "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-white shadow-[0_10px_22px_-10px_var(--color-brand)] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-[0_16px_30px_-12px_var(--color-brand)] disabled:opacity-50";
const linkBtn =
  "text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline disabled:opacity-50";

export function ActivateFlow({
  code,
  standAddress,
  account,
  establishments,
}: {
  code: string;
  standAddress: string;
  account: { email: string } | null;
  establishments: MyEstablishment[];
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(account ? "commerce" : "start");
  const [email, setEmail] = useState(account?.email ?? "");
  const [pin, setPin] = useState("");
  // Le secret a déjà été vérifié à l'étape 1 : inutile de le redemander.
  const [pinChecked, setPinChecked] = useState(false);
  const [otp, setOtp] = useState("");
  const [codeLength, setCodeLength] = useState(6);
  const [cooldown, setCooldown] = useState(0);
  const [ests, setEsts] = useState<MyEstablishment[]>(establishments);
  const [choice, setChoice] = useState<string>(establishments[0]?.id ?? "new");
  const [name, setName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [doneName, setDoneName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function sendCode(onSent?: () => void) {
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const res = await requestActivationCode({ code, pin, email });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setEmail(res.email);
      setCodeLength(res.codeLength);
      setPinChecked(true);
      setCooldown(RESEND_DELAY);
      setOtp("");
      onSent?.();
    });
  }

  function submitStart(e: FormEvent) {
    e.preventDefault();
    sendCode(() => setStep("code"));
  }

  function verify(token: string) {
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const res = await verifyActivationCode({ email, token });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setEsts(res.establishments);
      setChoice(res.establishments[0]?.id ?? "new");
      setStep("commerce");
    });
  }

  function onOtpChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setOtp(digits);
    // Remplissage automatique (clavier, copier-coller) : validation immédiate.
    if (digits.length === codeLength && !pending) verify(digits);
  }

  function submitCommerce(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const isNew = choice === "new";
      const res = await completeActivation({
        code,
        pin,
        establishmentId: isNew ? null : choice,
        name: isNew ? name : undefined,
        googleUrl: isNew ? googleUrl : undefined,
      });
      if (!res.ok) {
        setError(res.error);
        // Secret refusé : on le redemande dans ce même écran.
        if (/secret/i.test(res.error)) setPinChecked(false);
        return;
      }
      setDoneName(res.establishmentName);
      setEmail(res.email);
      setStep("done");
    });
  }

  function notMe() {
    startTransition(async () => {
      await signOutForActivation();
      setEsts([]);
      setChoice("new");
      setEmail("");
      setPinChecked(false);
      setError(null);
      setStep("start");
      router.refresh();
    });
  }

  // ---- Étape 1 : secret + e-mail -------------------------------------------
  if (step === "start") {
    return (
      <div className={card}>
        <LogoBadge className="mx-auto h-16 w-16 drop-shadow-[0_12px_24px_-12px_var(--color-brand)]" />
        <h1 className="mt-5 text-center font-display text-xl font-semibold text-ink">
          Activez votre présentoir
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Reliez ce présentoir à votre commerce en une minute, sans mot de passe.
        </p>
        <form onSubmit={submitStart} className="mt-6 flex flex-col gap-4">
          <PinField value={pin} onChange={setPin} autoFocus />
          <Field
            label="Votre e-mail"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            hint="Vous recevrez un code pour créer votre espace, ou vous y reconnecter si vous avez déjà un présentoir."
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={pending} className={primaryBtn}>
            {pending ? "Envoi du code…" : "Recevoir mon code"}
          </button>
        </form>
      </div>
    );
  }

  // ---- Étape 2 : code reçu par e-mail ---------------------------------------
  if (step === "code") {
    return (
      <div className={card}>
        <LogoBadge className="mx-auto h-16 w-16 drop-shadow-[0_12px_24px_-12px_var(--color-brand)]" />
        <h1 className="mt-5 text-center font-display text-xl font-semibold text-ink">
          Saisissez votre code
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Nous venons d&apos;envoyer un code à{" "}
          <span className="font-medium text-ink-soft">{email}</span>.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verify(otp);
          }}
          className="mt-6 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="sr-only">Code reçu par e-mail</span>
            <input
              name="otp"
              value={otp}
              onChange={(e) => onOtpChange(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              autoFocus
              placeholder={"0".repeat(codeLength)}
              aria-label="Code reçu par e-mail"
              className="h-14 w-full rounded-xl border border-line bg-surface px-3.5 text-center font-mono text-2xl font-semibold tracking-[0.4em] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-line focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)]"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-emerald-600">{info}</p>}
          <button
            type="submit"
            disabled={pending || otp.length < 6}
            className={primaryBtn}
          >
            {pending ? "Vérification…" : "Valider"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">
          Pas reçu ? Regardez dans les spams, ou ouvrez l&apos;e-mail et touchez
          « Ouvrir mon espace ».
        </p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={pending || cooldown > 0}
            onClick={() =>
              sendCode(() => setInfo("Nouveau code envoyé. Seul le dernier reçu fonctionne."))
            }
            className={linkBtn}
          >
            {cooldown > 0 ? `Renvoyer (${cooldown} s)` : "Renvoyer le code"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setError(null);
              setInfo(null);
              setOtp("");
              setStep("start");
            }}
            className={linkBtn}
          >
            Modifier l&apos;e-mail
          </button>
        </div>
      </div>
    );
  }

  // ---- Étape 3 : le commerce -------------------------------------------------
  if (step === "commerce") {
    const isNew = choice === "new";
    return (
      <div className={card}>
        <LogoBadge className="mx-auto h-16 w-16 drop-shadow-[0_12px_24px_-12px_var(--color-brand)]" />
        <h1 className="mt-5 text-center font-display text-xl font-semibold text-ink">
          {ests.length > 0 ? "Pour quel commerce ?" : "Votre commerce"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Connecté avec <span className="font-medium text-ink-soft">{email}</span>
        </p>
        <form onSubmit={submitCommerce} className="mt-6 flex flex-col gap-4">
          {!pinChecked && <PinField value={pin} onChange={setPin} autoFocus />}

          {ests.length > 0 && (
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">Commerce</legend>
              {ests.map((est) => (
                <ChoiceCard
                  key={est.id}
                  checked={choice === est.id}
                  onSelect={() => setChoice(est.id)}
                  title={est.name}
                  subtitle={
                    est.googleReviewUrl
                      ? "Même lien d'avis Google que vos autres présentoirs"
                      : "Lien d'avis Google à ajouter depuis votre espace"
                  }
                />
              ))}
              <ChoiceCard
                checked={isNew}
                onSelect={() => setChoice("new")}
                title="Un autre commerce"
                subtitle="Nouveau nom, nouveau lien d'avis"
              />
            </fieldset>
          )}

          {isNew && (
            <>
              <Field
                label="Nom du commerce"
                name="name"
                required
                autoFocus={pinChecked && ests.length === 0}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Le Comptoir de Camille"
              />
              <Field
                label="Lien de votre page d'avis Google"
                name="google_review_url"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                value={googleUrl}
                onChange={(e) => setGoogleUrl(e.target.value)}
                placeholder="https://g.page/r/…"
                hint="Sur votre fiche Google, touchez « Demander des avis » puis copiez le lien. Vous pourrez aussi l'ajouter plus tard."
              />
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={pending} className={primaryBtn}>
            {pending ? "Activation…" : "Activer mon présentoir"}
          </button>
        </form>
        {account && (
          <p className="mt-4 text-center text-xs text-muted">
            Ce n&apos;est pas votre compte ?{" "}
            <button type="button" onClick={notMe} disabled={pending} className={linkBtn}>
              Utiliser une autre adresse
            </button>
          </p>
        )}
      </div>
    );
  }

  // ---- Activé -----------------------------------------------------------------
  return (
    <div className={`${card} text-center`}>
      <div className="relative mx-auto h-16 w-16">
        <LogoBadge className="h-16 w-16 drop-shadow-[0_12px_24px_-12px_var(--color-brand)]" />
        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-surface">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      </div>
      <h1 className="mt-5 font-display text-xl font-semibold text-ink">
        Présentoir activé&nbsp;!
      </h1>
      <p className="mt-2 text-sm text-muted">
        Il est relié à{" "}
        <span className="font-medium text-ink-soft">{doneName || "votre commerce"}</span>{" "}
        et redirige déjà vos clients.
      </p>
      <div className="mt-5 rounded-xl border border-line bg-canvas px-4 py-3">
        <p className="text-xs text-muted">Adresse de votre présentoir</p>
        <p className="mt-0.5 font-mono text-sm font-medium text-ink">{standAddress}</p>
      </div>
      <Link href="/dashboard" className={`${primaryBtn} mt-6`}>
        Voir mon espace
      </Link>
      <p className="mt-3 text-xs text-muted">
        Confirmation envoyée à {email}. Pour revenir : votre e-mail, puis un
        code. Pas de mot de passe à retenir.
      </p>
      <p className="mt-3 text-xs text-muted">
        Le code secret imprimé sur le présentoir ne sert plus : personne ne peut
        modifier votre présentoir sans accéder à votre e-mail.
      </p>
    </div>
  );
}

function PinField({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <Field
      label="Code secret du présentoir"
      name="pin"
      required
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="ABCD1234"
      autoCapitalize="characters"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      className="font-mono uppercase tracking-wider"
      hint="Imprimé sur le présentoir, à côté du QR code (8 caractères)."
    />
  );
}

function ChoiceCard({
  checked,
  onSelect,
  title,
  subtitle,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
        checked ? "border-brand bg-brand-soft" : "border-line hover:border-ink-soft/30",
      )}
    >
      <input
        type="radio"
        name="establishment"
        checked={checked}
        onChange={onSelect}
        className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ink">{title}</span>
        <span className="block text-xs text-muted">{subtitle}</span>
      </span>
    </label>
  );
}
