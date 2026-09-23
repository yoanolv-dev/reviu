"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";

type Tier = { min: number; unitCents: number };

function euros(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

/**
 * Commande express de l'accueil : quantité + bouton, rien d'autre. Le prix
 * dégressif s'applique tout seul (recalculé côté serveur au paiement). Le
 * détail des paliers et des caractéristiques vit sur la fiche produit.
 */
export function QuickOrder({ tiers, max }: { tiers: Tier[]; max: number }) {
  const [qty, setQty] = useState(1);
  const set = (v: number) => setQty(Math.min(Math.max(v, 1), max));
  let unit = tiers[0]?.unitCents ?? 0;
  for (const t of tiers) if (qty >= t.min) unit = t.unitCents;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <div className="flex h-14 items-center justify-between gap-1 rounded-full border border-line bg-canvas p-1.5 sm:w-40">
        <button
          type="button"
          aria-label="Diminuer la quantité"
          onClick={() => set(qty - 1)}
          disabled={qty <= 1}
          className="grid h-11 w-11 place-items-center rounded-full text-xl text-ink transition-colors hover:bg-surface disabled:opacity-35"
        >
          −
        </button>
        <span aria-live="polite" className="text-center font-display text-lg font-semibold tabular-nums text-ink">
          {qty}
          <span className="sr-only"> présentoir{qty > 1 ? "s" : ""}</span>
        </span>
        <button
          type="button"
          aria-label="Augmenter la quantité"
          onClick={() => set(qty + 1)}
          disabled={qty >= max}
          className="grid h-11 w-11 place-items-center rounded-full text-xl text-ink transition-colors hover:bg-surface disabled:opacity-35"
        >
          +
        </button>
      </div>
      <Link
        href={`/boutique/commander?product=stand&quantity=${qty}`}
        className={buttonClass("primary", "lg", "group h-14 flex-1 text-base")}
      >
        Commander · {euros(unit * qty)}
        <IconArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
