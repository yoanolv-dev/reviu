import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Client Supabase à privilèges élevés (service role), STRICTEMENT côté serveur.
 * Utilisé uniquement pour des lectures sensibles hors session (ex. adresse
 * e-mail du commerçant pour les notifications). Retourne null si la clé n'est
 * pas configurée, pour dégrader proprement sans casser le parcours.
 */
export function createSupabaseAdmin() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
