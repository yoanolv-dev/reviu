import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { buildShopSessionParams } from "@/lib/stripe-checkout";
import { SITE_URL } from "@/lib/brand";
import { CheckoutEmbed } from "./checkout-embed";

/**
 * Crée la session Embedded Checkout CÔTÉ SERVEUR puis rend le formulaire
 * embarqué. Isolé dans un composant asynchrone dédié : la page peut streamer
 * immédiatement le reste (récap, photo, réassurance) et n'attendre Stripe que
 * pour cette zone (via `<Suspense>`), ce qui supprime l'aller-retour client qui
 * ralentissait l'affichage du formulaire.
 */
export async function CheckoutSection({
  product,
  quantity,
}: {
  product: string;
  quantity: number;
}) {
  const stripe = getStripe();
  const built = buildShopSessionParams(product, quantity);

  let clientSecret: string | null = null;
  if (stripe && built.ok) {
    const params: Stripe.Checkout.SessionCreateParams = {
      ...built.params,
      // Mode embarqué (nommé « embedded_page » par ce SDK) : son client_secret
      // initialise l'Embedded Checkout monté côté client.
      ui_mode: "embedded_page",
      // Une seule URL de retour (pas de success/cancel) ; la page merci vérifie
      // la session côté serveur via `session_id`.
      return_url: `${SITE_URL}/boutique/merci?session_id={CHECKOUT_SESSION_ID}`,
    };
    try {
      const session = await stripe.checkout.sessions.create(params);
      clientSecret = session.client_secret;
    } catch (err) {
      console.error("[shop] création session Embedded Checkout échouée", err);
    }
  }

  return <CheckoutEmbed clientSecret={clientSecret} />;
}
