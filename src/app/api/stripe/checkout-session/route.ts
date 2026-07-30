import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { buildShopSessionParams } from "@/lib/stripe-checkout";
import { SITE_URL } from "@/lib/brand";

/**
 * Crée une session Stripe Checkout en mode « embedded » et renvoie son
 * `client_secret`. Le formulaire de paiement est ensuite monté DIRECTEMENT sur
 * reviu.fr (`/boutique/commander`) via `@stripe/react-stripe-js`, sans
 * redirection vers checkout.stripe.com.
 *
 * Le prix est recalculé serveur (`buildShopSessionParams`) : le corps de requête
 * ne choisit que le produit et la quantité, jamais le montant. Le webhook et son
 * idempotence restent identiques (l'événement `checkout.session.completed` est
 * émis de la même façon qu'en Checkout hébergé).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json(
      { error: "Le paiement n'est pas disponible pour le moment." },
      { status: 503 },
    );
  }

  let body: { product?: unknown; quantity?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const built = buildShopSessionParams(
    String(body.product ?? ""),
    Number(body.quantity ?? 1),
  );
  if (!built.ok) return Response.json({ error: built.error }, { status: 400 });

  const params: Stripe.Checkout.SessionCreateParams = {
    ...built.params,
    // NB: ce SDK Stripe nomme le mode embarqué « embedded_page » (et non
    // « embedded »). Son `client_secret` initialise l'Embedded Checkout de
    // Stripe.js monté côté client.
    ui_mode: "embedded_page",
    // Embedded : une seule URL de retour (pas de success/cancel). La page merci
    // vérifie la session côté serveur via `session_id`.
    return_url: `${SITE_URL}/boutique/merci?session_id={CHECKOUT_SESSION_ID}`,
  };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create(params);
  } catch (err) {
    console.error("[shop] création session Embedded Checkout échouée", err);
    return Response.json(
      { error: "Le paiement n'a pas pu démarrer. Merci de réessayer." },
      { status: 502 },
    );
  }

  return Response.json({ client_secret: session.client_secret });
}
