"use client";

import { useActionState, useMemo, useState } from "react";
import { startShopCheckout } from "@/lib/stripe-actions";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
 * Choix de quantité par cartes (plus efficace qu'un stepper) + achat du
 * présentoir. Chaque carte affiche la quantité, le prix unitaire remisé et un
 * repère (économie / livraison offerte). La quantité choisie est postée à
 * `startShopCheckout` (le serveur recalcule le prix par palier, source de
 * vérité). Au-delà du plafond public, on oriente vers /revendeur.
 */
export function StandOrder({
  tiers,
  max,
  subscriptionLabel,
  period,
  freeShipThresholdCents,
  freeFromLabel,
}: {
  tiers: Tier[];
  max: number;
  subscriptionLabel: string;
  period: string;
  freeShipThresholdCents: number;
  freeFromLabel: string;
}) {
  const [qty, setQty] = useState(1);
  const [state, action, pending] = useActionState(startShopCheckout, null);

  const options = useMemo(
    () => [1, 2, 3, 5, 10].filter((q) => q <= max),
    [max],
  );
  const baseUnit = tiers[0]?.unitCents ?? 0;
  const unit = unitCentsFor(qty, tiers);
  const total = unit * qty;
  const saving = (baseUnit - unit) * qty;
  const freeShip = total >= freeShipThresholdCents;
  const toFreeShip = freeShipThresholdCents - total;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="text-sm font-medium text-ink">Choisissez la quantité</span>
        <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {options.map((q) => {
            const u = unitCentsFor(q, tiers);
            const selected = q === qty;
            const qualifies = u * q >= freeShipThresholdCents;
            return (
              <button
                key={q}
                type="button"
                onClick={() => setQty(q)}
                aria-pressed={selected}
                className={cn(
                  "relative flex flex-col items-center rounded-2xl border px-2 py-3 text-center transition-colors",
                  selected
                    ? "border-brand bg-brand-soft ring-1 ring-brand"
                    : "border-line bg-canvas hover:border-brand/40",
                )}
              >
                <span className="font-display text-xl font-semibold text-ink">
                  {q}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-muted">
                  {q > 1 ? "présentoirs" : "présentoir"}
                </span>
                <span
                  className={cn(
                    "mt-1.5 text-xs font-medium",
                    u < baseUnit ? "text-brand" : "text-ink-soft",
                  )}
                >
                  {euros(u)}/u
                </span>
                {qualifies && (
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-brand">
                    Livr. offerte
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Résumé */}
      <div className="rounded-2xl border border-line bg-canvas p-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm text-muted">
              Total{qty > 1 ? ` · ${qty} présentoirs` : ""}
            </span>
            {saving > 0 && (
              <p className="text-xs font-medium text-brand">
                Vous économisez {euros(saving)}
              </p>
            )}
          </div>
          <span className="font-display text-3xl font-semibold text-ink">
            {euros(total)}
          </span>
        </div>
        <div className="mt-3 border-t border-line pt-3 text-xs">
          {freeShip ? (
            <span className="font-medium text-brand">✓ Livraison offerte</span>
          ) : (
            <span className="text-muted">
              Plus que{" "}
              <span className="font-medium text-ink">{euros(toFreeShip)}</span>{" "}
              pour la livraison offerte (dès {freeFromLabel}).
            </span>
          )}
        </div>
      </div>

      <form action={action} className="flex flex-col gap-2">
        <input type="hidden" name="product" value="stand" />
        <input type="hidden" name="quantity" value={qty} />
        <button
          type="submit"
          disabled={pending}
          className={buttonClass("primary", "lg", "h-14 w-full text-base")}
        >
          {pending ? "Redirection…" : `Commander · ${euros(total)}`}
        </button>
        {state?.error && (
          <p className="text-center text-xs text-red-600">{state.error}</p>
        )}
      </form>

      <p className="text-center text-xs text-muted">
        Achat unique. Activation gratuite. Abonnement de suivi{" "}
        {subscriptionLabel}/{period} en option. Besoin de plus de {max}{" "}
        présentoirs ?{" "}
        <a href="/revendeur" className="font-medium text-brand hover:underline">
          Devenez revendeur
        </a>
        .
      </p>
    </div>
  );
}
