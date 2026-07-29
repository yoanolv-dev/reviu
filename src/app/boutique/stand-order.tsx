"use client";

import { useActionState, useMemo, useState } from "react";
import { startShopCheckout } from "@/lib/stripe-actions";
import { buttonClass } from "@/components/ui/button";

type Tier = { min: number; unitCents: number };

function euros(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function unitCentsFor(qty: number, tiers: Tier[]): number {
  let unit = tiers[0]?.unitCents ?? 0;
  for (const t of tiers) if (qty >= t.min) unit = t.unitCents;
  return unit;
}

/**
 * Sélecteur de quantité + achat du présentoir, avec tarif dégressif calculé en
 * direct. La quantité est postée à `startShopCheckout` (le serveur recalcule le
 * prix par palier, source de vérité).
 */
export function StandOrder({
  tiers,
  max,
  freeShipThresholdCents,
  freeFromLabel,
}: {
  tiers: Tier[];
  max: number;
  freeShipThresholdCents: number;
  freeFromLabel: string;
}) {
  const [qty, setQty] = useState(1);
  const [state, action, pending] = useActionState(startShopCheckout, null);

  const unit = useMemo(() => unitCentsFor(qty, tiers), [qty, tiers]);
  const total = unit * qty;
  const baseUnit = tiers[0]?.unitCents ?? 0;
  const saving = (baseUnit - unit) * qty;
  const freeShip = total >= freeShipThresholdCents;
  const toFreeShip = freeShipThresholdCents - total;

  const set = (v: number) => setQty(Math.min(Math.max(v, 1), max));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="font-display text-4xl font-semibold text-ink">
            {euros(unit)}
          </span>
          <span className="ml-1.5 text-sm text-muted">/ présentoir</span>
          {saving > 0 && (
            <p className="mt-1 text-xs font-medium text-brand">
              Vous économisez {euros(saving)} sur cette commande
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 rounded-full border border-line bg-canvas p-1">
          <button
            type="button"
            aria-label="Diminuer la quantité"
            onClick={() => set(qty - 1)}
            disabled={qty <= 1}
            className="grid h-9 w-9 place-items-center rounded-full text-lg text-ink transition-colors hover:bg-brand-soft disabled:opacity-40"
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            aria-label="Quantité de présentoirs"
            value={qty}
            min={1}
            max={max}
            onChange={(e) => set(Number(e.target.value))}
            className="w-12 bg-transparent text-center font-mono text-base text-ink outline-none"
          />
          <button
            type="button"
            aria-label="Augmenter la quantité"
            onClick={() => set(qty + 1)}
            disabled={qty >= max}
            className="grid h-9 w-9 place-items-center rounded-full text-lg text-ink transition-colors hover:bg-brand-soft disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted">
          Tarif dégressif{" "}
          <span className="text-ink-soft">- plus vous en prenez, moins c&apos;est cher</span>
        </p>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${tiers.length}, minmax(0, 1fr))` }}
        >
          {tiers.map((t, i) => {
            const upTo = tiers[i + 1] ? tiers[i + 1].min - 1 : null;
            const label =
              upTo && upTo !== t.min
                ? `${t.min}-${upTo}`
                : upTo === t.min
                  ? `${t.min}`
                  : `${t.min}+`;
            const activeTier = unitCentsFor(qty, tiers) === t.unitCents;
            const perUnitSaving = baseUnit - t.unitCents;
            return (
              <button
                type="button"
                key={t.min}
                onClick={() => set(t.min)}
                aria-pressed={activeTier}
                className={
                  "flex flex-col items-center rounded-xl border px-2 py-2.5 text-center transition-colors " +
                  (activeTier
                    ? "border-brand bg-brand-soft shadow-[var(--shadow-soft)]"
                    : "border-line bg-canvas hover:border-brand/40")
                }
              >
                <span
                  className={
                    "text-[11px] font-medium " +
                    (activeTier ? "text-brand" : "text-muted")
                  }
                >
                  {label} présentoir{t.min > 1 ? "s" : ""}
                </span>
                <span
                  className={
                    "mt-0.5 font-display text-[15px] font-semibold " +
                    (activeTier ? "text-brand" : "text-ink")
                  }
                >
                  {euros(t.unitCents)}
                </span>
                <span className="mt-0.5 text-[10px] leading-tight text-muted">
                  {perUnitSaving > 0 ? `- ${euros(perUnitSaving)} / unité` : "l'unité"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={
          "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs " +
          (freeShip
            ? "border-brand/40 bg-brand-soft text-brand"
            : "border-line text-muted")
        }
      >
        {freeShip ? (
          <span className="font-medium">✓ Livraison offerte sur cette commande</span>
        ) : (
          <span>
            Plus que{" "}
            <span className="font-medium text-ink">{euros(toFreeShip)}</span>{" "}
            pour la livraison offerte (dès {freeFromLabel}).
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm text-muted">
          Total {qty > 1 ? `(${qty} présentoirs)` : ""}
        </span>
        <span className="font-display text-2xl font-semibold text-ink">
          {euros(total)}
        </span>
      </div>

      <form action={action} className="flex flex-col gap-2">
        <input type="hidden" name="product" value="stand" />
        <input type="hidden" name="quantity" value={qty} />
        <button
          type="submit"
          disabled={pending}
          className={buttonClass("gradient", "lg", "w-full")}
        >
          {pending ? "Redirection…" : "Commander"}
        </button>
        {state?.error && (
          <p className="text-center text-xs text-red-600">{state.error}</p>
        )}
      </form>

      <p className="text-center text-xs text-muted">
        Achat unique, sans frais supplémentaires. Espace Reviu inclus dès
        l&apos;activation.
      </p>
    </div>
  );
}
