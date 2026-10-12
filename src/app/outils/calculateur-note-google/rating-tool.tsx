"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { IconStar } from "@/components/ui/icons";
import {
  averageAfter,
  compensation,
  formatRating,
  reviewsNeeded,
} from "@/lib/rating";
import { PRODUCT_PATH } from "@/lib/brand";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-brand focus:shadow-[0_0_0_4px_var(--color-brand-soft)]";
const labelCls = "text-[13px] font-semibold text-ink";

const TARGETS = [4.0, 4.3, 4.5, 4.7, 4.8, 4.9];
const NEW_AVGS = [
  { v: 5, label: "5 étoiles" },
  { v: 4.8, label: "4,8 en moyenne" },
  { v: 4.5, label: "4,5 en moyenne" },
];

/** Lit un nombre saisi à la française (« 4,2 » ou « 4.2 »). */
function parseNum(raw: string): number | null {
  const v = raw.trim().replace(",", ".");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * Calculateur de note Google : combien d'avis (5 étoiles, ou d'une note
 * moyenne donnée) pour atteindre une note cible, en combien de temps, et ce
 * que coûte un avis 1 étoile. Calcul instantané, entièrement local.
 */
export function RatingTool() {
  const [ratingRaw, setRatingRaw] = useState("4,2");
  const [countRaw, setCountRaw] = useState("47");
  const [target, setTarget] = useState(4.5);
  const [newAvg, setNewAvg] = useState(5);
  const [paceRaw, setPaceRaw] = useState("");
  const tracked = useRef(false);

  const touch = () => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("tool_use", { tool: "rating_calculator" });
  };

  const rating = parseNum(ratingRaw);
  const count = parseNum(countRaw);
  const pace = parseNum(paceRaw);

  const ratingOk = rating !== null && rating >= 1 && rating <= 5;
  const countOk = count !== null && Number.isInteger(count) && count >= 1 && count <= 1_000_000;
  const valid = ratingOk && countOk;

  const needed = valid ? reviewsNeeded(rating, count, target, newAvg) : null;
  const reached = valid && needed === 0;
  const impossible = valid && needed === null;
  const months =
    needed && pace && pace > 0 ? Math.max(1, Math.ceil(needed / pace)) : null;
  const afterOneStar = valid ? averageAfter(rating, count, 1, 1) : null;
  const comp = valid ? compensation(rating, 1) : null;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[var(--shadow-lift)]">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Saisie */}
        <div className="grid gap-6 p-5 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="rt-rating" className={labelCls}>
                Votre note Google actuelle
              </label>
              <div className="relative mt-2">
                <input
                  id="rt-rating"
                  inputMode="decimal"
                  autoComplete="off"
                  value={ratingRaw}
                  onChange={(e) => {
                    setRatingRaw(e.target.value);
                    touch();
                  }}
                  aria-invalid={!ratingOk || undefined}
                  className={cn(field, "h-12 pr-10", !ratingOk && ratingRaw && "border-red-400")}
                />
                <IconStar
                  size={18}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-star"
                />
              </div>
              <p className="mt-1.5 text-xs text-muted">Entre 1 et 5, ex. 4,2</p>
            </div>
            <div>
              <label htmlFor="rt-count" className={labelCls}>
                Nombre d&apos;avis actuels
              </label>
              <input
                id="rt-count"
                inputMode="numeric"
                autoComplete="off"
                value={countRaw}
                onChange={(e) => {
                  setCountRaw(e.target.value);
                  touch();
                }}
                aria-invalid={!countOk || undefined}
                className={cn(field, "mt-2 h-12", !countOk && countRaw && "border-red-400")}
              />
              <p className="mt-1.5 text-xs text-muted">Affiché à côté de la note</p>
            </div>
          </div>

          <fieldset>
            <legend className={labelCls}>Note visée</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TARGETS.map((t) => (
                <Chip
                  key={t}
                  active={target === t}
                  onClick={() => {
                    setTarget(t);
                    touch();
                  }}
                >
                  {formatRating(t)}
                </Chip>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
            <fieldset>
              <legend className={labelCls}>Note des nouveaux avis</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {NEW_AVGS.map((o) => (
                  <Chip
                    key={o.v}
                    active={newAvg === o.v}
                    onClick={() => {
                      setNewAvg(o.v);
                      touch();
                    }}
                  >
                    {o.label}
                  </Chip>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-muted">
                Plus réaliste : tous les avis ne sont pas à 5 étoiles.
              </p>
            </fieldset>
            <div>
              <label htmlFor="rt-pace" className={labelCls}>
                Nouveaux avis par mois <span className="font-normal text-muted">(facultatif)</span>
              </label>
              <input
                id="rt-pace"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ex. 6"
                value={paceRaw}
                onChange={(e) => {
                  setPaceRaw(e.target.value);
                  touch();
                }}
                className={cn(field, "mt-2 h-12")}
              />
              <p className="mt-1.5 text-xs text-muted">Pour estimer le délai</p>
            </div>
          </div>
        </div>

        {/* Résultat */}
        <div className="flex flex-col justify-center gap-5 border-line bg-canvas p-5 max-lg:border-t sm:p-8 lg:border-l" aria-live="polite">
          {!valid ? (
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Indiquez votre note actuelle (entre 1 et 5) et votre nombre
              d&apos;avis pour voir le résultat.
            </p>
          ) : reached ? (
            <div>
              <p className="font-display text-2xl font-semibold text-ink">
                Objectif déjà atteint
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Votre note de {formatRating(rating)} est déjà au niveau visé.
                L&apos;enjeu est maintenant de la garder : un flux régulier
                d&apos;avis récents protège la moyenne contre un avis négatif.
              </p>
            </div>
          ) : impossible ? (
            <div>
              <p className="font-display text-2xl font-semibold text-ink">
                Inatteignable avec ces avis
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Des avis notés {formatRating(newAvg)} en moyenne ne peuvent pas
                faire monter la note au-dessus de {formatRating(newAvg)}.
                Choisissez une note visée plus basse.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-muted">Il vous faut environ</p>
              <p className="mt-1 font-display text-5xl font-semibold tracking-tight text-brand sm:text-6xl">
                {needed!.toLocaleString("fr-FR")}
              </p>
              <p className="mt-2 text-[15px] font-medium leading-snug text-ink">
                {newAvg === 5
                  ? `nouveaux avis 5 étoiles`
                  : `nouveaux avis notés ${formatRating(newAvg)} en moyenne`}{" "}
                pour passer de {formatRating(rating)} à {formatRating(target)}.
              </p>
              {months !== null && (
                <p className="mt-3 rounded-xl bg-surface px-3.5 py-2.5 text-sm text-ink-soft ring-1 ring-line">
                  À {pace} avis par mois : environ <strong className="text-ink">{months} mois</strong>.
                </p>
              )}
            </div>
          )}

          {valid && afterOneStar !== null && comp !== null && (
            <div className="border-t border-line pt-5 text-sm leading-relaxed text-ink-soft">
              <p>
                <strong className="text-ink">Et un avis 1 étoile ?</strong> Il
                ferait passer votre moyenne à {formatRating(afterOneStar, 2)}.
                Il faudrait ensuite {comp} avis 5 étoiles pour revenir à{" "}
                {formatRating(rating)}.
              </p>
              <p className="mt-3">
                Le plus sûr pour faire monter la note : demander un avis à
                chaque client, au comptoir.{" "}
                <Link href={PRODUCT_PATH} className="font-medium text-brand hover:underline">
                  Voir le présentoir Reviu
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-colors",
        active
          ? "bg-brand-soft text-brand ring-brand/40"
          : "text-ink-soft ring-line hover:ring-brand/40",
      )}
    >
      {children}
    </button>
  );
}
