import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Client Supabase côté navigateur. */
export function createSupabaseBrowser() {
  return createBrowserClient(url, key);
}
