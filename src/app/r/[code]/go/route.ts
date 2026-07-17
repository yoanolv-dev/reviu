import { NextResponse, type NextRequest } from "next/server";
import { getStandByCode, recordEvent } from "@/lib/data";

/**
 * Redirection sortante traçée : /r/{code}/go
 * Enregistre le clic puis renvoie vers l'avis Google de l'établissement.
 * Permet de mesurer le taux de conversion scan -> avis.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const stand = await getStandByCode(code);

  if (!stand || stand.status !== "active" || !stand.establishment) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const s = req.nextUrl.searchParams.get("s");
  const channel = s === "nfc" ? "nfc" : s === "qr" ? "qr" : "unknown";
  await recordEvent(code, "click", {
    channel,
    userAgent: req.headers.get("user-agent"),
  });
  return NextResponse.redirect(stand.establishment.googleReviewUrl, {
    status: 302,
  });
}
