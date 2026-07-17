import { NextResponse, type NextRequest } from "next/server";

/**
 * Route le sous-domaine de redirection (convention Next 16 : proxy).
 *   r.reviu.fr/{code}      -> /r/{code}
 *   r.reviu.fr/{code}/go   -> /r/{code}/go
 * L'URL encodée sur le NFC/QR reste donc courte et stable : r.reviu.fr/{code}.
 */
export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0];
  const sub = host.split(".")[0];
  const { pathname } = req.nextUrl;

  if (sub === "r" && !pathname.startsWith("/r")) {
    const url = req.nextUrl.clone();
    url.pathname = `/r${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\.).*)"],
};
