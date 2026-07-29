import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroBackground } from "@/components/site/hero-background";
import { buttonClass } from "@/components/ui/button";
import {
  getGuide,
  guideSlugs,
  headingId,
  hubSlugForCategory,
  getCategoryHub,
  type Guide,
  type GuideBlock,
} from "@/lib/guides";
import { APP_BASE } from "@/lib/brand";
import {
  buildMetadata,
  graph,
  articleSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { accentLastWord } from "@/components/ui/accent";

type Props = { params: Promise<{ slug: string }> };

// Génère une page statique par guide au build (rendu HTML complet, idéal SEO).
export function generateStaticParams() {
  return guideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return buildMetadata({
    title: g.metaTitle,
    description: g.description,
    path: `/guides/${g.slug}`,
    keywords: g.keywords,
    type: "article",
    publishedTime: g.datePublished,
    modifiedTime: g.dateModified ?? g.datePublished,
    image: `/guides/${g.slug}/opengraph-image`,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const toc = guide.blocks.filter((b) => b.type === "h2") as Extract<
    GuideBlock,
    { type: "h2" }
  >[];
  const related = guide.related
    .map((s) => getGuide(s))
    .filter((g): g is Guide => Boolean(g));

  // Hub de catégorie éventuel (ex. « Par métier ») : sert de maillon
  // intermédiaire dans le fil d'Ariane et de lien depuis l'en-tête.
  const hubSlug = hubSlugForCategory(guide.category);
  const hub = hubSlug ? getCategoryHub(hubSlug) : undefined;

  const schema = graph(
    articleSchema({
      title: guide.h1,
      description: guide.description,
      path: `/guides/${guide.slug}`,
      datePublished: guide.datePublished,
      dateModified: guide.dateModified,
      keywords: guide.keywords,
      image: `/guides/${guide.slug}/opengraph-image`,
    }),
    faqSchema(guide.faq),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Guides", path: "/guides" },
      ...(hub ? [{ name: hub.label, path: `/guides/${hub.slug}` }] : []),
      { name: guide.h1, path: `/guides/${guide.slug}` },
    ]),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        {/* EN-TÊTE */}
        <section className="relative isolate overflow-hidden border-b border-line">
          <HeroBackground />
          <Container className="py-12 sm:py-16">
            <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
              <Link href="/" className="hover:text-ink">
                Accueil
              </Link>
              <span className="mx-2 text-line">/</span>
              <Link href="/guides" className="hover:text-ink">
                Guides
              </Link>
              {hub && (
                <>
                  <span className="mx-2 text-line">/</span>
                  <Link href={`/guides/${hub.slug}`} className="hover:text-ink">
                    {hub.label}
                  </Link>
                </>
              )}
            </nav>
            {hub ? (
              <Link
                href={`/guides/${hub.slug}`}
                className="mt-6 block w-fit font-mono text-xs uppercase tracking-widest text-brand hover:underline"
              >
                {guide.category}
              </Link>
            ) : (
              <span className="mt-6 block font-mono text-xs uppercase tracking-widest text-brand">
                {guide.category}
              </span>
            )}
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              {accentLastWord(guide.h1)}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-lg">
              {guide.excerpt}
            </p>
            <p className="mt-5 text-xs text-muted">
              {guide.readMinutes} min de lecture · mis à jour le{" "}
              <time dateTime={guide.dateModified ?? guide.datePublished}>
                {formatDate(guide.dateModified ?? guide.datePublished)}
              </time>
            </p>
          </Container>
        </section>

        {/* CORPS + SOMMAIRE */}
        <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_260px] lg:gap-16">
          <article className="max-w-2xl">
            {guide.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}

            {/* FAQ */}
            {guide.faq.length > 0 && (
              <section className="mt-14">
                <h2
                  id="faq"
                  className="scroll-mt-24 font-display text-2xl font-semibold tracking-tight text-ink"
                >
                  Questions fréquentes
                </h2>
                <div className="mt-6 flex flex-col gap-3">
                  {guide.faq.map((f) => (
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
              </section>
            )}

            {/* CTA de conversion en fin d'article */}
            <aside className="mt-14 rounded-3xl bg-ink px-6 py-10 text-center sm:px-10">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
                Mettez ce guide sur votre comptoir
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
                Le présentoir reviu (NFC + QR) transforme chaque client satisfait
                en avis Google, en un seul geste. Achat unique, activation
                gratuite.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/#produits"
                  className={buttonClass("secondary", "lg", "border-transparent")}
                >
                  Commander mon présentoir
                </Link>
                <a
                  href={`${APP_BASE}/signup`}
                  className={buttonClass("ghost", "lg", "!text-white hover:bg-white/10")}
                >
                  Activer un présentoir
                </a>
              </div>
            </aside>

            {/* Articles liés */}
            {related.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                  À lire ensuite
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/guides/${r.slug}`}
                      className="group rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand/40"
                    >
                      <span className="text-xs font-medium text-brand">
                        {r.category}
                      </span>
                      <p className="mt-2 font-display text-[15px] font-semibold leading-snug text-ink group-hover:text-brand">
                        {r.h1}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* SOMMAIRE */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="font-mono text-xs uppercase tracking-widest text-muted">
                  Sur cette page
                </p>
                <nav className="mt-4 flex flex-col gap-2.5 border-l border-line">
                  {toc.map((h) => (
                    <a
                      key={h.text}
                      href={`#${headingId(h.text)}`}
                      className="-ml-px border-l-2 border-transparent pl-4 text-sm leading-snug text-ink-soft transition-colors hover:border-brand hover:text-brand"
                    >
                      {h.text}
                    </a>
                  ))}
                  <a
                    href="#faq"
                    className="-ml-px border-l-2 border-transparent pl-4 text-sm leading-snug text-ink-soft transition-colors hover:border-brand hover:text-brand"
                  >
                    Questions fréquentes
                  </a>
                </nav>
              </div>
            </aside>
          )}
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

// Liens contextuels dans le corps : une syntaxe légère `[libellé](/chemin)`
// dans le texte source des guides est convertie en vrais liens. C'est le signal
// de maillage interne le plus fort pour Google, avec des ancres porteuses de
// sens. Le contenu des guides est statique et maîtrisé (pas d'entrée externe),
// le rendu est donc sûr. On ne l'applique qu'au corps, jamais aux réponses FAQ
// (qui alimentent le JSON-LD et doivent rester en texte brut).
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function richText(text: string): React.ReactNode {
  if (!text.includes("](")) return text;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const label = m[1];
    const href = m[2];
    const cls =
      "font-medium text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:decoration-brand";
    if (href.startsWith("http")) {
      parts.push(
        <a key={key++} href={href} className={cls} target="_blank" rel="noopener noreferrer">
          {label}
        </a>,
      );
    } else {
      parts.push(
        <Link key={key++} href={href} className={cls}>
          {label}
        </Link>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// ── Rendu d'un bloc de contenu ───────────────────────────────────────────────
function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={headingId(block.text)}
          className="mt-12 scroll-mt-24 font-display text-2xl font-semibold tracking-tight text-ink"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-8 font-display text-lg font-semibold text-ink">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {richText(block.text)}
        </p>
      );
    case "ul":
      return (
        <ul className="mt-4 flex flex-col gap-2.5">
          {block.items.map((it) => (
            <li key={it} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {richText(it)}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-4 flex flex-col gap-3">
          {block.items.map((it, i) => (
            <li key={it} className="flex items-start gap-3.5 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                {i + 1}
              </span>
              {richText(it)}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div className="mt-6 rounded-2xl border border-brand/20 bg-brand-soft/60 p-5">
          <p className="font-display text-sm font-semibold text-brand">
            {block.title}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            {richText(block.text)}
          </p>
        </div>
      );
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
