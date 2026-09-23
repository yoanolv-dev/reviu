import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroBackground } from "@/components/site/hero-background";
import { ProductPhoto } from "@/components/site/product-photo";
import { Reveal } from "@/components/site/reveal";
import { buttonClass } from "@/components/ui/button";
import { accentLastWord } from "@/components/ui/accent";
import { IconArrowRight, IconCheck, IconShield } from "@/components/ui/icons";
import { GUARANTEE, QR_TOOL_PATH, SHIPPING, SITE, STAND_PRICE } from "@/lib/brand";
import {
  ORG_ID,
  absoluteUrl,
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  graph,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { QrTool } from "./qr-tool";

export const metadata: Metadata = buildMetadata({
  title: "Générateur de QR code avis Google gratuit | reviu",
  description:
    "Créez gratuitement le QR code de votre page d'avis Google : QR en PNG ou SVG et affiche prête à imprimer. Sans inscription, en 30 secondes.",
  path: QR_TOOL_PATH,
  keywords: [
    "générateur qr code avis google",
    "qr code avis google gratuit",
    "créer qr code avis google",
    "qr code google avis",
    "affiche avis google",
    "qr code pour avis clients",
  ],
});

const FIND_LINK = [
  "Connectez-vous au compte Google qui gère votre fiche d'établissement (Google Business Profile), puis recherchez le nom de votre établissement sur Google.",
  "Dans le panneau de gestion de votre fiche, choisissez « Demander des avis » (parfois « Obtenir plus d'avis »).",
  "Copiez le lien proposé par Google : il ouvre directement la fenêtre de rédaction d'avis.",
  "Collez-le dans le générateur ci-dessus : votre QR code et votre affiche sont prêts.",
];

const PLACEMENT = [
  "Au comptoir ou près de la caisse, là où le client attend quelques secondes.",
  "Sur l'addition, le ticket ou la facture remis en fin de visite.",
  "En vitrine ou à l'accueil, à hauteur des yeux.",
  "Sur vos cartes de visite, flyers et emballages.",
];

const FAQ = [
  {
    q: "Le générateur de QR code avis Google est-il vraiment gratuit ?",
    a: "Oui. Le QR code et l'affiche sont gratuits et sans inscription. Le QR code seul ne porte aucune mention ; l'affiche indique simplement reviu.fr en petit, en bas. Vous pouvez les imprimer et les utiliser sur tous vos supports.",
  },
  {
    q: "Mon lien est-il envoyé à reviu ?",
    a: "Non. Le QR code et l'affiche sont générés directement dans votre navigateur : votre lien n'est ni envoyé ni enregistré sur nos serveurs.",
  },
  {
    q: "Le QR code expire-t-il ?",
    a: "Non. Il s'agit d'un QR code statique : il contient directement votre lien d'avis Google et fonctionne tant que ce lien est valide. En revanche, si le lien change, il faudra réimprimer le QR code. Le présentoir reviu, lui, garde la même adresse et vous laisse modifier la destination à distance.",
  },
  {
    q: "Quel format choisir pour l'impression ?",
    a: "Le SVG est vectoriel : il reste parfaitement net à toutes les tailles, idéal pour un imprimeur. Le PNG haute définition convient pour une impression de bureau ou un usage en ligne. L'affiche est prévue pour un format A5 ou A6.",
  },
  {
    q: "Quelle différence avec le présentoir NFC reviu ?",
    a: `Le QR code demande d'ouvrir l'appareil photo et de viser. Le présentoir reviu ajoute une puce NFC : le client approche simplement son téléphone. Il reste posé au comptoir, son lien est modifiable sans réimprimer et vous suivez vos scans. ${STAND_PRICE}, sans abonnement.`,
  },
];

export default function QrToolPage() {
  const schema = graph(
    {
      "@type": "WebApplication",
      "@id": `${absoluteUrl(QR_TOOL_PATH)}#app`,
      name: "Générateur de QR code avis Google",
      url: absoluteUrl(QR_TOOL_PATH),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "fr-FR",
      isAccessibleForFree: true,
      description:
        "Outil gratuit pour créer le QR code de sa page d'avis Google et une affiche prête à imprimer.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      provider: { "@id": ORG_ID },
    },
    faqSchema(FAQ),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Générateur de QR code avis Google", path: QR_TOOL_PATH },
    ]),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        {/* HERO + OUTIL */}
        <section className="relative isolate overflow-hidden border-b border-line">
          <HeroBackground />
          <Container className="py-10 sm:py-14 lg:py-16">
            <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
              <Link href="/" className="hover:text-ink">
                Accueil
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ink-soft">Générateur de QR code avis Google</span>
            </nav>
            <div className="reveal mt-6 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-xs font-medium text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur">
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                  Gratuit
                </span>
                Outil {SITE.name} · sans inscription
              </span>
              <h1 className="mt-5 font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Générateur de QR code avis Google{" "}
                <span className="text-brand">gratuit</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
                Collez le lien de votre page d&apos;avis, téléchargez votre QR code
                et une affiche prête à imprimer. Vos clients n&apos;ont plus
                qu&apos;à scanner pour laisser leur avis.
              </p>
            </div>
            <div className="mt-8 sm:mt-10">
              <QrTool standPrice={STAND_PRICE} shippingLabel={SHIPPING.label} />
            </div>
          </Container>
        </section>

        {/* TROUVER LE LIEN */}
        <section id="trouver-le-lien" className="scroll-mt-24 border-b border-line bg-surface">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                Étape préalable
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Trouver le lien de votre page d'avis Google.")}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                Le bon lien ouvre directement la fenêtre de rédaction d&apos;avis :
                c&apos;est lui qui doit se cacher derrière votre QR code. Plus de
                détails dans notre{" "}
                <Link href="/guides/qr-code-avis-google" className="font-medium text-brand hover:underline">
                  guide du QR code avis Google
                </Link>
                .
              </p>
            </Reveal>
            <ol className="flex flex-col gap-3">
              {FIND_LINK.map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border border-line bg-canvas p-4 text-[15px] leading-relaxed text-ink"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-soft font-mono text-sm font-semibold text-brand">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* OÙ PLACER LE QR CODE */}
        <section className="border-b border-line">
          <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal className="order-2 lg:order-1">
              <ProductPhoto
                src="/products/etape-1.webp"
                alt="Client scannant un QR code avis Google au comptoir d'un commerce"
                sizes="(min-width: 1024px) 480px, 90vw"
                framed={false}
                className="mx-auto aspect-square w-full max-w-[480px] rounded-[2rem] shadow-[var(--shadow-lift)]"
              />
            </Reveal>
            <Reveal className="order-1 lg:order-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                Bonnes pratiques
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Où placer votre QR code avis Google.")}
              </h2>
              <ul className="mt-6 grid gap-3">
                {PLACEMENT.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
                      <IconCheck size={12} strokeWidth={2.6} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-ink-soft">
                Proposez l&apos;avis à tous vos clients, de la même façon : Google
                interdit de filtrer les avis selon la satisfaction. Pour aller
                plus loin, lisez{" "}
                <Link href="/guides/avoir-plus-avis-google" className="font-medium text-brand hover:underline">
                  comment avoir plus d&apos;avis Google
                </Link>
                .
              </p>
            </Reveal>
          </Container>
        </section>

        {/* QR vs PRÉSENTOIR */}
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <Reveal>
              <div className="relative isolate grid items-center gap-8 overflow-hidden rounded-[2.5rem] bg-ink px-6 py-10 text-white sm:px-12 sm:py-14 lg:grid-cols-[1.2fr_0.8fr]">
                <span
                  aria-hidden
                  className="absolute -bottom-24 -left-24 -z-10 h-80 w-80 rounded-full bg-brand opacity-50 blur-3xl"
                />
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                    Passez au niveau supérieur
                  </span>
                  <h2 className="mt-3 max-w-xl font-display text-2xl font-semibold leading-tight sm:text-4xl">
                    Un QR code, c&apos;est bien. Un présentoir NFC, c&apos;est un
                    geste de moins.
                  </h2>
                  <ul className="mt-6 grid gap-2.5 text-[15px] text-white/85">
                    {[
                      "Le client approche son téléphone : pas besoin de viser",
                      "Posé au comptoir, toujours visible au bon moment",
                      "Lien modifiable à distance, sans rien réimprimer",
                      "Statistiques de scans dans votre espace Reviu inclus",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <IconCheck size={18} className="mt-0.5 shrink-0 text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      href="/#produits"
                      className={buttonClass("primary", "lg", "group h-14 border-transparent px-7 text-base")}
                    >
                      Découvrir le présentoir - {STAND_PRICE}
                      <IconArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                    <span className="inline-flex items-center gap-2 text-sm text-white/70">
                      <IconShield size={16} className="text-accent" />
                      {SHIPPING.label} · {GUARANTEE.label}
                    </span>
                  </div>
                </div>
                <ProductPhoto
                  src="/products/etape-3.webp"
                  alt="Présentoir NFC et QR code reviu pour avis Google sur un comptoir"
                  sizes="(min-width: 1024px) 360px, 90vw"
                  framed={false}
                  className="mx-auto aspect-square w-full max-w-[360px] rounded-[2rem]"
                />
              </div>
            </Reveal>
          </Container>
        </section>

        {/* FAQ */}
        <section>
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Questions fréquentes.")}
              </h2>
              <div className="mt-10 grid gap-3">
                {FAQ.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-2xl border border-line bg-surface p-5 transition-shadow open:shadow-[var(--shadow-soft)]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                      {f.q}
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
