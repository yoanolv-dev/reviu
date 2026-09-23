import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * - r.reviu.fr/{code}     -> /r/{code} (redirection NFC/QR)
 * - www.reviu.fr          -> 301 vers reviu.fr (domaine canonique)
 * - reviu.fr              -> site vitrine public (landing sur /, pages légales)
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

  // Domaine canonique = reviu.fr (sans www) : www.reviu.fr redirige en 301,
  // chemin et paramètres conservés, pour consolider tous les signaux SEO sur
  // une seule origine. ⚠️ Ne jamais configurer l'inverse (reviu.fr → www) côté
  // Vercel : cela créerait une boucle de redirection.
  if (host === "www.reviu.fr") {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "reviu.fr";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  // Anciennes pages d'accueil : redirection permanente (301) vers la racine,
  // source unique. Évite toute duplication /↔/home↔/vitrine côté SEO.
  if (pathname === "/home" || pathname === "/vitrine") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 301);
  }

  // Domaine vitrine : la racine affiche la boutique (page d'accueil orientée
  // commerce). L'ancienne landing explicative reste servie sur /home. Les pages
  // légales sont servies telles quelles. L'app reste sur app.reviu.fr.
  const isMarketingHost = host === "reviu.fr";
  // `/boutique` sert le même contenu que la racine : 301 vers `/` pour éviter
  // le contenu dupliqué (les sous-pages /boutique/commander|merci restent).
  if (isMarketingHost && pathname === "/boutique") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 301);
  }
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
