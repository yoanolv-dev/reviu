import { NextResponse, type NextRequest } from "next/server";
import { getStandByCode, recordEvent } from "@/lib/mock";

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

  await recordEvent(code, "click");
  return NextResponse.redirect(stand.establishment.googleReviewUrl, {
    status: 302,
  });
}
