"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";
import {
  NAV,
  APP_BASE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  STAND_PRICE,
  type NavItem,
} from "@/lib/brand";
import {
  IconArrowRight,
  IconBook,
  IconChevronDown,
  IconClose,
  IconMail,
  IconMenu,
  IconMessage,
  IconPhone,
  IconPlay,
  IconQr,
  IconStore,
  IconUser,
} from "@/components/ui/icons";
import { AnnounceBar } from "./announce-bar";
import { cn } from "@/lib/utils";

/** Icône associée à chaque entrée du méga-menu « Ressources ». */
const CHILD_ICONS: Record<string, ReactNode> = {
  "/guides": <IconBook size={18} />,
  "/guides/par-metier": <IconStore size={18} />,
  "/guides/gerer-sa-reputation": <IconMessage size={18} />,
  "/demo": <IconPlay size={18} />,
};

/** Lien actif : même page, ou sous-page d'une section (hors ancres « /# »). */
function isActive(pathname: string, item: NavItem): boolean {
  if (item.href.startsWith("/#")) return false;
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return Boolean(
    item.children?.some((c) => pathname === c.href) ||
      (item.featured && pathname === item.featured.href),
  );
}

/**
 * En-tête du site vitrine.
 *
 * Desktop : logo, navigation regroupée dans une pilule (état actif + survol),
 * méga-menu « Ressources » (guides, démo, outil gratuit mis en avant), puis
 * téléphone (si renseigné), connexion et CTA « Commander » avec le prix. Fond
 * translucide flouté qui gagne une ombre au défilement.
 * Mobile / tablette : logo + CTA toujours visible + menu plein écran.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobile ouvert : on bloque le défilement de la page et Échap le ferme.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <AnnounceBar />
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300",
          scrolled
            ? "border-line bg-canvas/85 shadow-[0_1px_0_rgba(10,13,22,0.03),0_12px_32px_-20px_rgba(17,57,201,0.28)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-canvas",
        )}
      >
        <Container className="flex h-[68px] items-center justify-between gap-4">
          <Link href="/" aria-label="reviu - accueil" className="shrink-0">
            <Logo />
          </Link>

          {/* Navigation desktop */}
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 rounded-full border border-line/80 bg-surface/70 p-1 shadow-[0_1px_2px_rgba(10,13,22,0.03)]">
              {NAV.map((item) => (
                <li key={item.href} className="relative">
                  {item.children ? (
                    <MegaMenu item={item} active={isActive(pathname, item)} />
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isActive(pathname, item) ? "page" : undefined}
                      className={cn(
                        "block whitespace-nowrap rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors",
                        isActive(pathname, item)
                          ? "bg-canvas text-ink shadow-[inset_0_0_0_1px_var(--color-line)]"
                          : "text-ink-soft hover:bg-line-soft hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions desktop */}
          <div className="hidden items-center gap-1.5 lg:flex">
            {CONTACT_PHONE && (
              <a
                href={CONTACT_PHONE.href}
                aria-label={`Appeler le ${CONTACT_PHONE.display}`}
                title={CONTACT_PHONE.display}
                className="grid h-10 w-10 place-items-center rounded-full text-brand transition-colors hover:bg-line-soft"
              >
                <IconPhone size={17} />
              </a>
            )}
            <a
              href={`${APP_BASE}/login`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-line-soft hover:text-ink"
            >
              <IconUser size={16} />
              <span className="sr-only xl:not-sr-only">Se connecter</span>
            </a>
            <Link
              href="/#produits"
              className={buttonClass("primary", "md", "group ml-1 whitespace-nowrap pl-5 pr-1.5")}
            >
              Commander
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[13px] font-semibold tabular-nums transition-colors group-hover:bg-white/20">
                {STAND_PRICE}
              </span>
            </Link>
          </div>

          {/* Sous lg : CTA toujours visible + menu plein écran */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/#produits" className={buttonClass("primary", "md", "px-4")}>
              Commander
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-line-soft"
            >
              <IconMenu />
            </button>
          </div>
        </Container>
      </header>

      {open && <MobileMenu pathname={pathname} onClose={close} />}
    </>
  );
}

/**
 * Méga-menu desktop : s'ouvre au survol, au focus clavier et au clic (tactile).
 * Se ferme à la sortie de la souris, sur Échap et au clic en dehors.
 */
function MegaMenu({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors",
          open || active
            ? "bg-canvas text-ink shadow-[inset_0_0_0_1px_var(--color-line)]"
            : "text-ink-soft hover:bg-line-soft hover:text-ink",
        )}
      >
        {item.label}
        <IconChevronDown
          size={15}
          className={cn(
            "text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-[min(640px,calc(100vw-3rem))] -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="grid grid-cols-[1.25fr_1fr] gap-2 rounded-3xl border border-line bg-surface p-2 shadow-[0_2px_4px_rgba(10,13,22,0.04),0_30px_60px_-24px_rgba(17,57,201,0.3)]">
          <ul className="flex flex-col gap-0.5 p-1">
            {item.children?.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  onClick={() => setOpen(false)}
                  className="group/item flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-canvas"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover/item:bg-brand group-hover/item:text-white">
                    {CHILD_ICONS[c.href] ?? <IconBook size={18} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">
                      {c.label}
                    </span>
                    {c.desc && (
                      <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                        {c.desc}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {item.featured && (
            <Link
              href={item.featured.href}
              onClick={() => setOpen(false)}
              className="group/feat relative flex flex-col overflow-hidden rounded-[1.25rem] bg-ink p-5 text-white"
            >
              <span className="relative flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">
                  <IconQr size={22} />
                </span>
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink">
                  {item.featured.badge}
                </span>
              </span>
              <span className="relative mt-auto pt-8 font-display text-[17px] font-semibold leading-snug">
                {item.featured.label}
              </span>
              {item.featured.desc && (
                <span className="relative mt-1.5 text-[13px] leading-snug text-white/70">
                  {item.featured.desc}
                </span>
              )}
              <span className="relative mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
                Créer mon QR code
                <IconArrowRight
                  size={15}
                  className="transition-transform group-hover/feat:translate-x-0.5"
                />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/** Menu mobile / tablette plein écran, avec son propre en-tête et ses CTA. */
function MobileMenu({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="menu-sheet fixed inset-0 z-[70] flex flex-col bg-canvas lg:hidden"
    >
      <Container className="flex h-[68px] shrink-0 items-center justify-between border-b border-line">
        <Link href="/" aria-label="reviu - accueil" onClick={onClose}>
          <Logo />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-line-soft"
        >
          <IconClose />
        </button>
      </Container>

      <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto">
        <Container className="flex flex-col py-4">
          {NAV.map((item, i) => (
            <div
              key={item.href}
              className="menu-item border-b border-line/70 py-1"
              style={{ animationDelay: `${40 + i * 45}ms` }}
            >
              {item.children ? (
                <>
                  <p className="px-1 pb-1 pt-3 text-[13px] font-semibold text-muted">
                    {item.label}
                  </p>
                  {item.featured && (
                    <Link
                      href={item.featured.href}
                      onClick={onClose}
                      className="my-2 flex items-center gap-3 rounded-2xl bg-ink p-4 text-white"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10">
                        <IconQr size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold leading-snug">
                          {item.featured.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-white/70">
                          Gratuit, prêt à imprimer
                        </span>
                      </span>
                      <IconArrowRight size={18} className="shrink-0 text-white/80" />
                    </Link>
                  )}
                  <div className="grid grid-cols-1 gap-1 pb-2 sm:grid-cols-2">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={onClose}
                        aria-current={pathname === c.href ? "page" : undefined}
                        className="flex items-center gap-3 rounded-2xl p-2.5 text-[15px] font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                          {CHILD_ICONS[c.href] ?? <IconBook size={18} />}
                        </span>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(pathname, item) ? "page" : undefined}
                  className="flex items-center justify-between rounded-2xl px-1 py-3.5 font-display text-xl font-semibold text-ink"
                >
                  {item.label}
                  <IconArrowRight size={18} className="text-muted" />
                </Link>
              )}
            </div>
          ))}
        </Container>
      </nav>

      <div className="shrink-0 border-t border-line bg-surface pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        <Container className="flex flex-col gap-2.5">
          <Link
            href="/#produits"
            onClick={onClose}
            className={buttonClass("primary", "lg", "w-full")}
          >
            Commander le présentoir - {STAND_PRICE}
          </Link>
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`${APP_BASE}/login`}
              onClick={onClose}
              className={buttonClass("secondary", "lg", "w-full whitespace-nowrap px-3")}
            >
              <IconUser size={17} />
              Se connecter
            </a>
            {CONTACT_PHONE ? (
              <a
                href={CONTACT_PHONE.href}
                className={buttonClass("secondary", "lg", "w-full whitespace-nowrap px-3")}
              >
                <IconPhone size={17} className="text-brand" />
                Appeler
              </a>
            ) : (
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={buttonClass("secondary", "lg", "w-full whitespace-nowrap px-3")}
              >
                <IconMail size={17} className="text-brand" />
                Nous écrire
              </a>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
