import type { Metadata } from "next";
import type { ReactNode } from "react";
import { preconnect } from "react-dom";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductPhoto } from "@/components/site/product-photo";
import { HeroBackground } from "@/components/site/hero-background";
import { Reveal } from "@/components/site/reveal";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { buttonClass } from "@/components/ui/button";
import { accentLastWord } from "@/components/ui/accent";
import { Stars } from "@/components/ui/stars";
import {
  IconArrowRight,
  IconChart,
  IconCheck,
  IconClose,
  IconFlag,
  IconLink,
  IconLock,
  IconMail,
  IconNfc,
  IconPhone,
  IconPlay,
  IconQr,
  IconShield,
  IconSmartphone,
  IconTruck,
} from "@/components/ui/icons";
import {
  STAND_PRICE,
  SHIPPING,
  GUARANTEE,
  INCLUDED_SPACE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  QR_TOOL_PATH,
} from "@/lib/brand";
import { STAND_TIERS, STAND_QTY_MAX, formatEuros } from "@/lib/shop";
import { PHOTO, PRODUCT_PATH } from "@/lib/photos";
import { TESTIMONIALS } from "@/lib/testimonials";
import { buildMetadata, graph, faqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ScanDemo } from "./scan-demo";
import { StickyBuyBar } from "./sticky-buy-bar";
import { QuickOrder } from "./quick-order";

export const metadata: Metadata = buildMetadata({
  title: "reviu : le présentoir NFC + QR code pour plus d'avis Google",
  description:
    "Le présentoir NFC + QR code qui ouvre votre page d'avis Google en un geste. 29,90 €, sans abonnement, livraison offerte, satisfait ou remboursé 30 jours.",
  path: "/",
  keywords: [
    "présentoir avis Google",
    "plaque NFC avis Google",
    "QR code avis Google",
    "obtenir plus d'avis Google",
    "support avis Google",
    "présentoir avis clients",
  ],
});

// Phrase « métiers » : chaque métier mène à son guide (maillage SEO).
const METIERS: { pre: string; label: string; href: string }[] = [
  { pre: "d'un", label: "restaurant", href: "/guides/avis-google-restaurant" },
  { pre: "d'un", label: "salon de coiffure", href: "/guides/avis-google-coiffeur" },
  { pre: "d'un", label: "garage", href: "/guides/avis-google-garage" },
  { pre: "d'une", label: "boulangerie", href: "/guides/avis-google-boulangerie" },
  { pre: "d'un", label: "institut de beauté", href: "/guides/avis-google-institut-beaute" },
  { pre: "d'un", label: "hôtel", href: "/guides/avis-google-hotel" },
  { pre: "d'une", label: "boutique", href: "/guides/avis-google-boutique" },
  { pre: "d'un", label: "cabinet dentaire", href: "/guides/avis-google-dentiste" },
  { pre: "d'une", label: "salle de sport", href: "/guides/avis-google-salle-de-sport" },
];

type Cell = boolean | "partial" | string;
const COMPARISON: { label: string; oral: Cell; qr: Cell; reviu: Cell }[] = [
  { label: "Le client trouve votre fiche sans chercher", oral: false, qr: true, reviu: true },
  { label: "Un simple contact suffit (NFC)", oral: false, qr: false, reviu: true },
  { label: "Visible en permanence au comptoir", oral: false, qr: "partial", reviu: true },
  { label: "Lien modifiable sans rien réimprimer", oral: false, qr: false, reviu: true },
  { label: "Statistiques de scans (QR code et NFC)", oral: false, qr: false, reviu: true },
  { label: "Coût", oral: "Gratuit", qr: "Gratuit", reviu: "29,90 € une fois" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Y a-t-il un abonnement ou des frais récurrents ?",
    a: "Non. Le présentoir est un achat unique à 29,90 € TTC, livraison offerte. Votre espace Reviu est inclus, sans abonnement : vous suivez vos statistiques de scans (QR et NFC distingués), gérez vos présentoirs et modifiez votre lien de redirection à tout moment.",
  },
  {
    q: "Et si le présentoir ne me convient pas ?",
    a: `Vous êtes couvert par notre garantie « ${GUARANTEE.label} ». ${GUARANTEE.detail} Cette garantie s'ajoute au droit de rétractation légal de 14 jours.`,
  },
  {
    q: "Comment fonctionne le présentoir ?",
    a: "Posez-le sur votre comptoir. Le client approche son téléphone de la puce NFC ou scanne le QR code, et votre page d'avis Google s'ouvre instantanément. Aucune application à installer.",
  },
  {
    q: "Est-il compatible avec iPhone et Android ?",
    a: "Oui. Le QR code fonctionne sur tous les smartphones. La lecture NFC est prise en charge sans application par les iPhone récents (XS et plus) et la grande majorité des Android équipés du NFC.",
  },
  {
    q: "Quels sont les délais et les frais de livraison ?",
    a: `La livraison est offerte dès le premier présentoir, en France métropolitaine, sous ${SHIPPING.delay}. Paiement sécurisé par carte via Stripe, facture transmise automatiquement.`,
  },
  {
    q: "Reviu filtre-t-il les avis négatifs ?",
    a: "Non. Reviu ne filtre pas les clients selon leur satisfaction : tous peuvent accéder à votre page d'avis Google, de la même manière. C'est la règle de Google, et c'est aussi ce qui rend vos avis crédibles.",
  },
];

