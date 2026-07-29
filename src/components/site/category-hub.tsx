import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonClass } from "@/components/ui/button";
import { HeroBackground } from "@/components/site/hero-background";
import { Reveal } from "@/components/site/reveal";
import { guidesInCategory, type CategoryHub } from "@/lib/guides";
import { APP_BASE } from "@/lib/brand";
import {
  graph,
  breadcrumbSchema,
  faqSchema,
  absoluteUrl,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

/**
 * Vue partagée d'une page hub de catégorie (contenu éditorial unique + grille
 * des guides + FAQ). Chaque route hub (`/guides/par-metier`,
 * `/guides/gerer-sa-reputation`) est un fin wrapper qui fournit son `hub` et ses
 * métadonnées ; la mise en page et les données structurées vivent ici, pour
 * rester cohérentes et indexables partout.
 */
export function CategoryHubView({ hub }: { hub: CategoryHub }) {
  const guides = guidesInCategory(hub.category);

  const schema = graph(
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: hub.label, path: `/guides/${hub.slug}` },
    ]),
    {
      "@type": "CollectionPage",
      name: hub.h1,
      description: hub.description,
      url: absoluteUrl(`/guides/${hub.slug}`),
      inLanguage: "fr-FR",
      hasPart: guides.map((g) => ({
        "@type": "Article",
        headline: g.h1,
        url: absoluteUrl(`/guides/${g.slug}`),
        description: g.description,
      })),
    },
    faqSchema(hub.faq),
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
              <Link href="/guides" className="hover:text-ink">
                Guides
              </Link>
              <span className="mx-2 text-line">/</span>
              <span className="text-ink-soft">{hub.label}</span>
            </nav>
            <span className="mt-6 block font-mono text-xs uppercase tracking-widest text-brand">
              {hub.label}
            </span>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[3rem] lg:leading-[1.05]">
              {hub.h1}
            </h1>
            <div className="mt-5 max-w-2xl space-y-4">
              {hub.intro.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="text-[15px] leading-relaxed text-ink-soft sm:text-lg"
                >
                  {p}
                </p>
              ))}
            </div>
          </Container>
        </section>

        {/* GRILLE DES GUIDES */}
        <section>
          <Container className="py-14 sm:py-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((g, i) => (
                <Reveal key={g.slug} delay={i * 60} className="h-full">
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

        {/* FAQ */}
        {hub.faq.length > 0 && (
          <section className="border-t border-line">
            <Container className="py-14 sm:py-16">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Questions fréquentes
              </h2>
              <div className="mt-8 flex max-w-2xl flex-col gap-3">
                {hub.faq.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-2xl border border-line bg-surface p-5 open:shadow-[var(--shadow-soft)]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                      {f.q}
                      <span className="text-brand transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* CTA */}
        <section className="border-t border-line bg-surface">
          <Container className="flex flex-col items-center gap-4 py-14 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Prêt à passer de la théorie aux avis ?
            </h2>
            <p className="max-w-md text-[15px] text-ink-soft">
              Le présentoir reviu met la méthode sur votre comptoir : un geste,
              un avis.
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
