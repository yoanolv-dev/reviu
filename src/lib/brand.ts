export const SITE = {
  name: "reviu",
  tagline: "Plus d'avis Google, sans effort.",
  domain: "reviu.fr",
} as const;

/** Abonnement de suivi (par présentoir). Sans engagement, résiliable à tout moment. */
export const SUBSCRIPTION = {
  priceLabel: "2,99 €",
  period: "mois",
  perks: [
    "Suivi des statistiques de scan",
    "Modification illimitée des liens du présentoir",
    "Retours privés des clients insatisfaits",
  ],
} as const;

/**
 * Bases d'URL pilotées par variables d'environnement.
 * Aucun domaine n'est codé en dur : on peut basculer .fr / .io sans toucher au code.
 */
export const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE ?? "https://app.reviu.fr";
export const REDIRECT_BASE =
  process.env.NEXT_PUBLIC_REDIRECT_BASE ?? "https://r.reviu.fr";

/**
 * Page produit Shopify pour l'achat d'un présentoir. Pilotée par variable
 * d'environnement : modifiable sans toucher au code (voir docs/HANDOFF.md).
 */
export const SHOPIFY_PRODUCT_URL =
  process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_URL ?? "https://reviu.fr/boutique";

export const NAV = [
  { label: "Fonctionnement", href: "#fonctionnement" },
  { label: "Avantages", href: "#avantages" },
  { label: "Conformité", href: "#conformite" },
] as const;
