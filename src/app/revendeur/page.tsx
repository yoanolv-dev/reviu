import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroBackground } from "@/components/site/hero-background";
import { buildMetadata } from "@/lib/seo";
import { STAND_PRICE } from "@/lib/brand";
import { ApplicationForm } from "./application-form";

export const metadata: Metadata = buildMetadata({
  title: "Devenir revendeur reviu — présentoirs d'avis Google",
  description:
    "Revendez les présentoirs reviu près de chez vous : tarif de gros sur candidature, conditions de revente claires et une formation accompagnée sur demande. Postulez en 2 minutes.",
  path: "/revendeur",
  keywords: [
    "revendeur avis Google",
    "revendre présentoir NFC",
    "distribuer présentoir avis Google",
    "programme revendeur reviu",
  ],
});

const STEPS = [
  {
    n: "01",
    title: "Vous candidatez",
    body: "Un formulaire en 2 minutes. On étudie chaque candidature au cas par cas.",
  },
  {
    n: "02",
    title: "On vous valide",
    body: "Si c'est le bon match, on vous ouvre le tarif de gros et on cale les conditions.",
  },
  {
    n: "03",
    title: "Vous revendez, accompagné",
    body: "Vous placez les présentoirs chez les commerçants, avec une formation sur demande.",
  },
];

const CONDITIONS = [
  "Tarif de gros réservé aux revendeurs validés : votre marge est encaissée à la revente, une fois.",
  `Prix public conseillé : ${STAND_PRICE} le présentoir. Vous restez libre de votre prix de revente.`,
  "L'abonnement de suivi (2,99 €/mois) est facturé par reviu directement au commerçant : rien à gérer pour vous, et un produit qui reste utile dans la durée.",
  "Aucun stock imposé : vous commandez les quantités dont vous avez besoin.",
  "Formation accompagnée sur demande : argumentaire, prix, méthode de prospection locale.",
  "Respect des règles Google : on invite tous les clients à laisser un avis, jamais de tri selon la note.",
];

export default function RevendeurPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-canvas">
        {/* HERO */}
        <section className="relative isolate overflow-hidden border-b border-line">
          <HeroBackground />
          <Container className="py-14 sm:py-20 lg:py-24">
            <div className="reveal max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-medium text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Programme revendeur
              </span>
              <h1 className="mt-5 font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Revendez le présentoir reviu{" "}
                <span className="text-gradient">près de chez vous</span>.
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-lg">
                Un produit concret, facile à démontrer, adossé à un vrai service.
                On sélectionne les revendeurs au cas par cas : tarif de gros,
                conditions claires et formation accompagnée sur demande.
              </p>
              <div className="mt-8">
                <a href="#candidature" className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-brand px-6 text-[15px] font-medium text-white shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5">
                  Postuler maintenant
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <span className="font-mono text-xs uppercase tracking-widest text-brand">
              Comment ça marche
            </span>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Trois étapes, une sélection humaine.
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="flex h-full flex-col rounded-3xl border border-line bg-canvas p-7"
                >
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
              ))}
            </div>
          </Container>
        </section>

        {/* CONDITIONS DE REVENTE */}
        <section>
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-brand">
                Conditions de revente
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Claires, dès le départ.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                Le modèle est simple : vous gagnez votre marge à la revente du
                présentoir. reviu garde le suivi mensuel du commerçant. Pas de
                commission à suivre, pas de flou.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {CONDITIONS.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-[15px] leading-relaxed text-ink"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* FORMULAIRE */}
        <section id="candidature" className="scroll-mt-24 border-t border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-2xl">
              <div className="text-center">
                <span className="font-mono text-xs uppercase tracking-widest text-brand">
                  Candidature
                </span>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Postulez en 2 minutes.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  Parlez-nous de vous et de votre projet. On revient vers vous par
                  e-mail.
                </p>
              </div>
              <div className="mt-10 rounded-3xl border border-line bg-canvas p-6 sm:p-8">
                <ApplicationForm />
              </div>
              <p className="mt-6 text-center text-sm text-muted">
                Vous cherchez plutôt à équiper votre commerce ?{" "}
                <Link href="/boutique#produits" className="font-medium text-brand hover:underline">
                  Commander un présentoir
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
