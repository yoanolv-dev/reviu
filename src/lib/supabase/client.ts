import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Client Supabase côté navigateur. Non utilisé : les cookies de session sont
 * `httpOnly` (src/lib/supabase/server.ts), ce client n'y aurait pas accès.
 */
export function createSupabaseBrowser() {
  return createBrowserClient(url, key);
}
