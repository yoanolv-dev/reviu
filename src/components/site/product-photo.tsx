import { cn } from "@/lib/utils";

/**
 * Photo produit avec repli de marque fiable.
 *
 * La vraie photo (déposée dans `public/products/`) est affichée en
 * `background-image` par-dessus un dégradé de marque. Si le fichier n'existe pas
 * encore — ou ne charge pas — le dégradé reste visible : jamais d'image cassée,
 * sans aucun JavaScript côté client. Dès que la photo est ajoutée au repo, elle
 * s'affiche automatiquement.
 */
export function ProductPhoto({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-brand to-brand-strong",
        className,
      )}
    >
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${src}")` }}
      />
    </div>
  );
}
