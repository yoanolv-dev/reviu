/**
 * Définition des offres reviu — source de vérité unique (prix, quotas, features).
 *
 * Volontairement sans dépendance ni variable d'environnement : ce module est
 * importable côté client comme côté serveur. Le mapping vers les prix Stripe
 * (facturation) vit dans le code serveur, pas ici.
 */

export type PlanId = "free" | "pro" | "business";

/** Quota illimité. */
export const UNLIMITED = -1;

export interface PlanQuotas {
  /** Nombre d'établissements autorisés. */
  establishments: number;
  /** Nombre de présentoirs actifs autorisés. */
  stands: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Prix mensuel en euros (0 = gratuit). */
  priceMonthly: number;
  /** Mis en avant sur la grille tarifaire. */
  featured: boolean;
  quotas: PlanQuotas;
  features: string[];
  cta: string;
}

export const PLANS: readonly Plan[] = [
  {
    id: "free",
    name: "Gratuit",
    tagline: "Pour démarrer et tester sur un comptoir.",
    priceMonthly: 0,
    featured: false,
    quotas: { establishments: 1, stands: 1 },
    features: [
      "1 établissement",
      "1 présentoir actif",
      "Page d'avis brandée",
      "Redirection Google tracée",
      "Retour privé (feedback)",
      "Analytics de base",
    ],
    cta: "Commencer gratuitement",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Pour un commerce qui veut accélérer.",
    priceMonthly: 19,
    featured: true,
    quotas: { establishments: 1, stands: 5 },
    features: [
      "Tout le plan Gratuit, plus :",
      "Jusqu'à 5 présentoirs actifs",
      "QR dynamique multi-canal (NFC + QR)",
      "Analytics complet (conversion, historique)",
      "Support prioritaire",
    ],
    cta: "Choisir Pro",
  },
  {
    id: "business",
    name: "Business",
    tagline: "Pour plusieurs établissements ou réseaux.",
    priceMonthly: 49,
    featured: false,
    quotas: { establishments: 3, stands: UNLIMITED },
    features: [
      "Tout le plan Pro, plus :",
      "Jusqu'à 3 établissements",
      "Présentoirs illimités",
      "Multi-plateforme (Instagram, menu)",
      "Marque blanche (à venir)",
      "Accompagnement dédié",
    ],
    cta: "Choisir Business",
  },
];

export const DEFAULT_PLAN_ID: PlanId = "free";

export const PLAN_BY_ID = Object.fromEntries(
  PLANS.map((p) => [p.id, p]),
) as Record<PlanId, Plan>;

/** Renvoie le plan correspondant, ou le plan par défaut si l'id est inconnu. */
export function getPlan(id: string | null | undefined): Plan {
  return PLAN_BY_ID[id as PlanId] ?? PLAN_BY_ID[DEFAULT_PLAN_ID];
}

/** Formate un quota pour affichage ("illimité" si non borné). */
export function formatQuota(n: number): string {
  return n === UNLIMITED ? "illimité" : String(n);
}

/** Vrai si un usage donné reste sous la limite (illimité = toujours vrai). */
export function isWithinQuota(used: number, limit: number): boolean {
  return limit === UNLIMITED || used < limit;
}
