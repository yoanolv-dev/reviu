/**
 * Mesure d'audience, conversions publicitaires et attribution des ventes, côté
 * navigateur. À n'appeler que depuis des composants client.
 *
 * Principe (conforme aux recommandations CNIL) :
 * - AUCUN script Google ni cookie de mesure avant un choix explicite ;
 * - le choix (accepter, refuser ou personnaliser) est gardé 6 mois ;
 * - les balises Google (gtag.js) ne sont chargées qu'après consentement, avec
 *   le mode consentement v2 renseigné selon le choix ;
 * - retirer un consentement recharge la page : plus aucune balise n'est active.
 *
 * Les événements envoyés avant le choix (ex. achat affiché sur la page merci
 * pendant que le bandeau est ouvert) sont mis en attente, puis envoyés ou
 * abandonnés selon la réponse.
 */
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_DAYS,
  CAMPAIGN_KEYS,
  CLICK_ID_KEYS,
  CONSENT_MAX_AGE_DAYS,
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  GOOGLE_ADS_PURCHASE_LABEL,
  TRACKING_ENABLED,
  sanitizeAttribution,
  type Attribution,
} from "./tracking-config";
import { SITE } from "./brand";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export type ConsentChoice = { analytics: boolean; ads: boolean };
type StoredConsent = ConsentChoice & { v: 1; at: number };

const CONSENT_KEY = "reviu-consent";
const CHANGE_EVENT = "reviu:consent-change";
const OPEN_EVENT = "reviu:consent-open";
const DAY_MS = 86_400_000;

// ── Choix de l'utilisateur ────────────────────────────────────────────────

/** `undefined` = pas encore lu ; `null` = aucun choix valide. */
let stored: StoredConsent | null | undefined;

function readStored(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<StoredConsent>;
    if (c.v !== 1 || typeof c.at !== "number") return null;
    if (Date.now() - c.at > CONSENT_MAX_AGE_DAYS * DAY_MS) return null;
    return { v: 1, at: c.at, analytics: c.analytics === true, ads: c.ads === true };
  } catch {
    return null;
  }
}

/** Choix en cours (référence stable, compatible `useSyncExternalStore`). */
export function getConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  if (stored === undefined) stored = readStored();
  return stored;
}

export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/** Enregistre un choix et l'applique immédiatement. */
export function saveConsent(choice: ConsentChoice): void {
  const previous = getConsent();
  stored = { v: 1, at: Date.now(), analytics: choice.analytics, ads: choice.ads };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
  } catch {
    // Stockage indisponible (navigation privée stricte) : choix gardé en mémoire
    // pour cette page, le bandeau réapparaîtra à la prochaine visite.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));

  // Retrait d'un consentement alors que les balises tournent : on recharge
  // pour repartir sans aucune balise active (gtag.js ne se décharge pas).
  const withdrawn =
    (previous?.analytics && !choice.analytics) || (previous?.ads && !choice.ads);
  if (withdrawn && tagsLoaded) {
    clearTrackingCookies(choice);
    window.location.reload();
    return;
  }
  applyConsent(choice);
}

