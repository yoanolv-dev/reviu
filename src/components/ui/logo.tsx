import { cn } from "@/lib/utils";

export const STAR =
  "M12 2.5l2.6 5.85 6.4.56-4.85 4.2 1.46 6.24L12 16.9l-5.61 2.45 1.46-6.24L3 8.91l6.4-.56L12 2.5z";

/** Étoile pleine, réutilisée dans l'UI. */
export function StarMark({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
      width={size}
      height={size}
    >
      <path d={STAR} />
    </svg>
  );
}

/**
 * Marque reviu : une bulle d'avis (message) contenant une étoile.
 * Bulle = avis client · étoile = note. Épuré, un seul aplat cobalt.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <path
        d="M6.5 2H21.5A4.5 4.5 0 0 1 26 6.5V15.5A4.5 4.5 0 0 1 21.5 20H11L6.5 25V20A4.5 4.5 0 0 1 2 15.5V6.5A4.5 4.5 0 0 1 6.5 2Z"
        fill="var(--color-brand)"
      />
      <path transform="translate(4 1.9) scale(0.82)" d={STAR} fill="#fff" />
    </svg>
  );
}

export function Logo({
  className,
  mark = true,
}: {
  className?: string;
  mark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-ink",
        className,
      )}
    >
      {mark && <LogoMark className="h-7 w-7" />}
      <span className="text-[1.35rem] font-semibold tracking-tight">reviu</span>
    </span>
  );
}
