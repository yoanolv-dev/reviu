/**
 * Vérification du lien d'avis saisi dans les outils gratuits (générateur de QR
 * code, messages de demande d'avis). Module pur, sans dépendance : importable
 * par un composant client sans embarquer la bibliothèque QR.
 */

/** Hôtes reconnus comme des liens Google (fiche, avis, Maps, liens courts). */
const GOOGLE_HOST = /(^|\.)(google\.[a-z.]+|goo\.gl|g\.page|g\.co)$/i;

export type LinkCheck =
  | { ok: true; url: string; google: boolean }
  | { ok: false; error: string };

/** Identifiant de fiche Google (Place ID), ex. « ChIJN1t_tDeuEmsRUsoyG83frY4 ». */
const PLACE_ID = /^ChIJ[\w-]{10,}$/;

/**
 * Normalise et vérifie le lien saisi (ajoute https:// si besoin). Un Place ID
 * seul est converti en lien direct de rédaction d'avis Google.
 */
export function checkLink(raw: string): LinkCheck {
  const v = raw.trim();
  if (!v) return { ok: false, error: "Collez le lien de votre page d'avis Google." };
  if (PLACE_ID.test(v)) {
    return {
      ok: true,
      url: `https://search.google.com/local/writereview?placeid=${v}`,
      google: true,
    };
  }
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  let u: URL;
  try {
    u = new URL(withScheme);
  } catch {
    return { ok: false, error: "Ce lien n'est pas valide. Vérifiez qu'il est complet." };
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    return { ok: false, error: "Le lien doit commencer par https://" };
  }
  if (!u.hostname.includes(".")) {
    return { ok: false, error: "Ce lien n'est pas valide. Vérifiez qu'il est complet." };
  }
  return { ok: true, url: u.toString(), google: GOOGLE_HOST.test(u.hostname) };
}
