"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  requestActivationCode,
  verifyActivationCode,
  verifyActivationCodeForOther,
  completeActivation,
  signOutForActivation,
} from "@/lib/activation-actions";
import type { MyEstablishment } from "@/lib/dashboard";
import { LogoBadge } from "@/components/ui/logo";
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/utils";

/**
 * Parcours d'activation d'un présentoir vierge :
 * 0. écran neutre (un client qui scanne un présentoir pas encore activé ne
 *    tombe pas sur un formulaire) -> « Vous êtes le commerçant ? Activer » ;
 * 1. code secret (imprimé sur le présentoir) + e-mail -> envoi d'un code ;
 * 2. code reçu par e-mail -> l'e-mail est vérifié, l'espace est ouvert ;
 * 3. choix du commerce (existant ou nouveau) -> présentoir activé.
 * Déjà connecté sur ce téléphone : directement l'étape 3, avec le code secret.
 *
 * Mode « pour un autre commerçant » (revendeur, démo) : le commerçant reçoit le
 * code et le donne ; le présentoir va dans SON espace, sans toucher à la
 * session de ce téléphone (jeton signé côté serveur).
 */

type Step = "intro" | "start" | "code" | "commerce" | "done";

const RESEND_DELAY = 50;
/** Reprise après rafraîchissement : e-mail et heure d'envoi (jamais le secret). */
const RESUME_WINDOW_MS = 30 * 60_000;

const card =
  "pop elev w-full max-w-sm rounded-3xl border border-line bg-surface p-6 sm:p-8";
const primaryBtn =
  "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-white shadow-[0_10px_22px_-10px_var(--color-brand)] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-[0_16px_30px_-12px_var(--color-brand)] disabled:opacity-50";
const linkBtn =
  "text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline disabled:opacity-50";

type Resume = { email: string; sentAt: number; codeLength: number };

function resumeKey(code: string) {
  return `reviu-activation-${code}`;
}
function readResume(code: string): Resume | null {
  try {
    const raw = sessionStorage.getItem(resumeKey(code));
    if (!raw) return null;
    const r = JSON.parse(raw) as Resume;
    return Date.now() - r.sentAt < RESUME_WINDOW_MS ? r : null;
  } catch {
    return null;
  }
}
function writeResume(code: string, r: Resume | null) {
  try {
    if (r) sessionStorage.setItem(resumeKey(code), JSON.stringify(r));
    else sessionStorage.removeItem(resumeKey(code));
  } catch {
    // stockage indisponible (navigation privée) : sans conséquence
  }
}

