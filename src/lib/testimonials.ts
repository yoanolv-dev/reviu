/**
 * Témoignages de commerçants équipés d'un présentoir reviu.
 *
 * ⚠️ UNIQUEMENT de vrais clients, avec leur accord (nom, photos, citation).
 * Aucun témoignage inventé ni reformulé au point d'en changer le sens.
 *
 * Tant que la liste est vide, la section n'est pas affichée. Pour ajouter un
 * témoignage : déposer les photos dans `public/temoignages/` (voir son README)
 * puis ajouter un objet ci-dessous. L'ordre de la liste = l'ordre d'affichage.
 *
 * Chaque témoignage a 1 à 4 photos : elles forment une pile de tirages que le
 * visiteur feuillette (la première est sur le dessus). Idéal : le présentoir
 * au comptoir, l'établissement, l'équipe.
 *
 * Exemple :
 * {
 *   quote: "Les clients le touchent en payant, sans qu'on ait besoin d'insister.",
 *   name: "Camille Martin",
 *   role: "Gérante",
 *   business: "Boulangerie Martin",
 *   city: "Nîmes",
 *   photos: [
 *     { src: "/temoignages/boulangerie-martin-1.webp", alt: "Présentoir reviu près de la caisse de la Boulangerie Martin" },
 *     { src: "/temoignages/boulangerie-martin-2.webp", alt: "Vitrine de la Boulangerie Martin à Nîmes" },
 *   ],
 * },
 */
export type TestimonialPhoto = { src: string; alt: string };

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
  /** 1 à 4 photos, cadrage vertical 4/5 ; la première est sur le dessus. */
  photos: TestimonialPhoto[];
};

export const TESTIMONIALS: Testimonial[] = [];
