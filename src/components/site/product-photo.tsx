import { cn } from "@/lib/utils";
import { StarMark } from "@/components/ui/logo";

/**
 * Photo produit avec repli de marque soigné.
 *
 * La vraie photo (déposée dans `public/products/`) est affichée en
 * `background-image` par-dessus un repli décoratif de marque. Si le fichier
 * n'existe pas encore - ou ne charge pas - le repli reste visible : un dégradé
 * cobalt→violet avec halos lumineux et une pastille étoilée, jamais un aplat
 * plat ni une image cassée, et sans aucun JavaScript. Dès que la photo est
 * ajoutée au repo, elle recouvre automatiquement le repli.
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
        "relative overflow-hidden bg-gradient-brand",
        className,
      )}
    >
      {/* Repli de marque décoratif (visible tant qu'aucune photo n'est déposée) */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-violet/40 blur-3xl" />
        <StarMark className="absolute -bottom-5 right-4 h-28 w-28 text-white/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur">
            <StarMark className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${src}")` }}
      />
    </div>
  );
}
