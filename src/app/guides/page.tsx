import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonClass } from "@/components/ui/button";
import { accentLastWord } from "@/components/ui/accent";
import { IconArrowRight, IconQr } from "@/components/ui/icons";
import { GuideCover } from "@/components/site/guide-cover";
import { GUIDES, CATEGORY_HUBS } from "@/lib/guides";
import { APP_BASE, QR_TOOL_PATH } from "@/lib/brand";
import { buildMetadata, graph, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Guides pour obtenir plus d'avis Google | reviu",
  description:
    "Nos guides pour collecter plus d'avis Google : présentoir et plaque NFC, QR code, référencement local, réponses aux avis. Des méthodes concrètes, dans les règles de Google.",
  path: "/guides",
  keywords: [
    "guide avis Google",
    "collecter avis Google",
    "plus d'avis Google",
    "référencement local avis",
    "e-réputation commerce",
  ],
});

export default function GuidesIndexPage() {
  const schema = graph(
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Guides", path: "/guides" },
    ]),
    {
      "@type": "CollectionPage",
      name: "Guides & ressources sur les avis Google",
      url: absoluteUrl("/guides"),
      inLanguage: "fr-FR",
      hasPart: GUIDES.map((g) => ({
        "@type": "Article",
        headline: g.h1,
        url: absoluteUrl(`/guides/${g.slug}`),
        description: g.description,
      })),
    },
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        <Container className="pb-16 pt-8 sm:pb-20 sm:pt-10">
          {/* En-tête compact : les articles sont visibles dès l'arrivée. */}
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
            <Link href="/" className="hover:text-ink">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-soft">Guides</span>
          </nav>
          <div className="mt-4 flex flex-col gap-5">
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Guides pour obtenir plus d'avis Google.")}
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Des méthodes concrètes pour les commerces de proximité, dans les
                règles de Google.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2" aria-label="Thèmes">
              <li>
                <span className="inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
                  Tous ({GUIDES.length})
                </span>
              </li>
              {CATEGORY_HUBS.map((h) => (
                <li key={h.slug}>
                  <Link
                    href={`/guides/${h.slug}`}
                    className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    {h.label} ({GUIDES.filter((g) => g.category === h.category).length})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g, i) => (
              <Fragment key={g.slug}>
                {i === 2 && <ToolCard />}
                <Link
                  href={`/guides/${g.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[box-shadow,border-color] hover:border-brand/30 hover:shadow-[var(--shadow-soft)]"
                >
                  <GuideCover slug={g.slug} category={g.category} className="aspect-[2/1] w-full" />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-medium text-muted">
                      {g.category} · {g.readMinutes} min
                    </p>
                    <h2 className="mt-2 font-display text-[17px] font-semibold leading-snug tracking-tight text-ink group-hover:text-brand">
                      {g.h1}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                      {g.excerpt}
                    </p>
                  </div>
                </Link>
              </Fragment>
            ))}
          </div>
        </Container>

        <section className="border-t border-line bg-surface">
          <Container className="flex flex-col items-center gap-4 py-14 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Prêt à passer de la théorie aux avis ?
            </h2>
            <p className="max-w-md text-[15px] text-ink-soft">
              Le présentoir reviu met tout ce que vous venez de lire sur votre
              comptoir : un geste, un avis.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link href="/#produits" className={buttonClass("primary", "lg")}>
                Commander mon présentoir
              </Link>
              <a href={`${APP_BASE}/signup`} className={buttonClass("secondary", "lg")}>
                Activer un présentoir
              </a>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

/** Carte glissée dans la grille : l'outil gratuit (maillage interne). */
function ToolCard() {
  return (
    <Link
      href={QR_TOOL_PATH}
      className="group flex h-full flex-col justify-between rounded-2xl bg-ink p-6 text-white transition-transform hover:-translate-y-0.5"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
        <IconQr size={22} />
      </span>
      <span className="mt-10 block">
        <span className="block font-display text-xl font-semibold leading-snug">
          Générateur de QR code avis Google
        </span>
        <span className="mt-2 block text-sm leading-relaxed text-white/70">
          Gratuit : votre QR code et une affiche prête à imprimer, en 30 secondes.
        </span>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
          Créer mon QR code
          <IconArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
