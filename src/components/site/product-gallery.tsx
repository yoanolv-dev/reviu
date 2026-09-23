"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Galerie produit e-commerce : une grande image + une bande de vignettes
 * cliquables. Images `next/image` (vrais `<img>` indexables, formats modernes)
 * et vignettes en vrais boutons accessibles (aria-pressed, aria-label).
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
      <div className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[var(--shadow-soft)]">
        <Image
          key={main.src}
          src={main.src}
          alt={main.alt}
          fill
          sizes="(min-width: 1024px) 540px, 100vw"
          className="screen-in object-cover"
        />
      </div>
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
                "relative aspect-square overflow-hidden rounded-xl border outline-none transition focus-visible:ring-2 focus-visible:ring-brand",
                i === active
                  ? "border-brand ring-2 ring-brand/30"
                  : "border-line opacity-80 hover:border-brand/40 hover:opacity-100",
              )}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="130px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
