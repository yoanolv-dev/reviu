import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dashboard";

/**
 * Racine de l'application (app.reviu.fr) : on redirige directement vers l'app
 * (dashboard si connecté, sinon connexion). Le site vitrine et la boutique sont
 * servis par la même app sur reviu.fr (voir src/proxy.ts et /home, /boutique).
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
