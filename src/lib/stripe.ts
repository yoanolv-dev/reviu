import Stripe from "stripe";

/**
 * Client Stripe côté serveur uniquement.
 *
 * La clé secrète (`STRIPE_SECRET_KEY`) et l'identifiant du tarif
 * (`STRIPE_PRICE_ID`, le prix récurrent 2,99 €/mois) sont pilotés par variables
 * d'environnement - jamais codés en dur. Si la clé n'est pas configurée, on
 * renvoie `null` pour dégrader proprement (les boutons afficheront une erreur
 * plutôt que de casser).
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

/** États d'abonnement acceptés par la contrainte de la table `subscriptions`. */
const ALLOWED_STATUS = new Set([
  "inactive",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
]);

/** Mappe un statut d'abonnement Stripe vers un statut stocké en base. */
export function mapStripeStatus(status: string): string {
  if (status === "canceled") return "canceled";
  return ALLOWED_STATUS.has(status) ? status : "inactive";
}

/**
 * Fin de période courante d'un abonnement, en ISO. Selon la version d'API, le
 * champ est porté par l'abonnement ou par sa première ligne : on lit les deux.
 */
export function periodEndIso(subscription: Stripe.Subscription): string | null {
  const top = (subscription as unknown as { current_period_end?: number })
    .current_period_end;
  const item = subscription.items?.data?.[0]?.current_period_end;
  const unix = top ?? item;
  return unix ? new Date(unix * 1000).toISOString() : null;
}

/** ID client Stripe, que `customer` soit une chaîne ou un objet développé. */
export function customerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string | null {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}
