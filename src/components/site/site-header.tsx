"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";
import { NAV, APP_BASE } from "@/lib/brand";
import { AnnounceBar } from "./announce-bar";
import { cn } from "@/lib/utils";

/**
 * En-tête du site vitrine.
 *
 * Desktop : logo + navigation (soulignement animé) + accès compte, séparés par
 * un filet. L'en-tête est opaque et gagne une ombre discrète au défilement
 * (état `scrolled`) pour se détacher nettement du contenu.
 * Mobile : logo + menu déroulant (hamburger).
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <Container className="flex h-[68px] items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="reviu - accueil"
            className="shrink-0"
            onClick={close}
          >
            <Logo />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.href} className="group relative">
                  <a
                    href={item.href}
                    className="relative inline-flex items-center gap-1 py-1 text-sm font-medium text-ink-soft transition-colors hover:text-ink group-focus-within:text-ink"
                  >
                    {item.label}
                    <IconChevron />
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-brand transition-transform duration-200 group-hover:scale-x-100 group-focus-within:scale-x-100" />
                  </a>
                  {/* Sous-menu : visible au survol et au focus clavier */}
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="min-w-[224px] rounded-2xl border border-line bg-canvas p-2 shadow-[0_1px_0_rgba(10,13,22,0.04),0_18px_40px_-20px_rgba(17,57,201,0.28)]">
                      {item.children.map((c) => (
                        <a
                          key={c.href}
                          href={c.href}
                          className="block rounded-xl px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-line-soft hover:text-ink"
                        >
                          {c.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative py-1 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-brand transition-transform duration-200 group-hover:scale-x-100" />
                </a>
              ),
            )}
          </nav>

          {/* Accès : Se connecter + Commander (le bouton principal est identifiable) */}
          <div className="hidden items-center gap-3 lg:flex">
            <span aria-hidden className="h-5 w-px bg-line" />
            <a
              href={`${APP_BASE}/login`}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Se connecter
            </a>
            <Link href="/#produits" className={buttonClass("primary", "md")}>
              Commander
            </Link>
          </div>

          {/* Sous lg : CTA « Commander » toujours visible + menu déroulant */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/#produits" className={buttonClass("primary", "md")}>
              Commander
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-ink transition-colors hover:bg-line-soft"
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </Container>

        {/* Panneau déroulant mobile / tablette */}
        {open && (
          <div className="border-t border-line bg-canvas lg:hidden">
            <Container className="flex flex-col py-2">
              {NAV.map((item) => (
                <div key={item.href}>
                  <a
                    href={item.href}
                    onClick={close}
                    className="block rounded-xl px-2 py-3 text-[15px] font-medium text-ink-soft transition-colors hover:bg-line-soft hover:text-ink"
                  >
                    {item.label}
                  </a>
                  {item.children && (
                    <div className="ml-3 flex flex-col border-l border-line pl-3">
                      {item.children.map((c) => (
                        <a
                          key={c.href}
                          href={c.href}
                          onClick={close}
                          className="rounded-xl px-2 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-line-soft hover:text-ink"
                        >
                          {c.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
                <Link
                  href="/#produits"
                  onClick={close}
                  className={buttonClass("primary", "lg", "w-full")}
                >
                  Commander
                </Link>
                <a
                  href={`${APP_BASE}/login`}
                  onClick={close}
                  className="rounded-full px-2 py-3 text-center text-[15px] font-medium text-ink-soft transition-colors hover:bg-line-soft hover:text-ink"
                >
                  Se connecter
                </a>
              </div>
            </Container>
          </div>
        )}
      </header>
    </>
  );
}

function IconChevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="mt-px text-muted transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
    >
      <path d="M6 9l6 6 6-6" />
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
