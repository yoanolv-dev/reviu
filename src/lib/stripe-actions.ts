"use server";

import { redirect } from "next/navigation";
import { getStripe, STRIPE_PRICE_ID } from "./stripe";
import { createSupabaseServer } from "./supabase/server";
import { createSupabaseAdmin } from "./supabase/admin";
import { APP_BASE, SITE_URL } from "./brand";
import { getProduct, requiresShipping, SHIPPING_COUNTRIES } from "./shop";
import type { FormState } from "./form";

/**
 * Intégration Stripe (paiement réel).
 *
 * - Dashboard (commerçant connecté) : `startCheckoutAction` ouvre une session
 *   Stripe Checkout pour un présentoir qu'il possède ; `openBillingPortalAction`
 *   ouvre le portail de facturation Stripe (gérer la carte, résilier).
 * - Scan (parcours anonyme) : `startSelfCheckout` ouvre une session Checkout
 *   gardée par le secret d'activation imprimé sous le présentoir.
 *
 * Aucun statut d'abonnement n'est écrit ici : c'est le webhook Stripe qui met à
 * jour la table `subscriptions` une fois le paiement confirmé (source de vérité).
 */

// --- Dashboard : s'abonner à un présentoir possédé -------------------------
export async function startCheckoutAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const stripe = getStripe();
  if (!stripe || !STRIPE_PRICE_ID) {
    return { error: "Le paiement n'est pas disponible pour le moment." };
  }
  const standId = String(formData.get("stand_id") ?? "");
  if (!standId) return { error: "Présentoir introuvable." };

  const supabase = await createSupabaseServer();
  // RLS : seuls les présentoirs de l'organisation du commerçant sont visibles.
  const { data: stand } = await supabase
    .from("stands")
    .select("id,code,status")
    .eq("id", standId)
    .maybeSingle<{ id: string; code: string; status: string }>();
  if (!stand) return { error: "Présentoir introuvable sur votre compte." };

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("stand_id", standId)
    .maybeSingle<{ stripe_customer_id: string | null }>();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    ...(sub?.stripe_customer_id
      ? { customer: sub.stripe_customer_id }
      : { customer_email: user?.email ?? undefined }),
    client_reference_id: standId,
    metadata: { stand_id: standId, stand_code: stand.code },
    subscription_data: { metadata: { stand_id: standId, stand_code: stand.code } },
    allow_promotion_codes: true,
    success_url: `${APP_BASE}/dashboard/stands?sub=success`,
    cancel_url: `${APP_BASE}/dashboard/stands?sub=cancel`,
  });

  if (!session.url) return { error: "Impossible de démarrer le paiement." };
  redirect(session.url);
}

// --- Dashboard : gérer / résilier via le portail Stripe --------------------
export async function openBillingPortalAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const stripe = getStripe();
  if (!stripe) return { error: "La gestion n'est pas disponible pour le moment." };
  const standId = String(formData.get("stand_id") ?? "");

  const supabase = await createSupabaseServer();
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("stand_id", standId)
    .maybeSingle<{ stripe_customer_id: string | null }>();
  if (!sub?.stripe_customer_id) {
    return { error: "Aucun abonnement Stripe pour ce présentoir." };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${APP_BASE}/dashboard/stands`,
  });
  redirect(session.url);
}

// --- Boutique : achat unique (présentoir, formation, packs revendeurs) ------
/**
 * Ouvre une session Stripe Checkout en paiement unique pour un produit de la
 * boutique. Le montant est construit à partir du catalogue (`price_data` en
 * ligne) : la source de vérité des prix reste `src/lib/shop.ts`, aucun produit
 * Stripe à créer à la main. Le webhook enregistre la commande (mail de
 * confirmation + accès formation) une fois le paiement confirmé.
 */
export async function startShopCheckout(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const stripe = getStripe();
  if (!stripe) {
    return { error: "Le paiement n'est pas disponible pour le moment." };
  }
  const product = getProduct(String(formData.get("product") ?? ""));
  if (!product) return { error: "Produit introuvable." };

  const qtyRaw = Number(formData.get("quantity") ?? 1);
  const quantity =
    product.adjustableQuantity && Number.isFinite(qtyRaw)
      ? Math.min(Math.max(Math.trunc(qtyRaw), 1), 50)
      : 1;

  const ship = requiresShipping(product);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity,
        ...(product.adjustableQuantity
          ? { adjustable_quantity: { enabled: true, minimum: 1, maximum: 50 } }
          : {}),
        price_data: {
          currency: "eur",
          unit_amount: product.priceCents,
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
        }
      : {}),
    metadata: {
      shop_product: product.id,
      product_name: product.name,
      grants_formation: product.grantsFormation ? "1" : "0",
      stands_included: String(product.standsIncluded),
    },
    success_url: `${SITE_URL}/boutique/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/boutique?checkout=cancel`,
  });

  if (!session.url) return { error: "Impossible de démarrer le paiement." };
  redirect(session.url);
}

// --- Scan : s'abonner depuis le parcours anonyme (gardé par le secret) -----
export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function startSelfCheckout(input: {
  code: string;
  pin: string;
}): Promise<CheckoutResult> {
  const stripe = getStripe();
  if (!stripe || !STRIPE_PRICE_ID) {
    return { ok: false, error: "Le paiement n'est pas disponible pour le moment." };
  }
  const admin = createSupabaseAdmin();
  if (!admin) return { ok: false, error: "Service indisponible pour le moment." };

  const code = input.code.trim();
  const { data: stand } = await admin
    .from("stands")
    .select("id,status")
    .eq("code", code)
    .maybeSingle<{ id: string; status: string }>();
  if (!stand) return { ok: false, error: "Présentoir introuvable." };

  // Vérifie le secret d'activation (imprimé sous le présentoir) — même garde
  // que l'activation, pour empêcher un abonnement par un tiers.
  const { data: secret } = await admin.rpc("derive_stand_secret", { p_code: code });
  if (
    !secret ||
    String(secret).toUpperCase() !== input.pin.trim().toUpperCase()
  ) {
    return { ok: false, error: "Secret d'activation incorrect." };
  }

  const { data: sub } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("stand_id", stand.id)
    .maybeSingle<{ stripe_customer_id: string | null }>();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    ...(sub?.stripe_customer_id ? { customer: sub.stripe_customer_id } : {}),
    client_reference_id: stand.id,
    metadata: { stand_id: stand.id, stand_code: code },
    subscription_data: { metadata: { stand_id: stand.id, stand_code: code } },
    allow_promotion_codes: true,
    success_url: `${APP_BASE}/login?sub=success`,
    cancel_url: `${APP_BASE}/login?sub=cancel`,
  });

  if (!session.url) return { ok: false, error: "Impossible de démarrer le paiement." };
  return { ok: true, url: session.url };
}
