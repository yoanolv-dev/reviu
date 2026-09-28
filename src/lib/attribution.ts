import { cookies } from "next/headers";
import {
  ATTRIBUTION_COOKIE,
  sanitizeAttribution,
  type Attribution,
} from "./tracking-config";

/**
 * Provenance de la visite (campagne, identifiant de clic, site d'origine),
 * relue côté serveur au moment de créer le paiement. Le cookie n'existe que si
 * le visiteur a accepté la mesure d'audience ou la publicité (voir
 * `src/lib/tracking.ts`). Valeurs revalidées ici : le cookie vient du navigateur.
 */
export async function readAttribution(): Promise<Attribution> {
  try {
    const raw = (await cookies()).get(ATTRIBUTION_COOKIE)?.value;
    return raw ? sanitizeAttribution(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}
