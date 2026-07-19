export type GeneratedStand = { code: string; pin: string };

export type FormState = {
  error?: string;
  success?: boolean;
  info?: string;
  /** Lot de présentoirs généré (code + PIN en clair, disponible une seule fois). */
  stands?: GeneratedStand[];
} | null;
