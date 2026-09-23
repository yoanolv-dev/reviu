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

/** Prix du présentoir physique (achat unique via la boutique). */
export const STAND_PRICE = "29,90 €";

/**
 * Réassurances clés affichées sous le hero, près du bouton d'achat et dans le
 * bandeau. Cœur du positionnement : achat unique, livraison offerte, garantie
 * satisfait ou remboursé, compatible partout.
 */
export const REASSURANCE = [
  "Livraison offerte",
  "Satisfait ou remboursé 30 jours",
  "Sans abonnement",
  "iPhone et Android",
] as const;

/**
 * Garantie commerciale « satisfait ou remboursé » (en plus du droit de
 * rétractation légal de 14 jours). Reprise dans la FAQ, les CGV et le schéma
 * Product (`hasMerchantReturnPolicy`) : garder ces textes cohérents.
 */
export const GUARANTEE = {
  days: 30,
  label: "Satisfait ou remboursé 30 jours",
  short: "Satisfait ou remboursé",
  detail:
    "Essayez le présentoir pendant 30 jours. S'il ne vous convient pas, renvoyez-le : on vous rembourse le prix du présentoir, sans justification.",
} as const;

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
 * Libellés de livraison (affichage). La livraison est OFFERTE dès le premier
 * présentoir : la logique chiffrée reste dans `src/lib/shop.ts`
 * (`shippingFeeCents`, toujours 0) et doit rester cohérente avec ces libellés.
 */
export const SHIPPING = {
  label: "Livraison offerte",
  delay: "3 à 5 jours ouvrés",
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

/**
 * Téléphone de contact affiché sur le site (header, footer, pages clés), au
 * format international sans espaces, ex. "+33612345678". Vide = masqué partout.
 * Surchargeable par `NEXT_PUBLIC_CONTACT_PHONE`. `PHONE_HAS_WHATSAPP` ajoute un
 * lien WhatsApp vers le même numéro.
 */
const PHONE_NUMBER = "";
const PHONE_HAS_WHATSAPP = false;

const PHONE_E164 = process.env.NEXT_PUBLIC_CONTACT_PHONE || PHONE_NUMBER;

/** Formate "+33612345678" en "06 12 34 56 78" (repli : valeur brute). */
function formatFrPhone(e164: string): string {
  const m = e164.replace(/\s+/g, "").match(/^\+33(\d{9})$/);
  if (!m) return e164;
  return ("0" + m[1]).replace(/(\d{2})(?=\d)/g, "$1 ");
}

export const CONTACT_PHONE = PHONE_E164
  ? {
      display: formatFrPhone(PHONE_E164),
      href: `tel:${PHONE_E164.replace(/\s+/g, "")}`,
      whatsapp: PHONE_HAS_WHATSAPP
        ? `https://wa.me/${PHONE_E164.replace(/[^\d]/g, "")}`
        : null,
    }
  : null;

/** Adresse recevant les notifications internes (nouvelles inscriptions…). */
export const ADMIN_NOTIFY_EMAIL = "yoan.oliveira30@gmail.com";

/**
 * Fiche produit + module d'achat (section `#produits` de l'accueil). Sert de
 * destination aux boutons « Commander » du site et du dashboard. `/boutique`
 * redirige (301) vers la racine sur le domaine vitrine : on pointe donc
 * directement la racine pour éviter un saut de redirection.
 */
export const BOUTIQUE_URL =
  process.env.NEXT_PUBLIC_BOUTIQUE_URL ?? `${SITE_URL}/#produits`;

/**
 * Navigation principale, orientée vraies pages (meilleur maillage interne
 * sitewide pour le SEO). « Ressources » ouvre un méga-menu (guides, outil
 * gratuit, démo). Les actions (Commander, Se connecter) sont gérées à part.
 */
export type NavChild = {
  label: string;
  href: string;
  /** Sous-titre court affiché dans le méga-menu desktop. */
  desc?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: readonly NavChild[];
  /** Mise en avant (carte) dans le méga-menu desktop. */
  featured?: NavChild & { badge: string };
};

export const QR_TOOL_PATH = "/outils/qr-code-avis-google";

export const NAV: readonly NavItem[] = [
  { label: "Le présentoir", href: "/#produits" },
  { label: "Comment ça marche", href: "/#fonctionnement" },
  {
    label: "Ressources",
    href: "/guides",
    children: [
      {
        label: "Tous les guides",
        href: "/guides",
        desc: "Méthodes concrètes pour collecter plus d'avis",
      },
      {
        label: "Guides par métier",
        href: "/guides/par-metier",
        desc: "Restaurant, coiffeur, garage, hôtel…",
      },
      {
        label: "Gérer sa réputation",
        href: "/guides/gerer-sa-reputation",
        desc: "Répondre aux avis, avis négatifs, note Google",
      },
      {
        label: "Démo du présentoir",
        href: "/demo",
        desc: "Le parcours client et l'espace Reviu en images",
      },
    ],
    featured: {
      label: "Générateur de QR code avis Google",
      href: QR_TOOL_PATH,
      desc: "Créez gratuitement le QR code de votre page d'avis, prêt à imprimer.",
      badge: "Gratuit",
    },
  },
  { label: "Revendeur", href: "/revendeur" },
];
