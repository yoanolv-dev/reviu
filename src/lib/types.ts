export type StandStatus = "blank" | "active" | "disabled";
export type TargetType = "google" | "instagram" | "menu";
export type EventKind = "view" | "click" | "feedback";

export interface Establishment {
  id: string;
  name: string;
  googleReviewUrl: string;
  logoUrl?: string | null;
  brandColor?: string | null;
  welcomeMessage?: string | null;
  feedbackEnabled: boolean;
}

export interface Stand {
  code: string;
  status: StandStatus;
  targetType: TargetType;
  establishment: Establishment | null;
  /** Lien effectif de redirection : override du présentoir, sinon lien établissement. */
  redirectUrl: string | null;
}
