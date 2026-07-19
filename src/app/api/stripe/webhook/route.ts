import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe, subscriptionPeriodEnd } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

// Le corps brut est nécessaire pour vérifier la signature : on force le runtime Node.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook_unconfigured" }, { status: 500 });
  }
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const payload = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const admin = createSupabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
      // 1er présentoir suivi : crée sa ligne (les suivants passent par l'action, pas Checkout).
      const session = event.data.object as Stripe.Checkout.Session;
      const standId = session.metadata?.stand_id;
      const subId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
      if (standId && subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        await admin.from("subscriptions").upsert(
          {
            stand_id: standId,
            status: sub.status,
            stripe_customer_id: customerId,
            stripe_subscription_id: sub.id,
            current_period_end: subscriptionPeriodEnd(sub),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "stand_id" },
        );
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      // Met à jour TOUS les présentoirs couverts par cet abonnement partagé.
      const sub = event.data.object as Stripe.Subscription;
      await admin
        .from("subscriptions")
        .update({
          status: sub.status,
          current_period_end: subscriptionPeriodEnd(sub),
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", sub.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
