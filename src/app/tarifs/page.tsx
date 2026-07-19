import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OFFERS, type Offer } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Tarifs — reviu",
  description:
    "La plaque redirige toujours, gratuitement. Activez le suivi à 2,99 €/mois par présentoir pour piloter et mesurer. Sans engagement.",
};

const FAQ = [
  {
    q: "Dois-je m'abonner pour que ma plaque fonctionne ?",
    a: "Non. Votre présentoir redirige vers votre lien à vie, gratuitement. L'abonnement ne sert qu'au suivi des scans et à la modification du lien à distance.",
  },
  {
    q: "Comment est facturé le suivi ?",
    a: "2,99 € par mois et par présentoir suivi. Vous activez le suivi présentoir par présentoir, et tout est regroupé sur une seule facture mensuelle.",
  },
  {
    q: "Puis-je changer mon lien ?",
    a: "Le lien initial se pose gratuitement à l'activation. Le modifier ensuite — et suivre les scans en temps réel — fait partie du Suivi reviu.",
  },
  {
    q: "Et si j'arrête l'abonnement ?",
    a: "Votre plaque continue de rediriger normalement. Seuls les statistiques et les changements de lien se mettent en pause. Vos données sont conservées.",
  },
];

export default function TarifsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-brand-soft opacity-70 blur-3xl"
          />
          <Container className="py-16 text-center sm:py-20">
            <span className="font-mono text-xs uppercase tracking-widest text-brand">
              Tarifs
            </span>
            <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              La plaque est gratuite à vie. Le suivi, quand vous voulez.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-ink-soft">
              Votre présentoir redirige vers votre avis, sans abonnement. Activez
              le suivi à 2,99 €/mois par présentoir pour tout piloter et mesurer.
            </p>
          </Container>
        </section>

        {/* GRILLE */}
        <section>
          <Container className="pb-8">
            <div className="mx-auto grid max-w-4xl items-start gap-6 sm:grid-cols-2">
              {OFFERS.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted">
              Prix HT · Suivi facturé mensuellement, par présentoir · Sans
              engagement, résiliable à tout moment
            </p>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-ink">
              Questions fréquentes
            </h2>
            <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
              {FAQ.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-line bg-canvas p-6"
                >
                  <h3 className="font-display text-base font-semibold text-ink">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section>
          <Container className="py-16 sm:py-20">
            <div className="rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Prêt à collecter plus d&apos;avis ?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                Activez votre présentoir en deux minutes — aucune carte requise
                pour démarrer.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/signup"
                  className={buttonClass(
                    "secondary",
                    "lg",
                    "border-transparent shadow-sm",
                  )}
                >
                  Activer ma plaque
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-3xl border bg-surface p-8 shadow-sm",
        offer.featured ? "border-brand ring-1 ring-brand" : "border-line",
      )}
    >
      {offer.featured && (
        <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
          Recommandé
        </span>
      )}
      <h2 className="font-display text-lg font-semibold text-ink">
        {offer.name}
      </h2>
      <p className="mt-1 text-sm text-muted">{offer.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-semibold tracking-tight text-ink">
          {offer.priceLabel}
        </span>
        {offer.priceNote && (
          <span className="text-sm text-muted">{offer.priceNote}</span>
        )}
      </div>

      <Link
        href="/signup"
        className={buttonClass(
          offer.featured ? "primary" : "secondary",
          "lg",
          "mt-6 w-full",
        )}
      >
        {offer.cta}
      </Link>

      <ul className="mt-8 flex flex-col gap-3">
        {offer.features.map((feature, i) => {
          const isHeading = i === 0 && offer.id !== "free";
          return (
            <li
              key={feature}
              className={cn(
                "flex items-start gap-2.5 text-[15px] leading-snug",
                isHeading ? "font-medium text-ink" : "text-ink-soft",
              )}
            >
              {!isHeading && <CheckIcon />}
              <span>{feature}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
      <svg
        viewBox="0 0 24 24"
        className="h-2.5 w-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}
