import { GUARANTEE, PRODUCT, PRODUCT_PATH, SITE } from "@/lib/brand";
import { PHOTO } from "@/lib/photos";
import { absoluteUrl } from "@/lib/seo";
import { standUnitCents } from "@/lib/shop";

/**
 * Flux produits Google Merchant Center (RSS 2.0 + espace de noms `g:`), à
 * déclarer dans Merchant Center comme « flux programmé » :
 * https://reviu.fr/google-shopping.xml (voir `docs/ADS-TRACKING.md`).
 *
 * Alimente les fiches gratuites de l'onglet Shopping et les annonces Shopping.
 * Tout vient des constantes du site (prix réellement facturé à l'unité, photos,
 * délais) : le flux reste aligné sur la fiche produit et son JSON-LD, ce que
 * Google vérifie (prix et disponibilité identiques sur la page d'arrivée).
 */
export const dynamic = "force-static";

function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const DESCRIPTION = [
  `Le ${PRODUCT.name} ouvre la page d'avis Google de votre commerce en un geste :`,
  "le client approche son téléphone (sans contact, comme pour payer) ou scanne le QR code, sans application à installer.",
  "À poser sur le comptoir, près de la caisse ou à l'accueil. Compatible iPhone et Android.",
  "Achat unique, sans abonnement : l'espace Reviu est inclus (statistiques de scans, gestion des présentoirs, lien modifiable à tout moment).",
  `Livraison offerte en France métropolitaine. ${GUARANTEE.label}.`,
].join(" ");

export function GET() {
  const price = (standUnitCents(1) / 100).toFixed(2);
  const item = [
    ["g:id", "reviu-presentoir"],
    ["g:title", `${PRODUCT.name} : présentoir avis Google sans contact et QR code`],
    ["g:description", DESCRIPTION],
    ["g:link", absoluteUrl(PRODUCT_PATH)],
    ["g:image_link", absoluteUrl(PHOTO.front)],
    ["g:additional_image_link", absoluteUrl(PHOTO.comptoir)],
    ["g:additional_image_link", absoluteUrl(PHOTO.angle)],
    ["g:availability", "in_stock"],
    ["g:price", `${price} EUR`],
    ["g:condition", "new"],
    ["g:brand", "Reviu"],
    ["g:identifier_exists", "no"],
    ["g:product_type", "Présentoirs > Présentoir avis Google"],
  ]
    .map(([tag, value]) => `      <${tag}>${xml(value)}</${tag}>`)
    .join("\n");

  // Livraison offerte ; délais alignés sur le checkout Stripe et le JSON-LD
  // (préparation 0 à 1 jour ouvré, transport 2 à 5 jours ouvrés).
  const shipping = `      <g:shipping>
        <g:country>FR</g:country>
        <g:price>0.00 EUR</g:price>
        <g:min_handling_time>0</g:min_handling_time>
        <g:max_handling_time>1</g:max_handling_time>
        <g:min_transit_time>2</g:min_transit_time>
        <g:max_transit_time>5</g:max_transit_time>
      </g:shipping>`;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xml(SITE.name)}</title>
    <link>${xml(absoluteUrl("/"))}</link>
    <description>${xml(SITE.tagline)}</description>
    <item>
${item}
${shipping}
    </item>
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
