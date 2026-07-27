import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductPhoto } from "@/components/site/product-photo";
import { ProductGallery } from "@/components/site/product-gallery";
import { HeroBackground } from "@/components/site/hero-background";
import { Reveal } from "@/components/site/reveal";
import { buttonClass } from "@/components/ui/button";
import { STAND_PRICE, SHIPPING } from "@/lib/brand";
import {
  getProduct,
  STAND_TIERS,
  STAND_QTY_MAX,
  FREE_SHIPPING_THRESHOLD_CENTS,
} from "@/lib/shop";
import { buildMetadata, graph, productSchema, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { StandOrder } from "./stand-order";

export const metadata: Metadata = buildMetadata({
  title:
    "Présentoir NFC + QR pour avis Google — 29,90 € sans abonnement · reviu",
  description:
    "Le présentoir Reviu (NFC + QR code) permet à vos clients d'accéder à votre page d'avis Google en un geste. 29,90 € TTC, achat unique, sans abonnement obligatoire. Compatible iPhone et Android, aucune application à télécharger.",
  path: "/",
  keywords: [
    "présentoir avis Google",
    "plaque NFC avis Google",
    "QR code avis Google",
    "présentoir NFC avis Google",
    "obtenir plus d'avis Google",
    "support avis Google",
    "carte NFC avis Google",
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

// Galerie de la fiche produit. Les gros plans QR / zone NFC / code secret et la
// vue « épaisseur » restent à photographier (voir compte rendu).
const GALLERY = [
  { src: PHOTO.front, alt: "Présentoir Reviu NFC et QR code pour avis Google, vue de face" },
  { src: PHOTO.angle, alt: "Présentoir Reviu, vue de trois quarts montrant le QR code et la zone NFC" },
  { src: PHOTO.comptoir, alt: "Présentoir Reviu installé sur le comptoir d'un commerce" },
  { src: PHOTO.etape1, alt: "Client approchant son smartphone du présentoir Reviu pour laisser un avis Google" },
];

// Étapes de configuration du présentoir APRÈS réception (pas l'usage client).
const STEPS = [
  {
    n: "1",
    title: "Scannez le QR code",
    body: "Scannez le QR code fourni dans votre colis depuis votre smartphone.",
    img: PHOTO.etape1,
    alt: "Smartphone scannant le QR code du présentoir Reviu à la réception",
  },
  {
    n: "2",
    title: "Activez votre présentoir",
    body: "Connectez-vous à votre espace client et entrez le lien vers votre fiche Google.",
    img: PHOTO.etape2,
    alt: "Écran d'activation du présentoir Reviu dans l'espace client",
  },
  {
    n: "3",
    title: "Vous êtes prêt !",
    body: "Placez votre présentoir en caisse et regardez les avis affluer.",
    img: PHOTO.etape3,
    alt: "Présentoir Reviu posé sur le comptoir, prêt à recueillir des avis Google",
  },
];

const BENEFITS = [
  "Accédez à votre page d'avis en un geste",
  "Aucune application à télécharger",
  "Compatible iPhone et Android",
  "Aucun abonnement obligatoire",
];

const WHY = [
  {
    t: "Vos clients ne cherchent plus",
    d: "Plus besoin de retrouver votre établissement sur Google : la bonne page s'ouvre directement.",
  },
  {
    t: "Compatibilité maximale",
    d: "NFC et QR code réunis : chaque client utilise ce qui fonctionne avec son téléphone.",
  },
  {
    t: "Le bon moment",
    d: "Posé au comptoir, le présentoir reste visible pile au moment où l'expérience vient de se terminer.",
  },
];

const PLACES = [
  {
    t: "Restaurants",
    d: "Près de l'encaissement, proposez l'avis au moment où le repas vient de se terminer.",
    img: PHOTO.comptoir,
    alt: "Présentoir Reviu sur le comptoir d'un restaurant",
  },
  {
    t: "Salons & instituts",
    d: "À l'accueil, prolongez la relation juste après la prestation.",
    img: PHOTO.etape3,
    alt: "Présentoir Reviu à l'accueil d'un salon ou institut de beauté",
  },
  {
    t: "Garages automobiles",
    d: "À la remise des clés, quand la satisfaction du client est au plus haut.",
    img: PHOTO.etape1,
    alt: "Présentoir Reviu au comptoir d'un garage automobile",
  },
];

const TRUST = [
  "Entreprise française",
  "Paiement sécurisé (Stripe)",
  "Garantie légale (2 ans)",
  "Activation accompagnée",
  "Assistance par e-mail",
  "Sans abonnement obligatoire",
];

// ── Accordéons de la fiche produit ───────────────────────────────────────────
// Caractéristiques physiques exactes à compléter par un humain (voir compte
// rendu) : une chaîne vide masque proprement la ligne, jamais d'info inventée.
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
    q: "Faut-il un abonnement ?",
    a: "Non. Le présentoir est un achat unique à 29,90 € TTC. Il s'active gratuitement et redirige vos clients vers votre page d'avis Google, sans aucun frais récurrent.",
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
    a: "Vous choisissez le lien de votre fiche Google lors de l'activation, gratuitement. Sa modification à distance ensuite (par exemple si l'adresse de votre fiche change) fait partie des outils de suivi optionnels de votre espace Reviu. Le présentoir, lui, garde toujours la même adresse : rien à réimprimer.",
  },
  {
    q: "Quels sont les délais et les frais de livraison ?",
    a: `Livraison en France métropolitaine sous 3 à 5 jours ouvrés. Frais de port ${SHIPPING.feeLabel}, offerts à partir de ${SHIPPING.freeFromLabel} de commande. Paiement sécurisé par carte via Stripe, facture transmise automatiquement.`,
  },
  {
    q: "Reviu filtre-t-il les avis négatifs ?",
    a: "Non. Reviu ne filtre pas les clients selon leur satisfaction : tous peuvent accéder à votre page d'avis Google, de la même manière.",
  },
];

export default function BoutiquePage() {
  const stand = getProduct("stand");
  const schema = graph(
    ...(stand
      ? [
          productSchema({
            name: "Présentoir Reviu — NFC + QR code pour avis Google",
            description:
              "Présentoir connecté (puce NFC + QR code déjà encodés) à poser sur le comptoir pour accéder à votre page d'avis Google en un geste. Achat unique, sans abonnement obligatoire, redirection modifiable à distance.",
            priceCents: stand.priceCents,
            path: "/",
            image: "/products/presentoir.webp",
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
        {/* 1 — HERO */}
        <section className="relative isolate overflow-hidden border-b border-line">
          <HeroBackground />
          <Container className="grid items-center gap-10 py-12 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
            <div className="reveal order-2 flex flex-col items-start lg:order-1">
              <h1 className="font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-[2.75rem] lg:text-5xl lg:leading-[1.05]">
                Obtenez plus d&apos;avis Google, directement depuis votre{" "}
                <span className="text-brand">comptoir</span>.
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft sm:text-lg">
                Vos clients approchent leur téléphone ou scannent le QR code pour
                accéder instantanément à votre page d&apos;avis Google. Aucun
                téléchargement et aucun abonnement obligatoire.
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href="#produits"
                  className={buttonClass("primary", "lg", "w-full sm:w-auto")}
                >
                  <span className="sm:hidden">Commander le présentoir</span>
                  <span className="hidden sm:inline">Commander — {STAND_PRICE}</span>
                </a>
                <a
                  href="#fonctionnement"
                  className={buttonClass("secondary", "lg", "w-full sm:w-auto")}
                >
                  Voir comment ça fonctionne
                </a>
              </div>
              <p className="mt-5 text-[13px] font-medium text-muted">
                Achat unique · Sans abonnement · Compatible iPhone et Android
              </p>
            </div>
            <div className="reveal relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
              <div
                aria-hidden
                className="absolute inset-4 -z-10 rounded-[3rem] bg-brand opacity-[0.06] blur-3xl"
              />
              <ProductPhoto
                src={PHOTO.comptoir}
                alt="Présentoir Reviu NFC et QR code pour avis Google, posé sur le comptoir d'un commerce"
                className="aspect-[4/3] w-full rounded-[2rem] border border-line shadow-[var(--shadow-lift)]"
              />
            </div>
          </Container>
        </section>

        {/* 2 — COMMENT ÇA MARCHE (fonctionnement + démonstration fusionnés) */}
        <section id="fonctionnement" className="scroll-mt-20 border-b border-line">
          <Container className="py-14 sm:py-16">
            <Reveal>
              <SectionHead
                eyebrow="Configuration"
                title="Configurez votre présentoir en 2 minutes."
              />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="flex h-full flex-col">
                    <ProductPhoto
                      src={s.img}
                      alt={s.alt}
                      className="aspect-square w-full rounded-2xl"
                    />
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-mono text-sm font-semibold text-brand">
                        {s.n}
                      </span>
                      <h3 className="font-display text-[17px] font-semibold leading-snug text-ink">
                        {s.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/r/demo"
                prefetch={false}
                className="text-sm font-medium text-brand hover:underline"
              >
                Essayer la page de démonstration →
              </Link>
            </div>
          </Container>
        </section>

        {/* 3 — PRODUIT ET COMMANDE (galerie + fiche + achat) */}
        <section id="produits" className="scroll-mt-20 border-b border-line bg-surface">
          <Container className="py-14 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
              {/* Galerie */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <ProductGallery images={GALLERY} />
              </div>

              {/* Achat */}
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Présentoir Reviu — NFC + QR
                </h2>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  Le présentoir connecté qui envoie vos clients vers votre page
                  d&apos;avis Google, en un geste.
                </p>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-ink">
                      <Check />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 rounded-[1.5rem] border border-line bg-canvas p-6 shadow-[var(--shadow-soft)]">
                  <StandOrder
                    tiers={STAND_TIERS.map((t) => ({ ...t }))}
                    max={STAND_QTY_MAX}
                    freeShipThresholdCents={FREE_SHIPPING_THRESHOLD_CENTS}
                    freeFromLabel={SHIPPING.freeFromLabel}
                  />
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  Un espace Reviu gratuit vous permet d&apos;activer et de gérer
                  votre présentoir.
                </p>

                {/* Détails techniques en accordéons */}
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
                  <Accordion title="Livraison et retours">
                    <ul className="space-y-1.5 text-sm leading-relaxed text-ink-soft">
                      <li>Livraison en France métropolitaine sous 3 à 5 jours ouvrés.</li>
                      <li>Frais de port {SHIPPING.feeLabel}, offerts dès {SHIPPING.freeFromLabel} de commande.</li>
                      <li>Droit de rétractation sous 14 jours.</li>
                      <li>Garantie légale de conformité (2 ans).</li>
                      <li>Entretien : chiffon doux, sans produit abrasif.</li>
                    </ul>
                  </Accordion>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 4 — POURQUOI ÇA MARCHE (3 bénéfices) */}
        <section className="border-b border-line">
          <Container className="py-14 sm:py-16">
            <Reveal>
              <SectionHead eyebrow="Pourquoi ça marche" title="Simple pour vos clients, efficace pour vous." />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {WHY.map((w, i) => (
                <Reveal key={w.t} delay={i * 80}>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {w.t}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                      {w.d}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* 5 — MISE EN SITUATION (3 environnements) */}
        <section id="pour-qui" className="scroll-mt-20 border-b border-line bg-surface">
          <Container className="py-14 sm:py-16">
            <Reveal>
              <SectionHead eyebrow="Où l'installer" title="Au comptoir, au bon moment." />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {PLACES.map((p, i) => (
                <Reveal key={p.t} delay={i * 80}>
                  <figure className="overflow-hidden rounded-2xl border border-line bg-canvas">
                    <ProductPhoto src={p.img} alt={p.alt} className="aspect-[4/3] w-full" />
                    <figcaption className="p-5">
                      <h3 className="font-display text-[17px] font-semibold text-ink">
                        {p.t}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {p.d}
                      </p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/guides" className="text-sm font-medium text-brand hover:underline">
                Voir les usages par secteur →
              </Link>
            </div>
          </Container>
        </section>

        {/* 6 — RÉASSURANCE + conformité (pas de faux témoignages) */}
        {/* Structure prête à accueillir jusqu'à 3 vrais témoignages clients,
            à ajouter uniquement lorsqu'ils existeront (aucune preuve inventée). */}
        <section className="border-b border-line">
          <Container className="py-12 sm:py-14">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-2xl border border-line bg-surface px-5 py-4 text-center text-[13px] leading-relaxed text-ink-soft">
              Une collecte d&apos;avis conforme aux règles Google : tous vos clients
              peuvent accéder à votre page d&apos;avis, sans filtrage selon leur
              satisfaction.
            </p>
          </Container>
        </section>

        {/* 7 — FAQ + CTA FINAL */}
        <section id="faq" className="scroll-mt-20 border-b border-line">
          <Container className="py-14 sm:py-16">
            <Reveal>
              <SectionHead eyebrow="Questions fréquentes" title="Tout ce qu'il faut savoir." />
            </Reveal>
            <div className="mx-auto mt-8 grid max-w-3xl gap-3">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-line bg-surface p-5 open:shadow-[var(--shadow-soft)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                    {f.q}
                    <span className="text-brand transition-transform group-open:rotate-45">+</span>
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
            <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-ink px-6 py-14 text-center sm:px-12 sm:py-16">
              <h2 className="mx-auto max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                Transformez chaque passage client en opportunité d&apos;avis
                Google.
              </h2>
              <div className="mt-8">
                <a href="#produits" className={buttonClass("primary", "lg", "border-transparent")}>
                  <span className="sm:hidden">Commander le présentoir</span>
                  <span className="hidden sm:inline">
                    Commander mon présentoir — {STAND_PRICE}
                  </span>
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

// ── Petits composants ────────────────────────────────────────────────────────
function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-brand">
        {eyebrow}
      </span>
      <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
    </div>
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
      <svg
        viewBox="0 0 24 24"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}
