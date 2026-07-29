import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonClass } from "@/components/ui/button";
import { HeroBackground } from "@/components/site/hero-background";
import { Reveal } from "@/components/site/reveal";
import { GUIDES, CATEGORY_HUBS } from "@/lib/guides";
import { APP_BASE } from "@/lib/brand";
import { buildMetadata, graph, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Guides & ressources sur les avis Google - reviu",
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
        {/* HERO */}
        <section className="relative isolate overflow-hidden border-b border-line">
          <HeroBackground />
          <Container className="py-16 sm:py-24">
            <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
              <Link href="/" className="hover:text-ink">
                Accueil
              </Link>
              <span className="mx-2 text-line">/</span>
              <span className="text-ink-soft">Guides</span>
            </nav>
            <span className="mt-6 block font-mono text-xs uppercase tracking-widest text-brand">
              Ressources
            </span>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[3rem] lg:leading-[1.05]">
              Tout pour collecter plus d&apos;
              <span className="text-gradient">avis Google</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-lg">
              Des guides concrets pour les commerces de proximité : quand
              demander un avis, quel support choisir, comment répondre - et
              comment transformer vos clients satisfaits en avis, dans les
              règles de Google.
            </p>
          </Container>
        </section>

        {/* GRILLE */}
        <section>
          <Container className="py-14 sm:py-16">
            {CATEGORY_HUBS.length > 0 && (
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted">Parcourir par thème :</span>
                {CATEGORY_HUBS.map((h) => (
                  <Link
                    key={h.slug}
                    href={`/guides/${h.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    {h.h1}
                    <span aria-hidden>→</span>
                  </Link>
                ))}
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {GUIDES.map((g, i) => (
                <Reveal key={g.slug} delay={i * 70} className="h-full">
                <Link
                  href={`/guides/${g.slug}`}
                  className="elev elev-hover group flex h-full flex-col rounded-3xl border border-line bg-surface p-6"
                >
                  <span className="w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
                    {g.category}
                  </span>
                  <h2 className="mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-ink group-hover:text-brand">
                    {g.h1}
                  </h2>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">
                    {g.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                    Lire le guide
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  <span className="mt-3 text-xs text-muted">
                    {g.readMinutes} min de lecture
                  </span>
                </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
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
              <a
                href={`${APP_BASE}/signup`}
                className={buttonClass("secondary", "lg")}
              >
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
