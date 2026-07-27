/**
 * Envoi d'e-mails transactionnels via Resend (API REST, aucune dépendance).
 * Piloté par variables d'environnement :
 *   RESEND_API_KEY      - clé API Resend (secrète, côté serveur)
 *   REVIU_EMAIL_FROM    - expéditeur vérifié, ex. "reviu <avis@reviu.fr>"
 * Sans clé configurée, l'envoi est ignoré proprement (pas d'erreur bloquante).
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.REVIU_EMAIL_FROM ?? "reviu <notifications@reviu.fr>";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  /** Adresse de réponse (ex. l'e-mail d'un candidat revendeur). */
  replyTo?: string;
}): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY absent - e-mail non envoyé.");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[email] envoi échoué", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] erreur réseau", err);
    return false;
  }
}
