import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { APP_BASE } from "@/lib/brand";
import { safeNext as allowedNext, trustedHost } from "@/lib/auth-code";

/**
 * Callback d'authentification (flux PKCE de @supabase/ssr).
 * Le lien magique / la confirmation d'e-mail renvoie ici avec un `?code=` :
 * on l'échange contre une session (cookies) puis on redirige vers `next`.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  // Pages de l'app connues uniquement (évite les open-redirects).
  const safeNext = allowedNext(searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Rattachement self-service, une seule fois au retour du lien.
      await supabase.rpc("bind_account");
      // Derrière un proxy (Vercel), l'hôte transmis, s'il est connu (prod,
      // préversion) ; en local, l'origine de la requête ; sinon l'app.
      const forwardedHost = req.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";
      const base = isLocal
        ? origin
        : forwardedHost && trustedHost(forwardedHost)
          ? `https://${forwardedHost}`
          : APP_BASE;
      return NextResponse.redirect(`${base}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
