import type { Metadata } from "next";
import { getCategoryHub } from "@/lib/guides";
import { buildMetadata } from "@/lib/seo";
import { CategoryHubView } from "@/components/site/category-hub";

// Page hub statique : URL propre `/guides/collecter-des-avis`, résolue avant la route
// dynamique voisine `/guides/[slug]`. Contenu et données structurées dans
// CategoryHubView ; ici on ne fournit que le hub et ses métadonnées.
const hub = getCategoryHub("collecter-des-avis")!;

export const metadata: Metadata = buildMetadata({
  title: hub.metaTitle,
  description: hub.description,
  path: `/guides/${hub.slug}`,
  keywords: hub.keywords,
});

export default function CollecterDesAvisHubPage() {
  return <CategoryHubView hub={hub} />;
}
