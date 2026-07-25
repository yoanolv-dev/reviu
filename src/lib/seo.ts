import type { Metadata } from "next";
import { SITE_URL, SITE, CONTACT_EMAIL, SUBSCRIPTION, STAND_PRICE } from "@/lib/brand";

/**
 * Boîte à outils SEO / GEO du site vitrine.
 *
 * Pourquoi ce fichier ? Next.js (App Router, Server Components) rend déjà tout
 * le HTML côté serveur : le contenu est parfaitement lisible par Google et par
 * les moteurs génératifs (ChatGPT, Perplexity, Gemini…). Ce qui manquait, ce
 * n'est pas le rendu, ce sont les **signaux** : métadonnées riches, Open Graph,
 * et surtout les **données structurées (JSON-LD)** qui décrivent explicitement
 * l'entreprise, le produit et le contenu. C'est ce que ce module centralise,
 * pour que chaque page parle le même langage aux moteurs.
 */

/** URL absolue et canonique à partir d'un chemin (`/guides`, `/boutique`…). */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  if (path === "/" || path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Description « maison » réutilisée par défaut (Organization, OG…). */
export const BRAND_DESCRIPTION =
  "reviu équipe les commerces de proximité de présentoirs NFC et QR codes dynamiques pour collecter plus d'avis Google, en un seul geste et en toute conformité avec les règles de Google.";

type BuildMeta = {
  /** Titre complet de la page (déjà « brandé », ex. « … · reviu »). */
  title: string;
  description: string;
  /** Chemin canonique, ex. `/guides/avoir-plus-avis-google`. */
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  /** `false` pour désindexer (pages utilitaires). Défaut : indexable. */
  index?: boolean;
  /** Dates ISO pour les articles (og:article). */
  publishedTime?: string;
  modifiedTime?: string;
};

/**
 * Fabrique une `Metadata` Next cohérente : canonical absolu, Open Graph et
 * Twitter Card renseignés. Les images OG sont injectées automatiquement par la
 * convention de fichier `opengraph-image.tsx` (racine `app/`), donc inutile de
 * les répéter ici.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  index = true,
  publishedTime,
  modifiedTime,
}: BuildMeta): Metadata {
  const url = absoluteUrl(path);
  // Image OG de marque servie par la route `opengraph-image`. On la référence
  // explicitement : dès qu'une page définit son propre bloc `openGraph`, Next
  // n'injecte plus automatiquement l'image issue de la convention de fichier.
  const ogImage = absoluteUrl("/opengraph-image");
  return {
    title,
    description,
    ...(keywords && keywords.length ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: "fr_FR",
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === "article" && (publishedTime || modifiedTime)
        ? { publishedTime, modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: index
      ? { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
      : { index: false, follow: false },
  };
}

// ── Données structurées (JSON-LD) ────────────────────────────────────────────
// Des objets simples, sérialisés en <script type="application/ld+json"> via le
// composant <JsonLd>. On référence les entités par @id pour éviter de dupliquer
// l'Organization d'une page à l'autre (un graphe cohérent pour toute la marque).

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    legalName: "NEVIFY",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.svg"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/logo.svg"),
    email: CONTACT_EMAIL,
    slogan: SITE.tagline,
    description: BRAND_DESCRIPTION,
    areaServed: { "@type": "Country", name: "France" },
    knowsLanguage: "fr-FR",
    contactPoint: {
      "@type": "ContactPoint",
      email: CONTACT_EMAIL,
      contactType: "customer support",
      areaServed: "FR",
      availableLanguage: ["French"],
    },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE.name,
    inLanguage: "fr-FR",
    publisher: { "@id": ORG_ID },
  };
}

/** Le SaaS lui-même, décrit comme application (utile pour « logiciel avis Google »). */
export function softwareApplicationSchema() {
  return {
    "@type": "SoftwareApplication",
    name: `${SITE.name} - collecte d'avis Google`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    url: SITE_URL,
    description: BRAND_DESCRIPTION,
    inLanguage: "fr-FR",
    provider: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      price: SUBSCRIPTION.priceLabel.replace(/[^\d,]/g, "").replace(",", "."),
      priceCurrency: "EUR",
      description: `Abonnement de suivi ${SUBSCRIPTION.priceLabel}/${SUBSCRIPTION.period} par présentoir, sans engagement.`,
    },
  };
}

type ProductInput = {
  name: string;
  description: string;
  priceCents: number;
  path: string;
  image?: string;
  sku?: string;
};

export function productSchema(p: ProductInput) {
  return {
    "@type": "Product",
    name: p.name,
    description: p.description,
    brand: { "@type": "Brand", name: SITE.name },
    ...(p.sku ? { sku: p.sku } : {}),
    ...(p.image ? { image: absoluteUrl(p.image) } : { image: absoluteUrl("/logo.svg") }),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(p.path),
      priceCurrency: "EUR",
      price: (p.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      areaServed: { "@type": "Country", name: "France" },
      seller: { "@id": ORG_ID },
      // Livraison : le checkout ne facture aucun frais de port → livraison
      // gratuite en France métropolitaine (véridique, cf. stripe-actions.ts).
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "FR",
        },
      },
      // Retours : droit de rétractation légal de 14 jours (vente à distance,
      // droit français) ; les frais de retour restent à la charge du client.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "FR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

type ArticleInput = {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
};

export function articleSchema(a: ArticleInput) {
  return {
    "@type": "Article",
    headline: a.title,
    description: a.description,
    inLanguage: "fr-FR",
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(a.path) },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    image: absoluteUrl(a.image ?? "/logo.svg"),
    ...(a.keywords && a.keywords.length ? { keywords: a.keywords.join(", ") } : {}),
  };
}

/**
 * Regroupe plusieurs schémas dans un unique graphe `@context`. On passe le
 * résultat à <JsonLd>. Ça évite de multiplier les balises <script> et ça relie
 * proprement les entités entre elles.
 */
export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

/** Petites constantes de discours réutilisées dans le contenu. */
export const SELLING_POINTS = {
  standPrice: STAND_PRICE,
  subPrice: `${SUBSCRIPTION.priceLabel}/${SUBSCRIPTION.period}`,
} as const;
