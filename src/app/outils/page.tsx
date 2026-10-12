import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroBackground } from "@/components/site/hero-background";
import { StandCta, ToolFaq } from "@/components/site/tool-layout";
import { accentLastWord } from "@/components/ui/accent";
import { IconArrowRight, IconChart, IconMessage, IconQr, IconStar } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, breadcrumbSchema, buildMetadata, faqSchema, graph } from "@/lib/seo";
import { QR_TOOL_PATH } from "@/lib/brand";
import {
  RATING_TOOL_PATH,
  REPLY_TOOL_PATH,
  REQUEST_TOOL_PATH,
  TOOLS,
  TOOLS_PATH,
} from "@/lib/tools";

const UPDATED = TOOLS.map((t) => t.updated).sort().at(-1)!;

export const metadata: Metadata = buildMetadata({
  title: "Outils gratuits pour les avis Google des commerçants | reviu",
  description:
    "Générateur de QR code avis Google, messages pour demander un avis, réponses aux avis, calculateur de note : des outils gratuits et sans inscription pour commerçants.",
  path: TOOLS_PATH,
  image: `${TOOLS_PATH}/opengraph-image`,
  keywords: [
    "outils avis google gratuits",
    "outil avis google",
    "générateur avis google",
    "outils commerçants avis clients",
  ],
});

const ICONS: Record<string, React.ReactNode> = {
  [QR_TOOL_PATH]: <IconQr size={22} />,
  [REQUEST_TOOL_PATH]: <IconMessage size={22} />,
  [REPLY_TOOL_PATH]: <IconStar size={22} />,
  [RATING_TOOL_PATH]: <IconChart size={22} />,
};

const NEEDS = [
  {
    t: "Obtenir plus d'avis",
    d: "Mettre votre lien d'avis sous les yeux de chaque client : en boutique avec un QR code, après la visite avec un message.",
    tools: [QR_TOOL_PATH, REQUEST_TOOL_PATH],
  },
  {
    t: "Répondre aux avis",
    d: "Remercier les clients satisfaits et désamorcer les critiques avec une réponse posée, adaptée à votre métier.",
    tools: [REPLY_TOOL_PATH],
  },
  {
    t: "Piloter votre note",
    d: "Savoir combien d'avis il vous faut pour atteindre votre objectif, et mesurer ce que coûte un avis négatif.",
    tools: [RATING_TOOL_PATH],
  },
];

const FAQ = [
  {
    q: "Les outils reviu sont-ils vraiment gratuits ?",
    a: "Oui. Tous les outils sont gratuits, sans inscription et sans limite d'utilisation. Ils fonctionnent dans votre navigateur : vos liens et vos textes ne sont pas envoyés à nos serveurs.",
  },
  {
    q: "Ces outils respectent-ils les règles de Google ?",
    a: "Oui. Ils servent à inviter tous vos clients de la même façon et à répondre aux avis. Aucun ne filtre les clients selon leur satisfaction ni ne propose de contrepartie, deux pratiques interdites par Google.",
  },
  {
    q: "Par quel outil commencer ?",
    a: "Par le générateur de QR code : il met votre lien d'avis sous les yeux de vos clients en boutique. Complétez avec un message de demande d'avis pour les clients déjà partis, puis répondez aux avis reçus avec le générateur de réponses.",
  },
];

export default function ToolsHubPage() {
  const schema = graph(
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Outils gratuits", path: TOOLS_PATH },
    ]),
    {
      "@type": "CollectionPage",
      name: "Outils gratuits pour les avis Google",
      url: absoluteUrl(TOOLS_PATH),
      inLanguage: "fr-FR",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: TOOLS.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          url: absoluteUrl(t.path),
        })),
      },
    },
    faqSchema(FAQ),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        <section className="relative isolate overflow-hidden border-b border-line">
          <HeroBackground />
          <Container className="py-14 sm:py-20">
            <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
              <Link href="/" className="hover:text-ink">Accueil</Link>
              <span className="mx-2 text-line">/</span>
              <span className="text-ink-soft">Outils gratuits</span>
            </nav>
            <h1 className="mt-5 max-w-3xl font-display text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:text-5xl sm:leading-[1.05]">
              {accentLastWord("Les outils gratuits pour vos avis Google.")}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-lg">
              Créer le QR code de votre page d&apos;avis, écrire à vos clients,
              répondre aux avis, calculer l&apos;effort pour faire monter votre
              note : quatre outils pensés pour les commerces de proximité.
              Gratuits, sans inscription, conformes aux règles de Google.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {TOOLS.map((t) => (
                <Link
                  key={t.path}
                  href={t.path}
                  className="group flex gap-4 rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-soft)] transition-colors hover:border-brand/40"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                    {ICONS[t.path]}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-ink group-hover:text-brand">
                      {t.name}
                    </span>
                    <span className="mt-1.5 block text-[15px] leading-relaxed text-ink-soft">
                      {t.desc}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                      Utiliser l&apos;outil
                      <IconArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-b border-line bg-surface">
          <Container className="py-14 sm:py-20">
            <h2 className="font-display text-[1.7rem] font-semibold tracking-tight text-ink sm:text-4xl">
              {accentLastWord("Quel outil pour quel besoin ?")}
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {NEEDS.map((n) => (
                <div key={n.t} className="rounded-3xl border border-line bg-canvas p-6">
                  <h3 className="font-display text-lg font-semibold text-ink">{n.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{n.d}</p>
                  <ul className="mt-4 grid gap-2">
                    {n.tools.map((p) => {
                      const t = TOOLS.find((x) => x.path === p)!;
                      return (
                        <li key={p}>
                          <Link href={p} className="text-sm font-semibold text-brand hover:underline">
                            {t.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
              Pour la méthode complète, lisez notre guide pour{" "}
              <Link href="/guides/avoir-plus-avis-google" className="font-medium text-brand hover:underline">
                avoir plus d&apos;avis Google
              </Link>{" "}
              et nos{" "}
              <Link href="/guides/par-metier" className="font-medium text-brand hover:underline">
                guides par métier
              </Link>
              .
            </p>
          </Container>
        </section>

        <StandCta
          title="Quand les outils ne suffisent plus : le présentoir Reviu."
          text="Un QR code demande d'ouvrir l'appareil photo, un message suppose d'avoir le numéro du client. Le présentoir Reviu, posé au comptoir, invite chaque client d'un simple geste du téléphone, sans contact ou par QR code."
        />

        <ToolFaq title="Questions fréquentes sur nos outils." items={FAQ} updated={UPDATED} />
      </main>
      <SiteFooter />
    </>
  );
}
