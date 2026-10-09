/**
 * Liens de redirection autorisés pour un présentoir : liens Google uniquement.
 *
 * Un présentoir est un objet de confiance posé sur un comptoir : s'il était
 * détourné, il ne doit jamais pouvoir renvoyer vers une page de phishing. Même
 * règle en base (fonction SQL `is_allowed_review_url`, migration
 * 20261009120000) - garder les deux listes alignées.
 */
const GOOGLE_HOST =
  /^([a-z0-9-]+\.)*(google\.[a-z]{2,3}(\.[a-z]{2})?|g\.page|goo\.gl|g\.co|share\.google)$/i;

/**
 * Nettoie la saisie (espaces, « https:// » manquant, http -> https) et vérifie
 * qu'il s'agit d'un lien Google. Chaîne vide = pas de lien (null).
 */
export function normalizeReviewUrl(
  input: string,
): { ok: true; url: string | null } | { ok: false } {
  let raw = input.trim();
  if (!raw) return { ok: true, url: null };
  if (/^http:\/\//i.test(raw)) raw = `https://${raw.slice(7)}`;
  else if (!/^[a-z][a-z0-9+.-]*:/i.test(raw)) raw = `https://${raw}`;
  if (raw.length > 2048) return { ok: false };

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { ok: false };
  }
  if (parsed.protocol !== "https:") return { ok: false };
  if (parsed.username || parsed.password) return { ok: false };
  if (parsed.port && parsed.port !== "443") return { ok: false };
  if (!GOOGLE_HOST.test(parsed.hostname)) return { ok: false };
  // La règle SQL lit la chaîne brute : on la vérifie aussi pour garantir que
  // la valeur enregistrée passera le contrôle en base.
  if (
    !/^https:\/\/([a-z0-9-]+\.)*(google\.[a-z]{2,3}(\.[a-z]{2})?|g\.page|goo\.gl|g\.co|share\.google)(:443)?([/?#]|$)/i.test(
      raw,
    )
  ) {
    return { ok: false };
  }
  return { ok: true, url: raw };
}

export const REVIEW_URL_ERROR =
  "Ce lien ne correspond pas à une page Google. Collez le lien d'avis de votre fiche Google (il commence souvent par https://g.page/r/…).";
