import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductPhoto } from "@/components/site/product-photo";
import { HeroBackground } from "@/components/site/hero-background";
import { Reveal } from "@/components/site/reveal";
import { Stars } from "@/components/ui/stars";
import { StarMark } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";
import { APP_BASE, CONTACT_EMAIL, STAND_PRICE, SHIPPING } from "@/lib/brand";
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

// Réassurance immédiate (section 2) — le cœur du positionnement.
const REASSURANCE = [
  { t: "Achat unique", d: "Payez une fois, le présentoir est à vous." },
  { t: "Sans abonnement obligatoire", d: "Le présentoir fonctionne seul, durablement." },
  { t: "Activation rapide", d: "En ligne, en quelques minutes." },
  { t: "NFC + QR code", d: "Les deux technologies sur un seul présentoir." },
  { t: "Aucune application", d: "Rien à télécharger, ni pour vous ni pour vos clients." },
  { t: "iPhone et Android", d: "Compatible avec tous les smartphones récents." },
];

const STEPS = [
  {
    n: "01",
    title: "Installez le présentoir",
    body: "Posez-le sur votre comptoir, à portée des clients. Rien à visser, rien à percer.",
    img: PHOTO.etape3,
    alt: "Présentoir Reviu posé sur le comptoir d'un commerce",
  },
  {
    n: "02",
    title: "Le client approche ou scanne",
    body: "Il approche son téléphone de la puce NFC, ou scanne le QR code du présentoir.",
    img: PHOTO.etape1,
    alt: "Un client approche son téléphone du présentoir NFC Reviu",
  },
  {
    n: "03",
    title: "Il accède à votre page Google",
    body: "Votre page d'avis Google s'ouvre instantanément. Aucune application à installer.",
    img: PHOTO.etape2,
    alt: "La page d'avis Google du commerce s'ouvre sur le smartphone",
  },
];

const WHY = [
  {
    t: "NFC et QR code réunis",
    d: "Les deux technologies sur un seul présentoir : chaque client utilise ce qui lui convient.",
  },
  {
    t: "Accès instantané à Google",
    d: "Un geste, et votre page d'avis Google s'ouvre. Zéro recherche, zéro friction.",
  },
  {
    t: "Lien configurable à distance",
    d: "Modifiez la destination du présentoir depuis votre espace, sans jamais le réimprimer.",
  },
  {
    t: "Aucune application nécessaire",
    d: "Ni pour vous, ni pour vos clients. Tout se passe dans le navigateur du téléphone.",
  },
  {
    t: "Sans abonnement obligatoire",
    d: "Le présentoir vous appartient et fonctionne durablement, sans frais récurrent imposé.",
  },
  {
    t: "Design professionnel",
    d: "Une finition soignée, pensée pour s'intégrer sur le comptoir d'un commerce.",
  },
];

