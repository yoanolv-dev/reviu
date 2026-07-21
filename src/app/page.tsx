import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dashboard";

/**
 * Racine de l'application (app.reviu.fr). Le site vitrine est désormais géré
 * par Shopify : on redirige directement vers l'app (dashboard si connecté,
 * sinon connexion). L'ancienne vitrine reste consultable sur /vitrine.
 */
export default async function Home() {
  let authenticated = false;
  try {
    authenticated = Boolean(await getCurrentUser());
  } catch {
    authenticated = false;
  }
  redirect(authenticated ? "/dashboard" : "/login");
}
