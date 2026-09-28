/**
 * Photos de présentoirs Reviu en place chez des clients, envoyées par eux.
 * Affichées en tirages photo sur l'accueil et la fiche produit (section
 * masquée tant que la liste est vide).
 *
 * ⚠️ UNIQUEMENT de vraies photos de clients. La légende dit le métier ou
 * l'emplacement, rien d'inventé. Un client qui donne en plus une phrase et son
 * nom va dans les témoignages (`src/lib/testimonials.ts`).
 *
 * Préparer chaque photo avec `scripts/prepare-photo.mjs` (4/5, 1000 × 1250,
 * WebP, amélioration automatique) en FLOUTANT le QR code et le code imprimé à
 * côté : ils mènent à la fiche Google du client. Fichiers dans
 * `public/installations/`. L'ordre de la liste = l'ordre d'affichage.
 */
export type Installation = {
  src: string;
  alt: string;
  /** Légende courte : métier ou emplacement (ex. « Salon de coiffure »). */
  caption: string;
};

export const INSTALLATIONS: Installation[] = [
  {
    src: "/installations/presentoir-debout-etagere.webp",
    alt: "Présentoir Reviu posé debout sur une étagère en verre, près de brochures touristiques",
    caption: "Debout, près des brochures",
  },
  {
    src: "/installations/presentoir-comptoir-accueil.webp",
    alt: "Présentoir Reviu posé sur le comptoir d'accueil d'un client",
    caption: "À l'accueil",
  },
  {
    src: "/installations/presentoir-table.webp",
    alt: "Présentoir Reviu posé à plat sur une table en bois chez un client",
    caption: "À plat, sur une table",
  },
];
