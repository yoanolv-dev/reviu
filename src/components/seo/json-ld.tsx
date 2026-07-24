/**
 * Rend un bloc de données structurées JSON-LD.
 *
 * On échappe le caractère « < » en son équivalent unicode pour neutraliser
 * toute injection HTML/XSS depuis les chaînes sérialisées (recommandation
 * officielle Next.js pour le JSON-LD). Un <script> natif est le bon choix :
 * ce sont des données, pas du code exécutable.
 */
export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
