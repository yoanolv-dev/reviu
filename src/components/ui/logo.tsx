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

/** Doré des étoiles d'avis Google — accent du monogramme. */
export const REVIEW_GOLD = "#FBBC04";

/**
 * Marque reviu : monogramme « r » dans un carré arrondi cobalt, ponctué d'une
 * étincelle au doré des étoiles Google. Le « r » se lit seul (app icon, favicon),
 * le point rappelle la note d'avis. Un aplat cobalt, un accent doré.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="4" y="4" width="40" height="40" rx="13" fill="var(--color-brand)" />
      <path
        d="M18 35V16.5h5.4v3.1c1.2-2.2 3.3-3.4 6.1-3.4.6 0 1.1.05 1.6.15v5.1c-.7-.2-1.4-.3-2.2-.3-3.3 0-5.5 2-5.5 5.6V35H18Z"
        fill="#fff"
      />
      <circle cx="33.5" cy="14.5" r="3.6" fill={REVIEW_GOLD} />
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
