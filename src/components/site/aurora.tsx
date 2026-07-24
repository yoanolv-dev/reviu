import { cn } from "@/lib/utils";

/**
 * Fond « aurora » : des halos de couleur flous et dérivants, posés derrière une
 * section. Purement décoratif, sans JavaScript (animation CSS). Donne la
 * profondeur lumineuse « premium » sans surcharger le contenu.
 *
 * À placer dans un parent `relative` (le composant est en `absolute inset-0`).
 */
type Blob = {
  size: number;
  color: string;
  pos: React.CSSProperties;
  delay?: number;
  opacity?: number;
};

const PRESETS: Record<string, Blob[]> = {
  hero: [
    { size: 540, color: "#6d5cff", pos: { top: "-14%", right: "-6%" } },
    { size: 480, color: "#1b4dff", pos: { top: "8%", left: "-12%" }, delay: -6 },
    { size: 360, color: "#38b6ff", pos: { bottom: "-16%", left: "34%" }, delay: -11, opacity: 0.4 },
    { size: 220, color: "#fbbc04", pos: { top: "16%", right: "24%" }, delay: -3, opacity: 0.26 },
  ],
  soft: [
    { size: 460, color: "#6d5cff", pos: { top: "-20%", right: "-10%" }, opacity: 0.32 },
    { size: 400, color: "#38b6ff", pos: { bottom: "-24%", left: "-8%" }, delay: -8, opacity: 0.3 },
  ],
  violet: [
    { size: 520, color: "#8b5cf6", pos: { top: "-18%", left: "-8%" }, opacity: 0.4 },
    { size: 420, color: "#1b4dff", pos: { bottom: "-20%", right: "-6%" }, delay: -7, opacity: 0.36 },
  ],
};

export function Aurora({
  variant = "hero",
  className,
}: {
  variant?: keyof typeof PRESETS;
  className?: string;
}) {
  return (
    <div className={cn("aurora", className)} aria-hidden>
      {PRESETS[variant].map((b, i) => (
        <span
          key={i}
          className="aurora-blob"
          style={{
            width: b.size,
            height: b.size,
            opacity: b.opacity ?? 0.55,
            animationDelay: `${b.delay ?? 0}s`,
            background: `radial-gradient(circle at 30% 30%, ${b.color}, transparent 70%)`,
            ...b.pos,
          }}
        />
      ))}
    </div>
  );
}
