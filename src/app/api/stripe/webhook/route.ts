import type Stripe from "stripe";
import { getStripe, mapStripeStatus, periodEndIso, customerId } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Webhook Stripe — source de vérité des abonnements.
 *
 * Stripe appelle cette route après chaque événement (paiement, renouvellement,
 * résiliation…). On vérifie la signature avec `STRIPE_WEBHOOK_SECRET`, puis on
 * met à jour la table `subscriptions` via le client service role (hors session).
 * Le `stand_id` voyage dans les métadonnées de la session et de l'abonnement.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return new Response("Stripe non configuré", { status: 500 });
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Signature manquante", { status: 400 });

  // La vérification de signature exige le corps brut (non parsé).
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }

  const admin = createSupabaseAdmin();
  if (!admin) return new Response("Service indisponible", { status: 500 });

  async function sync(standId: string, subscription: Stripe.Subscription) {
    await admin!.from("subscriptions").upsert(
      {
        stand_id: standId,
        status: mapStripeStatus(subscription.status),
        stripe_customer_id: customerId(subscription.customer),
        stripe_subscription_id: subscription.id,
        current_period_end: periodEndIso(subscription),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stand_id" },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const standId = session.metadata?.stand_id;
        if (standId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            String(session.subscription),
          );
          await sync(standId, subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        let standId: string | undefined = subscription.metadata?.stand_id;
        if (!standId) {
          const { data } = await admin
            .from("subscriptions")
            .select("stand_id")
            .eq("stripe_subscription_id", subscription.id)
            .maybeSingle<{ stand_id: string }>();
          standId = data?.stand_id;
        }
        if (standId) await sync(standId, subscription);
        break;
      }
      default:
        break;
    }
  } catch {
    // 500 → Stripe réessaiera l'événement automatiquement.
    return new Response("Erreur de traitement", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
