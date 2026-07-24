"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Révèle son contenu en fondu montant quand il entre dans le viewport
 * (IntersectionObserver). Ajoute du mouvement au défilement sans bibliothèque.
 *
 * - `delay` : décalage en ms pour créer un effet d'escalier entre cartes.
 * - Respecte `prefers-reduced-motion` via le CSS (`.reveal-up` neutralisé).
 * - Repli sûr : si l'observer n'est pas dispo, le contenu s'affiche direct.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Repli sans IntersectionObserver : on révèle au tick suivant.
    if (typeof IntersectionObserver === "undefined") {
      const t = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(t);
    }

    // L'observer appelle son callback dès le montage pour un élément déjà
    // visible (donc au-dessus de la ligne de flottaison aussi), et au scroll
    // pour les autres. Les setState ne se font que dans des callbacks.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);

    // Filet de sécurité : quoi qu'il arrive, on révèle après un court délai.
    const fallback = window.setTimeout(() => setVisible(true), 1400);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal-up", visible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
