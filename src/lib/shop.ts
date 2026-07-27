import crypto from "node:crypto";
import { SITE_URL } from "./brand";

/**
 * Catalogue de la boutique reviu (vente en ligne, paiement unique via Stripe).
 *
 * ── Où changer les prix ? ─────────────────────────────────────────────────
 * Ici, dans `CATALOG` (champ `priceCents`, en centimes d'euro). Chaque prix
 * peut aussi être surchargé par variable d'environnement (voir `SHOP_PRICE_*`)
 * sans toucher au code. C'est la SEULE source de vérité des tarifs boutique :
 * le montant réellement facturé par Stripe est construit à partir d'ici
 * (`price_data` en ligne), donc pas de produit Stripe à créer à la main.
 *
 * Les abonnements de suivi (2,99 €/mois par présentoir) restent gérés à part,
 * dans le dashboard et le parcours de scan (`stripe-actions.ts`).
 */

/** Type de produit → conditionne livraison, TVA, et accès formation. */
export type ShopProductKind = "physical" | "digital" | "bundle";

export type ShopProduct = {
  /** Identifiant stable (voyage dans les métadonnées Stripe). */
  id: "stand" | "formation" | "pack10" | "pack20";
  name: string;
  /** Accroche courte (affichée sous le titre + envoyée à Stripe). */
  tagline: string;
  priceCents: number;
  /** `physical` = livré · `digital` = accès en ligne · `bundle` = les deux. */
  kind: ShopProductKind;
  /** Débloque l'accès à la formation en ligne après paiement. */
  grantsFormation: boolean;
  /** Nombre de présentoirs inclus (0 pour la formation seule). */
  standsIncluded: number;
  /** Autoriser le client à ajuster la quantité au checkout. */
  adjustableQuantity: boolean;
  /** Points de valeur affichés sur la carte produit. */
  features: string[];
  /** Pastille optionnelle ("Le plus vendu", "Meilleure marge"…). */
  badge?: string;
  /** Prix unitaire indicatif par présentoir (packs), pour l'argumentaire. */
  perUnitLabel?: string;
};

function envCents(key: string, fallback: number): number {
  const raw = process.env[key];
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback;
}

export const CATALOG: ShopProduct[] = [
  {
    id: "stand",
    name: "Présentoir NFC + QR",
    tagline: "Le présentoir connecté, prêt à poser sur le comptoir.",
    priceCents: envCents("SHOP_PRICE_STAND", 2990),
    kind: "physical",
    grantsFormation: false,
    standsIncluded: 1,
    adjustableQuantity: true,
    features: [
      "NFC + QR déjà encodés, prêts à l'emploi",
      "Redirection modifiable à distance",
      "Achat unique, sans abonnement obligatoire",
    ],
  },
  {
    id: "formation",
    name: "Formation - Lance ton business d'avis Google",
    tagline:
      "La méthode complète pour produire, vendre et déployer des présentoirs d'avis Google.",
    priceCents: envCents("SHOP_PRICE_FORMATION", 4900),
    kind: "digital",
    grantsFormation: true,
    standsIncluded: 0,
    adjustableQuantity: false,
    features: [
      "Sourcing & production des présentoirs",
      "Argumentaire, tarifs et prospection locale",
      "Déploiement avec reviu : abonnements récurrents, pas de vente one-shot",
      "Accès en ligne immédiat, à vie",
    ],
    badge: "100 % en ligne",
  },
  {
    id: "pack10",
    name: "Pack Revendeur 10",
    tagline: "Formation + 10 présentoirs pour lancer ton activité dès le jour 1.",
    priceCents: envCents("SHOP_PRICE_PACK10", 19900),
    kind: "bundle",
    grantsFormation: true,
    standsIncluded: 10,
    adjustableQuantity: false,
    features: [
      "10 présentoirs NFC + QR livrés",
      "Formation complète incluse",
      "≈ 19,90 €/présentoir - marge à la revente à 29,90 €",
      "Chaque présentoir placé = un abonnement 2,99 €/mois",
    ],
    badge: "Le plus vendu",
    perUnitLabel: "≈ 19,90 € / présentoir",
  },
  {
    id: "pack20",
    name: "Pack Revendeur 20",
    tagline: "Formation + 20 présentoirs pour passer à l'échelle.",
    priceCents: envCents("SHOP_PRICE_PACK20", 34900),
    kind: "bundle",
    grantsFormation: true,
    standsIncluded: 20,
    adjustableQuantity: false,
    features: [
      "20 présentoirs NFC + QR livrés",
      "Formation complète incluse",
      "≈ 17,45 €/présentoir - meilleure marge du catalogue",
      "Idéal pour bâtir un portefeuille d'abonnements récurrents",
    ],
    badge: "Meilleure marge",
    perUnitLabel: "≈ 17,45 € / présentoir",
  },
];

