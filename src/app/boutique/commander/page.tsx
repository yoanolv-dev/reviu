import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SHIPPING } from "@/lib/brand";
import {
  getProduct,
  clampStandQty,
  standUnitCents,
  requiresShipping,
  shippingFeeCents,
  formatEuros,
} from "@/lib/shop";
import { CheckoutEmbed } from "./checkout-embed";

export const metadata: Metadata = {
  title: "Finaliser votre commande - reviu",
  // Étape de paiement : hors index.
  robots: { index: false, follow: false },
};

export default async function CommanderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; quantity?: string }>;
}) {
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

  return (
    <>
      <SiteHeader />
      <main className="bg-canvas">
        <Container className="py-10 sm:py-14">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <span aria-hidden>←</span> Retour à la boutique
          </Link>

          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Finaliser votre commande
          </h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            Paiement sécurisé par Stripe, directement sur reviu.fr. Aucune
            redirection : vous restez sur notre site.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
            {/* Récapitulatif de commande */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Votre commande
                </h2>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-ink">{product.name}</p>
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
                    <dd className={shipping === 0 ? "text-brand" : "text-ink"}>
                      {shipping === 0 ? "Offerte" : formatEuros(shipping)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-sm font-medium text-ink">Total</span>
                  <span className="font-display text-xl font-semibold text-ink">
                    {formatEuros(total)}
                  </span>
                </div>

                {shipping !== 0 && (
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    Livraison offerte dès {SHIPPING.freeFromLabel} de commande.
                  </p>
                )}
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  Achat unique, sans frais supplémentaires. Espace Reviu inclus
                  dès l&apos;activation.
                </p>
              </div>
            </aside>

            {/* Paiement embarqué Stripe */}
            <section aria-label="Paiement" className="min-w-0">
              <div className="rounded-3xl border border-line bg-canvas p-4 shadow-[var(--shadow-soft)] sm:p-6">
                <CheckoutEmbed product={product.id} quantity={qty} />
              </div>
            </section>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
