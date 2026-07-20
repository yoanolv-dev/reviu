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
  /** Destination de la redirection (pilotable à distance par les abonnés). */
  targetUrl: string | null;
  establishment: Establishment | null;
}
