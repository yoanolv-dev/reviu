/**
 * Offre reviu — modèle freemium **par présentoir**.
 *
 * Règles métier (verrouillées avec le fondateur) :
 * - Une plaque (présentoir) redirige **toujours**, gratuitement, à vie. Le lien
 *   est posé une fois à l'activation, sans frais.
 * - Le « Suivi reviu » (2,99 €/mois/présentoir) débloque : statistiques de scans,
 *   modification du lien à volonté, multi-plateforme, tunnel d'avis privé.
 *
 * Volontairement sans dépendance ni variable d'environnement : ce module est
 * importable côté client comme serveur. Le mapping vers Stripe (prix, quantité)
 * vit dans le code serveur, pas ici.
 */

/** Prix du suivi, par présentoir et par mois (en euros). */
export const MONITORING_PRICE_EUR = 2.99;

export type OfferId = "free" | "monitored";

export interface Offer {
  id: OfferId;
  name: string;
  tagline: string;
  /** Prix formaté pour l'affichage, ex. "0 €" ou "2,99 €". */
  priceLabel: string;
  /** Complément sous le prix, ex. "/ présentoir / mois" (null si gratuit). */
  priceNote: string | null;
  /** Mise en avant sur la grille tarifaire. */
  featured: boolean;
  features: string[];
  cta: string;
}

export const OFFERS: readonly Offer[] = [
  {
    id: "free",
    name: "Plaque active",
    tagline: "La plaque fonctionne, à vie, sans abonnement.",
    priceLabel: "0 €",
    priceNote: null,
    featured: false,
    features: [
      "QR + NFC dynamiques, liés à votre serveur reviu",
      "Redirection vers votre avis Google",
      "Page d'avis brandée à vos couleurs",
      "Lien posé une fois à l'activation",
      "Aucun frais, aucune carte requise",
    ],
    cta: "Activer ma plaque",
  },
  {
    id: "monitored",
    name: "Suivi reviu",
    tagline: "Le pilotage complet de chaque présentoir.",
    priceLabel: `${MONITORING_PRICE_EUR.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
    })} €`,
    priceNote: "/ présentoir / mois",
    featured: true,
    features: [
      "Tout le plan gratuit, plus :",
      "Statistiques de scans en temps réel",
      "Modification du lien à volonté, à distance",
      "Multi-plateforme (Google, Instagram, menu)",
      "Historique & taux de conversion",
      "Tunnel d'avis privé (feedback)",
      "Sans engagement, résiliable à tout moment",
    ],
    cta: "Activer le suivi",
  },
];

export const OFFER_BY_ID = Object.fromEntries(
  OFFERS.map((o) => [o.id, o]),
) as Record<OfferId, Offer>;

/** Total mensuel HT pour un nombre de présentoirs suivis. */
export function monitoringTotal(count: number): number {
  return Math.max(0, count) * MONITORING_PRICE_EUR;
}
