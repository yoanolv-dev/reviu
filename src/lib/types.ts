export type StandStatus = "blank" | "active" | "disabled";
export type TargetType = "google" | "instagram" | "menu";
export type EventKind = "view" | "click" | "feedback";

export type ScanMode = "direct" | "page";

export interface Establishment {
  id: string;
  name: string;
  googleReviewUrl: string;
  logoUrl?: string | null;
  brandColor?: string | null;
  welcomeMessage?: string | null;
  feedbackEnabled: boolean;
  /** Comportement au scan : 'direct' → redirection Google, 'page' → page reviu. */
  scanMode: ScanMode;
}

export interface Stand {
  code: string;
  status: StandStatus;
  targetType: TargetType;
  /** Lien effectif du présentoir (override propre, sinon lien d'avis de l'établissement). */
  targetUrl: string | null;
  establishment: Establishment | null;
}
