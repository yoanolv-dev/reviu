import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroVisual } from "@/components/site/hero-visual";
import { Stars } from "@/components/ui/stars";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { StarMark } from "@/components/ui/logo";
import { Testimonials } from "@/components/site/testimonials";
import { cn } from "@/lib/utils";

// Aperçu du site vitrine, conservé pour inspirer le futur site Shopify.
// La vitrine publique n'est plus servie par l'app (racine → /login).
export const metadata: Metadata = {
  title: "reviu — aperçu du site vitrine",
  robots: { index: false, follow: false },
};

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
    title: "QR dynamique",
    body: "Changez la destination à distance, sans jamais réimprimer un présentoir.",
  },
  {
    title: "Multi-plateforme",
    body: "Google aujourd'hui. Instagram et cartes de menu arrivent bientôt.",
  },
  {
    title: "100% conforme",
    body: "Aucune technique interdite : zéro risque pour votre fiche Google.",
  },
  {
    title: "Analytics clairs",
    body: "Scans, taux de conversion, note dans le temps, par établissement.",
  },
];

const COMPLIANCE = [
  "Tous vos clients accèdent à l'avis Google en un seul geste.",
  "Un canal privé, visible mais discret, recueille les remarques d'amélioration.",
  "Aucun filtrage interdit des avis négatifs : votre fiche reste protégée.",
];

export default function Vitrine() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-[-6rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-brand-soft opacity-70 blur-3xl"
          />
          <Container className="grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
            <div className="flex flex-col items-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Présentoirs NFC + QR dynamiques
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
                Transformez chaque client en{" "}
                <span className="relative whitespace-nowrap text-brand">
                  avis Google
                  <svg
                    aria-hidden
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1.5 left-0 h-2 w-full"
                  >
                    <path
                      d="M3 7 Q100 1 197 6"
                      fill="none"
                      stroke="var(--color-brand)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.35"
                    />
                  </svg>
                </span>
                .
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
                Des présentoirs NFC et QR codes dynamiques, pilotés à distance
                depuis une seule plateforme. Vos clients laissent un avis en un
                geste — vous gardez le contrôle.
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <ButtonLink href="#commander" size="lg">
                  Commander mes présentoirs
                </ButtonLink>
                <ButtonLink
                  href="/r/demo"
                  variant="secondary"
                  size="lg"
                  prefetch={false}
                >
                  Voir la démo
                </ButtonLink>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <Stars size={16} />
                <span className="text-sm text-muted">
                  Conforme aux règles de Google · sans risque
                </span>
              </div>
            </div>
            <HeroVisual />
          </Container>
        </section>

        {/* BANDEAU COMMERCES */}
        <section className="border-y border-line bg-surface">
          <Container className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-5 text-sm">
            <span className="font-medium text-ink-soft">Sur tous les comptoirs :</span>
            {["Restaurants", "Cafés", "Salons", "Garages", "Hôtels", "Boulangeries"].map(
              (t, i) => (
                <span key={t} className="text-muted">
                  {i > 0 && <span className="mr-6 text-line">•</span>}
                  {t}
                </span>
              ),
            )}
          </Container>
        </section>

        {/* FONCTIONNEMENT */}
        <section id="fonctionnement" className="border-t border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <SectionHead eyebrow="Fonctionnement" title="Trois étapes, zéro friction." />
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="flex flex-col">
                  <span className="font-mono text-sm text-brand">{s.n}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* AVANTAGES */}
        <section id="avantages">
          <Container className="py-16 sm:py-20">
            <SectionHead
              eyebrow="Avantages"
              title="Pensé pour collecter, simple à piloter."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-line bg-surface p-6"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
                    <StarMark className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* PREUVE SOCIALE */}
        <Testimonials />

        {/* CONFORMITÉ */}
        <section id="conformite" className="border-y border-line bg-surface">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHead
                eyebrow="Conformité"
                title="La conformité, pas la triche."
                align="left"
              />
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                Beaucoup de solutions filtrent les clients mécontents pour gonfler
                la note — une pratique contraire aux règles de Google, qui peut
                faire supprimer vos avis. reviu prend le parti inverse.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {COMPLIANCE.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4"
                >
                  <CheckIcon />
                  <span className="text-[15px] leading-relaxed text-ink">{c}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* CTA */}
        <section id="commander">
          <Container className="py-20 sm:py-24">
            <div className="rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Prêt à collecter plus d&apos;avis ?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                Commandez vos présentoirs, activez-les en quelques minutes, et
                laissez vos clients faire le reste.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#commander"
                  className={buttonClass(
                    "secondary",
                    "lg",
                    "border-transparent shadow-sm",
                  )}
                >
                  Commander mes présentoirs
                </a>
                <ButtonLink
                  href="/r/demo"
                  variant="ghost"
                  size="lg"
                  prefetch={false}
                  className="!text-white hover:bg-white/10"
                >
                  Voir la démo
                </ButtonLink>
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
