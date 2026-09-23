import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroBackground } from "@/components/site/hero-background";
import { ProductPhoto } from "@/components/site/product-photo";
import { Reveal } from "@/components/site/reveal";
import { buttonClass } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBook,
  IconHandshake,
  IconMail,
  IconMessage,
  IconNfc,
  IconPhone,
  IconShield,
  IconStore,
  IconTruck,
  IconUser,
} from "@/components/ui/icons";
import { buildMetadata, graph, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { accentLastWord } from "@/components/ui/accent";
import { CONTACT_EMAIL, CONTACT_PHONE, GUARANTEE, STAND_PRICE } from "@/lib/brand";
import { ApplicationForm } from "./application-form";

export const metadata: Metadata = buildMetadata({
  title: "Devenir revendeur reviu - présentoir avis Google",
  description:
    "Vous rencontrez des commerçants ? Devenez revendeur du présentoir avis Google reviu. Programme sur sélection : candidature en 2 minutes, réponse rapide.",
  path: "/revendeur",
  keywords: [
    "revendeur avis Google",
    "revendre présentoir NFC",
    "distribuer présentoir avis Google",
    "devenir revendeur plaque NFC avis Google",
    "programme revendeur reviu",
  ],
});

const PROFILES: { icon: ReactNode; t: string; d: string }[] = [
  {
    icon: <IconUser size={20} />,
    t: "Commerciaux terrain",
    d: "Agents indépendants, VRP, apporteurs d'affaires qui visitent des commerces chaque semaine.",
  },
  {
    icon: <IconMessage size={20} />,
    t: "Agences web et marketing",
    d: "Vous gérez la présence en ligne de commerces locaux : le présentoir complète votre offre.",
  },
  {
    icon: <IconStore size={20} />,
    t: "Prestataires des commerçants",
    d: "Caisses, terminaux de paiement, fournitures, enseignes : vous êtes déjà au comptoir.",
  },
  {
    icon: <IconHandshake size={20} />,
    t: "Réseaux et associations",
    d: "Unions commerciales, clubs d'entrepreneurs, réseaux de franchise ou de points de vente.",
  },
];

const SELLING_POINTS: { icon: ReactNode; t: string; d: string }[] = [
  {
    icon: <IconNfc size={20} />,
    t: "Se démontre en 10 secondes",
    d: "Un contact de téléphone et la page d'avis s'ouvre : le commerçant comprend tout de suite.",
  },
  {
    icon: <IconShield size={20} />,
    t: "Aucun abonnement pour le commerçant",
    d: `Un achat unique (prix public ${STAND_PRICE}), l'espace Reviu est inclus. Pas d'objection sur le récurrent.`,
  },
  {
    icon: <IconTruck size={20} />,
    t: "Rassurant à l'achat",
    d: `Livraison offerte et ${GUARANTEE.label.toLowerCase()} : le commerçant ne prend aucun risque.`,
  },
  {
    icon: <IconBook size={20} />,
    t: "Conforme aux règles Google",
    d: "Tous les clients peuvent laisser un avis, sans filtrage : un discours propre et durable.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Vous nous écrivez",
    body: "Un formulaire en 2 minutes : votre profil, votre secteur, votre réseau de commerçants.",
  },
  {
    n: "2",
    title: "On échange",
    body: "Nous étudions chaque candidature et revenons vers vous pour un échange, avec les conditions partenaires.",
  },
  {
    n: "3",
    title: "On démarre ensemble",
    body: "Si nous sommes alignés, on vous accompagne : argumentaire, démonstration, premiers commerçants.",
  },
];

// FAQ : répond aux objections des candidats et alimente le balisage FAQPage.
const REVENDEUR_FAQ = [
  {
    q: "Comment devenir revendeur reviu ?",
    a: "Remplissez le formulaire de candidature de cette page. Nous sélectionnons nos revendeurs au cas par cas : nous étudions votre profil et votre secteur, puis revenons vers vous pour en discuter.",
  },
  {
    q: "Quelles sont les conditions pour les revendeurs ?",
    a: "Les conditions partenaires (tarifs, volumes, accompagnement) vous sont présentées lors de notre échange, une fois votre candidature étudiée. Elles sont adaptées à votre profil et à votre zone d'activité.",
  },
  {
    q: "Le commerçant doit-il payer un abonnement ?",
    a: `Non. Le présentoir est un achat unique (prix public conseillé ${STAND_PRICE}) et l'espace Reviu est inclus, sans abonnement. C'est un argument de vente simple : aucun engagement pour le commerçant.`,
  },
  {
    q: "Ai-je besoin d'une expérience commerciale ?",
    a: "Ce n'est pas indispensable. Ce qui compte, c'est votre accès à des commerçants de proximité et votre sérieux. Le présentoir est un produit concret, qui se démontre en quelques secondes.",
  },
  {
    q: "Pourquoi une sélection ?",
    a: "Pour garantir un accompagnement de qualité à chaque revendeur et une image sérieuse auprès des commerçants. Nous préférons peu de partenaires, bien accompagnés.",
  },
];

export default function RevendeurPage() {
  const schema = graph(
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Revendeur", path: "/revendeur" },
    ]),
    faqSchema(REVENDEUR_FAQ),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        {/* HERO */}
        <section className="relative isolate overflow-hidden border-b border-line">
          <HeroBackground />
          <Container className="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
            <div className="reveal">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-xs font-medium text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Programme revendeur · sur sélection
              </span>
              <h1 className="mt-5 font-display text-[2.1rem] font-semibold leading-[1.07] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
                Devenez revendeur reviu{" "}
                <span className="text-brand">près de chez vous</span>.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                Vous rencontrez des commerçants chaque semaine ? Proposez-leur le{" "}
                <Link href="/#produits" className="font-medium text-brand hover:underline">
                  présentoir avis Google
                </Link>{" "}
                qui les aide à{" "}
                <Link
                  href="/guides/avoir-plus-avis-google"
                  className="font-medium text-brand hover:underline"
                >
                  collecter plus d&apos;avis
                </Link>
                . Nous sélectionnons nos revendeurs au cas par cas : parlons-en.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#candidature"
                  className={buttonClass("primary", "lg", "group h-14 px-7 text-base")}
                >
                  Proposer ma candidature
                  <IconArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
                {CONTACT_PHONE ? (
                  <a
                    href={CONTACT_PHONE.href}
                    className={buttonClass("secondary", "lg", "h-14 px-6 text-base")}
                  >
                    <IconPhone size={18} className="text-brand" />
                    {CONTACT_PHONE.display}
                  </a>
                ) : (
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Programme revendeur reviu")}`}
                    className={buttonClass("secondary", "lg", "h-14 px-6 text-base")}
                  >
                    <IconMail size={18} className="text-brand" />
                    Nous écrire
                  </a>
                )}
              </div>
            </div>

            <div className="reveal reveal-2 relative mx-auto w-full max-w-[440px]">
              <div
                aria-hidden
                className="absolute inset-6 -z-10 rounded-[3rem] bg-brand opacity-20 blur-3xl"
              />
              <ProductPhoto
                src="/products/presentoir-comptoir.webp"
                alt="Présentoir Reviu NFC et QR code pour avis Google installé dans un commerce"
                sizes="(min-width: 1024px) 440px, 90vw"
                preload
                framed={false}
                className="aspect-[4/5] w-full rounded-[2rem] shadow-[var(--shadow-lift)] ring-1 ring-white/60"
              />
              <div className="float absolute -left-3 bottom-8 max-w-[240px] rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[var(--shadow-lift)] backdrop-blur sm:-left-8">
                <p className="font-mono text-[11px] uppercase tracking-widest text-brand">
                  Ce que vous proposez
                </p>
                <p className="mt-1.5 font-display text-[17px] font-semibold leading-snug text-ink">
                  Un présentoir à {STAND_PRICE}, sans abonnement
                </p>
                <p className="mt-1 text-xs text-muted">
                  Livraison offerte · {GUARANTEE.short}
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* PROFILS RECHERCHÉS */}
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-24">
            <Reveal>
              <SectionHead
                eyebrow="Qui recherchons-nous"
                title="Des partenaires déjà au contact des commerçants."
              />
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROFILES.map((p, i) => (
                <Reveal key={p.t} delay={i * 70}>
                  <div className="flex h-full flex-col rounded-3xl border border-line bg-canvas p-6 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                      {p.icon}
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold text-ink">{p.t}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{p.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* UN PRODUIT FACILE À RECOMMANDER */}
        <section className="border-b border-line">
          <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                Pourquoi reviu
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Un produit facile à recommander.")}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft sm:text-base">
                Chaque commerçant veut plus d&apos;avis Google. Le présentoir
                reviu répond à ce besoin avec un geste simple, un prix
                accessible et aucun engagement.
              </p>
              <Link
                href="/demo"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Voir la démo du produit
                <IconArrowRight size={15} />
              </Link>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {SELLING_POINTS.map((p, i) => (
                <Reveal key={p.t} delay={i * 70}>
                  <div className="flex h-full gap-4 rounded-3xl border border-line bg-surface p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-white">
                      {p.icon}
                    </span>
                    <span>
                      <span className="block font-display text-[16px] font-semibold text-ink">
                        {p.t}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                        {p.d}
                      </span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* COMMENT ÇA SE PASSE */}
        <section className="relative isolate overflow-hidden bg-ink text-white">
          <span
            aria-hidden
            className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-brand opacity-40 blur-3xl"
          />
          <Container className="py-16 sm:py-24">
            <Reveal>
              <div className="text-center">
                <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                  Comment ça se passe
                </span>
                <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Trois étapes, une sélection humaine.
                </h2>
              </div>
            </Reveal>
            <div className="relative mt-12 grid gap-4 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="flex h-full flex-col rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand font-mono text-sm font-semibold">
                      {s.n}
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* CANDIDATURE + FAQ */}
        <section id="candidature" className="scroll-mt-24">
          <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                Candidature
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Parlons de votre projet.")}
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft">
                Présentez-vous en quelques lignes. Nous revenons vers vous
                rapidement, par e-mail ou par téléphone.
              </p>
              <div className="mt-8 rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-8">
                <ApplicationForm />
              </div>
              <p className="mt-5 text-sm text-muted">
                Vous cherchez plutôt à équiper votre commerce ?{" "}
                <Link href="/#produits" className="font-medium text-brand hover:underline">
                  Commander un présentoir
                </Link>
                .
              </p>
            </div>

            <div className="lg:pt-24">
              <h2 className="font-display text-xl font-semibold text-ink">
                Questions fréquentes
              </h2>
              <div className="mt-5 flex flex-col gap-3">
                {REVENDEUR_FAQ.map((f) => (
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
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
                <p className="text-sm font-semibold text-ink">
                  Une question avant de candidater ?
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Programme revendeur reviu")}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                  >
                    <IconMail size={16} /> {CONTACT_EMAIL}
                  </a>
                  {CONTACT_PHONE && (
                    <a
                      href={CONTACT_PHONE.href}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                    >
                      <IconPhone size={16} /> {CONTACT_PHONE.display}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-brand">
        {eyebrow}
      </span>
      <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {accentLastWord(title)}
      </h2>
    </div>
  );
}
