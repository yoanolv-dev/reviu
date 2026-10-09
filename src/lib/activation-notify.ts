import { sendEmail } from "./email";
import {
  activationAdminEmail,
  activationCustomerEmail,
} from "./email-templates";
import {
  ADMIN_NOTIFY_EMAIL,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  REDIRECT_BASE,
} from "./brand";

/**
 * E-mails envoyés après chaque activation de présentoir (best-effort : un échec
 * d'envoi n'annule jamais l'activation) :
 * - au commerçant : confirmation, récapitulatif, accès à son espace ;
 * - à l'admin : notification interne, pour repérer toute activation suspecte
 *   (le secret étant visible sur le présentoir).
 */
export async function notifyActivation(info: {
  code: string;
  email: string;
  establishmentName: string;
  googleUrl: string | null;
  newEstablishment: boolean;
  standsOnAccount: number;
  via: "scan" | "dashboard";
  origin: string;
}): Promise<void> {
  const standAddress = `${REDIRECT_BASE.replace(/^https?:\/\//, "")}/${info.code}`;
  const contactLine = CONTACT_PHONE
    ? `Appelez-nous au ${CONTACT_PHONE.display} ou écrivez à ${CONTACT_EMAIL}.`
    : `Écrivez-nous à ${CONTACT_EMAIL}.`;

  const customer = activationCustomerEmail({
    establishmentName: info.establishmentName,
    standAddress,
    googleUrl: info.googleUrl,
    loginUrl: `${info.origin}/login?email=${encodeURIComponent(info.email)}`,
    contactLine,
  });
  const adminMail = activationAdminEmail({
    code: info.code,
    establishmentName: info.establishmentName,
    googleUrl: info.googleUrl,
    email: info.email,
    via: info.via,
    newEstablishment: info.newEstablishment,
    standsOnAccount: info.standsOnAccount,
    adminUrl: `${info.origin}/admin/stands`,
    date: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
  });

  const results = await Promise.allSettled([
    sendEmail({ to: info.email, ...customer, replyTo: CONTACT_EMAIL }),
    sendEmail({ to: ADMIN_NOTIFY_EMAIL, ...adminMail, replyTo: info.email }),
  ]);
  for (const r of results) {
    if (r.status === "rejected") console.error("[activation] notification", r.reason);
  }
}
