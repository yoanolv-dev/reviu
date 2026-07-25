import { sendEmail } from "./email";
import { APP_BASE, SUBSCRIPTION } from "./brand";

/**
 * E-mails de conversion vers l'abonnement de suivi (2,99 €/mois).
 *
 * C'est le levier commercial de reviu : le revendeur vend le présentoir
 * physique, et reviu propose ensuite le suivi au commerçant - notamment par
 * e-mail. Ces messages sont envoyés :
 *  - automatiquement à l'activation d'un présentoir (parcours de scan) ;
 *  - à la demande, en relance des commerçants non-abonnés (espace admin).
 */

function offerHtml(opts: { name?: string | null; ctaUrl: string }): string {
  const hello = opts.name ? `Bonjour ${opts.name},` : "Bonjour,";
  const perks = SUBSCRIPTION.perks
    .map(
      (p) =>
        `<li style="margin:0 0 6px">${p.replace(/</g, "&lt;")}</li>`,
    )
    .join("");
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:auto;color:#0a0d16">
    <h2 style="font-size:18px">Passez au suivi de votre présentoir</h2>
    <p style="margin:8px 0 0">${hello}</p>
    <p style="margin:8px 0 0;color:#3a4256">
      Votre présentoir reviu collecte déjà des avis. Activez le
      <strong>suivi</strong> pour transformer ces scans en informations utiles :
    </p>
    <ul style="margin:12px 0;padding-left:18px;color:#0a0d16">${perks}</ul>
    <p style="margin:8px 0 16px;color:#3a4256">
      <strong>${SUBSCRIPTION.priceLabel}/${SUBSCRIPTION.period}</strong> par
      présentoir, sans engagement, résiliable à tout moment.
    </p>
    <p>
      <a href="${opts.ctaUrl}"
         style="background:#1b4dff;color:#fff;text-decoration:none;padding:11px 20px;border-radius:999px;font-weight:500;display:inline-block">
        Activer le suivi
      </a>
    </p>
    <p style="margin-top:18px;color:#8a91a1;font-size:12px">
      Vous recevez ce message car vous utilisez un présentoir reviu. Le suivi est
      optionnel : sans lui, votre présentoir continue de rediriger vers vos avis.
    </p>
  </div>`;
}

/** Envoie l'offre d'abonnement à un commerçant. Best-effort (jamais bloquant). */
export async function sendSubscriptionOffer(opts: {
  to: string;
  name?: string | null;
  /** Destination du bouton : inscription (nouveau) ou dashboard (existant). */
  cta?: "signup" | "dashboard";
}): Promise<boolean> {
  const ctaUrl =
    opts.cta === "dashboard"
      ? `${APP_BASE}/dashboard/stands`
      : `${APP_BASE}/signup`;
  return sendEmail({
    to: opts.to,
    subject: "Activez le suivi de votre présentoir reviu",
    html: offerHtml({ name: opts.name, ctaUrl }),
  });
}
