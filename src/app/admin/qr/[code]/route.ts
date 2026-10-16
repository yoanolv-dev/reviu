import { qrSvg } from "@/lib/qr";
import { getIsAdmin } from "@/lib/admin";

/**
 * QR code d'un présentoir (feuille d'impression de l'admin). Une route n'est
 * pas protégée par le layout /admin : la garde admin est faite ici.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  if (!(await getIsAdmin())) return new Response("Forbidden", { status: 403 });
  const { code } = await params;
  if (!/^[a-z0-9]{1,32}$/i.test(code)) return new Response("Not found", { status: 404 });
  const svg = await qrSvg(code);
  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "private, max-age=3600",
    },
  });
}
