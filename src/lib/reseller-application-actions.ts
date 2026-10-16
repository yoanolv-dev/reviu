"use server";

import { sendEmail } from "./email";
import { clientKey, emailKey, rateAllow } from "./rate-limit";
import { ADMIN_NOTIFY_EMAIL, SITE, CONTACT_EMAIL } from "./brand";

export type ResellerFormState = { ok?: true; error?: string } | null;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isEmail(v: string): boolean {
  return v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/** Champ texte d'une ligne : caractères de contrôle retirés, longueur bornée. */
function field(formData: FormData, name: string, max: number): string {
  return String(formData.get(name) ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);
}

/**
 * Candidature revendeur (page publique /revendeur) : envoyée par e-mail au
 * propriétaire, qui sélectionne ensuite les revendeurs à la main. Un accusé de
 * réception est envoyé au candidat (best-effort). Aucune donnée n'est stockée
 * en base : la sélection reste humaine et hors ligne.
 *
 * À ne pas confondre avec `reseller-actions.ts`, qui gère l'administration des
 * revendeurs déjà validés (RPC SECURITY DEFINER, espace admin).
 */
export async function submitResellerApplication(
  _prev: ResellerFormState,
  formData: FormData,
): Promise<ResellerFormState> {
  const name = field(formData, "name", 120);
  const email = field(formData, "email", 254);
  const phone = field(formData, "phone", 40);
  const city = field(formData, "city", 120);
  const profile = field(formData, "profile", 80);
  const message = String(formData.get("message") ?? "").trim().slice(0, 3000);
  // Champ piège anti-spam : rempli = robot.
  const honey = String(formData.get("company") ?? "").trim();

  if (honey) return { ok: true };
  if (!name) return { error: "Indiquez votre nom." };
  if (!isEmail(email)) return { error: "Indiquez un e-mail valide." };
  if (!city) return { error: "Indiquez votre ville ou votre secteur." };

  // Formulaire public : sans limite, il servirait à envoyer des e-mails au nom
  // de reviu (accusé de réception) à n'importe quelle adresse.
  const tooMany = `Trop de demandes pour le moment. Écrivez-nous directement à ${CONTACT_EMAIL}.`;
  if (!(await rateAllow("reseller_apply_ip", await clientKey(), 3600, 3))) {
    return { error: tooMany };
  }
  if (!(await rateAllow("reseller_apply_email", emailKey(email), 86_400, 2))) {
    return { error: tooMany };
  }

  const rows: [string, string][] = [
    ["Nom", name],
    ["E-mail", email],
    ["Téléphone", phone || "-"],
    ["Ville / secteur", city],
    ["Profil", profile || "-"],
    ["Message", message || "-"],
  ];
  const html = `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:auto;color:#0a0d16">
    <h2 style="font-size:18px">Nouvelle candidature revendeur</h2>
    <table style="border-collapse:collapse;margin-top:12px;width:100%">
      ${rows
        .map(
          ([k, v]) =>
            `<tr>
               <td style="padding:6px 10px;border:1px solid #e6e8ee;background:#f6f7fb;font-weight:600;white-space:nowrap;vertical-align:top">${esc(
                 k,
               )}</td>
               <td style="padding:6px 10px;border:1px solid #e6e8ee">${esc(
                 v,
               ).replace(/\n/g, "<br>")}</td>
             </tr>`,
        )
        .join("")}
    </table>
    <p style="margin-top:14px;color:#8a91a1;font-size:12px">
      Répondez directement à cet e-mail pour recontacter ${esc(name)}.
    </p>
  </div>`;

  const sent = await sendEmail({
    to: ADMIN_NOTIFY_EMAIL,
    subject: `Candidature revendeur - ${name} (${city})`,
    html,
    replyTo: email,
  });

  if (!sent) {
    return {
      error: `Envoi impossible pour le moment. Écrivez-nous directement à ${CONTACT_EMAIL}.`,
    };
  }

  // Accusé de réception au candidat (best-effort, ne bloque pas la réussite).
  try {
    await sendEmail({
      to: email,
      subject: `Votre candidature revendeur ${SITE.name}`,
      html: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:auto;color:#0a0d16">
        <h2 style="font-size:18px">Merci ${esc(name)} !</h2>
        <p style="margin:8px 0 0;color:#3a4256">
          Nous avons bien reçu votre candidature pour revendre les présentoirs
          ${esc(SITE.name)}. Nous sélectionnons les revendeurs au cas par cas et
          revenons vers vous rapidement.
        </p>
        <p style="margin:12px 0 0;color:#3a4256">À très vite,<br>L'équipe ${esc(
          SITE.name,
        )}</p>
      </div>`,
    });
  } catch {
    /* ignore */
  }

  return { ok: true };
}
