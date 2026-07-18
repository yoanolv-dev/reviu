"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "./supabase/server";
import { createSupabaseAdmin } from "./supabase/admin";
import {
  getStripe,
  monitoringPriceId,
  appBase,
  isStripeConfigured,
  subscriptionPeriodEnd,
} from "./stripe";

const STANDS = "/dashboard/stands";

/**
 * Facturation à la quantité : un seul abonnement Stripe par marchand, dont la
 * quantité = nombre de présentoirs suivis. Chaque présentoir couvert a une ligne
 * `subscriptions` partageant le même `stripe_subscription_id`.
 */

/** IDs des présentoirs du marchand courant (bornés par le RLS de la session). */
async function myStandIds(): Promise<string[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from("stands").select("id");
  return ((data ?? []) as { id: string }[]).map((s) => s.id);
}

/** Abonnement Stripe partagé du marchand, s'il en a un actif. */
async function activeSubscription(
  standIds: string[],
): Promise<{ subscriptionId: string; customerId: string } | null> {
  if (standIds.length === 0) return null;
  const admin = createSupabaseAdmin();
  const { data } = await admin
    .from("subscriptions")
    .select("stripe_subscription_id, stripe_customer_id")
    .in("stand_id", standIds)
    .in("status", ["active", "trialing"])
    .not("stripe_subscription_id", "is", null)
    .limit(1)
    .maybeSingle();
  const row = data as
    | { stripe_subscription_id?: string; stripe_customer_id?: string }
    | null;
  if (!row?.stripe_subscription_id || !row?.stripe_customer_id) return null;
  return {
    subscriptionId: row.stripe_subscription_id,
    customerId: row.stripe_customer_id,
  };
}

/** Customer Stripe déjà associé à un présentoir du marchand, s'il existe. */
async function findCustomerId(standIds: string[]): Promise<string | null> {
  if (standIds.length === 0) return null;
  const admin = createSupabaseAdmin();
  const { data } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .in("stand_id", standIds)
    .not("stripe_customer_id", "is", null)
    .limit(1)
    .maybeSingle();
  return (
    (data as { stripe_customer_id?: string } | null)?.stripe_customer_id ?? null
  );
}

/** Vérifie que le présentoir appartient bien au marchand courant. */
async function ownsStand(standId: string): Promise<boolean> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("stands")
    .select("id")
    .eq("id", standId)
    .maybeSingle();
  return Boolean(data);
}

/** Active le suivi (2,99 €/mois) d'un présentoir. */
export async function startMonitoringAction(formData: FormData) {
  if (!isStripeConfigured()) redirect(`${STANDS}?billing=unconfigured`);
  const standId = String(formData.get("stand_id") ?? "");
  if (!standId) redirect(STANDS);

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!(await ownsStand(standId))) redirect(STANDS);

  const admin = createSupabaseAdmin();
  const { data: existing } = await admin
    .from("subscriptions")
    .select("status")
    .eq("stand_id", standId)
    .maybeSingle();
  const st = (existing as { status?: string } | null)?.status;
  if (st === "active" || st === "trialing") redirect(`${STANDS}?suivi=deja`);

  const stripe = getStripe();
  const standIds = await myStandIds();
  const active = await activeSubscription(standIds);

  if (active) {
    // Abonnement existant : on ajoute une unité (quantité + 1).
    const sub = await stripe.subscriptions.retrieve(active.subscriptionId);
    const item = sub.items.data[0];
    await stripe.subscriptions.update(active.subscriptionId, {
      items: [{ id: item.id, quantity: (item.quantity ?? 1) + 1 }],
      proration_behavior: "create_prorations",
    });
    await admin.from("subscriptions").upsert(
      {
        stand_id: standId,
        status: sub.status,
        stripe_customer_id: active.customerId,
        stripe_subscription_id: active.subscriptionId,
        current_period_end: subscriptionPeriodEnd(sub),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stand_id" },
    );
    redirect(`${STANDS}?suivi=ok`);
  }

  // Premier présentoir suivi : Checkout (collecte le moyen de paiement).
  let customerId = await findCustomerId(standIds);
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
  }
  const base = appBase();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: monitoringPriceId(), quantity: 1 }],
    success_url: `${base}${STANDS}?suivi=ok`,
    cancel_url: `${base}${STANDS}?suivi=annule`,
    metadata: { stand_id: standId, user_id: user.id },
    subscription_data: { metadata: { user_id: user.id, first_stand_id: standId } },
  });
  redirect(session.url ?? STANDS);
}

/** Désactive le suivi d'un présentoir (quantité − 1, ou annulation si c'était le dernier). */
export async function stopMonitoringAction(formData: FormData) {
  if (!isStripeConfigured()) redirect(`${STANDS}?billing=unconfigured`);
  const standId = String(formData.get("stand_id") ?? "");
  if (!standId) redirect(STANDS);

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!(await ownsStand(standId))) redirect(STANDS);

  const admin = createSupabaseAdmin();
  const { data: row } = await admin
    .from("subscriptions")
    .select("stripe_subscription_id, status")
    .eq("stand_id", standId)
    .maybeSingle();
  const r = row as { stripe_subscription_id?: string; status?: string } | null;
  if (
    !r?.stripe_subscription_id ||
    !(r.status === "active" || r.status === "trialing")
  ) {
    redirect(STANDS);
  }

  const stripe = getStripe();
  const sub = await stripe.subscriptions.retrieve(r.stripe_subscription_id);
  const item = sub.items.data[0];
  const qty = item.quantity ?? 1;

  if (qty <= 1) {
    // Dernier présentoir couvert : on annule tout l'abonnement (webhook → 'canceled').
    await stripe.subscriptions.cancel(r.stripe_subscription_id);
  } else {
    await stripe.subscriptions.update(r.stripe_subscription_id, {
      items: [{ id: item.id, quantity: qty - 1 }],
      proration_behavior: "create_prorations",
    });
    await admin.from("subscriptions").delete().eq("stand_id", standId);
  }
  redirect(`${STANDS}?suivi=stop`);
}

/** Ouvre le portail de facturation Stripe du marchand (moyen de paiement, factures). */
export async function billingPortalAction() {
  if (!isStripeConfigured()) redirect(`${STANDS}?billing=unconfigured`);
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const customerId = await findCustomerId(await myStandIds());
  if (!customerId) redirect(`${STANDS}?billing=none`);

  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appBase()}${STANDS}`,
  });
  redirect(portal.url);
}
