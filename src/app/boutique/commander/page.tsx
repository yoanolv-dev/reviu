import type { Metadata } from "next";
import { Suspense } from "react";
import { preconnect } from "react-dom";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductPhoto } from "@/components/site/product-photo";
import { SHIPPING } from "@/lib/brand";
import {
  getProduct,
  clampStandQty,
  standUnitCents,
  requiresShipping,
  shippingFeeCents,
  formatEuros,
  FREE_SHIPPING_THRESHOLD_CENTS,
} from "@/lib/shop";
import { CheckoutSection } from "./checkout-section";

export const metadata: Metadata = {
  title: "Finaliser votre commande - reviu",
  // Étape de paiement : hors index.
  robots: { index: false, follow: false },
};

const PHOTO = "/products/presentoir.webp";

// Réassurances affichées près du récapitulatif (confiance + qualité perçue).
const TRUST = [
  "Paiement sécurisé par Stripe",
  "Livraison en 2 à 5 jours ouvrés",
  "Retour sous 14 jours",
  "Garantie légale de conformité (2 ans)",
] as const;

export default async function CommanderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; quantity?: string }>;
}) {
  // Connexions Stripe préchauffées dès le HTML initial (SDK + iframe de paiement).
  preconnect("https://js.stripe.com");
  preconnect("https://checkout.stripe.com");

  const { product: productId = "stand", quantity } = await searchParams;

  const product = getProduct(productId);
  // Produit inconnu : retour à la boutique plutôt qu'une page vide.
  if (!product) redirect("/boutique");

  const isStand = product.id === "stand";
  const qty = isStand ? clampStandQty(Number(quantity ?? 1)) : 1;
  const unit = isStand ? standUnitCents(qty) : product.priceCents;
  const subtotal = unit * qty;
  const shipping = requiresShipping(product) ? shippingFeeCents(subtotal) : 0;
  const total = subtotal + shipping;
  const freeShipGap = Math.max(FREE_SHIPPING_THRESHOLD_CENTS - subtotal, 0);

  return (
    <>
      <SiteHeader />
      <main className="bg-canvas">
        <Container className="py-8 sm:py-12">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-opacity hover:opacity-70"
          >
            <span aria-hidden>←</span> Retour à la boutique
          </Link>

          <div className="mt-4 max-w-xl">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
              Finaliser votre commande
            </h1>
            <p className="mt-2 flex items-center gap-2 text-[15px] leading-relaxed text-ink-soft">
              <LockIcon />
              Paiement sécurisé, directement sur reviu.fr. Aucune redirection.
            </p>
          </div>

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-10">
            {/* Récapitulatif de commande */}
            <aside className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-soft)]">
                <ProductPhoto
                  src={PHOTO}
                  alt="Présentoir Reviu NFC et QR code pour avis Google"
                  className="aspect-[4/3] w-full"
                />
                <div className="p-6">
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Votre commande
                  </h2>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatEuros(unit)} l&apos;unité × {qty}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-sm font-medium text-ink">
                      {formatEuros(subtotal)}
                    </span>
                  </div>

                  <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted">Sous-total</dt>
                      <dd className="text-ink">{formatEuros(subtotal)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted">Livraison</dt>
                      <dd
                        className={
                          shipping === 0 ? "font-medium text-brand" : "text-ink"
                        }
                      >
                        {shipping === 0 ? "Offerte" : formatEuros(shipping)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-sm font-medium text-ink">Total</span>
                    <span className="font-display text-2xl font-semibold text-ink">
                      {formatEuros(total)}
                    </span>
                  </div>

                  {shipping !== 0 && freeShipGap > 0 && (
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      Plus que {formatEuros(freeShipGap)} pour la livraison
                      offerte (dès {SHIPPING.freeFromLabel}).
                    </p>
                  )}

                  <ul className="mt-5 space-y-2 border-t border-line pt-4">
                    {TRUST.map((t) => (
                      <li
                        key={t}
                        className="flex items-start gap-2.5 text-[13px] text-ink-soft"
                      >
                        <CheckIcon />
                        {t}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-xs leading-relaxed text-muted">
                    Achat unique, sans frais récurrents. Espace Reviu inclus dès
                    l&apos;activation.
                  </p>
                </div>
              </div>
            </aside>

            {/* Paiement embarqué Stripe */}
            <section aria-label="Paiement" className="min-w-0">
              <div className="rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-7">
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-line pb-4">
                  <h2 className="font-display text-base font-semibold text-ink">
                    Paiement
                  </h2>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                    <LockIcon />
                    Sécurisé par Stripe
                  </span>
                </div>
                <Suspense fallback={<CheckoutSkeleton />}>
                  <CheckoutSection product={product.id} quantity={qty} />
                </Suspense>
              </div>
            </section>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

// ── Squelette de chargement (pendant la préparation de la session Stripe) ─────
function CheckoutSkeleton() {
  return (
    <div>
      <div className="space-y-4" aria-hidden>
        <div className="h-4 w-20 animate-pulse rounded bg-line-soft" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-line-soft" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 animate-pulse rounded-xl bg-line-soft" />
          <div className="h-11 animate-pulse rounded-xl bg-line-soft" />
        </div>
        <div className="h-4 w-28 animate-pulse rounded bg-line-soft" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-line-soft" />
        <div className="mt-2 h-12 w-full animate-pulse rounded-full bg-line" />
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        Chargement du paiement sécurisé…
      </p>
    </div>
  );
}

// ── Petites icônes ────────────────────────────────────────────────────────────
function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 text-brand"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
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
