import { cn } from "@/lib/utils";

const STAR =
  "M12 2.5l2.6 5.85 6.4.56-4.85 4.2 1.46 6.24L12 16.9l-5.61 2.45 1.46-6.24L3 8.91l6.4-.56L12 2.5z";

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
      {mark && (
        <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-brand text-white">
          <StarMark className="h-3.5 w-3.5" />
        </span>
      )}
      <span className="text-[1.35rem] font-semibold tracking-tight">reviu</span>
    </span>
  );
}
