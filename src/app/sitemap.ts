import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { GUIDES, CATEGORY_HUBS } from "@/lib/guides";

/**
 * Plan du site (sitemap.xml) - ne liste que les pages publiques indexables.
 * La page d’accueil canonique est la racine `/` (réécrite vers la boutique), on
 * ne liste donc pas `/boutique` en double. `/home` et `/vitrine` redirigent vers
 * `/` (308) : on ne les liste plus pour éviter la duplication. Les guides sont
 * générés depuis la source de contenu pour rester automatiquement à jour.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/guides"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/demo"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Pages hub par catégorie (ex. /guides/par-metier) : listées explicitement
  // pour être découvertes et indexées comme des pages à part entière.
  const hubs: MetadataRoute.Sitemap = CATEGORY_HUBS.map((h) => ({
    url: absoluteUrl(`/guides/${h.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const guides: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: absoluteUrl(`/guides/${g.slug}`),
    lastModified: g.dateModified ?? g.datePublished,
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
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...core, ...hubs, ...guides, ...legal];
}
