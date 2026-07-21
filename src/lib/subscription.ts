/** Statuts d'abonnement possibles (miroir de la contrainte SQL sur subscriptions). */
export const SUBSCRIPTION_STATUSES = [
  "inactive",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

/**
 * Un présentoir débloque les fonctions premium (stats, édition à distance de la
 * redirection) si son abonnement est actif ou en essai — identique à la garde
 * SQL de `set_stand_target`.
 */
export function isEntitled(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}