const USE_CASES = [
  { t: "Restaurants", d: "En fin de repas, quand le souvenir est encore frais.", icon: <path d="M4 3v7a3 3 0 0 0 6 0V3M7 10v11M17 3c-1.5 0-3 1.5-3 5s1.5 4 3 4v9" /> },
  { t: "Salons de coiffure", d: "À l'accueil ou en caisse, pour prolonger la relation.", icon: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.5 15.5M20 20 8.5 8.5" /></> },
  { t: "Garages automobiles", d: "À la remise des clés, au pic de satisfaction.", icon: <><path d="M5 17h14M6 17l1.5-6a2 2 0 0 1 2-1.5h5a2 2 0 0 1 2 1.5L18 17" /><circle cx="7.5" cy="17.5" r="1.5" /><circle cx="16.5" cy="17.5" r="1.5" /></> },
  { t: "Instituts de beauté", d: "Sur le comptoir de soin, un geste simple pour un avis.", icon: <><path d="M12 3c2 4 5 5 5 9a5 5 0 0 1-10 0c0-4 3-5 5-9z" /></> },
  { t: "Hôtels", d: "À la réception, au départ, pour capter le séjour.", icon: <><path d="M3 21V5l9-2v18M21 21V9l-9-2M7 8v0M7 12v0M7 16v0" /></> },
  { t: "Commerces de proximité", d: "En caisse, pour transformer chaque passage en avis.", icon: <><path d="M3 9l1.5-5h15L21 9M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M4 9h16" /></> },
];

// ── Fiche produit ────────────────────────────────────────────────────────────
// Renseignements physiques exacts à compléter par un humain avant mise en ligne.
// Laisser une chaîne vide masque proprement la ligne (jamais d'info inventée).
const SPEC_DIMENSIONS = ""; // TODO: dimensions réelles, ex. « 100 × 75 mm »
const SPEC_EPAISSEUR = ""; //  TODO: épaisseur réelle, ex. « 8 mm »
const SPEC_MATERIAU = ""; //   TODO: matériau réel, ex. « PVC rigide, finition mate »

const SPECS: { label: string; value: string }[] = [
  { label: "Technologies", value: "Puce NFC + QR code, déjà encodés" },
  { label: "Compatibilité", value: "iPhone et Android · aucune application" },
  { label: "Dimensions", value: SPEC_DIMENSIONS },
  { label: "Épaisseur", value: SPEC_EPAISSEUR },
  { label: "Matériau", value: SPEC_MATERIAU },
  { label: "Installation", value: "À poser sur le comptoir, sans fixation ni perçage" },
  { label: "Puce NFC", value: "Intégrée au présentoir, zone de contact indiquée" },
  { label: "Contenu du colis", value: "Le présentoir + son secret d'activation" },
  { label: "Expédition", value: "France métropolitaine, 2 à 5 jours ouvrés" },
  { label: "Activation", value: "En ligne, en quelques minutes" },
  { label: "Garantie", value: "Garantie légale de conformité (2 ans)" },
  { label: "Entretien", value: "Chiffon doux, sans produit abrasif" },
  { label: "Surfaces métalliques", value: "Préférez une surface non métallique, ou utilisez le QR code" },
  { label: "Retours", value: "Droit de rétractation sous 14 jours" },
].filter((s) => s.value !== "");

const INCLUDED = [
  "Le présentoir NFC + QR code, prêt à poser",
  "L'accès à la page d'activation",
  "La configuration initiale de votre lien Google",
  "L'accès direct à votre fiche Google, en un geste",
  "La gestion des informations essentielles du présentoir",
  "Le fonctionnement permanent du NFC et du QR code",
];

const SOON = [
  "Statistiques détaillées : scans, clics, NFC vs QR",
  "Historique et rapports d'activité",
  "Retours privés de vos clients",
  "Gestion de plusieurs présentoirs",
  "Connexion à Google Business Profile",
  "Réponses aux avis assistées par IA",
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Faut-il un abonnement ?",
    a: "Non. Le présentoir est un achat unique à 29,90 € TTC. Il s'active gratuitement et redirige vos clients vers votre page d'avis Google sans aucun frais récurrent. Des outils de suivi facultatifs existent, mais ils ne sont jamais obligatoires.",
  },
  {
    q: "Le présentoir fonctionne-t-il sur iPhone ?",
    a: "Oui. Le QR code fonctionne sur tous les iPhone, et la puce NFC est prise en charge sans application par les iPhone récents (iPhone XS et modèles plus récents, iOS à jour).",
  },
  {
    q: "Le présentoir fonctionne-t-il sur Android ?",
    a: "Oui. Le QR code fonctionne sur tous les Android, et la lecture NFC est disponible sur la grande majorité des smartphones Android équipés d'une puce NFC.",
  },
  {
    q: "Faut-il télécharger une application ?",
    a: "Non, jamais. Ni vous ni vos clients n'avez besoin d'installer quoi que ce soit : tout se passe directement dans le navigateur du téléphone.",
  },
  {
    q: "Comment relier le présentoir à ma fiche Google ?",
    a: "Après réception, scannez le présentoir, connectez-vous à votre espace Reviu et collez le lien de votre fiche Google. La redirection est active immédiatement.",
  },
  {
    q: "Puis-je modifier mon lien ?",
    a: "Oui. La destination du présentoir est modifiable à distance depuis votre espace, autant de fois que vous le souhaitez, sans réimprimer ni racheter le présentoir.",
  },
  {
    q: "Combien de temps prend l'activation ?",
    a: "Quelques minutes. L'activation se fait en ligne, en collant votre lien Google. Le présentoir est opérationnel aussitôt.",
  },
  {
    q: "Que contient le colis ?",
    a: "Le présentoir Reviu (puce NFC + QR code déjà encodés) et son secret d'activation imprimé sous la base, qui permet de le relier à votre établissement en toute sécurité.",
  },
  {
    q: "Où installer le présentoir ?",
    a: "Sur le comptoir, en caisse ou à l'accueil : partout où vos clients passent un moment, idéalement au moment du paiement ou du départ.",
  },
  {
    q: "Le NFC fonctionne-t-il sur une surface métallique ?",
    a: "Le métal peut perturber la lecture NFC. Posez le présentoir sur une surface non métallique, ou utilisez simplement le QR code, qui fonctionne dans tous les cas.",
  },
  {
    q: "Livraison et paiement ?",
    a: `Paiement sécurisé par carte via Stripe. Livraison en France métropolitaine : ${SHIPPING.feeLabel} de frais de port, offerts à partir de ${SHIPPING.freeFromLabel} de commande. Une facture vous est automatiquement transmise.`,
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
          <Container className="grid items-center gap-10 py-14 sm:gap-12 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
            <div className="reveal order-2 flex flex-col items-start lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft shadow-[var(--shadow-soft)]">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Présentoir NFC + QR pour avis Google
              </span>
              <h1 className="mt-5 font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.3rem] lg:leading-[1.04]">
                Obtenez plus d&apos;avis Google, directement depuis votre{" "}
                <span className="text-brand">comptoir</span>.
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-lg">
                Vos clients approchent leur téléphone ou scannent le QR code pour
                accéder instantanément à votre page d&apos;avis Google. Aucun
                téléchargement, aucun abonnement obligatoire et une installation
                en quelques minutes.
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href="#produits"
                  className={buttonClass("primary", "lg", "w-full sm:w-auto")}
                >
                  Commander mon présentoir — {STAND_PRICE}
                </a>
                <a
                  href="#fonctionnement"
                  className={buttonClass("secondary", "lg", "w-full sm:w-auto")}
                >
                  Voir comment ça fonctionne
                </a>
              </div>
              <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-muted">
                <span>Achat unique</span>
                <Dot />
                <span>Sans abonnement obligatoire</span>
                <Dot />
                <span>Activation rapide</span>
                <Dot />
                <span>Compatible iPhone et Android</span>
              </p>
            </div>
            <HeroProduct />
          </Container>
        </section>

        {/* 2 — RÉASSURANCE IMMÉDIATE */}
        <section className="border-b border-line bg-surface">
          <Container className="py-10 sm:py-12">
            <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {REASSURANCE.map((r) => (
                <li key={r.t} className="flex items-start gap-3">
                  <Check />
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">
                      {r.t}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-ink-soft">
                      {r.d}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* 3 — COMMENT ÇA MARCHE */}
        <section id="fonctionnement" className="scroll-mt-20 border-b border-line">
          <Container className="py-16 sm:py-20">
            <Reveal>
              <SectionHead
                eyebrow="Comment ça marche"
                title="Trois étapes, aucune application."
              />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <div className="flex h-full flex-col rounded-3xl border border-line bg-surface p-4 transition-colors hover:border-brand/30 sm:p-5">
                    <span className="px-1 font-mono text-sm font-semibold text-brand">
                      {s.n}
                    </span>
                    <ProductPhoto
                      src={s.img}
                      alt={s.alt}
                      className="mt-2 aspect-[4/3] w-full rounded-2xl"
                    />
                    <h3 className="mt-5 text-center font-display text-lg font-semibold text-ink">
                      {s.title}
                    </h3>
                    <p className="mx-auto mt-1.5 max-w-[18rem] text-center text-[15px] leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* 4 — DÉMONSTRATION RÉELLE */}
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
              <div>
                <SectionHead
                  eyebrow="Démonstration"
                  title="Le parcours complet, en un geste."
                  align="left"
                />
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  Approchez le téléphone ou scannez le QR code : la page d&apos;avis
                  Google du commerce s&apos;ouvre aussitôt. Le client n&apos;a
                  jamais besoin d&apos;installer d&apos;application.
                </p>
                <Link
                  href="/r/demo"
                  prefetch={false}
                  className={buttonClass("secondary", "md", "mt-6")}
                >
                  Essayer la page de démonstration
                </Link>
              </div>
              <Reveal delay={100}>
                <div className="relative overflow-hidden rounded-[2rem] border border-line bg-canvas p-4 shadow-[var(--shadow-soft)] sm:p-6">
                  <ProductPhoto
                    src={PHOTO.comptoir}
                    alt="Présentoir Reviu utilisé sur le comptoir d'un commerce"
                    className="aspect-[16/10] w-full rounded-2xl"
                  />
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft">
                      <StarMark className="h-4 w-4 text-brand" />
                    </span>
                    <p className="text-[13px] leading-snug text-ink-soft">
                      <span className="font-semibold text-ink">
                        Page d&apos;avis Google
                      </span>{" "}
                      — ouverte instantanément sur le téléphone du client.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* 5 — POURQUOI CHOISIR REVIU */}
        <section className="border-b border-line">
          <Container className="py-16 sm:py-20">
            <Reveal>
              <SectionHead
                eyebrow="Pourquoi Reviu"
                title="Un produit simple, pensé pour le comptoir."
              />
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WHY.map((w, i) => (
                <Reveal key={w.t} delay={i * 70}>
                  <div className="h-full rounded-3xl border border-line bg-surface p-6">
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

        {/* 6 — PRÉSENTATION DU PRODUIT */}
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <Reveal>
              <SectionHead eyebrow="Le produit" title="Le présentoir Reviu, en détail." />
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { src: PHOTO.front, alt: "Présentoir Reviu, vue de face", cap: "Vue de face" },
                { src: PHOTO.angle, alt: "Présentoir Reviu, vue de trois quarts", cap: "Vue de trois quarts" },
                { src: PHOTO.comptoir, alt: "Présentoir Reviu installé sur un comptoir", cap: "Installé sur le comptoir" },
              ].map((p, i) => (
                <Reveal key={p.cap} delay={i * 80}>
                  <figure className="overflow-hidden rounded-3xl border border-line bg-canvas">
                    <ProductPhoto src={p.src} alt={p.alt} className="aspect-square w-full" />
                    <figcaption className="px-4 py-3 text-center text-sm font-medium text-ink-soft">
                      {p.cap}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* 7 — CAS D'USAGE */}
        <section id="pour-qui" className="scroll-mt-20 border-b border-line">
          <Container className="py-16 sm:py-20">
            <Reveal>
              <SectionHead
                eyebrow="Pour qui"
                title="Pensé pour les commerces de proximité."
              />
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {USE_CASES.map((u, i) => (
                <Reveal key={u.t} delay={i * 70}>
                  <div className="flex h-full items-start gap-4 rounded-3xl border border-line bg-surface p-6">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {u.icon}
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-display text-[17px] font-semibold text-ink">
                        {u.t}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                        {u.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* 8 — OFFRE COMMERCIALE (achat principal unique) */}
        <section id="produits" className="scroll-mt-20 border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <Reveal>
              <SectionHead
                eyebrow="L'offre"
                title="Présentoir Reviu — 29,90 € TTC"
              />
            </Reveal>
            <div className="mx-auto mt-12 grid max-w-5xl items-start gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Visuel + fiche technique */}
              <div>
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute inset-4 -z-10 rounded-[2.5rem] bg-brand opacity-[0.06] blur-3xl"
                  />
                  <ProductPhoto
                    src={PHOTO.front}
                    alt="Présentoir Reviu NFC + QR pour avis Google"
                    className="aspect-square w-full rounded-[1.75rem] border border-line shadow-[var(--shadow-soft)]"
                  />
                </div>
                <dl className="mt-6 overflow-hidden rounded-2xl border border-line bg-canvas">
                  {SPECS.map((s, i) => (
                    <div
                      key={s.label}
                      className={
                        "grid grid-cols-[9rem_1fr] gap-3 px-4 py-3 text-sm sm:grid-cols-[10rem_1fr] " +
                        (i > 0 ? "border-t border-line" : "")
                      }
                    >
                      <dt className="text-muted">{s.label}</dt>
                      <dd className="font-medium text-ink">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Achat + ce qui est compris */}
              <div className="rounded-[2rem] border border-line bg-canvas p-6 shadow-[var(--shadow-soft)] sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  Présentoir NFC + QR
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                  Le présentoir connecté, prêt à poser. Redirection modifiable à
                  distance, activation gratuite.
                </p>
                <div className="mt-6 border-t border-line pt-6">
                  <StandOrder
                    tiers={STAND_TIERS.map((t) => ({ ...t }))}
                    max={STAND_QTY_MAX}
                    freeShipThresholdCents={FREE_SHIPPING_THRESHOLD_CENTS}
                    freeFromLabel={SHIPPING.freeFromLabel}
                  />
                </div>
                <div className="mt-6 border-t border-line pt-6">
                  <p className="text-sm font-semibold text-ink">Compris dans l&apos;achat</p>
                  <ul className="mt-3 grid gap-2">
                    {INCLUDED.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <Check />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs leading-relaxed text-muted">
                    Après activation, vous pourrez accéder à des outils facultatifs
                    de suivi et de pilotage depuis votre espace Reviu.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 9 — PREUVES (prêt à recevoir de vrais témoignages) */}
        <section className="border-b border-line">
          <Container className="py-16 sm:py-20">
            <Reveal>
              <SectionHead
                eyebrow="Ils installent Reviu"
                title="Bientôt, les retours de commerçants équipés."
              />
            </Reveal>
            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-dashed border-line bg-surface p-8 text-center">
              <div className="mx-auto flex w-fit items-center gap-1">
                <Stars size={22} />
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                Nous préférons afficher de vrais témoignages plutôt que d&apos;en
                inventer. Les premiers retours de commerçants équipés du présentoir
                Reviu apparaîtront ici très prochainement.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Mon%20retour%20sur%20le%20pr%C3%A9sentoir%20Reviu`}
                className="mt-5 inline-block text-sm font-medium text-brand hover:underline"
              >
                Déjà équipé ? Partagez votre expérience
              </a>
            </div>
          </Container>
        </section>

        {/* CONFORMITÉ GOOGLE */}
        <section className="border-b border-line bg-surface">
          <Container className="grid gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHead
                eyebrow="Plusieurs façons de s'exprimer"
                title="Un avis Google, ou un contact direct."
                align="left"
              />
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                Offrez à vos clients plusieurs moyens de partager leur expérience :
                publier un avis Google, ou contacter directement votre
                établissement. Le bouton « Avis Google » est proposé de la même
                manière à tous vos clients, sans tri selon la note.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                "Le bouton « Avis Google » est proposé à tous vos clients, sans distinction.",
                "Un canal de contact direct permet, en complément, de joindre l'établissement.",
                "Aucune redirection différente selon la note : chaque client choisit librement.",
              ].map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-canvas p-4"
                >
                  <Check />
                  <span className="text-[15px] leading-relaxed text-ink">{c}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* 10 — FAQ */}
        <section id="faq" className="scroll-mt-20 border-b border-line">
          <Container className="py-16 sm:py-20">
            <Reveal>
              <SectionHead eyebrow="Questions fréquentes" title="Tout ce qu'il faut savoir." />
            </Reveal>
            <div className="mx-auto mt-10 grid max-w-3xl gap-4">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-line bg-surface p-5 open:shadow-[var(--shadow-soft)]"
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

        {/* PROCHAINEMENT DANS REVIU (fonctionnalités futures, secondaire) */}
        <section className="border-b border-line bg-surface">
          <Container className="py-14 sm:py-16">
            <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-canvas p-7 sm:p-8">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Prochainement dans Reviu
              </span>
              <h2 className="mt-2 font-display text-xl font-semibold text-ink sm:text-2xl">
                Des outils de pilotage, à votre rythme.
              </h2>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-soft">
                Le présentoir fonctionne sans rien de plus. Pour aller plus loin,
                un espace de pilotage facultatif se construit — activez-le quand
                vous en aurez envie, après l&apos;achat.
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {SOON.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/40" />
                    {s}
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Acc%C3%A8s%20anticip%C3%A9%20Reviu`}
                className={buttonClass("secondary", "md", "mt-6")}
              >
                Rejoindre l&apos;accès anticipé
              </a>
            </div>
          </Container>
        </section>

        {/* REVENDEUR — teaser discret */}
        <section id="revendeur" className="scroll-mt-20 border-b border-line">
          <Container className="flex flex-col items-start gap-4 py-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                Vous voulez revendre le présentoir près de chez vous ?
              </h2>
              <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-ink-soft">
                Tarif de gros, conditions claires et formation accompagnée sur
                demande. Nous sélectionnons les revendeurs au cas par cas.
              </p>
            </div>
            <Link href="/revendeur" className={buttonClass("secondary", "md", "shrink-0")}>
              Devenir revendeur
            </Link>
          </Container>
        </section>

        {/* 11 — CTA FINAL */}
        <section>
          <Container className="py-16 sm:py-20">
            <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-ink px-6 py-14 text-center sm:px-12 sm:py-16">
              <h2 className="mx-auto max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                Transformez chaque passage client en opportunité d&apos;avis
                Google.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
                Achat unique, sans abonnement obligatoire. Installation en quelques
                minutes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#produits"
                  className={buttonClass("primary", "lg", "border-transparent")}
                >
                  Commander mon présentoir — {STAND_PRICE}
                </a>
                <a
                  href={`${APP_BASE}/signup`}
                  className={buttonClass("ghost", "lg", "!text-white hover:bg-white/10")}
                >
                  Activer un présentoir reçu
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
        className={
          "mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl " +
          (align === "center" ? "mx-auto max-w-2xl" : "")
        }
      >
        {title}
      </h2>
    </div>
  );
}

function Dot() {
  return <span aria-hidden className="text-line">·</span>;
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

/**
 * Visuel du hero : le vrai produit sur le comptoir (photo réelle), avec une
 * petite carte « avis Google » qui matérialise le mécanisme. Le tableau de bord
 * ne domine pas le hero (il apparaît plus bas comme avantage complémentaire).
 */
function HeroProduct() {
  return (
    <div className="reveal relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
      <div
        aria-hidden
        className="absolute inset-3 -z-10 rounded-[3rem] bg-brand opacity-[0.07] blur-3xl"
      />
      <ProductPhoto
        src={PHOTO.comptoir}
        alt="Présentoir Reviu NFC + QR posé sur le comptoir, un client laisse un avis Google"
        className="aspect-[4/3] w-full rounded-[2rem] border border-line shadow-[var(--shadow-lift)]"
      />
      {/* Carte « avis Google » — matérialise l'ouverture de la page Google. */}
      <div className="absolute -bottom-4 -left-3 hidden rounded-2xl border border-line bg-surface p-3 shadow-[var(--shadow-lift)] sm:block">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft">
            <StarMark className="h-4 w-4 text-brand" />
          </span>
          <div className="text-left">
            <p className="text-[11px] font-semibold text-ink">Avis Google</p>
            <Stars size={12} className="mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