/** Rouvre le bandeau (lien « Gérer les cookies » du pied de page). */
export function openConsentSettings(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentSettingsOpen(cb: () => void): () => void {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}

// ── Balises Google (gtag.js) ──────────────────────────────────────────────

let initialized = false;
let decided = false;
let granted: ConsentChoice = { analytics: false, ads: false };
let tagsLoaded = false;
const configured = { ga: false, ads: false };
const pending: ((g: ConsentChoice) => void)[] = [];

/**
 * gtag.js n'accepte que l'objet `arguments` (pas un tableau) : c'est la forme
 * officielle de l'extrait Google, reprise telle quelle.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]): void {
  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

function consentState(c: ConsentChoice) {
  const ads = c.ads ? "granted" : "denied";
  return {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  };
}

function applyConsent(choice: ConsentChoice): void {
  decided = true;
  granted = choice;
  const wantGa = choice.analytics && GA_MEASUREMENT_ID !== null;
  const wantAds = choice.ads && GOOGLE_ADS_ID !== null;

  if (wantGa || wantAds) {
    if (!tagsLoaded) {
      gtag("consent", "default", consentState(choice));
      gtag("js", new Date());
    } else {
      gtag("consent", "update", consentState(choice));
    }
    if (wantGa && !configured.ga) {
      // Cookies Analytics limités à 13 mois (recommandation CNIL ; 2 ans par défaut).
      gtag("config", GA_MEASUREMENT_ID, { cookie_expires: 395 * 86_400 });
      configured.ga = true;
    }
    if (wantAds && !configured.ads) {
      gtag("config", GOOGLE_ADS_ID);
      configured.ads = true;
    }
    if (!tagsLoaded) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        (wantGa ? GA_MEASUREMENT_ID : GOOGLE_ADS_ID) as string,
      )}`;
      document.head.appendChild(s);
      tagsLoaded = true;
    }
  } else {
    clearTrackingCookies(choice);
  }

  persistAttribution(choice);
  for (const job of pending.splice(0)) job(choice);
}

/**
 * Applique le choix déjà enregistré (visite suivante). Idempotent : appelé par
 * le bandeau au montage et par chaque envoi d'événement.
 */
export function initTracking(): void {
  if (initialized || typeof window === "undefined" || !TRACKING_ENABLED) return;
  initialized = true;
  snapshotLanding();
  const c = getConsent();
  if (c) applyConsent(c);
}

/** Exécute `job` dès que le choix est connu (tout de suite s'il l'est déjà). */
function whenDecided(job: (g: ConsentChoice) => void): void {
  if (!TRACKING_ENABLED || typeof window === "undefined") return;
  initTracking();
  if (decided) job(granted);
  else pending.push(job);
}

// ── Événements ────────────────────────────────────────────────────────────

/** Événement Google Analytics (ignoré sans consentement « mesure d'audience »). */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  whenDecided((g) => {
    if (g.analytics && GA_MEASUREMENT_ID) {
      gtag("event", name, { ...params, send_to: GA_MEASUREMENT_ID });
    }
  });
}

export type EcommerceItem = {
  id: string;
  name: string;
  quantity: number;
  /** Prix unitaire TTC en euros. */
  price: number;
};

function gaItems(item: EcommerceItem) {
  return [
    {
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
    },
  ];
}

/** Début de paiement (étape `/boutique/commander`) : entonnoir de conversion. */
export function trackBeginCheckout(value: number, item: EcommerceItem): void {
  trackEvent("begin_checkout", { value, currency: "EUR", items: gaItems(item) });
}

/**
 * Achat confirmé : événement `purchase` (Analytics) + conversion « Achat »
 * (Google Ads), avec le montant. Envoyé une seule fois par commande, même si
 * la page merci est rechargée (Google dédoublonne aussi par `transaction_id`).
 */
