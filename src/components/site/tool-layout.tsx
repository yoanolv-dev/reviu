import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { HeroBackground } from "@/components/site/hero-background";
import { buttonClass } from "@/components/ui/button";
import { accentLastWord } from "@/components/ui/accent";
import { IconArrowRight, IconShield } from "@/components/ui/icons";
import { GUARANTEE, PRODUCT_PATH, SHIPPING, STAND_PRICE } from "@/lib/brand";
import { TOOLS, TOOLS_PATH } from "@/lib/tools";
import { cn } from "@/lib/utils";

/**
 * Briques de mise en page communes aux pages d'outils gratuits (`/outils/...`).
 * Toutes sont des Server Components : le contenu éditorial (modèles, tableaux,
 * FAQ) est rendu en HTML statique, lisible sans JavaScript par Google et les
 * moteurs génératifs ; seul l'outil interactif est un composant client.
 */

/** En-tête d'outil : fil d'Ariane, H1, chapô, puis l'outil lui-même. */
export function ToolHero({
  title,
  lead,
  crumb,
  children,
}: {
  title: string;
  lead: string;
  /** Libellé du dernier maillon du fil d'Ariane. */
  crumb: string;
  children: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <HeroBackground />
      <Container className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
          <Link href="/" className="hover:text-ink">
            Accueil
          </Link>
          <span className="mx-2 text-line">/</span>
          <Link href={TOOLS_PATH} className="hover:text-ink">
            Outils gratuits
          </Link>
          <span className="mx-2 text-line">/</span>
          <span className="text-ink-soft">{crumb}</span>
        </nav>
        <h1 className="mt-5 max-w-3xl font-display text-[1.9rem] font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.6rem] lg:leading-[1.08]">
          {accentLastWord(title)}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-lg">
          {lead}
        </p>
        <div className="mt-8">{children}</div>
        <p className="mt-5 flex items-center gap-2 text-sm text-muted">
          <IconShield size={16} className="shrink-0 text-brand" />
          Gratuit, sans inscription. Tout est calculé dans votre navigateur.
        </p>
      </Container>
    </section>
  );
}

/** Section éditoriale standard (titre accentué + chapô + contenu). */
export function ToolSection({
  id,
  title,
  intro,
  children,
  alt = false,
}: {
  id?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
  /** Fond blanc (alterné avec le fond toile). */
  alt?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border-b border-line", alt && "bg-surface")}
    >
      <Container className="py-14 sm:py-20">
        <h2 className="max-w-3xl font-display text-[1.7rem] font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          {accentLastWord(title)}
        </h2>
        {intro && (
          <div className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {intro}
          </div>
        )}
        {children && <div className="mt-8 sm:mt-10">{children}</div>}
      </Container>
    </section>
  );
}

/** FAQ en accordéons natifs (le JSON-LD FAQPage est fourni par la page). */
export function ToolFaq({
  title,
  items,
  updated,
}: {
  title: string;
  items: { q: string; a: string }[];
  /** Date ISO de dernière mise à jour, affichée sous la FAQ. */
  updated: string;
}) {
  return (
    <section id="faq" className="scroll-mt-24 border-b border-line">
      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-[1.7rem] font-semibold tracking-tight text-ink sm:text-4xl">
            {accentLastWord(title)}
          </h2>
          <div className="mt-10 grid gap-3">
            {items.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-line bg-surface p-5 transition-shadow open:shadow-[var(--shadow-soft)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                  <h3 className="text-[15px] font-medium">{f.q}</h3>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted">
            Mis à jour le{" "}
            <time dateTime={updated}>
              {new Date(updated).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>{" "}
            · Outil gratuit proposé par reviu, indépendant de Google.
          </p>
        </div>
      </Container>
    </section>
  );
}

/** Bloc de conversion vers le présentoir, sur fond sombre. */
export function StandCta({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="border-b border-line">
      <Container className="py-14 sm:py-20">
        <div className="rounded-[2rem] bg-ink px-6 py-12 text-center sm:px-12">
          <h2 className="mx-auto max-w-2xl font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
            {text}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={PRODUCT_PATH}
              className={buttonClass("secondary", "lg", "group border-transparent")}
            >
              Découvrir le présentoir - {STAND_PRICE}
              <IconArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/60">
            {SHIPPING.label} · {GUARANTEE.label} · Sans abonnement
          </p>
        </div>
      </Container>
    </section>
  );
}

/** Cartes vers les autres outils (maillage entre outils). */
export function MoreTools({ current }: { current: string }) {
  const others = TOOLS.filter((t) => t.path !== current);
  return (
    <section className="bg-surface">
      <Container className="py-14 sm:py-16">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Nos autres outils gratuits
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((t) => (
            <Link
              key={t.path}
              href={t.path}
              className="group rounded-2xl border border-line bg-canvas p-5 transition-colors hover:border-brand/40"
            >
              <span className="font-display text-[15px] font-semibold text-ink group-hover:text-brand">
                {t.name}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                {t.desc}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Lien éditorial dans un paragraphe (style unique sur les pages d'outils). */
export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
      {children}
    </Link>
  );
}
