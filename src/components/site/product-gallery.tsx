"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Galerie produit e-commerce : une grande image + une bande de vignettes
 * cliquables. Les visuels sont posés en `background-image` (cohérent avec
 * ProductPhoto, sans requête next/image supplémentaire) et chaque vignette est
 * un vrai bouton accessible (aria-pressed, aria-label descriptif).
 */
export function ProductGallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];
  if (!main) return null;

  return (
    <div className="flex flex-col gap-3">
      <div
        role="img"
        aria-label={main.alt}
        className="aspect-square w-full rounded-[1.5rem] border border-line bg-surface bg-cover bg-center shadow-[var(--shadow-soft)]"
        style={{ backgroundImage: `url("${main.src}")` }}
      />
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir : ${img.alt}`}
              aria-pressed={i === active}
              className={cn(
                "aspect-square rounded-xl border bg-cover bg-center outline-none transition focus-visible:ring-2 focus-visible:ring-brand",
                i === active
                  ? "border-brand ring-2 ring-brand/30"
                  : "border-line hover:border-brand/40",
              )}
              style={{ backgroundImage: `url("${img.src}")` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
