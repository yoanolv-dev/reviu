import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLANS, formatQuota, type Plan } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Tarifs — reviu",
  description:
    "Un prix simple et sans surprise pour collecter plus d'avis Google. Plans Gratuit, Pro et Business, sans engagement.",
};

const FAQ = [
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui. Vous passez d'un plan à l'autre depuis votre tableau de bord ; le changement est immédiat et facturé au prorata.",
  },
  {
    q: "Y a-t-il un engagement ?",
    a: "Aucun. La facturation est mensuelle et vous résiliez quand vous voulez, en un clic.",
  },
  {
    q: "Les présentoirs sont-ils inclus ?",
    a: "Les plans couvrent la plateforme. Les présentoirs NFC + QR sont commandés séparément et fonctionnent avec tous les plans.",
  },
  {
    q: "Que se passe-t-il au-delà de mes quotas ?",
    a: "Vous êtes prévenu avant d'atteindre la limite et invité à passer au plan supérieur. Vos données restent intactes.",
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
              Un prix simple, sans surprise.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
              Commencez gratuitement, passez à la vitesse supérieure quand vous
              le voulez. Sans engagement.
            </p>
          </Container>
        </section>

        {/* GRILLE */}
        <section>
          <Container className="pb-8">
            <div className="grid items-start gap-6 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted">
              Prix HT, facturés mensuellement · TVA en sus · Résiliable à tout
              moment
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
                Créez votre compte gratuitement — aucune carte requise pour
                démarrer.
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
                  Commencer gratuitement
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

function PlanCard({ plan }: { plan: Plan }) {
  const href = plan.id === "free" ? "/signup" : `/signup?plan=${plan.id}`;
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-3xl border bg-surface p-8 shadow-sm",
        plan.featured
          ? "border-brand ring-1 ring-brand"
          : "border-line",
      )}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
          Populaire
        </span>
      )}
      <h2 className="font-display text-lg font-semibold text-ink">{plan.name}</h2>
      <p className="mt-1 text-sm text-muted">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-semibold tracking-tight text-ink">
          {plan.priceMonthly} €
        </span>
        {plan.priceMonthly > 0 && (
          <span className="text-sm text-muted">/ mois</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span>{formatQuota(plan.quotas.establishments)} établissement(s)</span>
        <span aria-hidden className="text-line">
          •
        </span>
        <span>{formatQuota(plan.quotas.stands)} présentoir(s)</span>
      </div>

      <Link
        href={href}
        className={buttonClass(
          plan.featured ? "primary" : "secondary",
          "lg",
          "mt-6 w-full",
        )}
      >
        {plan.cta}
      </Link>

      <ul className="mt-8 flex flex-col gap-3">
        {plan.features.map((feature, i) => (
          <li
            key={feature}
            className={cn(
              "flex items-start gap-2.5 text-[15px] leading-snug",
              i === 0 && plan.id !== "free"
                ? "font-medium text-ink"
                : "text-ink-soft",
            )}
          >
            {!(i === 0 && plan.id !== "free") && <CheckIcon />}
            <span>{feature}</span>
          </li>
        ))}
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
