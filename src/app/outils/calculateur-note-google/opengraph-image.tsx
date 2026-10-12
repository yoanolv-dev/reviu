import { ogCard } from "@/components/seo/og-card";

// Vignette de partage de la page (Open Graph + image des données structurées).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Calculateur de note Google gratuit - reviu";

export default function Image() {
  return ogCard({
    badge: "Outil gratuit",
    title: "Calculateur de note Google : combien d'avis 5 étoiles ?",
    pill: "Calculer",
  });
}
