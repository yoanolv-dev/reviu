"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Vue d'ensemble" },
  { href: "/dashboard/stands", label: "Présentoirs" },
  { href: "/dashboard/establishment", label: "Établissement" },
  { href: "/dashboard/feedback", label: "Avis privés" },
];

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="-mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:w-52 md:flex-col md:overflow-visible md:px-0">
      {ITEMS.map((it) => {
        const active =
          it.href === "/dashboard"
            ? pathname === it.href
            : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-soft text-brand"
                : "text-ink-soft hover:bg-line-soft",
            )}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
