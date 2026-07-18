import Stripe from "stripe";

let client: Stripe | null = null;

/** Client Stripe (serveur only). Lève une erreur si la clé n'est pas configurée. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant.");
  if (!client) client = new Stripe(key);
  return client;
}

/** Prix Stripe (récurrent, 2,99 €/mois) du suivi d'un présentoir. */
export function monitoringPriceId(): string {
  const id = process.env.STRIPE_PRICE_MONITORING;
  if (!id) throw new Error("STRIPE_PRICE_MONITORING manquant.");
  return id;
}

/** Vrai si Stripe est suffisamment configuré pour lancer un paiement. */
export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_MONITORING,
  );
}

/** Base d'URL de l'app (pour les retours Checkout / portail). */
export function appBase(): string {
  return process.env.NEXT_PUBLIC_APP_BASE ?? "http://localhost:3000";
}

/** Fin de période courante, robuste aux évolutions de l'API Stripe (top-level ou item). */
export function subscriptionPeriodEnd(sub: Stripe.Subscription): string | null {
  const top = sub as unknown as { current_period_end?: number };
  const item = sub.items?.data?.[0] as unknown as
    | { current_period_end?: number }
    | undefined;
  const ts = top.current_period_end ?? item?.current_period_end;
  return ts ? new Date(ts * 1000).toISOString() : null;
}
