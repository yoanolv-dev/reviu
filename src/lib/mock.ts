import type { EventKind, Stand } from "./types";

/**
 * Données de démonstration — remplacées par Supabase à l'étape suivante.
 * Permet de dérouler et tester le parcours de redirection dès maintenant.
 *
 * Codes de test :
 *   /r/demo     -> présentoir actif (page d'avis brandée)
 *   /r/blank01  -> présentoir vierge (écran d'activation)
 */
const DEMO_STANDS: Record<string, Stand> = {
  demo: {
    code: "demo",
    status: "active",
    targetType: "google",
    establishment: {
      id: "est_demo",
      name: "Le Comptoir de Camille",
      googleReviewUrl:
        "https://search.google.com/local/writereview?placeid=DEMO_PLACE_ID",
      logoUrl: null,
      brandColor: "#1b4dff",
      welcomeMessage:
        "Merci de votre visite ! Votre avis nous aide énormément.",
      feedbackEnabled: true,
    },
  },
  blank01: {
    code: "blank01",
    status: "blank",
    targetType: "google",
    establishment: null,
  },
};

export async function getStandByCode(code: string): Promise<Stand | null> {
  return DEMO_STANDS[code.toLowerCase()] ?? null;
}

export async function recordEvent(code: string, kind: EventKind): Promise<void> {
  // TODO(supabase): insérer dans `scans` / `feedback` avec canal (nfc|qr), UA, ts.
  if (process.env.NODE_ENV !== "production") {
    console.log(`[reviu] event ${kind} · stand ${code}`);
  }
}
