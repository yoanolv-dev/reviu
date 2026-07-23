"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Photo produit avec repli élégant.
 *
 * Affiche la vraie photo du présentoir (déposée dans `public/products/`). Tant
 * que le fichier n'existe pas — ou s'il ne charge pas — on retombe sur un visuel
 * de marque plutôt qu'une image cassée. Dès que la photo est ajoutée au repo,
 * elle s'affiche automatiquement, sans changement de code.
 */
export function ProductPhoto({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-brand-soft",
        className,
      )}
    >
      {failed ? (
        <Fallback alt={alt} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      )}
    </div>
  );
}

/** Repli de marque : dégradé cobalt + point doré, sans dépendance externe. */
function Fallback({ alt }: { alt: string }) {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand to-brand-strong p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-2xl font-semibold text-white">
          r<span className="text-accent">.</span>
        </span>
        <span className="text-sm font-medium text-white/80">{alt}</span>
        <span className="text-[11px] text-white/50">Visuel produit</span>
      </div>
    </div>
  );
}
