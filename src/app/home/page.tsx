import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroVisual } from "@/components/site/hero-visual";
import { ProductPhoto } from "@/components/site/product-photo";
import { Aurora } from "@/components/site/aurora";
import { HeroBackground } from "@/components/site/hero-background";
import { Reveal } from "@/components/site/reveal";
import { buttonClass } from "@/components/ui/button";
import { StarMark } from "@/components/ui/logo";
import { Testimonials } from "@/components/site/testimonials";
import {
  APP_BASE,
  SUBSCRIPTION,
  STAND_PRICE,
  BOUTIQUE_URL,
} from "@/lib/brand";
import {
  buildMetadata,
  graph,
  softwareApplicationSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Comment ça marche - reviu",
  description:
    "Présentoirs NFC et QR codes dynamiques pour faciliter le dépôt d'avis Google de vos vrais clients. Avis public ou retour privé, au choix du client - vous pilotez tout depuis une seule plateforme.",
  path: "/home",
  keywords: [
    "comment collecter des avis Google",
    "avis Google en un geste",
    "présentoir NFC avis",
    "plateforme avis Google",
    "logiciel avis clients",
  ],
});

const STEPS = [
  {
    n: "01",
    title: "Recevez vos présentoirs",
    body: "NFC et QR déjà encodés, prêts à poser sur le comptoir. Rien à installer.",
  },
  {
    n: "02",
    title: "Activez en 2 minutes",
    body: "Scannez, collez votre lien Google, personnalisez. C'est en ligne immédiatement.",
  },
  {
    n: "03",
    title: "Les avis affluent",
    body: "Un geste suffit à vos clients. Vous suivez tout depuis votre tableau de bord.",
  },
];

const FEATURES = [
  {
    title: "QR & NFC dynamiques",
    body: "Changez la destination à distance, sans jamais réimprimer un présentoir.",
  },
  {
    title: "Accès direct ou page reviu",
    body: "Choisissez : redirection Google instantanée, ou page de marque avec retour privé.",
  },
  {
    title: "Conçu pour les règles de Google",
    body: "Le bouton Google est proposé à tous vos clients, quel que soit leur ressenti.",
  },
  {
    title: "Statistiques claires",
    body: "Scans, clics vers Google, canal NFC vs QR, par établissement.",
  },
];

const PERKS_SOON = [
  "Alertes à chaque nouvel avis Google",
  "Réponses aux avis assistées par IA",
  "Suivi de tous vos avis depuis reviu",
];

const COMPLIANCE = [
  "Le bouton « Avis Google » est proposé à tous vos clients, sans distinction.",
  "En complément, un canal de contact direct permet de joindre l'établissement.",
  "Aucun tri automatique selon la note : chaque client choisit librement.",
];

const TRADES = [
  "Restaurants", "Cafés", "Salons", "Garages", "Hôtels", "Boulangeries",
  "Instituts", "Coiffeurs", "Boutiques", "Fleuristes",
];

