"use client";

import { useEffect } from "react";
import { trackBeginCheckout, trackPurchase } from "@/lib/tracking";

type ItemProps = {
  itemId: string;
  itemName: string;
  quantity: number;
  /** Prix unitaire TTC en euros. */
  unitPrice: number;
  /** Montant total TTC en euros. */
  value: number;
};

/** Étape de paiement affichée (`/boutique/commander`). */
export function BeginCheckoutEvent({ itemId, itemName, quantity, unitPrice, value }: ItemProps) {
  useEffect(() => {
    trackBeginCheckout(value, { id: itemId, name: itemName, quantity, price: unitPrice });
  }, [itemId, itemName, quantity, unitPrice, value]);
  return null;
}

/** Commande payée (`/boutique/merci`) : conversion Analytics + Google Ads. */
export function PurchaseEvent({
  transactionId,
  itemId,
  itemName,
  quantity,
  unitPrice,
  value,
}: ItemProps & { transactionId: string }) {
  useEffect(() => {
    trackPurchase(transactionId, value, { id: itemId, name: itemName, quantity, price: unitPrice });
  }, [transactionId, itemId, itemName, quantity, unitPrice, value]);
  return null;
}