export function getProduct(id: string): ShopProduct | undefined {
  return CATALOG.find((p) => p.id === id);
}

// ── Présentoir à l'unité : tarif dégressif public ───────────────────────────
// Le présentoir est le produit phare, vendu à l'unité avec une remise modérée
// à la quantité. La vraie marge revendeur (achat en gros à prix cassé) reste
// réservée aux revendeurs validés via la page /revendeur, pas au public.
// Source de vérité unique du prix payé : ces paliers (Stripe reçoit le montant
// calculé ici, `price_data` en ligne).
export const STAND_TIERS = [
  { min: 1, unitCents: 2990 },
  { min: 3, unitCents: 2700 },
  { min: 5, unitCents: 2500 },
] as const;

/** Quantité maximale à l'unité en public : au-delà, on oriente vers /revendeur. */
export const STAND_QTY_MAX = 20;

/** Borne une quantité de présentoirs dans [1, STAND_QTY_MAX]. */
export function clampStandQty(qty: number): number {
  const q = Math.trunc(qty);
  if (!Number.isFinite(q) || q < 1) return 1;
  return Math.min(q, STAND_QTY_MAX);
}

/** Prix unitaire (centimes) du présentoir pour une quantité donnée. */
export function standUnitCents(qty: number): number {
  const q = clampStandQty(qty);
  let unit: number = STAND_TIERS[0].unitCents;
  for (const t of STAND_TIERS) if (q >= t.min) unit = t.unitCents;
  return unit;
}

/** Total (centimes) pour une quantité de présentoirs, remise dégressive incluse. */
export function standTotalCents(qty: number): number {
  const q = clampStandQty(qty);
  return standUnitCents(q) * q;
}

// ── Livraison : offerte à partir d'un seuil, sinon frais forfaitaires ────────
/** Seuil (centimes) à partir duquel la livraison est offerte. */
export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
/** Frais de port forfaitaires (centimes) en dessous du seuil. */
export const SHIPPING_FEE_CENTS = 390;

/** Frais de port (centimes) pour un total de commande donné : 0 au-delà du seuil. */
export function shippingFeeCents(orderTotalCents: number): number {
  return orderTotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
    ? 0
    : SHIPPING_FEE_CENTS;
}

/** Formate des centimes d'euro en libellé français : 2990 → "29,90 €". */
export function formatEuros(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export function requiresShipping(p: ShopProduct): boolean {
  return p.kind === "physical" || p.kind === "bundle";
}

/** Pays de livraison autorisés au checkout (France métropolitaine + voisins FR). */
export const SHIPPING_COUNTRIES = ["FR", "MC", "BE", "LU"] as const;

// ── Accès formation (produit numérique) ────────────────────────────────────
// L'achat donne accès à une page protégée (`/formation`). Plutôt qu'une table
// en base, on émet un jeton signé (HMAC) lié à la session de paiement Stripe :
// impossible à falsifier, vérifiable sans état, valable à vie.
//
// Secret dédié `REVIU_SHOP_SECRET` recommandé ; à défaut on réutilise la clé
// service role (déjà présente en prod) pour fonctionner sans config supplémentaire.
const GRANT_SECRET =
  process.env.REVIU_SHOP_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function sign(sessionId: string): string {
  return crypto
    .createHmac("sha256", GRANT_SECRET)
    .update(`formation:${sessionId}`)
    .digest("base64url");
}

/** Jeton d'accès formation à partir d'un identifiant de session Stripe payée. */
export function formationGrantToken(sessionId: string): string {
  return `${sessionId}.${sign(sessionId)}`;
}

/** Vérifie un jeton d'accès formation (comparaison à temps constant). */
export function verifyFormationGrant(token: string | undefined | null): boolean {
  if (!token || !GRANT_SECRET) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const sessionId = token.slice(0, dot);
  const provided = token.slice(dot + 1);
  const expected = sign(sessionId);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Lien d'accès direct à la formation (mail de confirmation + page merci). */
export function formationAccessUrl(sessionId: string): string {
  return `${SITE_URL}/formation?token=${formationGrantToken(sessionId)}`;
}
