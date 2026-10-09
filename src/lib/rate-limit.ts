import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createSupabaseAdmin } from "./supabase/admin";

/**
 * Limitation des essais (envoi et saisie de codes, secret d'activation).
 * Compteurs en base (table `rate_events`, fonctions `rl_*` réservées au
 * service role). En cas d'erreur de la base, on laisse passer (et on journalise)
 * plutôt que de bloquer tous les commerçants : ces limites sont une protection
 * supplémentaire, pas la seule.
 */

/** Empreinte de l'adresse IP du visiteur (jamais stockée en clair). */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  return createHash("sha256").update(`reviu-rl:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Empreinte d'une adresse e-mail pour les compteurs : les adresses ne sont
 * jamais stockées en clair dans `rate_events`.
 */
export function emailKey(email: string): string {
  const pepper = process.env.REVIU_SHOP_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createHash("sha256")
    .update(`reviu-rl-email:${pepper}:${email.trim().toLowerCase()}`)
    .digest("hex")
    .slice(0, 32);
}

/** Enregistre une tentative si la limite le permet. `false` = limite atteinte. */
export async function rateAllow(
  kind: string,
  key: string,
  windowSeconds: number,
  max: number,
  opts: { failClosed?: boolean } = {},
): Promise<boolean> {
  const admin = createSupabaseAdmin();
  if (!admin) return !opts.failClosed;
  const { data, error } = await admin.rpc("rl_allow", {
    p_kind: kind,
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max: max,
  });
  if (error) {
    console.error("[rate-limit] rl_allow", kind, error.message);
    return !opts.failClosed;
  }
  return data !== false;
}

/** Nombre de tentatives récentes (sans en enregistrer). */
export async function rateCount(
  kind: string,
  key: string,
  windowSeconds: number,
): Promise<number> {
  const admin = createSupabaseAdmin();
  if (!admin) return 0;
  const { data, error } = await admin.rpc("rl_count", {
    p_kind: kind,
    p_key: key,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("[rate-limit] rl_count", kind, error.message);
    return 0;
  }
  return Number(data ?? 0);
}

/** Enregistre une tentative (ex. un secret erroné). */
export async function rateRecord(kind: string, key: string): Promise<void> {
  const admin = createSupabaseAdmin();
  if (!admin) return;
  const { error } = await admin.rpc("rl_record", { p_kind: kind, p_key: key });
  if (error) console.error("[rate-limit] rl_record", kind, error.message);
}
