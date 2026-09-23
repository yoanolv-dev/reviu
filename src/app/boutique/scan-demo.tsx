"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { IconCheck, IconNfc, IconQr, IconStar } from "@/components/ui/icons";

const STEP_MS = 3200;

const STEPS = [
  {
    title: "Le client approche son téléphone",
    body: "Contact NFC sur le présentoir, ou scan du QR code avec l'appareil photo. Aucune application.",
  },
  {
    title: "Votre page d'avis Google s'ouvre",
    body: "Directement sur la fenêtre de notation de votre fiche\u00a0: plus besoin de vous chercher sur Google.",
  },
  {
    title: "Il note et publie en quelques secondes",
    body: "Le geste est si court que l'avis se laisse sur place, au moment où l'expérience est encore fraîche.",
  },
] as const;

/**
 * Démonstration animée du parcours client : un téléphone qui déroule les trois
 * écrans (tap NFC, page d'avis, publication), synchronisé avec la liste des
 * étapes. Défilement automatique, étapes cliquables ; figé sur l'étape choisie
 * si l'utilisateur préfère réduire les animations.
 */
export function ScanDemo() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => setAuto(false), 0);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [auto, step]);

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-20">
      <ol className="flex flex-col gap-3">
        {STEPS.map((s, i) => {
          const active = i === step;
          return (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => {
                  setStep(i);
                  setAuto(false);
                }}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-[background-color,border-color,box-shadow] duration-300 sm:p-5",
                  active
                    ? "border-brand/30 bg-surface shadow-[var(--shadow-lift)]"
                    : "border-transparent hover:bg-surface/60",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl font-mono text-sm font-semibold transition-colors duration-300",
                    active ? "bg-brand text-white" : "bg-brand-soft text-brand",
                  )}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[17px] font-semibold leading-snug text-ink">
                    {s.title}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-[15px] leading-relaxed text-ink-soft transition-opacity duration-300",
                      !active && "opacity-70",
                    )}
                  >
                    {s.body}
                  </span>
                </span>
                {active && auto && (
                  <span
                    key={`p-${step}`}
                    aria-hidden
                    className="step-progress absolute inset-x-0 bottom-0 h-0.5 bg-brand/60"
                    style={{ ["--step-ms" as string]: `${STEP_MS}ms` }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Téléphone (au-dessus des étapes sur mobile, à droite sur desktop) */}
      <div className="order-first mx-auto w-[220px] shrink-0 sm:w-[268px] lg:order-none" aria-hidden>
        <div className="rounded-[46px] bg-ink p-2.5 shadow-[0_40px_80px_-40px_rgba(17,57,201,0.55)]">
          <div className="relative aspect-[9/19] overflow-hidden rounded-[38px] bg-white">
            <div className="flex h-9 items-center justify-center">
              <span className="h-[18px] w-[76px] rounded-full bg-ink" />
            </div>
            <div key={step} className="screen-in absolute inset-x-0 bottom-0 top-9 flex flex-col px-5 pb-6">
              {step === 0 && <ScreenTap />}
              {step === 1 && <ScreenReview filled={false} />}
              {step === 2 && <ScreenReview filled />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenTap() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="relative grid h-28 w-28 place-items-center text-brand">
        <span className="nfc-wave" />
        <span className="nfc-wave nfc-wave-2" />
        <span className="nfc-wave nfc-wave-3" />
        <span className="relative grid h-20 w-20 place-items-center rounded-full bg-brand text-white shadow-[var(--shadow-glow)]">
          <IconNfc size={34} />
        </span>
      </div>
      <p className="mt-8 font-display text-[17px] font-semibold text-ink">
        Approchez votre téléphone
      </p>
      <p className="mt-1.5 text-[13px] text-muted">du présentoir, au comptoir</p>
      <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-line-soft px-3 py-1.5 text-xs font-medium text-ink-soft">
        <IconQr size={14} /> ou scannez le QR code
      </span>
    </div>
  );
}

function ScreenReview({ filled }: { filled: boolean }) {
  return (
    <div className="flex flex-1 flex-col pt-3">
      <div className="flex items-center gap-2.5 border-b border-line pb-3.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">
          V
        </span>
        <span>
          <span className="block text-[13px] font-semibold text-ink">
            Votre commerce
          </span>
          <span className="block text-[11px] text-muted">Écrire un avis</span>
        </span>
      </div>
      <div className="mt-6 flex justify-center gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <IconStar
            key={i}
            size={30}
            className={cn(
              "transition-colors duration-300",
              filled ? "text-accent" : "text-line",
            )}
            style={filled ? { transitionDelay: `${i * 90}ms` } : undefined}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] text-muted">
        {filled ? "Excellent" : "Sélectionnez une note"}
      </p>
      <div className="mt-5 flex-1 rounded-xl border border-line p-3">
        {filled ? (
          <div className="flex flex-col gap-2">
            <span className="h-2 w-[85%] rounded-full bg-line" />
            <span className="h-2 w-[70%] rounded-full bg-line" />
            <span className="h-2 w-[40%] rounded-full bg-line" />
          </div>
        ) : (
          <span className="text-[11px] text-muted">
            Partagez votre expérience…
          </span>
        )}
      </div>
      <div
        className={cn(
          "mt-4 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors duration-300",
          filled ? "bg-[#1a73e8] text-white" : "bg-line-soft text-muted",
        )}
      >
        {filled ? (
          <>
            <IconCheck size={16} /> Avis publié
          </>
        ) : (
          "Publier"
        )}
      </div>
    </div>
  );
}
