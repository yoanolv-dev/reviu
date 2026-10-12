import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { GUIDES, CATEGORY_HUBS, guidesInCategory } from "@/lib/guides";
import { PRODUCT_PATH } from "@/lib/brand";
import { TOOLS, TOOLS_PATH } from "@/lib/tools";

/**
 * Plan du site (sitemap.xml) - ne liste que les pages publiques indexables.
 * La page d’accueil canonique est la racine `/` (réécrite vers la boutique), on
 * ne liste donc pas `/boutique` en double. `/home` et `/vitrine` redirigent vers
 * `/` (301) : on ne les liste plus pour éviter la duplication. Guides et outils
 * sont générés depuis leur source pour rester automatiquement à jour.
 *
 * `lastModified` = date de la dernière vraie modification du contenu, jamais
 * la date du build : Google ignore les `lastmod` d'un site qui les met tous à
 * jour à chaque déploiement. Penser à avancer ces dates quand une page change
 * réellement (les guides et outils portent la leur dans leur source).
 */
const PAGE_UPDATED = {
  home: "2026-10-12",
  product: "2026-10-09",
  demo: "2026-09-28",
  revendeur: "2026-09-28",
  legal: "2026-09-28",
} as const;

/** Date la plus récente d'une liste de dates ISO. */
function latest(dates: string[]): string {
  return dates.reduce((a, b) => (b > a ? b : a));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const guideDate = (g: (typeof GUIDES)[number]) => g.dateModified ?? g.datePublished;
  const guidesUpdated = latest(GUIDES.map(guideDate));
  const toolsUpdated = latest(TOOLS.map((t) => t.updated));

  const core: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: PAGE_UPDATED.home, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(PRODUCT_PATH), lastModified: PAGE_UPDATED.product, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl(TOOLS_PATH), lastModified: toolsUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/guides"), lastModified: guidesUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/demo"), lastModified: PAGE_UPDATED.demo, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/revendeur"), lastModified: PAGE_UPDATED.revendeur, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Outils gratuits : pages à forte intention pratique, aimants à liens.
  const tools: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: absoluteUrl(t.path),
    lastModified: t.updated,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Pages hub par catégorie (ex. /guides/par-metier) : listées explicitement
  // pour être découvertes et indexées comme des pages à part entière.
  const hubs: MetadataRoute.Sitemap = CATEGORY_HUBS.map((h) => ({
    url: absoluteUrl(`/guides/${h.slug}`),
    lastModified: latest(guidesInCategory(h.category).map(guideDate)),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const guides: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: absoluteUrl(`/guides/${g.slug}`),
    lastModified: guideDate(g),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const legal: MetadataRoute.Sitemap = [
    "/mentions-legales",
    "/confidentialite",
    "/cgu",
    "/cgv",
    "/cookies",
    "/google-business-profile",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: PAGE_UPDATED.legal,
    changeFrequency: "yearly",
    priority: 0.2,
  }));

  return [...core, ...tools, ...hubs, ...guides, ...legal];
}
