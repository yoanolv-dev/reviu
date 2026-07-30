"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  CheckoutElementsProvider,
  useCheckoutElements,
  PaymentElement,
  ShippingAddressElement,
  ContactDetailsElement,
} from "@stripe/react-stripe-js/checkout";
import { buttonClass } from "@/components/ui/button";

// Clé publique Stripe (publique par nature). `loadStripe` au niveau module = SDK
// chargé une seule fois, requête déclenchée dès l'hydratation.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey)
  : null;

// Accordéon compact : la 1re méthode (carte) est prête, les autres se replient
// en une seule ligne chacune. C'est ce qui raccourcit nettement le formulaire
// par rapport à l'Embedded Checkout tout déplié.
const PAYMENT_LAYOUT = {
  type: "accordion" as const,
  defaultCollapsed: false,
  radios: "if_multiple" as const,
  spacedAccordionItems: false,
};

// Apparence alignée sur la marque (cobalt), sans imposer de thème sombre/clair.
const APPEARANCE = {
  variables: {
    colorPrimary: "#1b4dff",
    borderRadius: "12px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
};

/**
 * Formulaire de paiement compact monté DIRECTEMENT dans la page (champs hébergés
 * par Stripe, PCI inchangé). Le `client_secret` est créé côté serveur. On
 * compose nous-mêmes les blocs (coordonnées, livraison, paiement) pour maîtriser
 * la mise en page et la longueur.
 */
export function PaymentForm({ clientSecret }: { clientSecret: string | null }) {
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
    <CheckoutElementsProvider
      stripe={stripePromise}
      options={{ clientSecret, elementsOptions: { appearance: APPEARANCE } }}
    >
      <Inner />
    </CheckoutElementsProvider>
  );
}

function Inner() {
  const result = useCheckoutElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (result.type === "loading") return <FieldsSkeleton />;
  if (result.type === "error") {
    return <p className="text-sm text-red-600">{result.error.message}</p>;
  }

  const checkout = result.checkout;

  async function pay() {
    setSubmitting(true);
    setError(null);
    // URL de retour concrète (avec l'id de session) pour les paiements à
    // redirection (3-D Secure) ; sinon on redirige nous-mêmes après succès.
    const returnUrl = `${window.location.origin}/boutique/merci?session_id=${checkout.id}`;
    const res = await checkout.confirm({ returnUrl, redirect: "if_required" });
    if (res.type === "error") {
      setError(res.error.message);
      setSubmitting(false);
      return;
    }
    router.push(`/boutique/merci?session_id=${res.session.id}`);
  }

  return (
    <div className="flex flex-col gap-5">
      <Field label="Coordonnées">
        <ContactDetailsElement />
      </Field>
      <Field label="Adresse de livraison">
        <ShippingAddressElement options={{ display: { name: "full" } }} />
      </Field>
      <Field label="Moyen de paiement">
        <PaymentElement options={{ layout: PAYMENT_LAYOUT }} />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={pay}
        disabled={submitting || !checkout.canConfirm}
        className={buttonClass("gradient", "lg", "w-full")}
      >
        {submitting
          ? "Paiement en cours…"
          : `Payer ${checkout.total.total.amount}`}
      </button>
      <p className="text-center text-xs text-muted">
        Paiement sécurisé par Stripe. Vos données de carte ne transitent jamais
        par nos serveurs.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      {children}
    </div>
  );
}

function FieldsSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-11 w-full animate-pulse rounded-xl bg-line-soft" />
      <div className="h-11 w-full animate-pulse rounded-xl bg-line-soft" />
      <div className="h-24 w-full animate-pulse rounded-xl bg-line-soft" />
      <div className="mt-1 h-12 w-full animate-pulse rounded-full bg-line" />
    </div>
  );
}
