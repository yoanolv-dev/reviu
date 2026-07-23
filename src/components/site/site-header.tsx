import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";
import { NAV, APP_BASE } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/home" aria-label="reviu — accueil" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={`${APP_BASE}/login`}
            className="hidden rounded-full px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Se connecter
          </a>
          <a href={`${APP_BASE}/signup`} className={buttonClass("primary", "md")}>
            Créer un compte
          </a>
        </div>
      </Container>
    </header>
  );
}
