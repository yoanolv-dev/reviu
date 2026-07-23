import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Stars } from "@/components/ui/stars";
import { Logo } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";
import { qrSvg } from "@/lib/qr";
import {
  APP_BASE,
  SITE_URL,
  SUBSCRIPTION,
  CONTACT_EMAIL,
  STAND_PRICE,
  SHOPIFY_PRODUCT_URL,
} from "@/lib/brand";

export const metadata: Metadata = {
  title: "Démo produit — reviu",
  description:
    "Découvrez reviu en images : le parcours de scan vers l'avis Google, le présentoir NFC + QR, le tableau de bord et les deux modes de redirection.",
  alternates: { canonical: `${SITE_URL}/demo` },
  robots: { index: true, follow: true },
};

/* Petit « G » Google multicolore. */
function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function Check() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-white">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

/* Exemples de commerces (illustratifs) — à remplacer par de vrais clients. */
const CLIENTS: { name: string; icon: React.ReactNode }[] = [
  { name: "Le Comptoir de Camille", icon: <path d="M4 8h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm13 1h2a2 2 0 0 1 0 4h-2" /> },
  { name: "Studio Épure", icon: <><circle cx="12" cy="12" r="8" /><path d="M12 4v8l5 3" /></> },
  { name: "Garage Central", icon: <path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.6 2.6-2.1-2.1 2.7-2.5Z" /> },
  { name: "Boulangerie Marlow", icon: <><path d="M6 20V9a6 6 0 0 1 12 0v11" /><path d="M6 13h12M12 7v13" /></> },
  { name: "Hôtel Rivage", icon: <><path d="M3 20V7l9-4 9 4v13" /><path d="M9 20v-6h6v6" /></> },
  { name: "Salon Nour", icon: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.5 15.5M20 20 8.5 8.5" /></> },
];

/* Cadre de téléphone réutilisable. */
function Phone({
  children,
  width = 288,
}: {
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <div
      className="rounded-[44px] bg-ink p-2 shadow-[0_30px_60px_-34px_rgba(20,30,70,0.45)]"
      style={{ width }}
    >
      <div className="relative aspect-[9/19.2] overflow-hidden rounded-[37px] bg-white text-ink">
        <div className="flex h-[34px] items-center justify-center">
          <span className="h-[5px] w-[52px] rounded-full bg-ink/15" />
        </div>
        <div className="flex h-[calc(100%-34px)] flex-col px-5 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs font-semibold uppercase tracking-wide text-brand">
      {children}
    </span>
  );
}

export default async function DemoPage() {
  const qr = await qrSvg("demo");

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO */}
        <Container className="grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Kicker>Démo produit · NFC + QR</Kicker>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
              Un scan pour simplifier
              <br />
              chaque avis Google.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              Un présentoir sur le comptoir, un scan, un avis. reviu enregistre
              chaque interaction et vous laisse tout piloter à distance — sans
              jamais réimprimer.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={`${APP_BASE}/signup`} className={buttonClass("primary", "lg")}>
                Créer mon compte
              </a>
              <Link
                href="/r/demo"
                prefetch={false}
                className="font-mono text-sm text-brand hover:underline"
              >
                Essayer la vraie page →
              </Link>
            </div>
            <p className="mt-4 font-mono text-[13px] text-muted">
              <span className="font-semibold text-ink">
                {SUBSCRIPTION.priceLabel}
              </span>{" "}
              / {SUBSCRIPTION.period} · par présentoir · sans engagement
            </p>
          </div>

          {/* Téléphone — UI d'avis Google */}
          <div className="justify-self-center">
            <Phone>
              <div className="flex items-center gap-2.5 border-b border-line pb-3.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft font-display text-lg font-bold text-brand">
                  C
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    Le Comptoir de Camille
                  </span>
                  <span className="block text-[11px] text-muted">Café · Nîmes</span>
                </span>
              </div>
              <p className="mt-5 text-sm font-semibold text-ink">
                Notez votre expérience
              </p>
              <div className="mt-3">
                <Stars size={30} />
              </div>
              <div className="mt-4 flex-1 rounded-xl border border-line p-3 text-xs text-muted">
                Partagez les détails de votre expérience…
              </div>
              <div className="mt-3.5 flex h-11 items-center justify-center rounded-xl bg-[#1b73e8] text-sm font-semibold text-white">
                Publier
              </div>
              <p className="mt-3 text-center font-mono text-[10px] text-muted">
                via reviu · r.reviu.fr/demo
              </p>
            </Phone>
          </div>
        </Container>

        {/* BANDE CLIENTS */}
        <section className="border-y border-line bg-surface">
          <Container className="py-9">
            <p className="text-center font-mono text-[11px] uppercase tracking-wider text-muted">
              Pensé pour les commerces de proximité
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-9 gap-y-5">
              {CLIENTS.map((c) => (
                <span
                  key={c.name}
                  className="flex items-center gap-2 text-muted transition-colors hover:text-ink-soft"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {c.icon}
                  </svg>
                  <span className="font-display text-[15px] font-semibold tracking-tight">
                    {c.name}
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-muted">
              Commerces illustratifs — vos futurs clients ici.
            </p>
          </Container>
        </section>

        {/* PRÉSENTOIR */}
        <section className="border-t border-line">
          <Container className="grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="justify-self-center" style={{ width: 260 }}>
              <div className="rounded-[20px] border border-line bg-surface p-6 text-center shadow-[0_16px_40px_-28px_rgba(20,30,70,0.5)]">
                <div
                  className="mx-auto h-[150px] w-[150px] rounded-xl bg-white p-2 shadow-[0_0_0_1px_var(--color-line)] [&_svg]:h-full [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: qr }}
                />
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-medium text-brand">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                    <path d="M5 17c3.5-4 3.5-6 0-10M9.5 15c2-2.5 2-3.5 0-6M14 20c6-6 6-10 0-16" />
                  </svg>
                  NFC · approchez le téléphone
                </span>
                <p className="mt-3 font-mono text-xs text-muted">r.reviu.fr/demo</p>
              </div>
              <div className="mx-auto h-3.5 w-[70%] rounded-b-[30px] bg-gradient-to-b from-line to-transparent" />
            </div>
            <div>
              <Kicker>Le présentoir</Kicker>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Un objet, deux technologies, un lien permanent.
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
                Chaque présentoir embarque un QR imprimé et une puce NFC, tous
                deux encodés sur une adresse{" "}
                <span className="font-mono text-ink">r.reviu.fr</span> unique et
                définitive. Elle passe par nos serveurs : vous changez la
                destination quand vous voulez, l&apos;objet reste le même.
              </p>
              <p className="mt-3 max-w-md leading-relaxed text-ink-soft">
                Un secret d&apos;activation imprimé sous la base garantit que
                seul le commerçant peut le relier à son établissement.
              </p>
            </div>
          </Container>
        </section>

        {/* DASHBOARD */}
        <section className="border-t border-line bg-surface" id="dashboard">
          <Container className="py-16 sm:py-20">
            <Kicker>Le tableau de bord</Kicker>
            <h2 className="mt-2 max-w-2xl font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Ce qui se passe sur le comptoir, en clair.
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Scans, clics vers Google, taux de clic et présentoirs — par
              établissement, en temps réel.{" "}
              <span className="text-muted">Aperçu avec données de démonstration.</span>
            </p>

            <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-canvas shadow-[0_36px_70px_-40px_rgba(20,30,70,0.5)]">
              {/* barre navigateur */}
              <div className="flex items-center gap-3 border-b border-line bg-line-soft px-4 py-3">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                </span>
                <span className="font-mono text-xs text-muted">
                  app.reviu.fr/dashboard
                </span>
              </div>
              <div className="grid md:grid-cols-[190px_1fr]">
                <aside className="hidden border-r border-line bg-line-soft p-4 md:block">
                  <div className="mb-5 px-1">
                    <Logo className="!text-lg" />
                  </div>
                  {[
                    ["Vue d'ensemble", true],
                    ["Présentoirs", false],
                    ["Établissement", false],
                    ["Avis privés", false],
                  ].map(([label, on]) => (
                    <div
                      key={label as string}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
                        on
                          ? "bg-brand-soft font-medium text-brand"
                          : "text-ink-soft"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-[2px] bg-current opacity-60" />
                      {label}
                    </div>
                  ))}
                </aside>
                <div className="p-6 sm:p-7">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-brand">
                    Vue d&apos;ensemble
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-ink">
                    Le Comptoir de Camille
                  </p>
                  <div className="mt-5 grid gap-3.5 sm:grid-cols-3">
                    {[
                      ["Scans · 30 j", "248", "+18 %"],
                      ["Clics vers Google", "205", "+12 %"],
                      ["Taux de clic Google", "83 %", "+6 %"],
                    ].map(([k, v, d]) => (
                      <div
                        key={k}
                        className="rounded-2xl border border-line bg-surface px-4 py-4"
                      >
                        <p className="text-xs text-muted">{k}</p>
                        <p className="mt-1.5 font-display text-[1.7rem] font-semibold tabular-nums tracking-tight text-ink">
                          {v}
                        </p>
                        <p className="text-xs font-semibold text-emerald-600">
                          {d}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* graphe en aire */}
                  <div className="mt-4 rounded-2xl border border-line bg-surface px-5 pb-2 pt-4">
                    <p className="text-[13px] font-medium text-ink-soft">
                      Scans · 6 derniers mois
                    </p>
                    <svg
                      viewBox="0 0 560 150"
                      width="100%"
                      height="130"
                      preserveAspectRatio="none"
                      className="mt-2"
                      aria-hidden
                    >
                      <defs>
                        <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="var(--color-brand)" stopOpacity="0.26" />
                          <stop offset="1" stopColor="var(--color-brand)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="112" x2="560" y2="112" stroke="var(--color-line)" />
                      <line x1="0" y1="74" x2="560" y2="74" stroke="var(--color-line)" strokeDasharray="3 6" />
                      <line x1="0" y1="36" x2="560" y2="36" stroke="var(--color-line)" strokeDasharray="3 6" />
                      <path
                        d="M0 104 C 60 100 90 86 140 84 C 200 82 210 62 280 60 C 340 58 350 70 420 52 C 480 38 500 24 560 18 L560 130 L0 130 Z"
                        fill="url(#cf)"
                      />
                      <path
                        d="M0 104 C 60 100 90 86 140 84 C 200 82 210 62 280 60 C 340 58 350 70 420 52 C 480 38 500 24 560 18"
                        fill="none"
                        stroke="var(--color-brand)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="560" cy="18" r="4.5" fill="var(--color-brand)" />
                    </svg>
                  </div>

                  {/* tableau présentoirs */}
                  <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
                    {[
                      ["k7Qm2p", "Actif", "142", true],
                      ["a3Xf9r", "Actif", "106", true],
                      ["m8Zt4w", "Vierge", "—", false],
                    ].map(([code, status, n, active], i) => (
                      <div
                        key={code as string}
                        className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-3.5 px-4 py-3 text-[13px] ${
                          i > 0 ? "border-t border-line" : ""
                        }`}
                      >
                        <span className="font-mono font-semibold text-ink">
                          {code}
                        </span>
                        <span className="truncate font-mono text-xs text-muted">
                          r.reviu.fr/{code}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-line-soft text-muted"
                          }`}
                        >
                          {status}
                        </span>
                        <span className="font-semibold tabular-nums text-ink">
                          {n}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* DEUX MODES */}
        <section className="border-t border-line">
          <Container className="py-16 sm:py-20">
            <Kicker>Deux expériences</Kicker>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Direct, ou à votre image.
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Le même présentoir, le comportement que vous choisissez —
              modifiable à tout moment, sans réimprimer.
            </p>

            <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-8">
              {/* mode direct */}
              <div className="flex flex-col items-center text-center">
                <Phone width={224}>
                  <div className="mt-1.5 flex items-center justify-center gap-2">
                    <GoogleG size={20} />
                    <span className="text-xs font-semibold text-ink">
                      Avis · Le Comptoir…
                    </span>
                  </div>
                  <p className="mt-4 text-center text-sm font-semibold text-ink">
                    Notez votre expérience
                  </p>
                  <div className="mt-3 flex justify-center">
                    <Stars size={22} />
                  </div>
                  <div className="mt-4 min-h-[44px] flex-1 rounded-xl border border-line p-3 text-xs text-muted">
                    Écrire un avis public…
                  </div>
                </Phone>
                <div className="mt-6">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    Défaut
                  </span>
                  <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
                    Accès direct Google
                  </h3>
                  <p className="mx-auto mt-1.5 max-w-[34ch] text-[15px] text-ink-soft">
                    Un scan, la page d&apos;avis Google s&apos;ouvre aussitôt.
                    Volume maximal.
                  </p>
                </div>
              </div>

              {/* mode page reviu */}
              <div className="flex flex-col items-center text-center">
                <Phone width={224}>
                  <span className="mx-auto mt-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-soft font-display text-xl font-bold text-brand">
                    C
                  </span>
                  <p className="mt-2.5 text-center text-[13px] font-bold text-ink">
                    Le Comptoir de Camille
                  </p>
                  <p className="mt-1 text-center text-[10.5px] text-muted">
                    Comment s&apos;est passée votre visite&nbsp;?
                  </p>
                  <div className="mt-3 flex justify-center">
                    <Stars size={19} />
                  </div>
                  <div className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-white text-xs font-semibold text-[#3c4043]">
                    <GoogleG size={14} /> Avis sur Google
                  </div>
                  <p className="mt-3.5 text-center text-[10px] text-muted underline">
                    J&apos;ai rencontré un souci
                  </p>
                </Phone>
                <div className="mt-6">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    Personnalisé
                  </span>
                  <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
                    Page reviu
                  </h3>
                  <p className="mx-auto mt-1.5 max-w-[34ch] text-[15px] text-ink-soft">
                    Votre marque, un accueil, et un canal de contact direct — le
                    bouton « Avis Google » reste proposé à tous.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* TARIFS */}
        <section className="border-t border-line bg-surface" id="tarifs">
          <Container className="py-16 sm:py-20">
            <div className="max-w-2xl">
              <Kicker>Tarifs</Kicker>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Simple, à l&apos;usage, sans engagement.
              </h2>
              <p className="mt-3 text-ink-soft">
                Le présentoir s&apos;achète une fois ({STAND_PRICE}, livraison en
                France métropolitaine) et s&apos;active gratuitement.
                L&apos;abonnement de suivi se paie ensuite par présentoir — et
                évolue vers un vrai hub de réputation.
              </p>
              <a
                href={SHOPIFY_PRODUCT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-mono text-sm text-brand hover:underline"
              >
                Commander un présentoir ({STAND_PRICE}) →
              </a>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {/* Essentiel */}
              <div className="flex flex-col rounded-3xl border-2 border-brand bg-canvas p-8 shadow-[0_24px_60px_-40px_rgba(27,77,255,0.55)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    Essentiel
                  </h3>
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                    Disponible
                  </span>
                </div>
                <p className="mt-4 font-display text-5xl font-semibold tracking-tight text-ink">
                  {SUBSCRIPTION.priceLabel}
                  <span className="text-lg font-normal text-muted">
                    {" "}
                    /{SUBSCRIPTION.period}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted">
                  par présentoir · sans engagement
                </p>
                <a
                  href={`${APP_BASE}/signup`}
                  className={buttonClass("primary", "lg", "mt-6 w-full")}
                >
                  Commencer
                </a>
                <ul className="mt-7 flex flex-col gap-3 text-[15px] text-ink">
                  {[
                    "Statistiques de scan en temps réel",
                    "Taux de clic vers Google & attribution NFC vs QR",
                    "Modification illimitée des liens à distance",
                    "Choix du mode de scan (direct Google ou page reviu)",
                    "Retours privés : un canal de contact direct",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-muted">
                  Présentoir vendu séparément ({STAND_PRICE}, achat unique) ;
                  activation gratuite. Résiliable à tout moment : la redirection
                  du présentoir continue, seules les fonctions de suivi sont
                  désactivées.
                </p>
              </div>

              {/* Pro */}
              <div className="flex flex-col rounded-3xl border border-line bg-surface p-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    Pro
                  </h3>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                    Bientôt
                  </span>
                </div>
                <p className="mt-4 font-display text-5xl font-semibold tracking-tight text-ink">
                  Bientôt
                </p>
                <p className="mt-1 text-sm text-muted">
                  pour la gestion complète de votre réputation
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=reviu%20Pro`}
                  className={buttonClass("secondary", "lg", "mt-6 w-full")}
                >
                  Être prévenu
                </a>
                <p className="mt-7 text-sm font-medium text-ink-soft">
                  Tout l&apos;Essentiel, plus :
                </p>
                <ul className="mt-3 flex flex-col gap-3 text-[15px] text-ink">
                  {[
                    "Alertes e-mail à chaque nouvel avis Google",
                    "Réponses aux avis assistées par IA",
                    "Avis Google intégrés : consulter & répondre depuis reviu",
                    "Statistiques de votre fiche Google",
                    "Gestion multi-établissements",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-ink-soft">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <Container className="py-16 sm:py-20">
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl border border-line bg-canvas px-8 py-12 sm:px-12">
            <h2 className="max-w-[20ch] font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Prêt à collecter plus d&apos;avis&nbsp;?
            </h2>
            <div className="flex flex-wrap gap-3">
              <a href={`${APP_BASE}/signup`} className={buttonClass("primary", "lg")}>
                Créer mon compte
              </a>
              <Link href="/home" className={buttonClass("secondary", "lg")}>
                En savoir plus
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
