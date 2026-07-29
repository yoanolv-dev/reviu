import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroBackground } from "@/components/site/hero-background";
import { buttonClass } from "@/components/ui/button";
import {
  buildMetadata,
  graph,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { accentLastWord } from "@/components/ui/accent";
import { STAND_PRICE } from "@/lib/brand";
import { ApplicationForm } from "./application-form";

export const metadata: Metadata = buildMetadata({
  title: "Devenir revendeur reviu - présentoirs d'avis Google",
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

// FAQ : répond aux objections des revendeurs et alimente le balisage FAQPage
// (données structurées) pour gagner en visibilité sur les requêtes revendeur.
const REVENDEUR_FAQ = [
  {
    q: "Combien puis-je gagner en revendant les présentoirs reviu ?",
    a: `Votre marge, c'est la différence entre le tarif de gros (réservé aux revendeurs validés) et votre prix de revente. Le prix public conseillé est de ${STAND_PRICE} le présentoir, mais vous restez libre de fixer le vôtre. La marge est encaissée une fois, à la revente.`,
  },
  {
    q: "Faut-il un stock minimum ou un engagement ?",
    a: "Non. Aucun stock n'est imposé et il n'y a pas d'engagement de volume : vous commandez les quantités dont vous avez besoin, quand vous en avez besoin.",
  },
  {
    q: "Qui gère l'abonnement de suivi du commerçant ?",
    a: "reviu s'en occupe entièrement : l'abonnement de suivi (2,99 €/mois) est facturé directement au commerçant. Vous n'avez aucune facturation récurrente à gérer, et le produit reste utile dans la durée.",
  },
  {
    q: "Ai-je besoin d'une expérience commerciale pour devenir revendeur ?",
    a: "Ce n'est pas indispensable : le présentoir est un produit concret et facile à démontrer. Une formation accompagnée est proposée sur demande (argumentaire, prix, méthode de prospection locale) pour vous lancer sereinement.",
  },
  {
    q: "Comment se passe la sélection des revendeurs ?",
    a: "Chaque candidature est étudiée au cas par cas, à partir du formulaire. Si c'est le bon match, on vous ouvre le tarif de gros et on cale ensemble les conditions. On revient toujours vers vous par e-mail.",
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
          <Container className="py-14 sm:py-20 lg:py-24">
            <div className="reveal max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-medium text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Programme revendeur
              </span>
              <h1 className="mt-5 font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Revendez le présentoir reviu{" "}
                <span className="text-brand">près de chez vous</span>.
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-lg">
                Un{" "}
                <Link href="/#produits" className="font-medium text-brand hover:underline">
                  produit concret
                </Link>
                , facile à démontrer, adossé à un vrai service qui aide les
                commerçants à{" "}
                <Link
                  href="/guides/avoir-plus-avis-google"
                  className="font-medium text-brand hover:underline"
                >
                  collecter plus d&apos;avis Google
                </Link>
                . On sélectionne les revendeurs au cas par cas : tarif de gros,
                conditions claires et formation accompagnée sur demande.
              </p>
              <div className="mt-8">
                <a href="#candidature" className={buttonClass("primary", "lg")}>
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
              {accentLastWord("Trois étapes, une sélection humaine.")}
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="flex h-full flex-col rounded-3xl border border-line bg-canvas p-7"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft font-mono text-sm font-semibold text-brand">
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
                {accentLastWord("Claires, dès le départ.")}
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
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* FAQ REVENDEUR */}
        <section className="border-t border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <span className="font-mono text-xs uppercase tracking-widest text-brand">
              Questions fréquentes
            </span>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {accentLastWord("Ce que les revendeurs nous demandent.")}
            </h2>
            <div className="mt-10 flex max-w-2xl flex-col gap-3">
              {REVENDEUR_FAQ.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-line bg-canvas p-5 open:shadow-[var(--shadow-soft)]"
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

        {/* FORMULAIRE */}
        <section id="candidature" className="scroll-mt-24 border-t border-line">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-2xl">
              <div className="text-center">
                <span className="font-mono text-xs uppercase tracking-widest text-brand">
                  Candidature
                </span>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {accentLastWord("Postulez en 2 minutes.")}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  Parlez-nous de vous et de votre projet. On revient vers vous par
                  e-mail.
                </p>
              </div>
              <div className="mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-8">
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
