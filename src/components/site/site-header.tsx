"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";
import { NAV, APP_BASE } from "@/lib/brand";
import { AnnounceBar } from "./announce-bar";
import { cn } from "@/lib/utils";

/**
 * En-tête du site vitrine.
 *
 * Desktop : logo à gauche, navigation centrée en pastilles (l'onglet de la page
 * courante est plein), accès compte (icône + CTA) à droite. Ombre discrète au
 * défilement. Mobile : logo + menu déroulant.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // L'onglet courant est mis en pastille pleine. Les liens à ancre (« /#… »)
  // pointent la page d'accueil boutique ("/").
  const isActive = (href: string) => {
    // Les liens à ancre (« /#produits ») sont des sauts dans la page, pas des
    // pages distinctes : jamais de pastille active pour eux.
    if (href.includes("#")) return false;
    const base = href || "/";
    return pathname === base || pathname.startsWith(base + "/");
  };

  return (
    <>
      <AnnounceBar />
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-canvas transition-shadow duration-200",
          scrolled
            ? "border-line shadow-[0_1px_0_rgba(10,13,22,0.04),0_10px_30px_-18px_rgba(17,57,201,0.25)]"
            : "border-line/70",
        )}
      >
        <Container className="flex h-[68px] items-center gap-4">
          <Link
            href="/"
            aria-label="reviu - accueil"
            className="shrink-0"
            onClick={close}
          >
            <Logo />
          </Link>

          {/* Navigation centrée (pastilles) */}
          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand text-white"
                      : "text-ink-soft hover:bg-line-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Accès compte (icône + CTA) */}
          <div className="hidden shrink-0 items-center gap-1.5 md:flex">
            <a
              href={`${APP_BASE}/login`}
              aria-label="Se connecter"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-line-soft hover:text-ink"
            >
              <IconUser />
            </a>
            <a href={`${APP_BASE}/signup`} className={buttonClass("primary", "md")}>
              Créer un compte
            </a>
          </div>

          {/* Menu mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-ink transition-colors hover:bg-line-soft md:hidden"
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </Container>

        {/* Panneau déroulant mobile */}
        {open && (
          <div className="border-t border-line bg-canvas md:hidden">
            <Container className="flex flex-col py-2">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "rounded-xl px-3 py-3 text-[15px] font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-brand text-white"
                      : "text-ink-soft hover:bg-line-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
                <a
                  href={`${APP_BASE}/login`}
                  onClick={close}
                  className={buttonClass("secondary", "lg", "w-full")}
                >
                  Se connecter
                </a>
                <a
                  href={`${APP_BASE}/signup`}
                  onClick={close}
                  className={buttonClass("primary", "lg", "w-full")}
                >
                  Créer un compte
                </a>
              </div>
            </Container>
          </div>
        )}
      </header>
    </>
  );
}

function IconUser() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
