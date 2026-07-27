export const SITE = {
  name: "reviu",
  tagline: "Plus d'avis Google, directement depuis votre comptoir.",
  domain: "reviu.fr",
} as const;

/**
 * Nom commercial et descriptif du produit — à employer partout, sans varier
 * (pas de « plaque », « borne », « carte », « support », « hub »… dans le
 * discours commercial). « plaque NFC avis Google » reste réservé au SEO.
 */
export const PRODUCT = {
  name: "Présentoir Reviu",
  descriptive: "Présentoir NFC et QR code pour avis Google",
} as const;

/**
 * Abonnement de suivi (par présentoir). Sans engagement, résiliable à tout
 * moment. IMPORTANT : c'est une amélioration FACULTATIVE, commercialisée
 * APRÈS l'achat (dashboard + e-mailing). Le prix mensuel ne doit pas apparaître
 * dans le tunnel d'achat du présentoir ni concurrencer le bouton « Commander ».
 * Les libellés ci-dessous restent utilisés côté espace client / e-mails.
 */
export const SUBSCRIPTION = {
  priceLabel: "2,99 €",
  period: "mois",
  /** Accroche courte de l'offre de services (espace client, e-mails). */
  pitch:
    "Après activation, un espace de pilotage facultatif vous aide à suivre vos statistiques, recueillir des retours privés et gérer vos présentoirs.",
  perks: [
    "Retours privés : un client peut aussi vous contacter en direct",
    "Alerte e-mail à chaque nouveau retour privé, pour réagir tout de suite",
    "Récap hebdomadaire par e-mail : scans, clics et progression de votre présentoir",
    "Statistiques détaillées de scan et de clics dans votre tableau de bord",
    "Historique et rapports d'activité de votre présentoir",
    "Accompagnement humain : réglage, conseils et suivi, pas un simple logiciel",
  ],
} as const;

/** Prix du présentoir physique (achat unique via la boutique). */
export const STAND_PRICE = "29,90 €";

/**
 * Réassurances clés affichées sous le hero et dans le bandeau produit.
 * Le cœur du positionnement : achat unique, sans abonnement obligatoire,
 * compatible partout, installation rapide.
 */
export const REASSURANCE = [
  "Achat unique",
  "Sans abonnement obligatoire",
  "Activation rapide",
  "Compatible iPhone et Android",
] as const;

/**
 * Libellés de livraison (affichage). La logique chiffrée (seuil, frais) reste
 * dans `src/lib/shop.ts` : `FREE_SHIPPING_THRESHOLD_CENTS`, `SHIPPING_FEE_CENTS`.
 * Ces deux constantes doivent rester cohérentes avec les libellés ci-dessous.
 */
export const SHIPPING = {
  freeFromLabel: "50 €",
  feeLabel: "3,90 €",
} as const;

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

/**
 * Navigation courte et orientée conversion. Les trois actions (Commander,
 * Activer, Se connecter) sont gérées séparément dans l'en-tête, pas ici.
 */
export const NAV = [
  { label: "Le présentoir", href: "/#produits" },
  { label: "Comment ça marche", href: "/#fonctionnement" },
  { label: "Questions fréquentes", href: "/#faq" },
  { label: "Guides", href: "/guides" },
] as const;
