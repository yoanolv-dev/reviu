"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

/**
 * Barre d'achat collante en bas d'écran (mobile / tablette uniquement).
 * Apparaît une fois le hero dépassé, et s'efface quand la fiche produit
 * (`#produits`) ou le pied de page sont visibles, pour ne jamais doublonner
 * le module d'achat ni masquer le footer.
 */
export function StickyBuyBar({
  price,
  note,
  image,
}: {
  price: string;
  note: string;
  image: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const hiders = [
      document.getElementById("produits"),
      document.querySelector("footer"),
    ].filter((el): el is HTMLElement => Boolean(el));
    if (!hero || typeof IntersectionObserver === "undefined") return;

    const seen = new Map<Element, boolean>();
    const update = () => {
      const heroVisible = seen.get(hero) ?? true;
      const hidden = hiders.some((el) => seen.get(el));
      setVisible(!heroVisible && !hidden);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target, e.isIntersecting);
        update();
      },
      { threshold: 0 },
    );
    io.observe(hero);
    hiders.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      data-visible={visible}
      aria-hidden={!visible}
      className="buy-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_-18px_rgba(17,57,201,0.3)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-line bg-line-soft">
          <Image src={image} alt="" fill sizes="44px" className="object-cover" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink">
            Présentoir Reviu
          </span>
          <span className="block truncate text-xs text-muted">
            <span className="font-semibold text-ink">{price}</span> · {note}
          </span>
        </span>
        <Link
          href="/#produits"
          tabIndex={visible ? undefined : -1}
          className={buttonClass("primary", "md", "shrink-0 px-5")}
        >
          Commander
        </Link>
      </div>
    </div>
  );
}
