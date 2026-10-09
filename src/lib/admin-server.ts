import { createSupabaseAdmin } from "./supabase/admin";
import { getCurrentUser } from "./dashboard";
import { getIsAdmin } from "./admin";

/**
 * Accès admin côté serveur.
 *
 * Les écrans et actions de l'admin lisent et modifient TOUS les comptes : ils
 * passent par le client « service role » (aucune RLS), mais seulement après
 * avoir vérifié ici que la personne connectée est administratrice (fonction
 * SQL `is_admin`). Chaque page ET chaque action serveur doit appeler
 * `requireAdmin()` : une action serveur est appelable directement, le layout
 * /admin ne la protège pas.
 */
export type AdminUser = { id: string; email: string };

export async function requireAdmin(): Promise<AdminUser | null> {
  const user = await getCurrentUser();
  if (!user?.email) return null;
  if (!(await getIsAdmin())) return null;
  return { id: user.id, email: user.email };
}

/** Client service role (null si la clé n'est pas configurée). */
export function adminDb() {
  return createSupabaseAdmin();
}
