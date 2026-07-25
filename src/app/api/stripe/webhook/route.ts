import type Stripe from "stripe";
import { getStripe, mapStripeStatus, periodEndIso, customerId } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { ADMIN_NOTIFY_EMAIL, SITE_URL } from "@/lib/brand";
import { formationAccessUrl, formatEuros } from "@/lib/shop";

/**
 * Webhook Stripe - source de vérité des abonnements.
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
        // Abonnement (dashboard / parcours de scan) : source de vérité côté sub.
        if (session.mode === "subscription") {
          const standId = session.metadata?.stand_id;
          if (standId && session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(
              String(session.subscription),
            );
            await sync(standId, subscription);
          }
          break;
        }
        // Boutique (achat unique) : commande présentoir / formation / pack.
        if (session.mode === "payment" && session.metadata?.shop_product) {
          await handleShopOrder(stripe, session);
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

// ── Commandes boutique (achat unique) ───────────────────────────────────────
type ShippingDetails = {
  name?: string | null;
  address?: Stripe.Address | null;
} | null;

/**
 * Traite une commande boutique payée : notifie l'exploitant (préparation de la
 * commande, adresse de livraison) et confirme au client (avec l'accès formation
 * si le produit le débloque). Best-effort : les erreurs d'e-mail sont avalées
 * pour ne pas provoquer de rejeu Stripe inutile.
 */
async function handleShopOrder(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<void> {
  try {
    const full = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });
    const quantity = full.line_items?.data?.[0]?.quantity ?? 1;
    const productName = full.metadata?.product_name ?? "Commande reviu";
    const amount = full.amount_total != null ? formatEuros(full.amount_total) : "-";
    const email = full.customer_details?.email ?? null;
    const grantsFormation = full.metadata?.grants_formation === "1";
    const standsIncluded = Number(full.metadata?.stands_included ?? 0);

    const shipping =
      ((full as unknown as { collected_information?: { shipping_details?: ShippingDetails } })
        .collected_information?.shipping_details ??
        (full as unknown as { shipping_details?: ShippingDetails }).shipping_details) ??
      null;

    // 1) Notification exploitant (déclenche la préparation / l'expédition).
    await sendEmail({
      to: ADMIN_NOTIFY_EMAIL,
      subject: `Nouvelle commande boutique - ${productName}`,
      html: adminOrderHtml({
        productName,
        quantity,
        amount,
        email,
        standsIncluded,
        shipping,
      }),
    }).catch(() => false);

    // 2) Confirmation client (+ accès formation le cas échéant).
    if (email) {
      await sendEmail({
        to: email,
        subject: "Votre commande reviu est confirmée",
        html: customerOrderHtml({
          productName,
          amount,
          grantsFormation,
          physical: standsIncluded > 0,
          formationUrl: grantsFormation ? formationAccessUrl(session.id) : null,
        }),
      }).catch(() => false);
    }
  } catch (err) {
    console.error("[shop] traitement commande échoué", err);
  }
}

function formatAddress(shipping: ShippingDetails): string {
  if (!shipping?.address) return "(adresse non fournie)";
  const a = shipping.address;
  const parts = [
    shipping.name,
    a.line1,
    a.line2,
    [a.postal_code, a.city].filter(Boolean).join(" "),
    a.country,
  ].filter(Boolean);
  return parts.join("<br>");
}

function adminOrderHtml(o: {
  productName: string;
  quantity: number;
  amount: string;
  email: string | null;
  standsIncluded: number;
  shipping: ShippingDetails;
}): string {
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:auto;color:#0a0d16">
    <h2 style="font-size:18px">Nouvelle commande boutique 🛍️</h2>
    <div style="border:1px solid #e6e8ef;border-radius:12px;padding:16px;margin-top:12px">
      <p style="margin:0 0 4px"><strong>${o.productName}</strong> × ${o.quantity}</p>
      <p style="margin:0;color:#6b7382">Montant : ${o.amount}</p>
      <p style="margin:8px 0 0;color:#6b7382">Client : ${o.email ?? "-"}</p>
      ${
        o.standsIncluded > 0
          ? `<p style="margin:12px 0 4px"><strong>Livraison</strong></p>
             <p style="margin:0;color:#0a0d16">${formatAddress(o.shipping)}</p>`
          : `<p style="margin:12px 0 0;color:#6b7382">Produit numérique (pas d'expédition).</p>`
      }
    </div>
    <p style="margin-top:16px;color:#6b7382;font-size:13px">
      Détail complet et facture dans le tableau de bord Stripe.
    </p>
  </div>`;
}

function customerOrderHtml(o: {
  productName: string;
  amount: string;
  grantsFormation: boolean;
  physical: boolean;
  formationUrl: string | null;
}): string {
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:auto;color:#0a0d16">
    <h2 style="font-size:18px">Merci pour votre commande !</h2>
    <p style="color:#6b7382;margin:4px 0 16px">${o.productName} - ${o.amount}</p>
    ${
      o.physical
        ? `<p style="margin:0 0 12px">📦 Votre commande est en préparation. Vous recevrez vos présentoirs à l'adresse indiquée lors du paiement.</p>`
        : ""
    }
    ${
      o.grantsFormation && o.formationUrl
        ? `<div style="border:1px solid #d6ddff;background:#f2f5ff;border-radius:12px;padding:16px;margin:8px 0">
             <p style="margin:0 0 10px"><strong>🎓 Votre formation est débloquée</strong></p>
             <a href="${o.formationUrl}"
                style="background:#1b4dff;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:500;display:inline-block">
               Accéder à la formation
             </a>
             <p style="margin:10px 0 0;color:#6b7382;font-size:12px">Accès valable à vie - conservez cet e-mail.</p>
           </div>`
        : ""
    }
    <p style="margin-top:20px">
      <a href="${SITE_URL}/boutique"
         style="color:#1b4dff;text-decoration:none;font-weight:500">
        Retour à la boutique
      </a>
    </p>
  </div>`;
}