export default function BoutiquePage() {
  // Préchauffe la connexion au SDK Stripe pour l'étape de paiement.
  preconnect("https://js.stripe.com");
  const schema = graph(faqSchema(FAQ));
  const tierNote = STAND_TIERS.slice(1)
    .map((t) => `${formatEuros(t.unitCents)} dès ${t.min}`)
    .join(", ");

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        {/* HERO : hauteur visible sur desktop (100svh - bandeau 36px - header 68px). */}
        <section
          id="hero"
          className="relative isolate overflow-hidden lg:flex lg:min-h-[calc(100svh-104px)] lg:flex-col"
        >
          <HeroBackground />
          <Container className="grid w-full flex-1 items-center gap-10 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
            <div className="reveal flex flex-col items-start">
              <h1 className="font-display text-[2.15rem] font-semibold leading-[1.06] tracking-tight text-ink sm:text-[2.9rem] lg:text-[3.5rem] lg:leading-[1.03]">
                Obtenez plus d&apos;avis Google, directement depuis votre{" "}
                <span className="text-brand">comptoir</span>.
              </h1>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-ink-soft sm:mt-6 sm:text-lg">
                Le présentoir NFC + QR code reviu : vos clients approchent leur
                téléphone ou scannent, et votre page d&apos;avis Google
                s&apos;ouvre instantanément. Sans application, sans abonnement.
              </p>
              <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row">
                <a
                  href="#produits"
                  className={buttonClass("primary", "lg", "group h-14 w-full px-7 text-base sm:w-auto")}
                >
                  Commander - {STAND_PRICE}
                  <IconArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#fonctionnement"
                  className={buttonClass("secondary", "lg", "h-14 w-full px-6 text-base sm:w-auto")}
                >
                  <IconPlay size={18} className="text-brand" />
                  Voir comment ça marche
                </a>
              </div>
              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5 text-[13.5px] font-medium text-ink-soft">
                <Reassure icon={<IconTruck size={16} />}>Livraison offerte</Reassure>
                <Reassure icon={<IconShield size={16} />}>
                  Satisfait ou remboursé<span className="hidden sm:inline">&nbsp;30&nbsp;j</span>
                </Reassure>
                <Reassure icon={<IconSmartphone size={16} />}>Sans abonnement</Reassure>
              </ul>
            </div>

            <HeroVisual />
          </Container>
        </section>

        {/* MÉTIERS : une phrase éditoriale, chaque métier mène à son guide. */}
        <section aria-label="Pour tous les commerces de proximité" className="border-y border-line bg-surface">
          <Container className="py-14 sm:py-20">
            <p className="mx-auto max-w-4xl text-center font-display text-[1.45rem] font-medium leading-[1.45] tracking-tight text-muted sm:text-[1.9rem] lg:text-[2.15rem]">
              Au comptoir{" "}
              {METIERS.map((m, i) => (
                <span key={m.href}>
                  {m.pre}{" "}
                  <Link
                    href={m.href}
                    className="whitespace-nowrap text-ink underline decoration-brand/30 decoration-2 underline-offset-[6px] transition-colors hover:text-brand hover:decoration-brand"
                  >
                    {m.label}
                  </Link>
                  {i < METIERS.length - 2 ? ", " : i === METIERS.length - 2 ? " ou " : ""}
                </span>
              ))}
              &nbsp;: <span className="text-ink">vos clients satisfaits deviennent des avis Google.</span>
            </p>
          </Container>
        </section>

        {/* PARCOURS CLIENT (démo animée) */}
        <section id="fonctionnement" className="scroll-mt-20">
          <Container className="py-16 sm:py-24">
            <Reveal>
              <SectionHead
                title="Un geste, et votre page d'avis s'ouvre."
                intro="Le présentoir supprime tout ce qui fait renoncer un client satisfait : chercher votre fiche, trouver le bouton, remettre à plus tard."
              />
            </Reveal>
            <div className="mt-12 sm:mt-14">
              <ScanDemo />
            </div>
          </Container>
        </section>

        {/* TÉMOIGNAGES (affichés dès le premier vrai témoignage) */}
        <TestimonialsSection items={TESTIMONIALS} />

        {/* COMMANDE EXPRESS : le détail vit sur la fiche produit. */}
        <section id="produits" className="scroll-mt-20 border-y border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12">
              <Link href={PRODUCT_PATH} className="group block" aria-label="Voir la fiche du présentoir">
                <ProductPhoto
                  src={PHOTO.front}
                  alt="Présentoir Reviu NFC et QR code pour avis Google"
                  sizes="(min-width: 768px) 420px, 90vw"
                  className="mx-auto aspect-square w-full max-w-[220px] rounded-[2rem] sm:max-w-[420px]"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </Link>
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {accentLastWord("Commandez votre présentoir.")}
                </h2>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  NFC + QR code déjà encodés, prêt à poser. Espace Reviu inclus,
                  sans abonnement.
                </p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-semibold tracking-tight text-ink">
                    {STAND_PRICE}
                  </span>
                  <span className="text-sm text-muted">TTC l&apos;unité</span>
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  Puis {tierNote}. Livraison offerte.
                </p>
                <div className="mt-6">
                  <QuickOrder tiers={STAND_TIERS.map((t) => ({ ...t }))} max={STAND_QTY_MAX} />
                </div>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-ink-soft">
                  <Reassure icon={<IconShield size={15} />}>{GUARANTEE.label}</Reassure>
                  <Reassure icon={<IconLock size={15} />}>Paiement sécurisé</Reassure>
                </ul>
                <Link
                  href={PRODUCT_PATH}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                >
                  Caractéristiques, activation et compatibilité
                  <IconArrowRight size={15} />
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* POURQUOI UN PRÉSENTOIR (comparatif honnête) */}
        <section className="border-b border-line">
          <Container className="py-16 sm:py-24">
            <Reveal>
              <SectionHead title="Plus simple qu'une demande à l'oral, plus complet qu'un QR code imprimé." />
            </Reveal>
            <Reveal className="mx-auto mt-12 max-w-4xl">
              <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-soft)]">
                <table className="w-full table-fixed border-collapse text-left">
                  <caption className="sr-only">
                    Comparatif : demander un avis à l&apos;oral, QR code imprimé et présentoir Reviu
                  </caption>
                  <thead>
                    <tr className="border-b border-line text-[12px] font-semibold text-muted sm:text-[13px]">
                      <th scope="col" className="w-[42%] px-4 py-4 sm:w-1/2 sm:px-6">
                        <span className="sr-only">Critère</span>
                      </th>
                      <th scope="col" className="px-1 py-4 text-center">À l&apos;oral</th>
                      <th scope="col" className="px-1 py-4 text-center">QR code imprimé</th>
                      <th scope="col" className="bg-brand-soft px-1 py-4 text-center text-brand">Reviu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row) => (
                      <tr key={row.label} className="border-b border-line last:border-0">
                        <th scope="row" className="px-4 py-3.5 text-[13.5px] font-medium leading-snug text-ink sm:px-6 sm:text-[15px]">
                          {row.label}
                        </th>
                        <td className="px-1 py-3.5 text-center"><CompareCell value={row.oral} /></td>
                        <td className="px-1 py-3.5 text-center"><CompareCell value={row.qr} /></td>
                        <td className="bg-brand-soft/60 px-1 py-3.5 text-center"><CompareCell value={row.reviu} strong /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-center text-sm text-muted">
                Besoin d&apos;un QR code en attendant ?{" "}
                <Link href={QR_TOOL_PATH} className="font-semibold text-brand hover:underline">
                  Générez-le gratuitement
                </Link>
                .
              </p>
            </Reveal>

            <Reveal className="mx-auto mt-10 max-w-4xl">
              <div className="flex flex-col items-start gap-6 rounded-3xl bg-ink p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
                <p className="max-w-xl font-display text-xl font-semibold leading-snug sm:text-2xl">
                  {STAND_PRICE}, une seule fois. Un seul nouveau client qui vous
                  choisit grâce à vos avis, et le présentoir est rentabilisé.
                </p>
                <a href="#produits" className={buttonClass("primary", "lg", "shrink-0 border-transparent")}>
                  Commander
                </a>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ESPACE REVIU INCLUS */}
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-24">
            <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {accentLastWord("Votre présentoir, piloté depuis votre espace.")}
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base">
                  {INCLUDED_SPACE.title}&nbsp;: tout ce qu&apos;il faut pour suivre et
                  gérer vos présentoirs, sans abonnement, dès l&apos;activation.
                </p>
                <ul className="mt-6 grid gap-3">
                  {INCLUDED_SPACE.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px] text-ink">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={100}>
                <DashboardMock />
              </Reveal>
            </div>
          </Container>
        </section>

        {/* GARANTIE */}
        <section className="relative isolate overflow-hidden bg-brand text-white">
          <div aria-hidden className="absolute inset-0 -z-10 opacity-30 hero-grid" />
          <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Essayez-le 30 jours. Satisfait ou remboursé.
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base">
                {GUARANTEE.detail} Vous le testez en conditions réelles, à votre
                comptoir, sans engagement.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ul className="grid gap-3">
                {[
                  { icon: <IconTruck size={20} />, t: "Livraison offerte", d: `Dès 1 présentoir, sous ${SHIPPING.delay}.` },
                  { icon: <IconLock size={20} />, t: "Sans abonnement", d: "Un achat unique, l'espace Reviu est inclus." },
                  { icon: <IconFlag size={20} />, t: "Entreprise française", d: "Un support humain, qui répond vraiment." },
                ].map((it) => (
                  <li key={it.t} className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand">
                      {it.icon}
                    </span>
                    <span>
                      <span className="block font-semibold">{it.t}</span>
                      <span className="mt-0.5 block text-sm text-white/75">{it.d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-b border-line">
          <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Tout ce qu'il faut savoir.")}
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                Une autre question ? Écrivez-nous ou appelez-nous, on répond vite.
              </p>
              <div className="mt-6 flex flex-col items-start gap-2.5">
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
                  <IconMail size={17} /> {CONTACT_EMAIL}
                </a>
                {CONTACT_PHONE && (
                  <a href={CONTACT_PHONE.href} className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
                    <IconPhone size={17} /> {CONTACT_PHONE.display}
                  </a>
                )}
              </div>
            </Reveal>
            <div className="grid content-start gap-3">
              {FAQ.map((f) => (
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
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA FINAL */}
        <section>
          <Container className="py-16 sm:py-20">
            <div className="grid items-center gap-8 rounded-[2.5rem] bg-ink px-6 py-12 sm:px-12 sm:py-14 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="text-center lg:text-left">
                <Stars size={18} className="justify-center lg:justify-start" />
                <h2 className="mx-auto mt-4 max-w-xl font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:mx-0">
                  Transformez chaque passage client en avis Google.
                </h2>
                <p className="mt-3 text-[15px] text-white/70">
                  {STAND_PRICE} · Livraison offerte · {GUARANTEE.label}
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                  <a href="#produits" className={buttonClass("primary", "lg", "h-14 border-transparent px-7 text-base")}>
                    Commander mon présentoir
                  </a>
                  <Link
                    href="/demo"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-base font-medium text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
                  >
                    Voir la démo
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto hidden w-full max-w-[300px] lg:block">
                <ProductPhoto
                  src={PHOTO.front}
                  alt="Présentoir Reviu NFC et QR code pour avis Google"
                  sizes="300px"
                  framed={false}
                  className="float aspect-square w-full rounded-[2rem] shadow-[0_40px_80px_-30px_rgba(27,77,255,0.6)]"
                />
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
      <StickyBuyBar price={STAND_PRICE} note={SHIPPING.label} image={PHOTO.front} />
    </>
  );
}

// ── Visuel du hero : photo en situation + cartes flottantes ──────────────────
function HeroVisual() {
  return (
    <div className="reveal reveal-2 relative mx-auto w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[520px]">
      <div
        aria-hidden
        className="absolute inset-6 -z-10 rounded-[3rem] bg-brand opacity-20 blur-3xl"
      />
      <ProductPhoto
        src={PHOTO.etape3}
        alt="Cliente laissant un avis Google depuis son téléphone devant le présentoir Reviu NFC et QR code, posé sur le comptoir"
        sizes="(min-width: 1024px) 520px, (min-width: 640px) 460px, 90vw"
        preload
        framed={false}
        className="aspect-square w-full rounded-[2rem] shadow-[var(--shadow-lift)] ring-1 ring-white/60"
      />

      {/* Carte : tap NFC */}
      <div className="float absolute -left-2 top-5 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-2.5 pr-4 shadow-[var(--shadow-lift)] backdrop-blur sm:-left-8 sm:top-8 sm:p-3 sm:pr-5">
        <span className="relative grid h-10 w-10 place-items-center text-brand">
          <span className="nfc-wave" />
          <span className="nfc-wave nfc-wave-2" />
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
            <IconNfc size={20} />
          </span>
        </span>
        <span>
          <span className="block text-[13px] font-semibold leading-tight text-ink">
            Page d&apos;avis ouverte
          </span>
          <span className="block text-xs text-muted">en un seul geste</span>
        </span>
      </div>

      {/* Pastille prix */}
      <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-ink/85 px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
        <IconQr size={14} />
        {STAND_PRICE} · {SHIPPING.label}
      </div>
    </div>
  );
}

// ── Aperçu (illustratif) de l'espace Reviu ───────────────────────────────────
function DashboardMock() {
  const bars = [38, 52, 44, 68, 58, 76, 64];
  return (
    <div className="relative" aria-hidden>
      <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-brand-soft" />
      <div className="rounded-3xl border border-line bg-canvas p-4 shadow-[var(--shadow-lift)] sm:p-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <IconChart size={17} className="text-brand" />
            Espace Reviu
          </span>
          <span className="rounded-full bg-line-soft px-2.5 py-1 text-[11px] font-medium text-muted">
            Aperçu
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { l: "Scans NFC", icon: <IconNfc size={16} /> },
            { l: "Scans QR", icon: <IconQr size={16} /> },
          ].map((k) => (
            <div key={k.l} className="rounded-2xl border border-line bg-surface p-3.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <span className="text-brand">{k.icon}</span>
                {k.l}
              </span>
              <span className="mt-3 block h-2.5 w-2/3 rounded-full bg-line" />
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-line bg-surface p-4">
          <span className="text-xs font-medium text-muted">Scans par jour</span>
          <div className="mt-4 flex h-28 items-end gap-2">
            {bars.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-lg bg-brand/80"
                style={{ height: `${h}%`, opacity: 0.45 + i * 0.08 }}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
            <IconLink size={17} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-muted">Lien de redirection</span>
            <span className="block truncate font-mono text-[13px] text-ink">
              g.page/r/votre-commerce/review
            </span>
          </span>
          <span className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white">
            Modifier
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Petits composants ────────────────────────────────────────────────────────
function SectionHead({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="text-center">
      <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {accentLastWord(title)}
      </h2>
      {intro && (
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {intro}
        </p>
      )}
    </div>
  );
}

function Reassure({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span className="shrink-0 text-brand">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

function CompareCell({ value, strong = false }: { value: Cell; strong?: boolean }) {
  if (value === true)
    return (
      <span
        className={
          "inline-grid h-7 w-7 place-items-center rounded-full " +
          (strong ? "bg-brand text-white" : "bg-brand-soft text-brand")
        }
      >
        <IconCheck size={15} strokeWidth={2.6} />
        <span className="sr-only">Oui</span>
      </span>
    );
  if (value === false)
    return (
      <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-line-soft text-muted">
        <IconClose size={14} />
        <span className="sr-only">Non</span>
      </span>
    );
  if (value === "partial")
    return (
      <span className="text-[12px] font-medium text-muted sm:text-[13px]">
        Selon le support
      </span>
    );
  return (
    <span
      className={
        "text-[12px] leading-tight sm:text-sm " +
        (strong ? "font-semibold text-brand" : "font-medium text-muted")
      }
    >
      {value}
    </span>
  );
}

function Check() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
      <IconCheck size={12} strokeWidth={2.6} />
    </span>
  );
}
