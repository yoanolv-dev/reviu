/**
 * Configuration de la mesure d'audience et des conversions publicitaires.
 * Module partagé serveur / navigateur (aucune dépendance Node).
 *
 * Tout est piloté par variables d'environnement PUBLIQUES (injectées au build,
 * donc redéployer après modification) :
 * - `NEXT_PUBLIC_GA_MEASUREMENT_ID`          Google Analytics 4, ex. « G-ABC123 » ;
 * - `NEXT_PUBLIC_GOOGLE_ADS_ID`              Google Ads, ex. « AW-123456789 » ;
 * - `NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL`  libellé de la conversion « Achat ».
 *
 * Sans aucune de ces variables : pas de bandeau cookies, aucun script tiers,
 * aucune donnée d'attribution. Mode d'emploi complet : `docs/ADS-TRACKING.md`.
 */

function publicId(raw: string | undefined, pattern: RegExp): string | null {
  const v = raw?.trim();
  return v && pattern.test(v) ? v : null;
}

export const GA_MEASUREMENT_ID = publicId(
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  /^G-[A-Z0-9]+$/,
);
export const GOOGLE_ADS_ID = publicId(
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  /^AW-\d+$/,
);
export const GOOGLE_ADS_PURCHASE_LABEL = publicId(
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL,
  /^[\w-]+$/,
);

/** Au moins un outil configuré : le bandeau de consentement est nécessaire. */
export const TRACKING_ENABLED = Boolean(GA_MEASUREMENT_ID || GOOGLE_ADS_ID);

/**
 * Durée de validité d'un choix (accepter comme refuser) : 6 mois, durée
 * recommandée par la CNIL avant de redemander.
 */
export const CONSENT_MAX_AGE_DAYS = 182;

// ── Attribution des ventes (source de la visite → métadonnées Stripe) ───────
// Cookie first-party posé UNIQUEMENT après consentement (voir `tracking.ts`),
// lu côté serveur à la création de la session de paiement. On ne garde que la
// dernière provenance connue (dernier clic non direct), 30 jours.

export const ATTRIBUTION_COOKIE = "reviu_attr";
export const ATTRIBUTION_MAX_AGE_DAYS = 30;

/** Paramètres de campagne : conservés avec le consentement « mesure d'audience ». */
export const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Identifiants de clic publicitaires : conservés avec le consentement « publicité ». */
export const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid"] as const;

/** Contexte de la visite : page d'arrivée et site d'origine (nom de domaine seul). */
export const CONTEXT_KEYS = ["landing_page", "referrer"] as const;

export const ATTRIBUTION_KEYS = [
  ...CAMPAIGN_KEYS,
  ...CLICK_ID_KEYS,
  ...CONTEXT_KEYS,
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

/** Longueur max d'une valeur (limite Stripe : 500 caractères par valeur). */
const MAX_VALUE_LENGTH = 150;

/**
 * Ne garde que les clés connues, des chaînes nettoyées (caractères de
 * contrôle retirés, longueur bornée). Appliqué à la capture ET à la relecture
 * serveur : le cookie vient du navigateur, il n'est jamais considéré fiable.
 */
export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== "object") return {};
  const src = input as Record<string, unknown>;
  const out: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const raw = src[key];
    if (typeof raw !== "string") continue;
    const value = raw.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, MAX_VALUE_LENGTH);
    if (value) out[key] = value;
  }
  return out;
}