export default function HomePage() {
  const schema = graph(
    softwareApplicationSchema(),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Comment ça marche", path: "/home" },
    ]),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <HeroBackground />
          <Container className="grid items-center gap-10 py-14 sm:gap-12 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
            <div className="reveal flex flex-col items-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-medium text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Présentoirs NFC + QR dynamiques
              </span>
              <h1 className="mt-5 font-display text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl sm:leading-[1.02] lg:text-[3.5rem]">
                Le dépôt d&apos;
                <span className="text-gradient">avis Google</span>,
                <br className="hidden sm:block" /> simplifié.
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft sm:text-lg">
                Des présentoirs NFC et QR codes dynamiques, pilotés à distance
                depuis une seule plateforme. Vos clients laissent un avis en un
                geste - vous gardez le contrôle.
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href={`${APP_BASE}/signup`}
                  className={buttonClass("gradient", "lg", "w-full sm:w-auto")}
                >
                  Créer mon compte
                </a>
                <Link
                  href="/demo"
                  className={buttonClass("secondary", "lg", "w-full sm:w-auto")}
                >
                  Voir la démo
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-2.5 text-sm text-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-brand">
                  <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Conçu pour respecter les règles de collecte d&apos;avis de Google
              </div>
            </div>
            <HeroVisual />
          </Container>
        </section>

        {/* BANDEAU COMMERCES - marquee */}
        <section className="border-y border-line bg-surface/70 backdrop-blur">
          <Container className="py-6">
            <p className="text-center font-mono text-[11px] uppercase tracking-widest text-muted">
              Sur tous les comptoirs
            </p>
            <div className="marquee fade-x mt-4">
              <div className="marquee-track gap-3 pr-3">
                {[...TRADES, ...TRADES].map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-1.5 text-sm font-medium text-ink-soft"
                  >
                    <StarMark className="h-3.5 w-3.5 text-accent" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* FONCTIONNEMENT */}
        <section id="fonctionnement" className="relative overflow-hidden">
          <Container className="py-16 sm:py-24">
            <Reveal>
              <SectionHead eyebrow="Fonctionnement" title="Trois étapes, zéro friction." />
            </Reveal>
            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <div className="group relative flex h-full flex-col rounded-3xl border border-line bg-surface p-7 elev elev-hover">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand font-mono text-sm font-semibold text-white shadow-[var(--shadow-glow)]">
                      {s.n}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* AVANTAGES */}
        <section id="avantages" className="relative overflow-hidden border-y border-line bg-surface">
          <Aurora variant="soft" />
          <Container className="py-16 sm:py-24">
            <Reveal>
              <SectionHead
                eyebrow="Avantages"
                title="Pensé pour collecter, simple à piloter."
              />
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 80}>
                  <div className="elev elev-hover group h-full rounded-3xl border border-line bg-canvas p-7">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand text-white shadow-[var(--shadow-glow)] transition-transform group-hover:scale-105">
                      <StarMark className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                      {f.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ABONNEMENT / VALEUR */}
        <section id="abonnement" className="relative overflow-hidden">
          <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div>
                <SectionHead
                  eyebrow="Abonnement"
                  title="Le suivi qui fait grandir votre réputation."
                  align="left"
                />
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  Le présentoir s&apos;achète une fois ({STAND_PRICE}) et
                  s&apos;active gratuitement. L&apos;abonnement de suivi débloque
                  ensuite les statistiques, la modification illimitée de vos liens
                  et vos retours privés - et bientôt la gestion de vos avis Google
                  directement depuis reviu.
                </p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {SUBSCRIPTION.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-3 text-[15px] text-ink"
                    >
                      <CheckIcon />
                      {perk}
                    </li>
                  ))}
                  {PERKS_SOON.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-3 text-[15px] text-muted"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">
                        ★
                      </span>
                      {perk}
                      <span className="rounded-full bg-line-soft px-2 py-0.5 text-[11px] font-medium text-muted">
                        bientôt
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="ring-gradient elev rounded-[2rem] border border-line bg-surface p-8 shadow-[var(--shadow-lift)]">
                <ProductPhoto
                  src="/products/presentoir.webp"
                  alt="Présentoir reviu NFC + QR pour avis Google"
                  className="mb-6 aspect-[16/10] w-full rounded-2xl"
                />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-ink">Présentoir</span>
                  <span className="font-display text-2xl font-semibold text-ink">
                    {STAND_PRICE}
                    <span className="text-sm font-normal text-muted"> · achat unique</span>
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Livraison en France métropolitaine · activation gratuite
                </p>
                <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                  <span className="text-sm font-medium text-ink">
                    Abonnement de suivi
                  </span>
                  <span className="font-display text-2xl font-semibold text-ink">
                    {SUBSCRIPTION.priceLabel}
                    <span className="text-sm font-normal text-muted">
                      /{SUBSCRIPTION.period}
                    </span>
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Par présentoir · sans engagement · résiliable à tout moment
                </p>
                <a
                  href={BOUTIQUE_URL}
                  className={buttonClass("gradient", "lg", "mt-6 w-full")}
                >
                  Commander un présentoir
                </a>
                <a
                  href={`${APP_BASE}/signup`}
                  className={buttonClass("secondary", "md", "mt-2 w-full")}
                >
                  Créer mon compte
                </a>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* PREUVE SOCIALE */}
        <Testimonials />

        {/* CONFORMITÉ */}
        <section id="conformite" className="border-y border-line bg-surface">
          <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div>
                <SectionHead
                  eyebrow="Conformité"
                  title="Avis public ou retour privé, au choix du client."
                  align="left"
                />
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  reviu invite tous vos clients à laisser un avis Google, quel que
                  soit leur ressenti. Le retour privé est un canal de contact
                  direct proposé en complément - jamais un moyen d&apos;éviter un
                  avis négatif. Aucun tri automatique selon la note.
                </p>
              </div>
            </Reveal>
            <ul className="flex flex-col gap-3">
              {COMPLIANCE.map((c, i) => (
                <Reveal key={c} delay={i * 90}>
                  <li className="flex items-start gap-3 rounded-2xl border border-line bg-canvas p-4">
                    <CheckIcon />
                    <span className="text-[15px] leading-relaxed text-ink">{c}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden">
          <Container className="py-20 sm:py-24">
            <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center sm:px-12">
              <Aurora variant="violet" className="opacity-70" />
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Prêt à collecter plus d&apos;avis ?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                Créez votre compte, activez vos présentoirs en quelques minutes,
                et laissez vos clients faire le reste.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={`${APP_BASE}/signup`}
                  className={buttonClass("secondary", "lg", "border-transparent")}
                >
                  Créer mon compte
                </a>
                <a
                  href={`${APP_BASE}/login`}
                  className={buttonClass(
                    "ghost",
                    "lg",
                    "!text-white hover:bg-white/10",
                  )}
                >
                  Se connecter
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function SectionHead({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <span className="font-mono text-xs uppercase tracking-widest text-brand">
        {eyebrow}
      </span>
      <h2
        className={cn(
          "mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl",
          align === "center" && "mx-auto max-w-2xl",
        )}
      >
        {title}
      </h2>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-brand text-white">
      <svg
        viewBox="0 0 24 24"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}
