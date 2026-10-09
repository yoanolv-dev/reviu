-- Reviu - CORRECTIF DE SECURITE (urgent) : roles et suspension non modifiables
-- par les utilisateurs.
--
-- Avant : la politique "profiles self update" (USING id = auth.uid(), sans
-- controle des colonnes) laissait tout utilisateur connecte modifier SA ligne
-- de profiles, y compris la colonne role : un simple appel a l'API publique
-- (PATCH /rest/v1/profiles?id=eq.<son id> {"role":"super_admin"}) suffisait a
-- devenir administrateur. De meme, un commercant suspendu pouvait remettre
-- organizations.disabled a false.
--
-- Apres : les utilisateurs ne peuvent plus ecrire que les colonnes utiles a
-- l'application (nom du profil ; creation et nom de leur organisation). Les
-- fonctions SECURITY DEFINER (admin_*, handle_new_user, bind_account,
-- activate_stand_verified...) et le service role ne sont pas concernes.

-- profiles : jamais le role.
revoke insert, update, truncate on table public.profiles from anon, authenticated;
grant insert (id, full_name) on table public.profiles to authenticated;
grant update (full_name) on table public.profiles to authenticated;

-- organizations : creation (nom + proprietaire) et changement de nom seulement ;
-- disabled, owner_id et customer_id restent aux mains de l'admin et du serveur.
revoke insert, update, truncate on table public.organizations from anon, authenticated;
grant insert (name, owner_id) on table public.organizations to authenticated;
grant update (name) on table public.organizations to authenticated;

-- app_admins : jamais accessible depuis le navigateur.
revoke all on table public.app_admins from anon, authenticated;
