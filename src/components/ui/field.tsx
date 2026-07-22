import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)]";

export function Field({
  label,
  hint,
  className,
  ...props
}: ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <input {...props} className={cn(inputBase, "h-11", className)} />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  className,
  ...props
}: ComponentProps<"textarea"> & { label: string; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <textarea
        {...props}
        className={cn(inputBase, "resize-none py-3", className)}
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}
