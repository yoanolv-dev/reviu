import { StarMark } from "./logo";
import { cn } from "@/lib/utils";

export function Stars({
  count = 5,
  size = 18,
  className,
}: {
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-accent", className)}
      role="img"
      aria-label={`${count} étoiles sur 5`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <StarMark key={i} size={size} />
      ))}
    </span>
  );
}
