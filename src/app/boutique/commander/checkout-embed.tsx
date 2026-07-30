"use client";

import { useCallback } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// La clé publique Stripe est exposée côté client (elle est publique par nature).
// `loadStripe` est appelé au niveau module pour ne charger le SDK qu'une fois.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey)
  : null;

/**
 * Monte le formulaire de paiement Stripe DIRECTEMENT dans la page (iframe
 * sécurisé par Stripe), sans redirection. Le `client_secret` est récupéré depuis
 * notre endpoint `/api/stripe/checkout-session`, qui recalcule le prix serveur.
 * Après paiement, Stripe redirige vers la `return_url` (page merci).
 */
export function CheckoutEmbed({
  product,
  quantity,
}: {
  product: string;
  quantity: number;
}) {
  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/stripe/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, quantity }),
    });
    if (!res.ok) throw new Error("Impossible de démarrer le paiement.");
    const data = (await res.json()) as { client_secret?: string };
    if (!data.client_secret) throw new Error("Réponse de paiement invalide.");
    return data.client_secret;
  }, [product, quantity]);

  if (!stripePromise) {
    return (
      <p className="text-sm text-red-600">
        Le paiement n&apos;est pas disponible pour le moment.
      </p>
    );
  }

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
