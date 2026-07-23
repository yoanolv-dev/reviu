import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductPhoto } from "@/components/site/product-photo";
import { Testimonials } from "@/components/site/testimonials";
import { StarMark } from "@/components/ui/logo";
import { APP_BASE, SITE_URL, SUBSCRIPTION } from "@/lib/brand";
import { CATALOG, formatEuros, type ShopProduct } from "@/lib/shop";
import { BuyButton } from "./buy-button";

export const metadata: Metadata = {
  title: "reviu — Présentoirs NFC + QR pour plus d'avis Google",
  description:
    "Commandez votre présentoir NFC + QR pour collecter des avis Google en un geste, la formation pour lancer votre business, ou un pack revendeur (10 ou 20 présentoirs). Paiement sécurisé, livraison en France.",
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

const STEPS = [
  {
    n: "01",
    title: "Recevez votre présentoir",
    body: "NFC et QR déjà encodés, prêt à poser sur le comptoir. Rien à installer.",
  },
  {
    n: "02",
    title: "Activez en 2 minutes",
    body: "Scannez, collez votre lien Google, personnalisez. En ligne immédiatement.",
  },
  {
    n: "03",
    title: "Les avis affluent",
    body: "Un geste suffit à vos clients. Vous suivez tout depuis votre tableau de bord.",
  },
];

const COMPLIANCE = [
  "Le bouton « Avis Google » est proposé à tous vos clients, sans distinction.",
  "En complément, un canal de contact direct permet de joindre l'établissement.",
  "Aucun tri automatique selon la note : chaque client choisit librement.",
];

const PHOTO = {
  hero: "/products/presentoir-angle.png",
  front: "/products/presentoir.png",
  comptoir: "/products/presentoir-comptoir.png",
} as const;

export default function BoutiquePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-canvas">
        {/* HERO */}
        <section className="relative isolate overflow-hidden border-b border-line">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-[-6rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-brand-soft opacity-70 blur-3xl"
          />
          <Container className="grid items-center gap-10 py-12 sm:gap-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
            <div className="reveal order-2 flex flex-col items-start lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Boutique officielle reviu
              </span>
              <h1 className="mt-5 font-display text-[1.9rem] font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[3.15rem] lg:leading-[1.05]">
                Le présentoir qui transforme vos clients en{" "}
                <span className="text-brand">avis Google</span>.
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft sm:mt-5 sm:text-lg">
                Un geste — coller le téléphone ou scanner le QR — et l&apos;avis
                est lancé. Commandez à l&apos;unité, ou lancez votre propre
                activité avec un pack revendeur et la formation.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-muted sm:mt-8 sm:gap-x-6">
                <TrustItem>Paiement sécurisé Stripe</TrustItem>
                <TrustItem>Livraison en France</TrustItem>
                <TrustItem>NFC + QR déjà encodés</TrustItem>
              </div>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href="#produits"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-white shadow-[0_8px_20px_-8px_var(--color-brand)] transition-colors hover:bg-brand-strong sm:w-auto"
                >
                  Voir les produits
                </a>
                <a
                  href="#revendeur"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-surface px-6 text-[15px] font-medium text-ink transition-colors hover:border-brand/40 sm:w-auto"
                >
                  Devenir revendeur
                </a>
              </div>
            </div>
            <ProductPhoto
              src={PHOTO.hero}
              alt="Présentoir reviu NFC + QR pour avis Google"
              className="order-1 mx-auto aspect-square w-full max-w-[18rem] rounded-3xl shadow-[var(--shadow-soft)] sm:max-w-sm lg:order-2 lg:max-w-none"
            />
          </Container>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section className="border-b border-line bg-surface">
          <Container className="py-14 sm:py-16">
            <SectionHead eyebrow="Comment ça marche" title="Trois étapes, zéro friction." />
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="flex flex-col">
                  <span className="font-mono text-sm text-brand">{s.n}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* PRODUITS */}
        <section id="produits" className="scroll-mt-24">
          <Container className="py-16 sm:py-20">
            <SectionHead
              eyebrow="Catalogue"
              title="Choisissez votre point de départ."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {CATALOG.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted">
              Prix TTC. Le présentoir s&apos;active gratuitement ; l&apos;
              <strong className="font-medium text-ink-soft">
                abonnement de suivi
              </strong>{" "}
              ({SUBSCRIPTION.priceLabel}/{SUBSCRIPTION.period} par présentoir,
              sans engagement) se souscrit ensuite depuis votre espace.
            </p>
          </Container>
        </section>

        {/* PREUVE SOCIALE / CAS D'USAGE */}
        <Testimonials />

        {/* CONFORMITÉ GOOGLE */}
        <section className="border-t border-line bg-surface">
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
                proposé en complément — jamais un moyen d&apos;éviter un avis
                négatif. Aucun tri automatique selon la note.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {COMPLIANCE.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4"
                >
                  <Check />
                  <span className="text-[15px] leading-relaxed text-ink">{c}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* REVENDEUR — le différenciateur */}
        <section
          id="revendeur"
          className="scroll-mt-24 border-y border-line bg-surface"
        >
          <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2">
            <ProductPhoto
              src={PHOTO.comptoir}
              alt="Présentoir reviu posé sur le comptoir d'un commerce"
              className="aspect-[4/3] w-full rounded-3xl shadow-[var(--shadow-soft)]"
            />
            <div>
              <SectionHead
                eyebrow="Programme revendeur"
                title="Ne revendez pas une carte morte. Revendez un présentoir intelligent."
                align="left"
              />
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                Achetez les présentoirs en pack remisé, revendez-les au prix
                public : votre marge est encaissée à la vente. Et comme le
                présentoir reviu est adossé à un vrai service (statistiques,
                retours privés, liens modifiables), il se vend bien plus
                facilement qu&apos;une simple carte NFC.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {RESELLER_POINTS.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-[15px] text-ink">
                    <Check />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#produits" className="inline-flex">
                  <span className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-white shadow-[0_8px_20px_-8px_var(--color-brand)] transition-colors hover:bg-brand-strong">
                    Voir les packs revendeurs
                  </span>
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section>
          <Container className="py-16 sm:py-20">
            <SectionHead eyebrow="Questions fréquentes" title="Bon à savoir." />
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

        {/* CTA compte */}
        <section className="border-t border-line bg-surface">
          <Container className="flex flex-col items-center gap-4 py-14 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Déjà un présentoir ?
            </h2>
            <p className="max-w-md text-[15px] text-ink-soft">
              Créez votre compte pour l&apos;activer, personnaliser vos liens et
              suivre vos statistiques.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`${APP_BASE}/signup`}
                className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
              >
                Créer mon compte
              </a>
              <Link
                href="/demo"
                className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-canvas px-6 text-sm font-medium text-ink transition-colors hover:border-brand/40"
              >
                Voir la démo
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

// ── Carte produit ───────────────────────────────────────────────────────────
function ProductCard({ product }: { product: ShopProduct }) {
  const isDigital = product.kind === "digital";
  const highlight = product.badge === "Le plus vendu";

  return (
    <div
      className={
        "elev flex flex-col overflow-hidden rounded-3xl border bg-surface " +
        (highlight ? "border-brand/50 ring-1 ring-brand/20" : "border-line")
      }
    >
      <div className="relative">
        {isDigital ? (
          <div className="grid aspect-[16/9] w-full place-items-center bg-gradient-to-br from-brand to-brand-strong">
            <div className="flex flex-col items-center gap-2 text-white">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
                <StarMark className="h-6 w-6 text-white" />
              </span>
              <span className="text-sm font-medium text-white/85">
                Formation 100 % en ligne
              </span>
            </div>
          </div>
        ) : (
          <ProductPhoto
            src={PHOTO.front}
            alt={product.name}
            className="aspect-[16/9] w-full"
          />
        )}
        {product.standsIncluded > 1 && (
          <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
            ×{product.standsIncluded} présentoirs
          </span>
        )}
        {product.badge && (
          <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-ink">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-ink">
          {product.name}
        </h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
          {product.tagline}
        </p>

        <ul className="mt-5 flex flex-col gap-2.5">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
              <Check />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
          <div>
            <span className="font-display text-3xl font-semibold text-ink">
              {formatEuros(product.priceCents)}
            </span>
            <span className="ml-1 text-sm text-muted">
              {product.kind === "digital" ? "· accès à vie" : "· achat unique"}
            </span>
            {product.perUnitLabel && (
              <p className="mt-0.5 text-xs text-muted">{product.perUnitLabel}</p>
            )}
          </div>
        </div>

        <BuyButton
          product={product.id}
          label={isDigital ? "Accéder à la formation" : "Commander"}
          className="mt-5"
        />
      </div>
    </div>
  );
}

const RESELLER_POINTS = [
  "Marge immédiate à la revente : achat en pack remisé, revente au prix public (≈ 10 €/unité).",
  "Un produit facile à vendre : soutenu par un vrai service, pas un gadget qui finit dans un tiroir.",
  "Un outil concret à montrer en rendez-vous : dashboard, stats de scan, retours privés.",
  "La formation vous donne l'argumentaire, les tarifs et la méthode de prospection locale.",
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Comment fonctionne le présentoir ?",
    a: "Chaque présentoir intègre une puce NFC et un QR code déjà encodés. Le client colle son téléphone ou scanne le QR, et il est redirigé vers votre page d'avis Google. La destination est modifiable à distance, sans réimprimer.",
  },
  {
    q: "Faut-il un abonnement ?",
    a: "Non pour commander : le présentoir est un achat unique et s'active gratuitement. L'abonnement de suivi (2,99 €/mois par présentoir, sans engagement) est optionnel et débloque les statistiques, la modification illimitée des liens et les retours privés.",
  },
  {
    q: "Qu'est-ce que le pack revendeur ?",
    a: "Un pack (10 ou 20 présentoirs) livré avec la formation complète. Il vous permet de démarrer une activité de revente : vous placez les présentoirs chez des commerçants, vous marge à la revente, et chaque présentoir activé peut générer un abonnement récurrent.",
  },
  {
    q: "Comment j'accède à la formation après achat ?",
    a: "L'accès est immédiat : après paiement, vous recevez un lien d'accès par e-mail et vous pouvez ouvrir la formation directement depuis la page de confirmation. L'accès est valable à vie.",
  },
  {
    q: "Livraison et paiement ?",
    a: "Paiement sécurisé par carte via Stripe. Livraison en France métropolitaine. Une facture vous est automatiquement transmise.",
  },
];

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

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Check />
      {children}
    </span>
  );
}

function Check() {
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
