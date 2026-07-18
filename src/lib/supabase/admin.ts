import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec la clé **service_role** — BYPASSE le RLS.
 *
 * À n'utiliser QUE côté serveur (webhook Stripe, actions de facturation) et
 * jamais exposé au navigateur : la clé n'est lue que via `SUPABASE_SERVICE_ROLE_KEY`
 * (variable serveur, sans préfixe NEXT_PUBLIC).
 */
export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Configuration serveur incomplète : SUPABASE_SERVICE_ROLE_KEY manquant.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
