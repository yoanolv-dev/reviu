import { ogCard } from "@/components/seo/og-card";

// Vignette de partage de la page (Open Graph + image des données structurées).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Outils gratuits pour les avis Google - reviu";

export default function Image() {
  return ogCard({
    badge: "Outils gratuits",
    title: "Les outils gratuits pour vos avis Google",
    pill: "Sans inscription",
  });
}
