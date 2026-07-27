import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "gradient";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,box-shadow,transform,border-color] duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-[0_6px_16px_-8px_var(--color-brand)] hover:bg-brand-strong",
  // Conservé pour compatibilité : « gradient » rend désormais le même bleu
  // plein que « primary » (plus de dégradé bleu/violet sur les CTA).
  gradient:
    "bg-brand text-white shadow-[0_6px_16px_-8px_var(--color-brand)] hover:bg-brand-strong",
  secondary:
    "bg-surface text-ink border border-line hover:border-brand/50 hover:bg-brand-soft/40",
  ghost: "text-ink hover:bg-line-soft",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
