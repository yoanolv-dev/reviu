import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { buildShopSessionParams } from "@/lib/stripe-checkout";
import { SITE_URL } from "@/lib/brand";
import { PaymentForm } from "./payment-form";

/**
 * Crée la session Checkout CÔTÉ SERVEUR (mode `elements` : Checkout Sessions +
 * Elements, notre propre formulaire compact) puis rend le formulaire de
 * paiement. Isolé dans un composant asynchrone dédié pour être streamé
 * (`<Suspense>`) sans bloquer le reste de la page.
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
      // Mode « elements » (Checkout Sessions + Elements) : on monte notre propre
      // formulaire compact (Payment Element en accordéon) au lieu de l'Embedded
      // Checkout tout déplié. Le `client_secret` alimente ce formulaire.
      ui_mode: "elements",
      // URL de retour pour les paiements à redirection (3-D Secure). La page
      // merci vérifie la session côté serveur via `session_id`.
      return_url: `${SITE_URL}/boutique/merci?session_id={CHECKOUT_SESSION_ID}`,
    };
    try {
      const session = await stripe.checkout.sessions.create(params);
      clientSecret = session.client_secret;
    } catch (err) {
      console.error("[shop] création session Checkout (elements) échouée", err);
    }
  }

  return <PaymentForm clientSecret={clientSecret} />;
}
