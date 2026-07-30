"use client";

import Link from "next/link";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// La clé publique Stripe est exposée côté client (publique par nature).
// `loadStripe` au niveau module = le SDK n'est chargé qu'une seule fois, et sa
// requête part dès l'hydratation (connexion préchauffée via les preconnect).
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey)
  : null;

/**
 * Monte le formulaire de paiement Stripe DIRECTEMENT dans la page (iframe
 * sécurisé par Stripe). Le `client_secret` est créé CÔTÉ SERVEUR et passé en
 * prop : aucun aller-retour client supplémentaire, le formulaire s'affiche plus
 * vite. Après paiement, Stripe redirige vers la `return_url` (page merci).
 */
export function CheckoutEmbed({ clientSecret }: { clientSecret: string | null }) {
  if (!stripePromise || !clientSecret) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="text-sm font-medium text-ink">
          Le paiement n&apos;est pas disponible pour le moment.
        </p>
        <p className="mt-1 text-sm text-muted">
          Merci de réessayer dans un instant.
        </p>
        <Link
          href="/boutique"
          className="mt-4 inline-flex text-sm font-medium text-brand hover:underline"
        >
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
