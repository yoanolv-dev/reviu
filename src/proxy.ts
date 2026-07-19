import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * - r.reviu.fr/{code} -> /r/{code} (redirection NFC/QR)
 * - autres hôtes : rafraîchit la session Supabase pour le dashboard
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

  return updateSession(req);
}

export const config = {
  // Exclut _next, les routes API (ex. webhook Stripe : corps brut préservé),
  // favicon et les fichiers à extension.
  matcher: ["/((?!_next/|api/|favicon.ico|.*\\.).*)"],
};
