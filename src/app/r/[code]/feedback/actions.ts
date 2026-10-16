"use server";

import { submitFeedback } from "@/lib/data";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { esc } from "@/lib/email-templates";
import { clientKey, rateAllow } from "@/lib/rate-limit";
import { APP_BASE } from "@/lib/brand";

type NotifyTarget = {
  email: string | null;
  establishment_name: string | null;
  rating: number | null;
  message: string | null;
};

function feedbackEmailHtml(row: NotifyTarget): string {
  const stars =
    row.rating && row.rating > 0
      ? "★".repeat(row.rating) + "☆".repeat(5 - row.rating)
      : "Sans note";
  const msg = (row.message ?? "").trim() || "(aucun message)";
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:auto;color:#0a0d16">
    <h2 style="font-size:18px">Nouveau retour client sur reviu</h2>
    <p style="color:#6b7382;margin:4px 0 16px">${esc(row.establishment_name ?? "Votre établissement")}</p>
    <div style="border:1px solid #e6e8ef;border-radius:12px;padding:16px">
      <p style="font-size:18px;color:#f5a524;margin:0 0 8px">${stars}</p>
      <p style="margin:0;white-space:pre-wrap">${esc(msg)}</p>
    </div>
    <p style="margin-top:20px">
      <a href="${APP_BASE}/dashboard/feedback"
         style="background:#1b4dff;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:500">
        Voir dans mon espace
      </a>
    </p>
  </div>`;
}

/**
 * Enregistre le retour client puis notifie le commerçant par e-mail (best-effort :
 * n'interrompt jamais le parcours client). Ne concerne QUE les retours saisis
 * dans Reviu - les avis Google ne sont pas détectés (aucune intégration GBP).
 *
 * Action publique (sans compte) : saisie bornée et limites par visiteur, pour
 * qu'un tiers ne puisse ni inonder un commerçant de messages ni épuiser le
 * quota d'e-mails (qui sert aussi aux codes de connexion).
 */
export async function submitFeedbackAction(
  code: string,
  rating: number,
  message: string,
): Promise<void> {
  const cleanCode = String(code ?? "").trim();
  const text = String(message ?? "").trim().slice(0, 2000);
  const stars = Number.isInteger(rating) && rating >= 0 && rating <= 5 ? rating : 0;
  if (!/^[a-z0-9]{1,32}$/i.test(cleanCode) || !text) return;

  const ip = await clientKey();
  if (!(await rateAllow("feedback_ip", ip, 3600, 10))) return;
  if (!(await rateAllow("feedback_stand_ip", `${cleanCode}|${ip}`, 3600, 3))) return;

  const id = await submitFeedback(cleanCode, stars, text);
  if (!id) return;
  // Plafond d'e-mails par présentoir : au-delà, le retour reste visible dans
  // l'espace du commerçant, sans e-mail.
  if (!(await rateAllow("feedback_notify", cleanCode, 86_400, 20))) return;

  try {
    const admin = createSupabaseAdmin();
    if (!admin) return; // service role non configuré : on n'envoie rien
    const { data } = await admin.rpc("feedback_notification_target", {
      p_feedback: id,
    });
    const row = (Array.isArray(data) ? data[0] : data) as NotifyTarget | undefined;
    if (!row?.email) return;
    await sendEmail({
      to: row.email,
      subject: `Nouveau retour client - ${row.establishment_name ?? "reviu"}`,
      html: feedbackEmailHtml(row),
    });
  } catch (err) {
    console.error("[feedback] notification échouée", err);
  }
}
