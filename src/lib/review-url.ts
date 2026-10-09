/**
 * Liens de redirection autorisés pour un présentoir : liens d'avis / de fiche
 * Google uniquement.
 *
 * Un présentoir est un objet de confiance posé sur un comptoir : s'il était
 * détourné, il ne doit jamais pouvoir renvoyer vers une page de phishing. On
 * n'accepte donc PAS « tout ce qui est chez Google » : sites.google.com,
 * docs.google.com (formulaires), script.google.com ou les redirections
 * (/url, /amp) peuvent héberger ou rediriger vers n'importe quoi. Seules les
 * formes de liens produites par une fiche Google sont acceptées.
 *
 * Même règle en base (fonction SQL `is_allowed_review_url`, migration
 * 20261009120000) : garder les deux versions alignées.
 */

/** Domaines Google nationaux acceptés pour google.<pays>/maps et /search. */
const GOOGLE_CC = new Set([
  "com", "fr", "be", "ch", "lu", "ca", "de", "es", "it", "pt", "nl", "at",
  "ie", "co.uk",
]);

function allowedHostPath(host: string, path: string, search: string): boolean {
  if (host === "g.page" || host === "maps.app.goo.gl" || host === "share.google") {
    return true;
  }
  if (host === "goo.gl") return path.startsWith("/maps/");
  if (host === "g.co") return path.startsWith("/kgs/");
  if (host === "search.google.com") return path.startsWith("/local/");

  const m = host.match(/^(www\.|maps\.)?google\.([a-z.]+)$/);
  if (!m || !GOOGLE_CC.has(m[2])) return false;
  // « J'ai de la chance » (btnI) redirige vers le premier résultat : refusé.
  if (/btn(i|%49)/i.test(search)) return false;
  if (/^\/(maps|search)(\/|$)/.test(path)) return true;
  // maps.google.<pays>/?cid=… (ancien format de fiche), hors redirecteur /url.
  return m[1] === "maps." && !path.startsWith("/url");
}

/**
 * Nettoie la saisie (espaces, « https:// » manquant, http -> https) et vérifie
 * qu'il s'agit d'un lien de fiche Google. Chaîne vide = pas de lien (null).
 */
export function normalizeReviewUrl(
  input: string,
): { ok: true; url: string | null } | { ok: false } {
  let raw = input.trim();
  if (!raw) return { ok: true, url: null };
  if (/^http:\/\//i.test(raw)) raw = `https://${raw.slice(7)}`;
  else if (!/^[a-z][a-z0-9+.-]*:/i.test(raw)) raw = `https://${raw}`;
  // Ni espace, ni caractère de contrôle, ni antislash (contournements connus).
  if (raw.length > 2048 || /[\s\\\u0000-\u001f\u007f]/.test(raw)) return { ok: false };

  // Forme stricte, identique à la règle SQL : https://hôte[:443][/…]
  const m = raw.match(/^https:\/\/([A-Za-z0-9.-]+)(:443)?([/?#].*)?$/);
  if (!m) return { ok: false };
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { ok: false };
  }
  const host = m[1].toLowerCase();
  if (parsed.hostname !== host) return { ok: false };
  const rest = m[3] ?? "/";
  const path = rest.split(/[?#]/)[0] || "/";
  const search = rest.slice(path.length);
  // Segments « . » / « .. » (même encodés) et barres encodées : le navigateur
  // les résoudrait (/maps/../amp/… = redirecteur), donc refusés.
  if (/(^|\/)(\.|%2e){1,2}(\/|$)/i.test(path) || /%2f|%5c/i.test(rest)) {
    return { ok: false };
  }
  if (!allowedHostPath(host, path, search)) return { ok: false };
  return { ok: true, url: raw };
}

export const REVIEW_URL_ERROR =
  "Ce lien n'est pas un lien de fiche Google. Collez le lien d'avis de votre fiche (il commence souvent par https://g.page/r/…).";
