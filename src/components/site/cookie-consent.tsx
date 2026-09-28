"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/tracking-config";
import {
  getConsent,
  initTracking,
  onConsentSettingsOpen,
  openConsentSettings,
  saveConsent,
  subscribeConsent,
  type ConsentChoice,
} from "@/lib/tracking";

/** Rendu serveur et hydratation : choix inconnu, rien n'est affiché. */
const UNKNOWN = "unknown" as const;
const getServerSnapshot = () => UNKNOWN;

/** Catégories proposées : seulement celles dont l'outil est configuré. */
const CATEGORIES: {
  key: keyof ConsentChoice;
  enabled: boolean;
  title: string;
  body: string;
}[] = [
  {
    key: "analytics",
    enabled: GA_MEASUREMENT_ID !== null,
    title: "Mesure d'audience",
    body: "Google Analytics : savoir quelles pages sont utiles et d'où viennent nos visiteurs.",
  },
  {
    key: "ads",
    enabled: GOOGLE_ADS_ID !== null,
    title: "Publicité",
    body: "Google Ads : mesurer les commandes issues de nos annonces et vous montrer des annonces reviu sur d'autres sites.",
  },
];

/**
 * Bandeau de consentement aux cookies (mesure d'audience et publicité).
 * « Tout refuser » et « Tout accepter » ont le même poids visuel, un choix
 * par catégorie reste possible, et le lien « Gérer les cookies » du pied de
 * page rouvre ce panneau à tout moment. Monté par le pied de page, uniquement
 * si un outil est configuré (voir `src/lib/tracking-config.ts`).
 */
export function CookieConsent() {
  const consent = useSyncExternalStore<ReturnType<typeof getConsent> | typeof UNKNOWN>(
    subscribeConsent,
    getConsent,
    getServerSnapshot,
  );
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [draft, setDraft] = useState<ConsentChoice>({ analytics: false, ads: false });

  useEffect(() => {
    initTracking();
    return onConsentSettingsOpen(() => {
      const current = getConsent();
      setDraft({ analytics: current?.analytics ?? false, ads: current?.ads ?? false });
      setCustom(true);
      setOpen(true);
    });
  }, []);

  if (consent === UNKNOWN || (consent !== null && !open)) return null;

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    setOpen(false);
    setCustom(false);
  };
  const categories = CATEGORIES.filter((c) => c.enabled);

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-3 bottom-3 z-[80] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[25rem]"
    >
      <div className="rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-lift)] sm:p-6">
        <h2 id="cookie-consent-title" className="font-display text-base font-semibold text-ink">
          Vos préférences cookies
        </h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
          Avec votre accord, nous mesurons l&apos;audience du site et
          l&apos;efficacité de nos annonces (Google). Rien n&apos;est déposé
          avant votre choix, modifiable à tout moment.{" "}
          <Link href="/cookies" className="font-medium text-brand hover:underline">
            En savoir plus
          </Link>
        </p>

        {custom && (
          <ul className="mt-4 flex flex-col gap-2.5">
            {categories.map((c) => (
              <li key={c.key}>
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-3 transition-colors hover:border-brand/40">
                  <input
                    type="checkbox"
                    checked={draft[c.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [c.key]: e.target.checked }))}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand)]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{c.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">{c.body}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => choose({ analytics: false, ads: false })}
            className={buttonClass("primary", "md", "w-full")}
          >
            Tout refuser
          </button>
          <button
            type="button"
            onClick={() => choose({ analytics: true, ads: true })}
            className={buttonClass("primary", "md", "w-full")}
          >
            Tout accepter
          </button>
        </div>
        {custom ? (
          <button
            type="button"
            onClick={() => choose(draft)}
            className={buttonClass("secondary", "md", "mt-2 w-full")}
          >
            Enregistrer mes choix
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCustom(true)}
            className="mt-3 w-full text-center text-[13px] font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            Personnaliser
          </button>
        )}
      </div>
    </div>
  );
}

/** Lien du pied de page qui rouvre le bandeau pour modifier son choix. */
export function ManageCookiesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={cn("text-left", className)}>
      Gérer les cookies
    </button>
  );
}
