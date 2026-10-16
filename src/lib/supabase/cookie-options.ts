/**
 * Cookies de session illisibles par JavaScript (la session n'est lue que côté
 * serveur : aucun client Supabase navigateur n'est utilisé). Un script injecté
 * ne peut donc pas voler la session. Partagé par server.ts et proxy-session.ts.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;
