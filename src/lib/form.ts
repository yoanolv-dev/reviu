export type FormState = {
  error?: string;
  success?: boolean;
  info?: string;
  /**
   * Présentoirs fraîchement générés (code + PIN en clair). Le PIN n'existe en
   * clair qu'à cet instant : seul son hash est stocké, donc l'admin doit le
   * sauvegarder ici. Renseigné uniquement par generate_stands.
   */
  generated?: { code: string; pin: string }[];
} | null;
