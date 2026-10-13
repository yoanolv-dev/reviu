import { unsubscribe, verifyUnsubscribe } from "@/lib/outreach";

/**
 * Désinscription de la prospection. GET : lien cliqué dans l'e-mail ;
 * POST : désinscription en un clic des messageries (RFC 8058).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(req: Request) {
  const url = new URL(req.url);
  const email = verifyUnsubscribe(url.searchParams.get("e") ?? "", url.searchParams.get("t") ?? "");
  if (!email) return page("Lien invalide ou expiré. Écrivez-nous à contact@reviu.fr.", 400);
  await unsubscribe(email);
  return page("C'est fait : vous ne recevrez plus aucun message de prospection de notre part.");
}

function page(message: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Désinscription - reviu</title><body style="font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;color:#111"><h1 style="font-size:1.25rem">Désinscription</h1><p>${message}</p></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export const GET = handle;
export const POST = handle;
