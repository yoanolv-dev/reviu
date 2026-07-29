export const SITE = {
  name: "reviu",
  tagline: "Plus d'avis Google, directement depuis votre comptoir.",
  domain: "reviu.fr",
} as const;

/**
 * Nom commercial et descriptif du produit - à employer partout, sans varier
 * (pas de « plaque », « borne », « carte », « support », « hub »… dans le
 * discours commercial). « plaque NFC avis Google » reste réservé au SEO.
 */
export const PRODUCT = {
  name: "Présentoir Reviu",
  descriptive: "Présentoir NFC et QR code pour avis Google",
} as const;

/**
 * LEGACY - l'ancien « abonnement de suivi » 2,99 €/mois. Le repositionnement a
 * INTÉGRÉ ses fonctions (statistiques, gestion, modification du lien) à l'espace
 * Reviu inclus avec la plaque : il n'est plus proposé dans le parcours
 * commerçant. Cette constante n'est conservée que pour les canaux non encore
 * migrés (programme revendeur, formation, e-mails) - à retirer lors de leur
 * refonte. Ne pas réutiliser côté commerçant.
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
    "Modification du lien du présentoir à distance, à volonté",
    "Accompagnement humain : réglage, conseils et suivi, pas un simple logiciel",
  ],
} as const;

/** Prix du présentoir physique (achat unique via la boutique). */
export const STAND_PRICE = "29,90 €";

/**
 * Réassurances clés affichées sous le hero et dans le bandeau produit.
 * Cœur du positionnement : achat unique, sans frais supplémentaires,
 * compatible partout, installation rapide.
 */
export const REASSURANCE = [
  "Achat unique",
  "Sans frais supplémentaires",
  "Activation rapide",
  "Compatible iPhone et Android",
] as const;

/**
 * Espace Reviu INCLUS avec la plaque (aucun frais récurrent). Regroupe ce que
 * le client obtient sans surcoût après activation. Employé côté public et
 * tableau de bord pour un discours cohérent.
 */
export const INCLUDED_SPACE = {
  title: "Espace Reviu inclus",
  tagline: "Inclus avec votre plaque, sans frais supplémentaires.",
  features: [
    "Statistiques de scans, QR et NFC distingués",
    "Gestion de vos présentoirs",
    "Modification de votre lien de redirection à tout moment",
  ],
} as const;

/**
 * Reviu Pro - offre AVANCÉE À VENIR (non disponible, aucun achat pour l'instant).
 * Présentée comme optionnelle : la plaque reste complète sans elle. Le CTA se
 * limite à une inscription (liste d'attente), jamais un paiement.
 */
export const REVIU_PRO = {
  name: "Reviu Pro",
  status: "Bientôt disponible",
  intro:
    "Votre plaque et votre espace Reviu vous suffisent au quotidien. Pour aller plus loin, Reviu Pro arrivera bientôt, en option.",
  features: [
    "Connexion à Google Business Profile",
    "Centralisation de tous vos avis Google",
    "Réponses aux avis directement depuis Reviu",
    "Alertes à chaque nouvel avis",
    "Assistance IA pour préparer vos réponses",
    "Analyses et rapports avancés",
  ],
  cta: "Me prévenir au lancement",
  /** Sujet de l'e-mail de mise en relation (liste d'attente). */
  waitlistSubject: "Reviu Pro - me prevenir au lancement",
} as const;

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
 * Navigation principale, orientée vraies pages (meilleur maillage interne
 * sitewide pour le SEO). « Guides » ouvre un sous-menu vers les pages hub.
 * Les actions (Commander, Se connecter) sont gérées séparément dans l'en-tête.
 */
export type NavItem = {
  label: string;
  href: string;
  children?: readonly { label: string; href: string }[];
};

export const NAV: readonly NavItem[] = [
  { label: "Le présentoir", href: "/#produits" },
  {
    label: "Guides",
    href: "/guides",
    children: [
      { label: "Tous les guides", href: "/guides" },
      { label: "Par métier", href: "/guides/par-metier" },
      { label: "Gérer sa réputation", href: "/guides/gerer-sa-reputation" },
    ],
  },
  { label: "Démo", href: "/demo" },
];
