"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "./supabase/server";
import { createSupabaseAdmin } from "./supabase/admin";
import { getStripe, monitoringPriceId, appBase, isStripeConfigured } from "./stripe";

const STANDS = "/dashboard/stands";

/** IDs des présentoirs du marchand courant (bornés par le RLS de la session). */
async function myStandIds(): Promise<string[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from("stands").select("id");
  return ((data ?? []) as { id: string }[]).map((s) => s.id);
}

/** Retrouve le customer Stripe déjà associé à un présentoir du marchand, s'il existe. */
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
  return (data as { stripe_customer_id?: string } | null)?.stripe_customer_id ?? null;
}

/** Active le suivi (2,99 €/mois) d'un présentoir via une session Checkout Stripe. */
export async function startMonitoringAction(formData: FormData) {
  if (!isStripeConfigured()) redirect(`${STANDS}?billing=unconfigured`);
  const standId = String(formData.get("stand_id") ?? "");
  if (!standId) redirect(STANDS);

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Propriété du présentoir (borné par le RLS via la session utilisateur).
  const { data: stand } = await supabase
    .from("stands")
    .select("id")
    .eq("id", standId)
    .maybeSingle();
  if (!stand) redirect(STANDS);

  // Déjà suivi ?
  const admin = createSupabaseAdmin();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("status")
    .eq("stand_id", standId)
    .maybeSingle();
  const status = (sub as { status?: string } | null)?.status;
  if (status === "active" || status === "trialing") {
    redirect(`${STANDS}?suivi=deja`);
  }

  const stripe = getStripe();
  let customerId = await findCustomerId(await myStandIds());
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
    subscription_data: { metadata: { stand_id: standId, user_id: user.id } },
  });
  redirect(session.url ?? STANDS);
}

/** Ouvre le portail de facturation Stripe du marchand (gérer / résilier). */
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
