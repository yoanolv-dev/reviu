"use server";

import { createPublicClient } from "./supabase/public";
import { sendSubscriptionOffer } from "./subscription-emails";

export type ActionResult = { ok: true } | { ok: false; error: string };

const ERRORS: Record<string, string> = {
  email_required: "Renseignez votre e-mail.",
  name_required: "Renseignez le nom de votre commerce.",
  stand_not_found: "Ce présentoir est introuvable.",
  stand_already_assigned:
    "Ce présentoir est déjà configuré. Connectez-vous pour le gérer.",
  invalid_pin:
    "Code d'activation (PIN) incorrect. Il figure sous le présentoir.",
  invalid_action: "Action invalide.",
};

function mapError(message: string | undefined, fallback: string): string {
  if (!message) return fallback;
  const key = Object.keys(ERRORS).find((k) => message.includes(k));
  return key ? ERRORS[key] : fallback;
}

/**
 * Active un présentoir vierge depuis le scan (parcours anonyme, sans compte).
 * Enregistre l'e-mail en base clients et relie le présentoir au client.
 */
export async function activateStand(input: {
  code: string;
  pin: string;
  email: string;
  name: string;
  googleUrl: string;
}): Promise<ActionResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  if (!name) return { ok: false, error: ERRORS.name_required };
  if (!email) return { ok: false, error: ERRORS.email_required };

  const supabase = createPublicClient();
  const { error } = await supabase.rpc("activate_stand", {
    p_code: input.code.trim(),
    p_pin: input.pin.trim() || null,
    p_email: email,
    p_name: name,
    p_google_url: input.googleUrl.trim() || null,
  });
  if (error) {
    return { ok: false, error: mapError(error.message, "Activation impossible. Réessayez.") };
  }

  // Le présentoir est actif : on propose le suivi par e-mail (best-effort, ne
  // bloque jamais l'activation même si l'envoi échoue).
  try {
    await sendSubscriptionOffer({ to: email, name, cta: "signup" });
  } catch {
    /* ignore : l'activation reste réussie */
  }
  return { ok: true };
}

/**
 * Abonnement simulé piloté depuis le scan (gardé par le PIN du présentoir).
 * subscribe → suivi actif ; cancel → résiliation. Sans engagement.
 */
export async function setSelfSubscription(input: {
  code: string;
  pin: string;
  action: "subscribe" | "cancel";
}): Promise<ActionResult> {
  const supabase = createPublicClient();
  const { error } = await supabase.rpc("self_set_subscription", {
    p_code: input.code.trim(),
    p_pin: input.pin.trim() || null,
    p_action: input.action,
  });
  if (error) {
    return { ok: false, error: mapError(error.message, "Opération impossible. Réessayez.") };
  }
  return { ok: true };
}
