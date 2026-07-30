import type Stripe from "stripe";
import {
  getProduct,
  requiresShipping,
  SHIPPING_COUNTRIES,
  clampStandQty,
  standUnitCents,
  shippingFeeCents,
  type ShopProduct,
} from "./shop";

/**
 * Construction des paramètres d'une session Stripe Checkout pour la boutique
 * (achat unique). Source unique partagée par les deux points d'entrée :
 *
 *  - `startShopCheckout` (Checkout hébergé, redirection) - ajoute success_url /
 *    cancel_url ;
 *  - `POST /api/stripe/checkout-session` (Embedded Checkout) - ajoute
 *    `ui_mode: 'embedded'` + return_url.
 *
 * Le montant est TOUJOURS recalculé ici à partir du catalogue (`price_data` en
 * ligne) : le client ne peut pas fixer le prix. La quantité reçue est bornée et,
 * pour le présentoir, le prix unitaire est recalculé par palier dégressif.
 */
export type ShopSessionBuild =
  | {
      ok: true;
      product: ShopProduct;
      quantity: number;
      /** Paramètres communs, SANS les URLs ni le `ui_mode` (ajoutés par l'appelant). */
      params: Stripe.Checkout.SessionCreateParams;
    }
  | { ok: false; error: string };

export function buildShopSessionParams(
  productId: string,
  quantityRaw: number,
): ShopSessionBuild {
  const product = getProduct(productId);
  if (!product) return { ok: false, error: "Produit introuvable." };

  // Le présentoir applique un tarif dégressif : la quantité est bornée et le
  // prix unitaire recalculé par palier (on maîtrise le montant, donc pas
  // d'`adjustable_quantity` côté Stripe qui casserait la remise). Les autres
  // produits gardent leur prix fixe.
  const isStand = product.id === "stand";
  const quantity = isStand
    ? clampStandQty(quantityRaw)
    : product.adjustableQuantity && Number.isFinite(quantityRaw)
      ? Math.min(Math.max(Math.trunc(quantityRaw), 1), 50)
      : 1;
  const unitAmount = isStand ? standUnitCents(quantity) : product.priceCents;
  const useAdjustable = product.adjustableQuantity && !isStand;
  const ship = requiresShipping(product);

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: [
      {
        quantity,
        ...(useAdjustable
          ? { adjustable_quantity: { enabled: true, minimum: 1, maximum: 50 } }
          : {}),
        price_data: {
          currency: "eur",
          unit_amount: unitAmount,
          product_data: {
            name: product.name,
            description: product.tagline,
          },
        },
      },
    ],
    customer_creation: "always",
    billing_address_collection: "auto",
    invoice_creation: { enabled: true },
    allow_promotion_codes: true,
    ...(ship
      ? {
          shipping_address_collection: {
            allowed_countries: [...SHIPPING_COUNTRIES],
          },
          // Livraison offerte au-delà du seuil, sinon frais forfaitaires.
          shipping_options: [
            {
              shipping_rate_data: {
                type: "fixed_amount" as const,
                fixed_amount: {
                  amount: shippingFeeCents(unitAmount * quantity),
                  currency: "eur",
                },
                display_name:
                  shippingFeeCents(unitAmount * quantity) === 0
                    ? "Livraison offerte"
                    : "Livraison",
                delivery_estimate: {
                  minimum: { unit: "business_day" as const, value: 2 },
                  maximum: { unit: "business_day" as const, value: 5 },
                },
              },
            },
          ],
        }
      : {}),
    metadata: {
      shop_product: product.id,
      product_name: product.name,
      grants_formation: product.grantsFormation ? "1" : "0",
      stands_included: String(product.standsIncluded),
    },
  };

  return { ok: true, product, quantity, params };
}
