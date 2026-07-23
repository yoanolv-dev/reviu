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
    "Suivi des statistiques de scan et de clics",
    "Modification illimitée des liens du présentoir",
    "Retours privés : un canal de contact direct avec vos clients",
  ],
} as const;

/** Prix du présentoir physique (achat unique via la boutique). */
export const STAND_PRICE = "29,90 €";

/** Mention d'indépendance vis-à-vis de Google (footer, mentions légales, page GBP). */
export const GOOGLE_DISCLAIMER =
  "Reviu est un service indépendant et n'est ni affilié, ni sponsorisé, ni approuvé par Google. Google et le logo Google sont des marques de Google LLC.";

/**
 * Bases d'URL pilotées par variables d'environnement.
 * Aucun domaine n'est codé en dur : on peut basculer .fr / .io sans toucher au code.
 */
export const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE ?? "https://app.reviu.fr";
export const REDIRECT_BASE =
  process.env.NEXT_PUBLIC_REDIRECT_BASE ?? "https://r.reviu.fr";
/** Site vitrine public (landing + pages légales). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reviu.fr";

/** Adresse de contact affichée sur le site et les pages légales. */
export const CONTACT_EMAIL = "contact@reviu.fr";

/** Adresse recevant les notifications internes (nouvelles inscriptions…). */
export const ADMIN_NOTIFY_EMAIL = "yoan.oliveira30@gmail.com";

/**
 * Page produit Shopify pour l'achat d'un présentoir. Pilotée par variable
 * d'environnement : modifiable sans toucher au code (voir docs/HANDOFF.md).
 */
export const SHOPIFY_PRODUCT_URL =
  process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_URL ?? "https://reviu.fr/boutique";

export const NAV = [
  { label: "Fonctionnement", href: "/home#fonctionnement" },
  { label: "Avantages", href: "/home#avantages" },
  { label: "Démo", href: "/demo" },
] as const;
