"use server";

import { redirect } from "next/navigation";
import { getStripe, STRIPE_PRICE_ID } from "./stripe";
import { createSupabaseServer } from "./supabase/server";
import { createSupabaseAdmin } from "./supabase/admin";
import { APP_BASE } from "./brand";
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
