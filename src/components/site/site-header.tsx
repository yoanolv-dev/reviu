"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";
import { NAV, APP_BASE } from "@/lib/brand";

/**
 * En-tête du site vitrine.
 *
 * Desktop : logo + navigation en ligne + accès compte.
 * Mobile : logo + bouton menu (hamburger) qui déroule un panneau contenant la
 * navigation et les accès compte - plus de grosse CTA qui déborde sur petit écran.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-canvas/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="reviu - accueil"
          className="shrink-0"
          onClick={close}
        >
          <Logo />
        </Link>

        {/* Navigation desktop */}
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

        {/* Accès compte desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href={`${APP_BASE}/login`}
            className="rounded-full px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            Se connecter
          </a>
          <a href={`${APP_BASE}/signup`} className={buttonClass("gradient", "md")}>
            Créer un compte
          </a>
        </div>

        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-line-soft md:hidden"
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </Container>

      {/* Panneau déroulant mobile */}
      {open && (
        <div className="border-t border-line bg-canvas/95 backdrop-blur-md md:hidden">
          <Container className="flex flex-col py-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="rounded-xl px-2 py-3 text-[15px] font-medium text-ink-soft transition-colors hover:bg-line-soft hover:text-ink"
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
                className={buttonClass("gradient", "lg", "w-full")}
              >
                Créer un compte
              </a>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function IconMenu() {
  return (
    <svg
      width="22"
      height="22"
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
      width="22"
      height="22"
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
