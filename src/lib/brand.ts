export const SITE = {
  name: "reviu",
  tagline: "Plus d'avis Google, sans effort.",
  domain: "reviu.fr",
} as const;

/** Abonnement de suivi (par présentoir). Sans engagement, résiliable à tout moment. */
export const SUBSCRIPTION = {
  priceLabel: "2,99 €",
  period: "mois",
  /** Accroche courte de l'offre de services. */
  pitch:
    "Bien plus qu'un présentoir : protégez votre réputation, prouvez vos résultats et gardez la main, avec un accompagnement humain.",
  perks: [
    "Retours privés : un client mécontent vous écrit en direct, avant de le faire en public",
    "Alerte e-mail à chaque nouveau retour privé, pour réagir tout de suite",
    "Récap hebdomadaire par e-mail : scans, clics et progression de votre présentoir",
    "Statistiques détaillées de scan et de clics dans votre tableau de bord",
    "Modification illimitée du lien du présentoir, à distance",
    "Accompagnement humain : réglage, conseils et suivi, pas un simple logiciel",
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
 * Boutique interne (vente des présentoirs, formation et packs revendeurs).
 * Sert de destination aux boutons « Commander » du site et du dashboard.
 * Surchargeable par variable d'environnement, mais par défaut = `/boutique`
 * sur le site vitrine.
 */
export const BOUTIQUE_URL =
  process.env.NEXT_PUBLIC_BOUTIQUE_URL ?? `${SITE_URL}/boutique`;

export const NAV = [
  { label: "Comment ça marche", href: "/home" },
  { label: "Tarifs", href: "/#produits" },
  { label: "Guides", href: "/guides" },
  { label: "Démo", href: "/demo" },
] as const;
