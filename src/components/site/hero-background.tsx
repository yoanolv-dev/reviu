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
      <div className="absolute inset-0 hero-grid opacity-70" />

      {/* Halo doux en haut à droite, derrière le visuel. */}
      <div
        className="absolute -right-40 -top-48 h-[40rem] w-[40rem] rounded-full opacity-70 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(109,92,255,0.42), rgba(27,77,255,0.22) 45%, transparent 70%)",
        }}
      />
      {/* Petit rappel doré très discret, encore plus à droite. */}
      <div
        className="absolute right-[8%] top-24 hidden h-56 w-56 rounded-full opacity-40 blur-[90px] lg:block"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(251,188,4,0.35), transparent 68%)",
        }}
      />

      {/* Fondu vers le fond de page en bas, pour une transition douce. */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}
