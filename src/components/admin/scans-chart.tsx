"use client";

import { useState } from "react";
import type { DayPoint } from "@/lib/admin-data";

const dayFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

function label(day: string) {
  return dayFmt.format(new Date(`${day}T12:00:00`));
}

/**
 * Scans par jour sur 30 jours : une seule série (le titre la nomme, pas de
 * légende), barres fines arrondies côté valeur, axe discret, info-bulle au
 * survol ou au clavier, et tableau des données pour les lecteurs d'écran.
 */
export function ScansChart({ days }: { days: DayPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d.views));
  const current = active === null ? null : days[active];

  return (
    <figure className="rounded-3xl border border-line bg-surface p-5">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="font-display text-base font-semibold text-ink">
          Scans par jour (30 jours)
        </span>
        <span className="text-xs text-muted" aria-live="polite">
          {current
            ? `${label(current.day)} : ${current.views} scan${current.views > 1 ? "s" : ""}, ${current.clicks} vers Google`
            : `Max ${max} / jour`}
        </span>
      </figcaption>
      <div
        className="mt-4 flex h-32 items-end gap-[2px] border-b border-line"
        onMouseLeave={() => setActive(null)}
        aria-hidden
      >
        {days.map((d, i) => (
          <div
            key={d.day}
            className="flex h-full flex-1 items-end"
            onMouseEnter={() => setActive(i)}
          >
            <div
              className={`w-full rounded-t-[4px] transition-colors ${
                active === i ? "bg-brand-strong" : "bg-brand"
              }`}
              style={{ height: d.views ? `${Math.max(3, (d.views / max) * 100)}%` : 0 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-muted" aria-hidden>
        <span>{days[0] ? label(days[0].day) : ""}</span>
        <span>{days.at(-1) ? label(days.at(-1)!.day) : ""}</span>
      </div>
      <details className="mt-3 text-xs text-muted">
        <summary className="cursor-pointer select-none">Voir les données</summary>
        <table className="mt-2 w-full text-left tabular-nums">
          <thead>
            <tr className="text-ink-soft">
              <th className="py-1 font-medium">Jour</th>
              <th className="py-1 font-medium">Scans</th>
              <th className="py-1 font-medium">Vers Google</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.day} className="border-t border-line">
                <td className="py-1">{label(d.day)}</td>
                <td className="py-1">{d.views}</td>
                <td className="py-1">{d.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
