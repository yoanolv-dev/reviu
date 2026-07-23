import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroVisual } from "@/components/site/hero-visual";
import { ProductPhoto } from "@/components/site/product-photo";
import { buttonClass } from "@/components/ui/button";
import { StarMark } from "@/components/ui/logo";
import { Testimonials } from "@/components/site/testimonials";
import {
  APP_BASE,
  SITE_URL,
  SUBSCRIPTION,
  STAND_PRICE,
  BOUTIQUE_URL,
} from "@/lib/brand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Comment ça marche — reviu",
  description:
    "Présentoirs NFC et QR codes dynamiques pour faciliter le dépôt d'avis Google de vos vrais clients. Avis public ou retour privé, au choix du client — vous pilotez tout depuis une seule plateforme.",
  alternates: { canonical: `${SITE_URL}/home` },
  robots: { index: true, follow: true },
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

export default function HomePage() {
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
            <div className="reveal flex flex-col items-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Présentoirs NFC + QR dynamiques
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
                Le dépôt d&apos;
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
                , simplifié.
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
                Des présentoirs NFC et QR codes dynamiques, pilotés à distance
                depuis une seule plateforme. Vos clients laissent un avis en un
                geste — vous gardez le contrôle.
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href={`${APP_BASE}/signup`}
                  className={buttonClass("primary", "lg")}
                >
                  Créer mon compte
                </a>
                <Link href="/demo" className={buttonClass("secondary", "lg")}>
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
                  className="elev elev-hover rounded-2xl border border-line bg-surface p-6"
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

        {/* ABONNEMENT / VALEUR */}
        <section id="abonnement" className="border-t border-line bg-surface">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
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
                et vos retours privés — et bientôt la gestion de vos avis Google
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
            <div className="elev rounded-3xl border border-line bg-canvas p-8">
              <ProductPhoto
                src="/products/presentoir.png"
                alt="Présentoir reviu NFC + QR pour avis Google"
                className="mb-6 aspect-[16/10] w-full"
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
                className={buttonClass("primary", "lg", "mt-6 w-full")}
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
                title="Avis public ou retour privé, au choix du client."
                align="left"
              />
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                reviu invite tous vos clients à laisser un avis Google, quel que
                soit leur ressenti. Le retour privé est un canal de contact
                direct proposé en complément — jamais un moyen d&apos;éviter un
                avis négatif. Aucun tri automatique selon la note.
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
        <section>
          <Container className="py-20 sm:py-24">
            <div className="rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
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
                  className={buttonClass(
                    "secondary",
                    "lg",
                    "border-transparent",
                  )}
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
