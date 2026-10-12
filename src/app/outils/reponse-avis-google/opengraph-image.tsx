import { ogCard } from "@/components/seo/og-card";

// Vignette de partage de la page (Open Graph + image des données structurées).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Générateur de réponses aux avis Google - reviu";

export default function Image() {
  return ogCard({
    badge: "Outil gratuit",
    title: "Générateur de réponses aux avis Google",
    pill: "Modèles inclus",
  });
}
