import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Jeton d'activation « pour un autre commerçant » (revendeur, démo admin).
 *
 * Le commerçant a prouvé qu'il possède son adresse en donnant le code reçu
 * par e-mail, mais SANS ouvrir de session sur le téléphone de celui qui
 * installe le présentoir. Ce jeton signé (HMAC, 30 min, lié au présentoir)
 * porte cette preuve jusqu'à l'étape « commerce ». Il ne contient aucun
 * secret et ne sert qu'à activer CE présentoir au nom de CE commerçant.
 */

const SECRET = process.env.REVIU_SHOP_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const TTL_MS = 30 * 60_000;

type Payload = { uid: string; email: string; code: string; exp: number };

function sign(data: string): string {
  return createHmac("sha256", `reviu-activation-ticket:${SECRET}`).update(data).digest("base64url");
}

export function ticketAvailable(): boolean {
  return SECRET.length > 0;
}

export function createActivationTicket(p: Omit<Payload, "exp">): string {
  const data = Buffer.from(JSON.stringify({ ...p, exp: Date.now() + TTL_MS })).toString(
    "base64url",
  );
  return `${data}.${sign(data)}`;
}

/** Jeton valide, non expiré et émis pour ce présentoir ; sinon null. */
export function readActivationTicket(
  ticket: string | null | undefined,
  code: string,
): { uid: string; email: string } | null {
  if (!ticket || !SECRET) return null;
  const dot = ticket.lastIndexOf(".");
  if (dot <= 0) return null;
  const data = ticket.slice(0, dot);
  const a = Buffer.from(ticket.slice(dot + 1));
  const b = Buffer.from(sign(data));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as Payload;
    if (p.code !== code || Date.now() > p.exp || !p.uid || !p.email) return null;
    return { uid: p.uid, email: p.email };
  } catch {
    return null;
  }
}
