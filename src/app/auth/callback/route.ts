import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Callback d'authentification (flux PKCE de @supabase/ssr).
 * Le lien magique / la confirmation d'e-mail renvoie ici avec un `?code=` :
 * on l'échange contre une session (cookies) puis on redirige vers `next`.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  // Redirection interne uniquement (évite les open-redirects).
  const safeNext = next.startsWith("/") ? next : "/dashboard";

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Derrière un proxy (Vercel), privilégier l'hôte transmis.
      const forwardedHost = req.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";
      const base =
        !isLocal && forwardedHost ? `https://${forwardedHost}` : origin;
      return NextResponse.redirect(`${base}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