export function ActivateFlow({
  code,
  standAddress,
  account,
  establishments,
  activated,
}: {
  code: string;
  standAddress: string;
  account: { email: string } | null;
  establishments: MyEstablishment[];
  /** Présentoir déjà activé sur ce compte (page rouverte ou rafraîchie). */
  activated?: { establishmentName: string; hasGoogleLink: boolean };
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(
    activated ? "done" : account ? "commerce" : "intro",
  );
  // Arrivé déjà connecté (et non connecté à l'instant par le code) : seul ce
  // cas propose « Ce n'est pas votre compte ? ».
  const [cameLoggedIn] = useState(Boolean(account));
  const [forOther, setForOther] = useState(false);
  const [ticket, setTicket] = useState<string | null>(null);
  const [email, setEmail] = useState(account?.email ?? "");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  // Le secret a déjà été vérifié à l'étape 1 : inutile de le redemander.
  const [pinChecked, setPinChecked] = useState(false);
  const [otp, setOtp] = useState("");
  const [codeLength, setCodeLength] = useState(6);
  const [cooldown, setCooldown] = useState(0);
  const [ests, setEsts] = useState<MyEstablishment[]>(establishments);
  // Un seul commerce : pré-sélectionné. Plusieurs : choix explicite obligatoire
  // (un présentoir rattaché au mauvais commerce ne se corrige que par l'admin).
  const [choice, setChoice] = useState<string>(defaultChoice(establishments));
  const [name, setName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [doneName, setDoneName] = useState(activated?.establishmentName ?? "");
  const [hasLink, setHasLink] = useState(activated?.hasGoogleLink ?? true);
  // Vrai seulement si l'activation vient d'avoir lieu dans cet onglet.
  const [justActivated, setJustActivated] = useState(false);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  /** « Activer mon présentoir » : reprend à l'étape 2 si un code vient d'être envoyé (page rafraîchie). */
  function begin() {
    const r = readResume(code);
    if (r) {
      setEmail(r.email);
      setSentTo(r.email);
      setCodeLength(r.codeLength);
      setCooldown(Math.max(0, RESEND_DELAY - Math.round((Date.now() - r.sentAt) / 1000)));
      setStep("code");
      return;
    }
    setStep("start");
  }

  function resetMessages() {
    setError(null);
    setInfo(null);
  }

  function sendCode(onSent?: () => void) {
    resetMessages();
    startTransition(async () => {
      const res = await requestActivationCode({ code, pin, email });
      if (!res.ok) {
        if (res.code === "stand_already_assigned") setBlocked(res.error);
        else setError(res.error);
        return;
      }
      setEmail(res.email);
      setSentTo(res.email);
      setCodeLength(res.codeLength);
      setPinChecked(true);
      setCooldown(RESEND_DELAY);
      setOtp("");
      if (!forOther) {
        writeResume(code, { email: res.email, sentAt: Date.now(), codeLength: res.codeLength });
      }
      onSent?.();
    });
  }

  function submitStart(e: FormEvent) {
    e.preventDefault();
    // Retour en arrière avec la même adresse : le code envoyé reste valable.
    if (sentTo && sentTo === email.trim().toLowerCase() && cooldown > 0 && pin.trim()) {
      resetMessages();
      setStep("code");
      return;
    }
    sendCode(() => setStep("code"));
  }

  function verify(token: string) {
    resetMessages();
    startTransition(async () => {
      const res = forOther
        ? await verifyActivationCodeForOther({ code, email, token })
        : await verifyActivationCode({ email, token });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if ("ticket" in res && typeof res.ticket === "string") setTicket(res.ticket);
      else writeResume(code, null);
      setEsts(res.establishments);
      setChoice(defaultChoice(res.establishments));
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
    if (!choice) {
      setError("Choisissez le commerce de ce présentoir.");
      return;
    }
    resetMessages();
    startTransition(async () => {
      const isNew = choice === "new";
      const res = await completeActivation({
        code,
        pin,
        establishmentId: isNew ? null : choice,
        name: isNew ? name : undefined,
        googleUrl: isNew ? googleUrl : undefined,
        ticket: forOther ? ticket : null,
      });
      if (!res.ok) {
        if (res.code === "stand_already_assigned") {
          setBlocked(res.error);
        } else if (res.code === "not_authenticated") {
          setPinChecked(false);
          setStep("start");
          setError(res.error);
        } else {
          setError(res.error);
          // Secret refusé : on le redemande dans ce même écran.
          if (res.code === "invalid_pin" || res.code === "locked") setPinChecked(false);
        }
        return;
      }
      setDoneName(res.establishmentName);
      setEmail(res.email);
      setHasLink(res.hasGoogleLink);
      setJustActivated(true);
      setStep("done");
    });
  }

  /** Revendeur / démo : activer pour un client, sans changer de compte ici. */
  function startForOther() {
    resetMessages();
    setForOther(true);
    setTicket(null);
    setEsts([]);
    setChoice("new");
    setEmail("");
    setSentTo(null);
    setCooldown(0);
    setStep("start");
  }

  function notMe() {
    startTransition(async () => {
      await signOutForActivation();
      setEsts([]);
      setChoice("new");
      setEmail("");
      setSentTo(null);
      setPinChecked(false);
      resetMessages();
      setStep("start");
      router.refresh();
    });
  }

  // ---- Présentoir activé par quelqu'un d'autre entre-temps --------------------
  if (blocked) {
    return (
      <div className={`${card} text-center`}>
        <LogoBadge className="mx-auto h-16 w-16 drop-shadow-[0_12px_24px_-12px_var(--color-brand)]" />
        <h1 className="mt-5 font-display text-xl font-semibold text-ink">
          Présentoir déjà activé
        </h1>
        <p role="alert" className="mt-2 text-sm text-muted">
          {blocked}
        </p>
      </div>
    );
  }

  // ---- Écran neutre (clients) -------------------------------------------------
  if (step === "intro") {
    return (
      <div className={`${card} text-center`}>
        <LogoBadge className="mx-auto h-16 w-16 drop-shadow-[0_12px_24px_-12px_var(--color-brand)]" />
        <h1 className="mt-5 font-display text-xl font-semibold text-ink">
          Présentoir bientôt prêt
        </h1>
        <p className="mt-2 text-sm text-muted">
          Ce présentoir n&apos;est pas encore activé. Merci de votre visite !
        </p>
        <div className="mt-6 rounded-2xl border border-line bg-canvas p-4">
          <p className="text-sm font-medium text-ink">Vous êtes le commerçant ?</p>
          <p className="mt-1 text-xs text-muted">
            Reliez ce présentoir à votre commerce en une minute, sans mot de passe.
          </p>
          <button type="button" onClick={begin} className={`${primaryBtn} mt-4`}>
            Activer mon présentoir
          </button>
          <button type="button" onClick={startForOther} className={`${linkBtn} mt-3 text-xs`}>
            Vous l&apos;installez chez un client ? Activer pour lui
          </button>
        </div>
      </div>
    );
  }

  // ---- Étape 1 : secret + e-mail -------------------------------------------
  if (step === "start") {
    return (
      <div className={card}>
        <LogoBadge className="mx-auto h-16 w-16 drop-shadow-[0_12px_24px_-12px_var(--color-brand)]" />
        <h1 className="mt-5 text-center font-display text-xl font-semibold text-ink">
          {forOther ? "Activer pour un commerçant" : "Activez votre présentoir"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          {forOther
            ? "Le commerçant reçoit un code par e-mail et vous le donne. Le présentoir ira dans son espace, pas dans le vôtre."
            : "Reliez ce présentoir à votre commerce en une minute, sans mot de passe."}
        </p>
        <form onSubmit={submitStart} className="mt-6 flex flex-col gap-4">
          <PinField value={pin} onChange={setPin} autoFocus invalid={Boolean(error)} />
          <Field
            label={forOther ? "E-mail du commerçant" : "Votre e-mail"}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            hint={
              forOther
                ? "Son espace est créé au passage s'il n'en a pas encore."
                : "Vous recevrez un code pour créer votre espace, ou vous y reconnecter si vous avez déjà un présentoir."
            }
          />
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
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
          {forOther ? "Code reçu par le commerçant" : "Saisissez votre code"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Nous venons d&apos;envoyer un code à{" "}
          <span className="font-medium text-ink-soft">{email}</span>.
          {forOther ? " Demandez-le au commerçant." : ""}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verify(otp);
          }}
          className="mt-6 flex flex-col gap-4"
        >
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
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "otp-error" : undefined}
            className="h-14 w-full rounded-xl border border-line bg-surface px-3.5 text-center font-mono text-2xl font-semibold tracking-[0.4em] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-line focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)]"
          />
          {error && (
            <p id="otp-error" role="alert" className="text-sm text-red-600">
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
            {pending ? "Vérification…" : "Valider"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">
          {forOther
            ? "Rien reçu ? Le commerçant peut regarder dans ses courriers indésirables, ou vous pouvez renvoyer le code."
            : "Rien reçu ? Regardez dans vos courriers indésirables, ou renvoyez le code. Vous pouvez aussi toucher « Continuer l'activation » dans l'e-mail."}
        </p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={pending || cooldown > 0}
            onClick={() => {
              if (!pin.trim()) {
                // Page rafraîchie : le secret n'est jamais conservé.
                setStep("start");
                setError("Saisissez à nouveau le code secret pour recevoir un nouveau code.");
                return;
              }
              sendCode(() => setInfo("Nouveau code envoyé. Seul le dernier reçu fonctionne."));
            }}
            className={linkBtn}
          >
            {cooldown > 0 ? `Renvoyer (${cooldown} s)` : "Renvoyer le code"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              resetMessages();
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
          {ests.length > 1
            ? "Pour quel commerce ?"
            : forOther
              ? "Commerce du client"
              : "Votre commerce"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          {forOther ? "Pour " : "Connecté avec "}
          <span className="font-medium text-ink-soft">{email}</span>
        </p>
        <form onSubmit={submitCommerce} className="mt-6 flex flex-col gap-4">
          {!pinChecked && (
            <PinField value={pin} onChange={setPin} autoFocus invalid={Boolean(error)} />
          )}

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
                      ? `Lien d'avis enregistré (${hostOf(est.googleReviewUrl)})`
                      : "Lien d'avis Google à ajouter depuis votre espace"
                  }
                />
              ))}
              {/* Pas de « nouveau commerce » ici : l'espace ne gère encore
                  qu'un commerce par compte (il serait introuvable ensuite). */}
              <p className="text-xs text-muted">
                Présentoir destiné à un autre commerce ? Choisissez celui-ci,
                puis changez le lien de ce présentoir dans « Présentoirs ».
              </p>
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
                hint="Sur votre fiche Google, touchez « Demander des avis » puis copiez le lien. Sans lien, le présentoir ne redirige pas encore : vous pourrez l'ajouter depuis votre espace."
              />
            </>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <button type="submit" disabled={pending || !choice} className={primaryBtn}>
            {pending ? "Activation…" : "Activer mon présentoir"}
          </button>
        </form>
        {cameLoggedIn && !forOther && (
          <div className="mt-4 flex flex-col items-center gap-1.5 text-center text-xs text-muted">
            <p>
              Vous l&apos;installez chez un client ?{" "}
              <button type="button" onClick={startForOther} disabled={pending} className={linkBtn}>
                Activer pour un autre commerçant
              </button>
            </p>
            <p>
              Ce n&apos;est pas votre compte ?{" "}
              <button type="button" onClick={notMe} disabled={pending} className={linkBtn}>
                Utiliser une autre adresse
              </button>
            </p>
          </div>
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
      {forOther ? (
        <>
          <p className="mt-2 text-sm text-muted">
            Il est relié à{" "}
            <span className="font-medium text-ink-soft">{doneName || "son commerce"}</span>
            {hasLink
              ? " et redirige déjà ses clients."
              : ". Le commerçant devra ajouter le lien d'avis de sa fiche Google depuis son espace."}
          </p>
          <p className="mt-3 text-xs text-muted">
            {email} reçoit une confirmation et se connecte à son espace avec son
            e-mail, sans mot de passe.
          </p>
          {cameLoggedIn && (
            <Link href="/dashboard" className={`${primaryBtn} mt-6`}>
              Retour à mon espace
            </Link>
          )}
        </>
      ) : (
        <>
      <p className="mt-2 text-sm text-muted">
        Il est relié à{" "}
        <span className="font-medium text-ink-soft">{doneName || "votre commerce"}</span>
        {hasLink
          ? " et redirige déjà vos clients."
          : ". Dernière étape : ajoutez le lien d'avis de votre fiche Google pour qu'il redirige vos clients."}
      </p>
      <div className="mt-5 rounded-xl border border-line bg-canvas px-4 py-3">
        <p className="text-xs text-muted">Adresse de votre présentoir</p>
        <p className="mt-0.5 font-mono text-sm font-medium text-ink">{standAddress}</p>
      </div>
      <Link
        href={hasLink ? "/dashboard" : "/dashboard/stands"}
        className={`${primaryBtn} mt-6`}
      >
        {hasLink ? "Voir mon espace" : "Ajouter mon lien d'avis"}
      </Link>
      <p className="mt-3 text-xs text-muted">
        {justActivated && email ? `Confirmation envoyée à ${email}. ` : ""}
        Pour revenir : votre e-mail, puis un code. Pas de mot de passe à
        retenir.
      </p>
      <p className="mt-3 text-xs text-muted">
        Le code secret imprimé ne permet plus de réactiver ce présentoir. Votre
        espace est protégé par votre adresse e-mail.
      </p>
        </>
      )}
    </div>
  );
}

function defaultChoice(establishments: MyEstablishment[]): string {
  if (establishments.length === 0) return "new";
  // Un seul commerce : pré-sélectionné. Plusieurs (anciens comptes) : choix
  // explicite, pour ne pas rattacher le présentoir au mauvais commerce.
  return establishments.length === 1 ? establishments[0].id : "";
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "lien Google";
  }
}

function PinField({
  value,
  onChange,
  autoFocus,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  invalid?: boolean;
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
      aria-invalid={invalid || undefined}
      className="font-mono uppercase tracking-wider"
      hint="8 caractères imprimés sur le présentoir, à côté du QR code."
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
