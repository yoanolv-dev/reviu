/**
 * Calculs de note Google (outil `/outils/calculateur-note-google`).
 *
 * La note affichée par Google est une moyenne présentée avec une décimale.
 * Google ne documente pas publiquement un éventuel mode de pondération : on
 * raisonne donc sur une moyenne simple, et l'outil présente ses résultats comme
 * des estimations. Tous les calculs se font en dixièmes d'étoile (entiers) pour
 * éviter les erreurs d'arrondi des nombres à virgule (4,5 - 4,2 = 0,30000…04).
 *
 * Module pur, sans dépendance : utilisé par le composant client (calcul en
 * direct) et par la page serveur (tableaux d'exemples rendus en HTML statique).
 */

/** Convertit une note (ex. 4.2) en dixièmes entiers (42). */
export function tenths(n: number): number {
  return Math.round(n * 10);
}

/**
 * Nombre d'avis supplémentaires, notés en moyenne `newAvg`, nécessaires pour
 * faire passer une moyenne `current` (sur `count` avis) à `target`.
 * - 0 si l'objectif est déjà atteint ;
 * - null si l'objectif est inatteignable (les nouveaux avis ne sont pas mieux
 *   notés que l'objectif lui-même).
 */
export function reviewsNeeded(
  current: number,
  count: number,
  target: number,
  newAvg = 5,
): number | null {
  const c = tenths(current);
  const t = tenths(target);
  const a = tenths(newAvg);
  if (t <= c) return 0;
  if (a <= t) return null;
  // (c·n + a·k) / (n + k) >= t  <=>  k >= n·(t - c) / (a - t)
  return Math.ceil((count * (t - c)) / (a - t));
}

/** Moyenne après l'ajout de `k` avis notés `stars` (2 décimales). */
export function averageAfter(
  current: number,
  count: number,
  k: number,
  stars: number,
): number {
  if (count + k === 0) return 0;
  const sum = tenths(current) * count + tenths(stars) * k;
  return Math.round((sum / (count + k)) * 10) / 100;
}

/**
 * Nombre d'avis 5 étoiles nécessaires pour revenir à la note `current` après
 * un avis à `stars` étoiles. Ne dépend pas du nombre d'avis existants :
 * k >= (c - s) / (5 - c).
 */
export function compensation(current: number, stars = 1): number | null {
  const c = tenths(current);
  const s = tenths(stars);
  if (c >= 50) return null;
  if (s >= c) return 0;
  return Math.ceil((c - s) / (50 - c));
}

/** Formate une note à la française (4.5 -> « 4,5 »). */
export function formatRating(n: number, decimals = 1): string {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Paliers d'exemple affichés dans les tableaux statiques de la page. */
export const EXAMPLE_COUNTS = [10, 25, 50, 100, 200] as const;

export const EXAMPLE_STEPS: { from: number; to: number }[] = [
  { from: 3.8, to: 4.0 },
  { from: 4.0, to: 4.5 },
  { from: 4.2, to: 4.5 },
  { from: 4.3, to: 4.6 },
  { from: 4.5, to: 4.8 },
  { from: 4.7, to: 4.9 },
];

export const COMPENSATION_RATINGS = [4.0, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9] as const;
