import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Photo produit optimisée (`next/image`) : un vrai `<img>` avec `alt`, donc
 * indexable par Google Images, servi en formats modernes et aux bonnes
 * dimensions (`sizes`). `preload` est à réserver à l'image LCP (hero).
 *
 * → Les visuels vivent dans `public/products/` (WebP compressé conseillé).
 */
export function ProductPhoto({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  preload = false,
  imgClassName,
  framed = true,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
  imgClassName?: string;
  /** Filet gris autour de la photo (désactivable sur fonds sombres / cartes). */
  framed?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-line-soft",
        framed && "border border-line",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={cn("object-cover", imgClassName)}
      />
    </div>
  );
}
