import type { Metadata } from "next";
import { preconnect } from "react-dom";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductPhoto } from "@/components/site/product-photo";
import { ProductGallery } from "@/components/site/product-gallery";
import { Reveal } from "@/components/site/reveal";
import { accentLastWord } from "@/components/ui/accent";
import { IconArrowRight, IconCheck } from "@/components/ui/icons";
import { GUARANTEE, QR_TOOL_PATH, SHIPPING } from "@/lib/brand";
import { getProduct, STAND_TIERS, STAND_QTY_MAX } from "@/lib/shop";
import { PHOTO, PRODUCT_PATH } from "@/lib/photos";
import {
  buildMetadata,
  graph,
  productSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { StandOrder } from "../boutique/stand-order";

export const metadata: Metadata = buildMetadata({
  title: "Présentoir avis Google NFC + QR code : prix et caractéristiques | reviu",
  description:
    "Fiche du présentoir avis Google reviu : puce NFC + QR code déjà encodés, lien modifiable, statistiques incluses. 29,90 €, dégressif, livraison offerte.",
  path: PRODUCT_PATH,
  keywords: [
    "présentoir avis Google",
    "présentoir NFC avis Google",
    "plaque NFC avis Google",
    "support avis Google comptoir",
    "présentoir QR code avis",
    "acheter présentoir avis Google",
  ],
});

const GALLERY = [
  { src: PHOTO.front, alt: "Présentoir Reviu NFC et QR code pour avis Google, vue de face" },
  { src: PHOTO.etape3, alt: "Cliente laissant un avis Google depuis son téléphone devant le présentoir Reviu" },
  { src: PHOTO.etape1, alt: "Smartphone scannant le QR code du présentoir Reviu pour avis Google" },
  { src: PHOTO.angle, alt: "Présentoir Reviu, vue de trois quarts montrant le QR code et la zone NFC" },
];

const BENEFITS = [
  "Ouvre votre page d'avis Google en un geste",
  "Aucune application à télécharger",
  "Compatible iPhone et Android",
  "Espace Reviu inclus, sans abonnement",
];

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

const FAQ: { q: string; a: string }[] = [
  {
    q: "Comment relier le présentoir à ma fiche Google ?",
    a: "Après réception, scannez le présentoir (ou rendez-vous sur la page d'activation), saisissez le code secret imprimé à côté du QR code, puis collez le lien de votre fiche Google. Le présentoir est opérationnel aussitôt.",
  },
  {
    q: "Est-il compatible avec tous les téléphones ?",
    a: "Le QR code fonctionne sur tous les smartphones. La lecture NFC est prise en charge sans application par les iPhone récents (XS et plus) et la grande majorité des Android équipés du NFC.",
  },
  {
    q: "Puis-je modifier le lien du présentoir ?",
    a: "Oui, à tout moment depuis votre espace Reviu inclus. Le présentoir garde toujours la même adresse (QR et NFC) : vous changez seulement sa destination, sans rien réimprimer.",
  },
  {
    q: "Combien coûte le présentoir en plusieurs exemplaires ?",
    a: "29,90 € l'unité, 27 € l'unité dès 3 présentoirs et 25 € l'unité dès 5. La remise s'applique automatiquement à la commande, livraison offerte.",
  },
  {
    q: "Où placer le présentoir ?",
    a: "Là où le client attend quelques secondes à la fin de sa visite : près de la caisse, à l'accueil, sur le comptoir. Évitez de le poser directement sur une surface métallique, qui peut gêner la lecture NFC.",
  },
  {
    q: "Et s'il ne me convient pas ?",
    a: `${GUARANTEE.detail} Cette garantie s'ajoute au droit de rétractation légal de 14 jours.`,
  },
];

export default function ProductPage() {
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
            path: PRODUCT_PATH,
            image: PHOTO.front,
            sku: stand.id,
          }),
        ]
      : []),
    faqSchema(FAQ),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Présentoir avis Google", path: PRODUCT_PATH },
    ]),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        <section className="border-b border-line bg-surface">
          <Container className="py-8 sm:py-12">
            <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
              <Link href="/" className="hover:text-ink">Accueil</Link>
              <span className="mx-2">/</span>
              <span className="text-ink-soft">Présentoir avis Google</span>
            </nav>
            <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <ProductGallery images={GALLERY} />
              </div>

              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Présentoir avis Google
                  <span className="block text-brand">NFC + QR code</span>
                </h1>
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
                          <dd className="mb-2 text-sm font-medium text-ink sm:mb-0">{s.value}</dd>
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
                      <li>{SHIPPING.label} en France métropolitaine, sous {SHIPPING.delay}.</li>
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

        {/* Mise en route */}
        <section className="border-b border-line">
          <Container className="py-16 sm:py-20">
            <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {accentLastWord("Prêt en 2 minutes, sans technicien.")}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {SETUP.map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="flex h-full flex-col">
                    <div className="relative">
                      <ProductPhoto src={s.img} alt={s.alt} className="aspect-[4/3] w-full rounded-2xl" />
                      <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-surface font-display text-sm font-semibold text-brand shadow-[var(--shadow-soft)]">
                        {s.n}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-[17px] font-semibold leading-snug text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Où l'installer */}
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {accentLastWord("Au comptoir, au bon moment.")}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PLACES.map((p, i) => (
                <Reveal key={p.t} delay={i * 80}>
                  <Link
                    href={p.href}
                    className="group block h-full overflow-hidden rounded-3xl border border-line bg-canvas transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                  >
                    <ProductPhoto
                      src={p.img}
                      alt={p.alt}
                      framed={false}
                      className="aspect-[4/3] w-full"
                      imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="p-5">
                      <h3 className="font-display text-[17px] font-semibold text-ink">{p.t}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.d}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                        Lire le guide
                        <IconArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ produit */}
        <section>
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Questions sur le présentoir.")}
              </h2>
              <div className="mt-10 grid gap-3">
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
              <p className="mt-8 text-center text-sm text-muted">
                Pas encore prêt ?{" "}
                <Link href={QR_TOOL_PATH} className="font-semibold text-brand hover:underline">
                  Créez gratuitement le QR code de votre page d&apos;avis
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
