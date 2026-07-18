import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Client Supabase public (clé publishable) pour les appels RPC anonymes
 * du parcours client final. Aucune clé secrète nécessaire : les fonctions
 * SQL SECURITY DEFINER encadrent lecture et écriture.
 */
export function createPublicClient() {
  if (!url || !key) {
    throw new Error(
      "Variables Supabase manquantes (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
