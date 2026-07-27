import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductPhoto } from "@/components/site/product-photo";
import { Testimonials } from "@/components/site/testimonials";
import { HeroBackground } from "@/components/site/hero-background";
import { Reveal } from "@/components/site/reveal";
import { buttonClass } from "@/components/ui/button";
import { APP_BASE, SUBSCRIPTION } from "@/lib/brand";
import {
  getProduct,
  formatEuros,
  STAND_TIERS,
  STAND_QTY_MAX,
} from "@/lib/shop";
import { buildMetadata, graph, productSchema, faqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { StandOrder } from "./stand-order";

export const metadata: Metadata = buildMetadata({
  title: "reviu - Le présentoir NFC + QR pour plus d'avis Google",
  description:
    "Commandez votre présentoir NFC + QR pour collecter des avis Google en un geste. Activation gratuite, et un abonnement de suivi à 2,99 €/mois qui protège votre réputation et prouve vos résultats. Paiement sécurisé, livraison en France.",
  path: "/",
  keywords: [
    "présentoir avis Google",
    "plaque NFC avis Google",
    "QR code avis Google",
    "acheter présentoir avis",
    "collecter avis Google commerce",
    "abonnement suivi avis Google",
  ],
});

const STEPS = [
  {
    n: "01",
    title: "Recevez votre présentoir",
    body: "NFC et QR déjà encodés, prêt à poser sur le comptoir. Rien à installer.",
  },
  {
    n: "02",
    title: "Activez en 2 minutes",
    body: "Scannez, collez votre lien Google, personnalisez. En ligne immédiatement.",
  },
  {
    n: "03",
    title: "Les avis affluent",
    body: "Un geste suffit à vos clients. Vous suivez tout depuis votre tableau de bord.",
  },
];

const COMPLIANCE = [
  "Le bouton « Avis Google » est proposé à tous vos clients, sans distinction.",
  "En complément, un canal de contact direct permet de joindre l'établissement.",
  "Aucun tri automatique selon la note : chaque client choisit librement.",
];

const PHOTO = {
  hero: "/products/presentoir-angle.png",
  front: "/products/presentoir.png",
  comptoir: "/products/presentoir-comptoir.png",
} as const;

export default function BoutiquePage() {
  const stand = getProduct("stand");
  const schema = graph(
    ...(stand
      ? [
          productSchema({
            name: "Présentoir reviu NFC + QR pour avis Google",
            description:
              "Présentoir connecté (puce NFC + QR code déjà encodés) à poser sur le comptoir pour collecter des avis Google en un geste. Redirection modifiable à distance, activation gratuite.",
            priceCents: stand.priceCents,
            path: "/",
            image: "/products/presentoir.png",
            sku: stand.id,
          }),
        ]
      : []),
    faqSchema(FAQ),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        {/* HERO */}
        <section className="relative isolate overflow-hidden border-b border-line">
          <HeroBackground />
          <Container className="grid items-center gap-10 py-14 sm:gap-12 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-28">
            <div className="reveal order-2 flex flex-col items-start lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-medium text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Boutique officielle reviu
              </span>
              <h1 className="mt-5 font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.03]">
                Le présentoir qui transforme vos clients en{" "}
                <span className="text-gradient">avis Google</span>.
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft sm:mt-5 sm:text-lg">
                Un geste - coller le téléphone ou scanner le QR - et l&apos;avis
                est lancé. Posez-le sur le comptoir, activez-le en deux minutes,
                et suivez tout depuis votre tableau de bord.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-muted sm:mt-8 sm:gap-x-6">
                <TrustItem>Paiement sécurisé Stripe</TrustItem>
                <TrustItem>Livraison en France</TrustItem>
                <TrustItem>NFC + QR déjà encodés</TrustItem>
              </div>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a href="#produits" className={buttonClass("gradient", "lg", "w-full sm:w-auto")}>
                  Commander mon présentoir
                </a>
                <a href="#abonnement" className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
                  Découvrir le suivi
                </a>
              </div>
            </div>
            <div className="relative order-1 mx-auto w-full max-w-[18rem] sm:max-w-sm lg:order-2 lg:max-w-none">
              <div
                aria-hidden
                className="absolute inset-3 -z-10 rounded-[3rem] bg-gradient-brand opacity-25 blur-3xl"
              />
              <ProductPhoto
                src={PHOTO.hero}
                alt="Présentoir reviu NFC + QR pour avis Google"
                className="ring-gradient aspect-square w-full rounded-[2rem] shadow-[var(--shadow-lift)]"
              />
            </div>
          </Container>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <Reveal>
              <SectionHead eyebrow="Comment ça marche" title="Trois étapes, zéro friction." />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <div className="elev elev-hover flex h-full flex-col rounded-3xl border border-line bg-canvas p-7">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand font-mono text-sm font-semibold text-white shadow-[var(--shadow-glow)]">
                      {s.n}
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* PRODUIT - le présentoir à l'unité */}
        <section id="produits" className="scroll-mt-24">
          <Container className="py-16 sm:py-20">
            <SectionHead
              eyebrow="Le présentoir"
              title="Commandez le vôtre, à l'unité."
            />
            <div className="mx-auto mt-12 grid max-w-4xl items-center gap-8 rounded-[2rem] border border-line bg-surface p-6 sm:p-8 lg:grid-cols-2 lg:gap-12">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute inset-4 -z-10 rounded-[2.5rem] bg-gradient-brand opacity-20 blur-3xl"
                />
                <ProductPhoto
                  src={PHOTO.front}
                  alt="Présentoir reviu NFC + QR"
                  className="ring-gradient aspect-square w-full rounded-[1.75rem] shadow-[var(--shadow-lift)]"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  Présentoir NFC + QR
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                  Le présentoir connecté, prêt à poser. Redirection modifiable à
                  distance, activation gratuite.
                </p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {[
                    "NFC + QR déjà encodés, prêts à l'emploi",
                    "Redirection modifiable à distance, sans réimprimer",
                    "Tarif dégressif à la quantité",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-line pt-6">
                  <StandOrder
                    tiers={STAND_TIERS.map((t) => ({ ...t }))}
                    max={STAND_QTY_MAX}
                    subscriptionLabel={SUBSCRIPTION.priceLabel}
                    period={SUBSCRIPTION.period}
                  />
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-muted">
              Prix TTC. Le présentoir fonctionne dès l&apos;activation, gratuitement.
            </p>
          </Container>
        </section>

        {/* ABONNEMENT - l'offre de services (le récurrent) */}
        <section id="abonnement" className="scroll-mt-24 border-y border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <SectionHead
              eyebrow="Abonnement de suivi"
              title="Le présentoir attire les avis. L'abonnement protège votre réputation."
            />
            <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-ink-soft">
              {SUBSCRIPTION.pitch}
            </p>
            <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
              <div className="ring-gradient flex flex-col justify-center rounded-3xl border border-brand/40 bg-canvas p-7 shadow-[var(--shadow-glow)]">
                <span className="font-mono text-xs uppercase tracking-widest text-brand">
                  Sans engagement
                </span>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-display text-5xl font-semibold text-ink">
                    {SUBSCRIPTION.priceLabel}
                  </span>
                  <span className="mb-1.5 text-muted">/{SUBSCRIPTION.period}</span>
                </div>
                <p className="mt-1 text-sm text-muted">par présentoir</p>
                <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                  Un mauvais avis public évité, et l&apos;abonnement est rentabilisé
                  pour des mois. Résiliable à tout moment.
                </p>
                <a
                  href="#produits"
                  className={buttonClass("gradient", "md", "mt-6 w-full")}
                >
                  Commander un présentoir
                </a>
                <Link
                  href="/demo"
                  className="mt-3 text-center text-sm text-brand hover:underline"
                >
                  Voir la démo du suivi
                </Link>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:grid-flow-row">
                {SUBSCRIPTION.perks.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 rounded-2xl border border-line bg-canvas p-4 text-[15px] leading-relaxed text-ink"
                  >
                    <Check />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* PREUVE SOCIALE / CAS D'USAGE */}
        <Testimonials />

        {/* CONFORMITÉ GOOGLE */}
        <section className="border-t border-line bg-surface">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHead
                eyebrow="Conformité"
                title="Avis public ou retour privé, au choix du client."
                align="left"
              />
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                reviu invite tous vos clients à laisser un avis Google, quel que
                soit leur ressenti. Le retour privé est un canal de contact
                proposé en complément - jamais un moyen d&apos;éviter un avis
                négatif. Aucun tri automatique selon la note.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {COMPLIANCE.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4"
                >
                  <Check />
                  <span className="text-[15px] leading-relaxed text-ink">{c}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* REVENDEUR - teaser vers la candidature */}
        <section
          id="revendeur"
          className="scroll-mt-24 border-b border-line"
        >
          <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2">
            <ProductPhoto
              src={PHOTO.comptoir}
              alt="Présentoir reviu posé sur le comptoir d'un commerce"
              className="aspect-[4/3] w-full rounded-3xl shadow-[var(--shadow-soft)]"
            />
            <div>
              <SectionHead
                eyebrow="Programme revendeur"
                title="Vous voulez revendre le présentoir près de chez vous ?"
                align="left"
              />
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                Nous sélectionnons les revendeurs au cas par cas : tarif de gros,
                conditions de revente claires et une formation accompagnée sur
                demande. Candidatez, on revient vers vous.
              </p>
              <div className="mt-8">
                <Link href="/revendeur" className={buttonClass("gradient", "lg")}>
                  Devenir revendeur
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section>
          <Container className="py-16 sm:py-20">
            <SectionHead eyebrow="Questions fréquentes" title="Bon à savoir." />
            <div className="mx-auto mt-10 grid max-w-3xl gap-4">
              {FAQ.map((f) => (
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

        {/* CTA compte */}
        <section className="border-t border-line bg-surface">
          <Container className="flex flex-col items-center gap-4 py-14 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Déjà un présentoir ?
            </h2>
            <p className="max-w-md text-[15px] text-ink-soft">
              Créez votre compte pour l&apos;activer, personnaliser votre lien et
              suivre vos statistiques.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={`${APP_BASE}/signup`} className={buttonClass("gradient", "md")}>
                Créer mon compte
              </a>
              <Link href="/demo" className={buttonClass("secondary", "md")}>
                Voir la démo
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "Comment fonctionne le présentoir ?",
    a: "Chaque présentoir intègre une puce NFC et un QR code déjà encodés. Le client colle son téléphone ou scanne le QR, et il est redirigé vers votre page d'avis Google. La destination est modifiable à distance, sans réimprimer.",
  },
  {
    q: "Le tarif dégressif, comment ça marche ?",
    a: `Le présentoir est à ${formatEuros(
      STAND_TIERS[0].unitCents,
    )} l'unité, avec une remise à la quantité : à partir de ${
      STAND_TIERS[1].min
    } présentoirs le prix baisse, et encore au-delà. Le total se met à jour automatiquement au moment de choisir la quantité.`,
  },
  {
    q: "Faut-il un abonnement ?",
    a: "Non pour commander : le présentoir est un achat unique et s'active gratuitement, la redirection vers Google fonctionne sans rien payer. L'abonnement de suivi (2,99 €/mois par présentoir, sans engagement) est optionnel : il ajoute les retours privés et leurs alertes, le récap hebdomadaire, les statistiques détaillées et un accompagnement humain.",
  },
  {
    q: "Qu'apporte vraiment l'abonnement à 2,99 € ?",
    a: "Il protège votre réputation (un client mécontent vous écrit en privé, avant de le faire en public, et vous êtes alerté par e-mail), il prouve vos résultats (récap hebdomadaire et statistiques de scans/clics), et il vous accompagne (réglages et conseils). C'est un service de suivi, pas un simple logiciel.",
  },
  {
    q: "Je veux en revendre, c'est possible ?",
    a: "Oui, sur candidature. Nous sélectionnons les revendeurs pour leur proposer un tarif de gros, des conditions de revente claires et une formation accompagnée sur demande. Rendez-vous sur la page Revendeur pour postuler.",
  },
  {
    q: "Livraison et paiement ?",
    a: "Paiement sécurisé par carte via Stripe. Livraison en France métropolitaine. Une facture vous est automatiquement transmise.",
  },
];

// ── Petits composants ────────────────────────────────────────────────────────
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
        className={
          "mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl " +
          (align === "center" ? "mx-auto max-w-2xl" : "")
        }
      >
        {title}
      </h2>
    </div>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Check />
      {children}
    </span>
  );
}

function Check() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-white">
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
