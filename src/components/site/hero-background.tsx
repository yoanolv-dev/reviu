import { cn } from "@/lib/utils";

/**
 * Fond de hero épuré et premium.
 *
 * Objectif : de la lumière et de la profondeur SANS jamais gêner la lecture.
 * Le texte du hero reste sur le fond clair net ; la couleur est concentrée en
 * haut à droite (derrière le visuel) via un halo doux, plus une fine texture
 * pointillée estompée. Rien de coloré ne passe derrière le texte de gauche.
 */
export function HeroBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Texture pointillée subtile, masquée vers le haut/droite. */}
      <div className="absolute inset-0 hero-grid opacity-50" />

      {/* Halo bleu doux et discret en haut à droite, derrière le visuel. */}
      <div
        className="absolute -right-40 -top-48 h-[38rem] w-[38rem] rounded-full opacity-60 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(27,77,255,0.20), transparent 68%)",
        }}
      />

      {/* Fondu vers le fond de page en bas, pour une transition douce. */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}
