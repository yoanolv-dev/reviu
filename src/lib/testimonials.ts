/**
 * Témoignages de commerçants équipés d'un présentoir reviu.
 *
 * ⚠️ UNIQUEMENT de vrais clients, avec leur accord (nom, photo, citation).
 * Aucun témoignage inventé ni reformulé au point d'en changer le sens.
 *
 * Tant que la liste est vide, la section n'est pas affichée. Pour ajouter un
 * témoignage : déposer la photo dans `public/temoignages/` (voir son README)
 * puis ajouter un objet ci-dessous. L'ordre de la liste = l'ordre d'affichage.
 *
 * Exemple :
 * {
 *   quote: "Les clients le touchent en payant, sans qu'on ait besoin d'insister.",
 *   name: "Camille Martin",
 *   role: "Gérante",
 *   business: "Boulangerie Martin",
 *   city: "Nîmes",
 *   photo: "/temoignages/boulangerie-martin.webp",
 *   photoAlt: "Présentoir reviu posé près de la caisse de la Boulangerie Martin",
 *   guide: "/guides/avis-google-boulangerie",
 * },
 */
export type Testimonial = {
  /** Citation exacte du commerçant (1 à 3 phrases). */
  quote: string;
  /** Prénom et nom (ou prénom seul si préféré). */
  name: string;
  /** Fonction : Gérant, Fondatrice, Responsable… */
  role: string;
  /** Nom de l'établissement. */
  business: string;
  city: string;
  /** Photo du présentoir installé, cadrage vertical 4/5. */
  photo: string;
  photoAlt: string;
  /** Guide métier associé (facultatif), ex. `/guides/avis-google-restaurant`. */
  guide?: string;
};

export const TESTIMONIALS: Testimonial[] = [];