export function trackPurchase(transactionId: string, value: number, item: EcommerceItem): void {
  const key = `reviu-purchase-${transactionId}`;
  whenDecided((g) => {
    try {
      if (window.sessionStorage.getItem(key)) return;
    } catch {
      // sessionStorage indisponible : Google dédoublonne par transaction_id.
    }
    let sent = false;
    if (g.analytics && GA_MEASUREMENT_ID) {
      gtag("event", "purchase", {
        send_to: GA_MEASUREMENT_ID,
        transaction_id: transactionId,
        value,
        currency: "EUR",
        items: gaItems(item),
      });
      sent = true;
    }
    if (g.ads && GOOGLE_ADS_ID && GOOGLE_ADS_PURCHASE_LABEL) {
      gtag("event", "conversion", {
        send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_LABEL}`,
        transaction_id: transactionId,
        value,
        currency: "EUR",
      });
      sent = true;
    }
    if (sent) {
      try {
        window.sessionStorage.setItem(key, "1");
      } catch {
        // voir plus haut
      }
    }
  });
}

// ── Attribution des ventes ────────────────────────────────────────────────
// Provenance de la visite (paramètres de campagne, identifiant de clic, site
// d'origine) lue sur la page d'arrivée et gardée EN MÉMOIRE ; elle n'est
// écrite dans un cookie qu'après consentement. Le serveur la relit à la
// création du paiement et l'ajoute aux métadonnées Stripe de la commande.

let landing: Attribution | null = null;

function externalReferrer(): string | null {
  try {
    if (!document.referrer) return null;
    const host = new URL(document.referrer).hostname;
    const own = host === SITE.domain || host.endsWith(`.${SITE.domain}`);
    // Retour de 3-D Secure / Stripe : ce n'est pas une provenance.
    const stripe = host === "stripe.com" || host.endsWith(".stripe.com");
    return host && host !== window.location.hostname && !own && !stripe ? host : null;
  } catch {
    return null;
  }
}

function snapshotLanding(): Attribution {
  if (landing) return landing;
  const url = new URL(window.location.href);
  const found: Record<string, string> = {};
  for (const key of [...CAMPAIGN_KEYS, ...CLICK_ID_KEYS]) {
    const v = url.searchParams.get(key);
    if (v) found[key] = v;
  }
  const ref = externalReferrer();
  if (ref) found.referrer = ref;
  if (Object.keys(found).length > 0) found.landing_page = url.pathname;
  landing = sanitizeAttribution(found);
  return landing;
}

/** Ne garde que ce que le consentement autorise. */
function allowedAttribution(a: Attribution, c: ConsentChoice): Attribution {
  if (!c.analytics && !c.ads) return {};
  const out: Attribution = { ...a };
  if (!c.ads) for (const key of CLICK_ID_KEYS) delete out[key];
  return out;
}

function readAttributionCookie(): Attribution {
  const prefix = `${ATTRIBUTION_COOKIE}=`;
  const part = document.cookie.split("; ").find((c) => c.startsWith(prefix));
  if (!part) return {};
  try {
    return sanitizeAttribution(JSON.parse(decodeURIComponent(part.slice(prefix.length))));
  } catch {
    return {};
  }
}

function persistAttribution(c: ConsentChoice): void {
  const fresh = allowedAttribution(snapshotLanding(), c);
  // Nouvelle provenance = dernier clic ; sinon on conserve la précédente
  // (filtrée si le consentement a été réduit).
  const value = Object.keys(fresh).length > 0 ? fresh : allowedAttribution(readAttributionCookie(), c);
  if (Object.keys(value).length === 0) {
    deleteCookie(ATTRIBUTION_COOKIE);
    return;
  }
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${
    ATTRIBUTION_MAX_AGE_DAYS * 86_400
  }; Path=/; SameSite=Lax${secure}`;
}

// ── Nettoyage des cookies ─────────────────────────────────────────────────

function deleteCookie(name: string): void {
  const host = window.location.hostname;
  const root = host.split(".").slice(-2).join(".");
  for (const domain of ["", `; Domain=${host}`, `; Domain=.${root}`]) {
    document.cookie = `${name}=; Max-Age=0; Path=/${domain}`;
  }
}

/** Supprime les cookies Google des catégories refusées. */
function clearTrackingCookies(c: ConsentChoice): void {
  for (const part of document.cookie.split("; ")) {
    const name = part.split("=")[0];
    const analytics = name === "_gid" || name.startsWith("_ga");
    const ads = name.startsWith("_gcl");
    if ((analytics && !c.analytics) || (ads && !c.ads)) deleteCookie(name);
  }
  if (!c.analytics && !c.ads) deleteCookie(ATTRIBUTION_COOKIE);
}
