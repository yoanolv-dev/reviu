import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * - r.reviu.fr/{code}     -> /r/{code} (redirection NFC/QR)
 * - reviu.fr (+ www)      -> site vitrine public (landing sur /, pages légales)
 * - autres hôtes (app)    -> rafraîchit la session Supabase pour le dashboard
 */
export async function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0];
  const sub = host.split(".")[0];
  const { pathname } = req.nextUrl;

  if (sub === "r" && !pathname.startsWith("/r")) {
    const url = req.nextUrl.clone();
    url.pathname = `/r${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // Domaine vitrine : la racine affiche la boutique (page d'accueil orientée
  // commerce). L'ancienne landing explicative reste servie sur /home. Les pages
  // légales sont servies telles quelles. L'app reste sur app.reviu.fr.
  const isMarketingHost = host === "reviu.fr" || host === "www.reviu.fr";
  if (isMarketingHost && pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/boutique";
    return NextResponse.rewrite(url);
  }

  // Ne rafraîchir la session Supabase (appel réseau à l'auth) que sur les zones
  // authentifiées. Les pages publiques (landing, login, parcours d'avis) évitent
  // ainsi un aller-retour réseau à chaque navigation.
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return updateSession(req);
  }
  return NextResponse.next({ request: req });
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\.).*)"],
};
