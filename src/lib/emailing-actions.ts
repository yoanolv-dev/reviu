"use server";

import { getIsAdmin } from "./admin";
import { listUnsubscribedContacts } from "./emailing";
import { sendSubscriptionOffer } from "./subscription-emails";
import type { FormState } from "./form";

/**
 * Relance par e-mail des commerçants non-abonnés (levier de conversion vers le
 * suivi 2,99 €/mois). Envoi best-effort, dédupliqué par adresse. Réservé aux
 * administrateurs.
 */
// Signature imposée par useActionState ; les arguments ne sont pas utilisés ici.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function relanceUnsubscribedAction(_prev: FormState, _formData: FormData): Promise<FormState> {
  if (!(await getIsAdmin())) {
    return { error: "Accès réservé aux administrateurs." };
  }

  const contacts = await listUnsubscribedContacts();
  if (contacts.length === 0) {
    return { success: true, info: "Aucun commerçant à relancer pour l'instant." };
  }

  const seen = new Set<string>();
  let sent = 0;
  for (const c of contacts) {
    const email = c.email.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    try {
      const ok = await sendSubscriptionOffer({
        to: c.email,
        name: c.full_name ?? c.org_name,
        cta: "dashboard",
      });
      if (ok) sent += 1;
    } catch {
      /* on continue avec les suivants */
    }
  }

  return {
    success: true,
    info: `Relance envoyée à ${sent} commerçant${sent > 1 ? "s" : ""}.`,
  };
}
