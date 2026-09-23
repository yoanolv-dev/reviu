import type { Metadata } from "next";
import type { ReactNode } from "react";
import { preconnect } from "react-dom";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductPhoto } from "@/components/site/product-photo";
import { ProductGallery } from "@/components/site/product-gallery";
import { HeroBackground } from "@/components/site/hero-background";
import { Reveal } from "@/components/site/reveal";
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
  IconStar,
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
import { getProduct, STAND_TIERS, STAND_QTY_MAX } from "@/lib/shop";
import { buildMetadata, graph, productSchema, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { StandOrder } from "./stand-order";
import { ScanDemo } from "./scan-demo";
import { StickyBuyBar } from "./sticky-buy-bar";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { TESTIMONIALS } from "@/lib/testimonials";

export const metadata: Metadata = buildMetadata({
  title: "Présentoir avis Google NFC + QR code - 29,90 € | reviu",
  description:
    "Le présentoir NFC + QR code qui ouvre votre page d'avis Google en un geste. 29,90 €, sans abonnement, livraison offerte, satisfait ou remboursé 30 jours.",
  path: "/",
  keywords: [
    "présentoir avis Google",
    "plaque NFC avis Google",
    "QR code avis Google",
    "présentoir NFC avis Google",
    "obtenir plus d'avis Google",
    "support avis Google",
    "carte NFC avis Google",
    "présentoir avis clients",
  ],
});

const PHOTO = {
  comptoir: "/products/presentoir-comptoir.webp",
  front: "/products/presentoir.webp",
  angle: "/products/presentoir-angle.webp",
  etape1: "/products/etape-1.webp",
  etape2: "/products/etape-2.webp",
  etape3: "/products/etape-3.webp",
} as const;

const GALLERY = [
  { src: PHOTO.front, alt: "Présentoir Reviu NFC et QR code pour avis Google, vue de face" },
  { src: PHOTO.etape3, alt: "Cliente laissant un avis Google depuis son téléphone devant le présentoir Reviu" },
  { src: PHOTO.etape1, alt: "Smartphone scannant le QR code du présentoir Reviu pour avis Google" },
  { src: PHOTO.angle, alt: "Présentoir Reviu, vue de trois quarts montrant le QR code et la zone NFC" },
];

// Mise en route du présentoir APRÈS réception (côté commerçant).
const SETUP = [
  {
    n: "1",
    title: "Scannez le QR code",
    body: "À réception, scannez le QR code imprimé sur le présentoir.",
    img: PHOTO.etape1,
    alt: "Smartphone scannant le QR code imprimé sur le présentoir Reviu",
  },
  {
    n: "2",
    title: "Reliez votre fiche Google",
    body: "Entrez le code secret situé à côté du QR code, puis collez le lien de votre fiche Google.",
    img: PHOTO.etape2,
    alt: "Écran d'activation du présentoir Reviu dans l'espace client",
  },
  {
    n: "3",
    title: "Posez-le au comptoir",
    body: "C'est prêt. Invitez simplement vos clients à partager leur expérience.",
    img: PHOTO.etape3,
    alt: "Présentoir Reviu posé sur le comptoir, prêt à recueillir des avis Google",
  },
];

const BENEFITS = [
  "Ouvre votre page d'avis Google en un geste",
  "Aucune application à télécharger",
  "Compatible iPhone et Android",
  "Espace Reviu inclus, sans abonnement",
];

// Bandeau « métiers » : chaque pastille mène au guide du métier (maillage SEO).
const METIERS = [
  { label: "Restaurants", href: "/guides/avis-google-restaurant" },
  { label: "Coiffeurs", href: "/guides/avis-google-coiffeur" },
  { label: "Garages", href: "/guides/avis-google-garage" },
  { label: "Boulangeries", href: "/guides/avis-google-boulangerie" },
  { label: "Instituts de beauté", href: "/guides/avis-google-institut-beaute" },
  { label: "Hôtels", href: "/guides/avis-google-hotel" },
  { label: "Boutiques", href: "/guides/avis-google-boutique" },
  { label: "Dentistes", href: "/guides/avis-google-dentiste" },
  { label: "Salles de sport", href: "/guides/avis-google-salle-de-sport" },
];

type Cell = boolean | "partial" | string;
const COMPARISON: { label: string; oral: Cell; qr: Cell; reviu: Cell }[] = [
  { label: "Le client trouve votre fiche sans chercher", oral: false, qr: true, reviu: true },
  { label: "Un simple contact suffit (NFC)", oral: false, qr: false, reviu: true },
  { label: "Visible en permanence au comptoir", oral: false, qr: "partial", reviu: true },
  { label: "Lien modifiable sans rien réimprimer", oral: false, qr: false, reviu: true },
  { label: "Statistiques de scans (QR et NFC)", oral: false, qr: false, reviu: true },
  { label: "Coût", oral: "Gratuit", qr: "Gratuit", reviu: "29,90 € une fois" },
];

const PLACES = [
  {
    t: "Restaurants et cafés",
    d: "Près de l'encaissement, au moment où le repas vient de se terminer.",
    img: PHOTO.comptoir,
    alt: "Présentoir Reviu sur le comptoir d'un restaurant",
    href: "/guides/avis-google-restaurant",
  },
  {
    t: "Salons et instituts",
    d: "À l'accueil, pour prolonger la relation juste après la prestation.",
    img: PHOTO.etape3,
    alt: "Présentoir Reviu à l'accueil d'un salon ou institut de beauté",
    href: "/guides/avis-google-coiffeur",
  },
  {
    t: "Garages automobiles",
    d: "À la remise des clés, quand la satisfaction du client est au plus haut.",
    img: PHOTO.etape1,
    alt: "Présentoir Reviu au comptoir d'un garage automobile",
    href: "/guides/avis-google-garage",
  },
];

// ── Accordéons de la fiche produit ───────────────────────────────────────────
// Caractéristiques physiques exactes à compléter par un humain : une chaîne
// vide masque proprement la ligne, jamais d'info inventée.
const SPEC_DIMENSIONS = ""; // TODO: dimensions réelles, ex. « 100 × 75 mm »
const SPEC_EPAISSEUR = ""; //  TODO: épaisseur réelle, ex. « 8 mm »
const SPEC_MATERIAU = ""; //   TODO: matériau réel, ex. « PVC rigide, finition mate »
const SPEC_POIDS = ""; //      TODO: poids réel, ex. « 120 g »

const SPECS: { label: string; value: string }[] = [
  { label: "Technologies", value: "Puce NFC + QR code, déjà encodés" },
  { label: "Emplacement du QR code", value: "En façade du présentoir" },
  { label: "Emplacement de la puce NFC", value: "Intégrée au présentoir, zone de contact indiquée" },
  { label: "Code secret d'activation", value: "Imprimé à côté du QR code, sur le présentoir" },
  { label: "Dimensions", value: SPEC_DIMENSIONS },
  { label: "Épaisseur", value: SPEC_EPAISSEUR },
  { label: "Matériau", value: SPEC_MATERIAU },
  { label: "Poids", value: SPEC_POIDS },
  { label: "Stabilité", value: "À poser (autoportant), sans fixation ni perçage" },
  { label: "Surfaces métalliques", value: "Préférez une surface non métallique, ou utilisez le QR code" },
].filter((s) => s.value !== "");

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
    q: "Comment relier le présentoir à ma fiche Google ?",
    a: "Après réception, scannez le présentoir (ou rendez-vous sur la page d'activation), saisissez le code secret imprimé à côté du QR code, puis collez le lien de votre fiche Google. Le présentoir est opérationnel aussitôt.",
  },
  {
    q: "Puis-je modifier mon lien ?",
    a: "Oui, à tout moment depuis votre espace Reviu inclus, sans frais supplémentaires. Vous mettez à jour la destination de votre présentoir (par exemple si l'adresse de votre fiche Google change) ; le présentoir, lui, garde toujours la même adresse : rien à réimprimer.",
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
  // Préchauffe la connexion au SDK Stripe : à l'étape de paiement, le formulaire
  // embarqué se charge plus vite (connexion TLS déjà ouverte).
  preconnect("https://js.stripe.com");

  const stand = getProduct("stand");
  const schema = graph(
    ...(stand
      ? [
          productSchema({
            name: "Présentoir Reviu - NFC + QR code pour avis Google",
            description:
              "Présentoir connecté (puce NFC + QR code déjà encodés) à poser sur le comptoir pour accéder à votre page d'avis Google en un geste. Achat unique, sans abonnement, livraison offerte et satisfait ou remboursé 30 jours ; espace Reviu inclus (statistiques, gestion, modification du lien).",
            priceCents: stand.priceCents,
            path: "/",
            image: PHOTO.front,
            sku: stand.id,
          }),
        ]
      : []),
    faqSchema(FAQ),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Le présentoir", path: "/#produits" },
    ]),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        {/* 1 - HERO. Sur desktop, il occupe la hauteur visible (100svh moins le
            bandeau 36px et le header 68px). Sur mobile, texte et CTA d'abord. */}
        <section
          id="hero"
          className="relative isolate overflow-hidden lg:flex lg:min-h-[calc(100svh-104px)] lg:flex-col"
        >
          <HeroBackground />
          <Container className="grid w-full flex-1 items-center gap-10 pb-12 pt-8 sm:pb-16 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
            <div className="reveal flex flex-col items-start">
              <h1 className="font-display font-semibold tracking-tight text-ink">
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pl-1 pr-3.5 text-[13px] font-medium tracking-normal text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                    <IconNfc size={12} /> NFC + QR
                  </span>
                  Présentoir avis Google
                </span>
                <span className="mt-5 block text-[2.15rem] leading-[1.06] sm:text-[2.9rem] lg:text-[3.5rem] lg:leading-[1.03]">
                  Obtenez plus d&apos;avis Google, directement depuis votre{" "}
                  <span className="text-brand">comptoir</span>.
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-ink-soft sm:mt-6 sm:text-lg">
                Vos clients approchent leur téléphone ou scannent le QR
                code&nbsp;: votre page d&apos;avis Google s&apos;ouvre instantanément. Sans
                application, sans abonnement.
              </p>
              <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row">
                <a
                  href="#produits"
                  className={buttonClass("primary", "lg", "group h-14 w-full px-7 text-base sm:w-auto")}
                >
                  Commander - {STAND_PRICE}
                  <IconArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
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

        {/* 2 - MÉTIERS : bandeau défilant, chaque pastille mène à son guide. */}
        <section aria-label="Pensé pour les commerces de proximité" className="border-y border-line bg-surface">
          <div className="mx-auto flex max-w-6xl items-center gap-6 py-4 lg:px-8">
            <p className="hidden shrink-0 text-[13px] font-semibold text-muted lg:block">
              Pensé pour
            </p>
            <div className="marquee fade-x min-w-0 flex-1">
              <div className="marquee-track">
                {[...METIERS, ...METIERS].map((m, i) => {
                  const dup = i >= METIERS.length;
                  return (
                    <Link
                      key={`${m.href}-${i}`}
                      href={m.href}
                      aria-hidden={dup || undefined}
                      tabIndex={dup ? -1 : undefined}
                      className="mx-1.5 inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
                    >
                      <IconStar size={13} className="text-accent" />
                      {m.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 3 - PARCOURS CLIENT (démo animée) */}
        <section id="fonctionnement" className="scroll-mt-20">
          <Container className="py-16 sm:py-24">
            <Reveal>
              <SectionHead
                eyebrow="Comment ça marche"
                title="Un geste, et votre page d'avis s'ouvre."
                intro="Le présentoir supprime tout ce qui fait renoncer un client satisfait : chercher votre fiche, trouver le bouton, remettre à plus tard."
              />
            </Reveal>
            <div className="mt-12 sm:mt-14">
              <ScanDemo />
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/r/demo"
                prefetch={false}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Essayer la page de démonstration
                <IconArrowRight size={15} />
              </Link>
            </div>
          </Container>
        </section>

        {/* TÉMOIGNAGES (affichés dès le premier vrai témoignage) */}
        <TestimonialsSection items={TESTIMONIALS} />

        {/* 4 - PRODUIT ET COMMANDE (galerie + fiche + achat) */}
        <section id="produits" className="scroll-mt-16 border-y border-line bg-surface">
          <Container className="py-14 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <ProductGallery images={GALLERY} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                    <IconTruck size={14} /> Livraison offerte
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-ink">
                    <IconShield size={14} className="text-star" /> {GUARANTEE.label}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Présentoir avis Google Reviu
                  <span className="block text-brand">NFC + QR code</span>
                </h2>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  Le présentoir connecté qui envoie vos clients vers votre page
                  d&apos;avis Google, en un geste. Déjà encodé, prêt à poser.
                </p>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-ink">
                      <Check />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 rounded-[1.75rem] border border-line bg-canvas p-5 shadow-[var(--shadow-soft)] sm:p-6">
                  <StandOrder
                    tiers={STAND_TIERS.map((t) => ({ ...t }))}
                    max={STAND_QTY_MAX}
                    guaranteeLabel={GUARANTEE.label}
                  />
                </div>

                <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line">
                  <Accordion title="Caractéristiques" defaultOpen>
                    <dl className="grid gap-x-4 gap-y-2.5 sm:grid-cols-[10rem_1fr]">
                      {SPECS.map((s) => (
                        <div key={s.label} className="sm:contents">
                          <dt className="text-sm text-muted">{s.label}</dt>
                          <dd className="mb-2 text-sm font-medium text-ink sm:mb-0">
                            {s.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </Accordion>
                  <Accordion title="Activation">
                    <ol className="ml-4 list-decimal space-y-1.5 text-sm leading-relaxed text-ink-soft marker:text-muted">
                      <li>Vous recevez votre présentoir.</li>
                      <li>Vous scannez le QR code ou ouvrez la page d&apos;activation.</li>
                      <li>Vous saisissez le code secret imprimé à côté du QR code.</li>
                      <li>Vous collez le lien de votre fiche Google.</li>
                      <li>Le présentoir devient opérationnel.</li>
                    </ol>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      Le code secret est un mécanisme de sécurité : il garantit que
                      vous seul pouvez relier ce présentoir à votre établissement.
                    </p>
                  </Accordion>
                  <Accordion title="Compatibilité">
                    <ul className="space-y-1.5 text-sm leading-relaxed text-ink-soft">
                      <li>iPhone : QR code sur tous les modèles ; NFC sans application dès l&apos;iPhone XS.</li>
                      <li>Android : QR code sur tous les modèles ; NFC sur la grande majorité des appareils équipés.</li>
                      <li>Aucune application à télécharger, ni pour vous ni pour vos clients.</li>
                    </ul>
                  </Accordion>
                  <Accordion title="Livraison, retours et garantie">
                    <ul className="space-y-1.5 text-sm leading-relaxed text-ink-soft">
                      <li>Livraison offerte en France métropolitaine, sous {SHIPPING.delay}.</li>
                      <li>{GUARANTEE.detail}</li>
                      <li>Droit de rétractation légal de 14 jours.</li>
                      <li>Garantie légale de conformité (2 ans).</li>
                      <li>Entretien : chiffon doux, sans produit abrasif.</li>
                    </ul>
                  </Accordion>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 5 - POURQUOI UN PRÉSENTOIR (comparatif honnête) */}
        <section className="border-b border-line">
          <Container className="py-16 sm:py-24">
            <Reveal>
              <SectionHead
                eyebrow="Pourquoi un présentoir"
                title="Plus simple qu'une demande à l'oral, plus complet qu'un QR imprimé."
              />
            </Reveal>
            <Reveal className="mx-auto mt-12 max-w-4xl">
              <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-soft)]">
                <table className="w-full table-fixed border-collapse text-left">
                  <caption className="sr-only">
                    Comparatif : demander un avis à l&apos;oral, QR code imprimé et
                    présentoir Reviu
                  </caption>
                  <thead>
                    <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
                      <th scope="col" className="w-[44%] px-4 py-4 sm:w-1/2 sm:px-6">
                        <span className="sr-only">Critère</span>
                      </th>
                      <th scope="col" className="px-1 py-4 text-center">À l&apos;oral</th>
                      <th scope="col" className="px-1 py-4 text-center">QR imprimé</th>
                      <th scope="col" className="bg-brand-soft px-1 py-4 text-center text-brand">
                        Reviu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row) => (
                      <tr key={row.label} className="border-b border-line last:border-0">
                        <th
                          scope="row"
                          className="px-4 py-3.5 text-[13.5px] font-medium leading-snug text-ink sm:px-6 sm:text-[15px]"
                        >
                          {row.label}
                        </th>
                        <td className="px-1 py-3.5 text-center">
                          <CompareCell value={row.oral} />
                        </td>
                        <td className="px-1 py-3.5 text-center">
                          <CompareCell value={row.qr} />
                        </td>
                        <td className="bg-brand-soft/60 px-1 py-3.5 text-center">
                          <CompareCell value={row.reviu} strong />
                        </td>
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

            {/* Argument de rentabilité (raisonnement, pas une promesse chiffrée) */}
            <Reveal className="mx-auto mt-10 max-w-4xl">
              <div className="relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-3xl bg-ink p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold text-white/70">
                    Le calcul est vite fait
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold leading-snug sm:text-2xl">
                    {STAND_PRICE}, une seule fois. Un seul nouveau client qui vous
                    choisit grâce à vos avis, et le présentoir est rentabilisé.
                  </p>
                </div>
                <a
                  href="#produits"
                  className={buttonClass("primary", "lg", "shrink-0 border-transparent")}
                >
                  Commander
                </a>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* 6 - ESPACE REVIU INCLUS + MISE EN ROUTE */}
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-24">
            <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <span className="text-sm font-semibold text-brand">
                  Inclus, sans abonnement
                </span>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {accentLastWord("Votre présentoir, piloté depuis votre espace.")}
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base">
                  {INCLUDED_SPACE.title}&nbsp;: tout ce qu&apos;il faut pour suivre et
                  gérer vos présentoirs, sans frais supplémentaires, dès
                  l&apos;activation.
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

            <div className="mt-20 sm:mt-24">
              <Reveal>
                <SectionHead
                  eyebrow="Mise en route"
                  title="Prêt en 2 minutes, sans technicien."
                />
              </Reveal>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {SETUP.map((s, i) => (
                  <Reveal key={s.n} delay={i * 80}>
                    <div className="group flex h-full flex-col">
                      <div className="relative">
                        <ProductPhoto
                          src={s.img}
                          alt={s.alt}
                          className="aspect-[4/3] w-full rounded-2xl"
                          imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-surface font-mono text-sm font-semibold text-brand shadow-[var(--shadow-soft)]">
                          {s.n}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-[17px] font-semibold leading-snug text-ink">
                        {s.title}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                        {s.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* 7 - GARANTIE (bloc de couleur de marque, levier anti-hésitation) */}
        <section className="relative isolate overflow-hidden bg-brand text-white">
          <div aria-hidden className="absolute inset-0 -z-10 opacity-30 hero-grid" />
          <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal>
              <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                <IconShield size={28} />
              </span>
              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Essayez-le 30 jours. Satisfait ou remboursé.
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base">
                {GUARANTEE.detail} Vous le testez en conditions réelles, à
                votre comptoir, sans engagement.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ul className="grid gap-3">
                {[
                  { icon: <IconTruck size={20} />, t: "Livraison offerte", d: `Dès 1 présentoir, sous ${SHIPPING.delay}.` },
                  { icon: <IconLock size={20} />, t: "Sans abonnement", d: "Un achat unique, l'espace Reviu est inclus." },
                  { icon: <IconFlag size={20} />, t: "Entreprise française", d: "Un support humain, qui répond vraiment." },
                ].map((it) => (
                  <li
                    key={it.t}
                    className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur"
                  >
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

        {/* 8 - OÙ L'INSTALLER (chaque carte mène au guide du métier) */}
        <section id="pour-qui" className="scroll-mt-20 border-b border-line">
          <Container className="py-16 sm:py-24">
            <Reveal>
              <SectionHead eyebrow="Où l'installer" title="Au comptoir, au bon moment." />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PLACES.map((p, i) => (
                <Reveal key={p.t} delay={i * 80}>
                  <Link
                    href={p.href}
                    className="group block h-full overflow-hidden rounded-3xl border border-line bg-surface transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                  >
                    <ProductPhoto
                      src={p.img}
                      alt={p.alt}
                      framed={false}
                      className="aspect-[4/3] w-full"
                      imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="p-5">
                      <h3 className="font-display text-[17px] font-semibold text-ink">
                        {p.t}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {p.d}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                        Lire le guide
                        <IconArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-2xl rounded-2xl border border-line bg-surface px-5 py-4 text-center text-[13px] leading-relaxed text-ink-soft">
              Une collecte d&apos;avis conforme aux règles Google : tous vos clients
              peuvent accéder à votre page d&apos;avis, sans filtrage selon leur
              satisfaction.
            </p>
          </Container>
        </section>

        {/* 9 - FAQ */}
        <section id="faq" className="scroll-mt-20 border-b border-line">
          <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <span className="text-sm font-semibold text-brand">
                Questions fréquentes
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Tout ce qu'il faut savoir.")}
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                Une autre question ? Écrivez-nous, on répond vite.
              </p>
              <div className="mt-6 flex flex-col items-start gap-2.5">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                >
                  <IconMail size={17} /> {CONTACT_EMAIL}
                </a>
                {CONTACT_PHONE && (
                  <a
                    href={CONTACT_PHONE.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                  >
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

        {/* 10 - CTA FINAL */}
        <section>
          <Container className="py-16 sm:py-20">
            <div className="relative isolate grid items-center gap-8 overflow-hidden rounded-[2.5rem] bg-ink px-6 py-12 sm:px-12 sm:py-14 lg:grid-cols-[1.2fr_0.8fr]">
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
      <StickyBuyBar
        price={STAND_PRICE}
        note={SHIPPING.label}
        image={PHOTO.front}
      />
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
function SectionHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="text-center">
      <span className="text-sm font-semibold text-brand">
        {eyebrow}
      </span>
      <h2 className="mx-auto mt-2 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
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

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink">
        {title}
        <span className="text-brand transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}

function Check() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
      <IconCheck size={12} strokeWidth={2.6} />
    </span>
  );
}
