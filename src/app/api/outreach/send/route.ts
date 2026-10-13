import { outreachSecret, runOutreachBatch } from "@/lib/outreach";

/**
 * Déclenché toutes les 15 minutes par GitHub Actions
 * (.github/workflows/outreach.yml), avec `Authorization: Bearer OUTREACH_SECRET`.
 * Chaque appel envoie au plus une douzaine d'e-mails ; le plafond du jour,
 * le préchauffage et la plage horaire sont gérés par `runOutreachBatch`.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const secret = outreachSecret();
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Non autorisé", { status: 401 });
  }
  return Response.json(await runOutreachBatch());
}
