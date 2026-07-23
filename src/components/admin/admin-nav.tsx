"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Présentoirs" },
  { href: "/admin/stands", label: "Tous les stands" },
  { href: "/admin/accounts", label: "Comptes" },
  { href: "/admin/resellers", label: "Revendeurs" },
  { href: "/admin/emailing", label: "Emailing" },
  { href: "/admin/history", label: "Journal" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {ITEMS.map((it) => {
        const active =
          it.href === "/admin" ? pathname === it.href : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
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
