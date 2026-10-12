import { CATEGORY_HUBS, GUIDES } from "@/lib/guides";
import {
  GUARANTEE,
  PRODUCT,
  PRODUCT_PATH,
  SHIPPING,
  SITE,
  STAND_PRICE,
} from "@/lib/brand";
import { BRAND_DESCRIPTION, absoluteUrl } from "@/lib/seo";
import { TOOLS, TOOLS_PATH } from "@/lib/tools";

/**
 * `llms.txt` (proposition llmstxt.org) : résumé Markdown du site pour les
 * agents et assistants IA qui le consultent. Google indique ne pas s'en servir
 * pour ses fonctionnalités IA ; le fichier ne remplace donc ni le sitemap ni les
 * données structurées. Il ne coûte rien à maintenir : tout est généré depuis
 * les sources du site (guides, outils, constantes de marque).
 */
export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${SITE.name}`,
    "",
    `> ${BRAND_DESCRIPTION}`,
    "",
    "reviu est une marque de NEVIFY, entreprise basée à Nîmes (France). Service indépendant de Google.",
    "",
    "## Produit",
    "",
    `- [${PRODUCT.name}](${absoluteUrl(PRODUCT_PATH)}) : présentoir avis Google pour comptoir, sans contact (puce NFC) et QR code. ${STAND_PRICE}, achat unique, sans abonnement. ${SHIPPING.label}, ${GUARANTEE.label.toLowerCase()}. Espace Reviu inclus : statistiques de scans, gestion des présentoirs, lien modifiable.`,
    `- [Commander](${absoluteUrl("/")}/#produits)`,
    `- [Démo](${absoluteUrl("/demo")})`,
    "",
    "## Outils gratuits",
    "",
    `- [Tous les outils](${absoluteUrl(TOOLS_PATH)})`,
    ...TOOLS.map((t) => `- [${t.name}](${absoluteUrl(t.path)}) : ${t.desc}`),
    "",
    "## Guides",
    "",
    ...CATEGORY_HUBS.map((h) => `- [${h.h1}](${absoluteUrl(`/guides/${h.slug}`)}) : ${h.description}`),
    ...GUIDES.map((g) => `- [${g.h1}](${absoluteUrl(`/guides/${g.slug}`)}) : ${g.description}`),
    "",
    "## Optional",
    "",
    `- [Programme revendeur](${absoluteUrl("/revendeur")})`,
    `- [Mentions légales](${absoluteUrl("/mentions-legales")})`,
    `- [Conditions générales de vente](${absoluteUrl("/cgv")})`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
