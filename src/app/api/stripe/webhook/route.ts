import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

// Le corps brut est nécessaire pour vérifier la signature : on force le runtime Node.
export const runtime = "nodejs";

/** Fin de période courante, robuste aux évolutions de l'API Stripe (top-level ou item). */
function periodEndIso(sub: Stripe.Subscription): string | null {
  const top = sub as unknown as { current_period_end?: number };
  const item = sub.items?.data?.[0] as unknown as
    | { current_period_end?: number }
    | undefined;
  const ts = top.current_period_end ?? item?.current_period_end;
  return ts ? new Date(ts * 1000).toISOString() : null;
}

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

  async function upsert(sub: Stripe.Subscription, standIdHint?: string) {
    const standId = sub.metadata?.stand_id ?? standIdHint;
    if (!standId) return; // abonnement non rattaché à un présentoir : ignoré
    const customerId =
      typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    await admin.from("subscriptions").upsert(
      {
        stand_id: standId,
        status: sub.status,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        current_period_end: periodEndIso(sub),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stand_id" },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        await upsert(sub, session.metadata?.stand_id ?? undefined);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await upsert(event.data.object as Stripe.Subscription);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
