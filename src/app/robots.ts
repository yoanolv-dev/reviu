import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * robots.txt généré. On ouvre tout le site vitrine au crawl et on ferme
 * explicitement l'application (dashboard/admin), les points d'API, les parcours
 * de redirection NFC (`/r/…`) et les pages transactionnelles (paiement, accès
 * protégés) : rien d'utile à indexer, et on évite le contenu dupliqué.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/api/",
          "/r/",
          "/auth/",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/boutique/merci",
          "/formation",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
