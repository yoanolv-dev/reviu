/**
 * Server-side environment guards.
 *
 * The whole app talks to a single Supabase project across every deployment
 * (production, Vercel previews, local dev). Generating REAL stands writes
 * permanent, physical identifiers, so it must NEVER happen from a preview or
 * test environment. Generation is therefore allowed only in production, unless
 * explicitly opted in with REVIU_ALLOW_STAND_GENERATION=true (for controlled
 * local admin work).
 *
 * These read non-public env vars and must only be used in server code.
 */

export function currentEnvLabel(): string {
  return process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
}

export function standGenerationAllowed(): boolean {
  if (process.env.REVIU_ALLOW_STAND_GENERATION === "true") return true;
  return process.env.VERCEL_ENV === "production";
}
