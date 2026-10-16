-- Reviu - Correctifs de l'audit de sécurité du 16/10/2026.
--
-- ⚠️ NON APPLIQUÉE automatiquement : à coller dans le SQL Editor de Supabase
-- (vue « Raw » de GitHub) ou à appliquer par le connecteur, APRÈS le
-- déploiement du code qui l'accompagne (src/lib/data.ts appelle désormais
-- submit_feedback et record_scan avec le service role). Le code fonctionne
-- aussi AVANT la migration : l'ordre code -> migration est sans coupure.
--
-- Contenu :
-- 1. owner_set_subscription (ancienne simulation d'abonnement) n'est plus
--    appelable : un commerçant connecté pouvait passer un de ses présentoirs en
--    « abonné » pendant 30 jours sans payer, par un appel direct à l'API.
-- 2. submit_feedback et record_scan réservés au serveur : appelées directement
--    avec la clé publique, elles contournaient les limites du serveur (retours
--    en masse dans l'espace d'un commerçant, statistiques gonflées).
-- 3. Fonctions admin / revendeur : plus exécutables par le rôle anonyme (elles
--    vérifient déjà is_admin() / auth.uid() ; défense en profondeur).
-- 4. Droits de table resserrés : un commerçant ne peut plus supprimer son
--    organisation ou ses commerces, ni déplacer un commerce vers une autre
--    organisation (contournement d'une suspension), ni écrire logo_url
--    (image arbitraire sur la page publique). Écritures directes retirées sur
--    les tables que seules les fonctions serveur modifient.
-- 5. stands_guard : search_path figé.
-- 6. is_allowed_review_url durcie (même règle que src/lib/review-url.ts) :
--    lettres encodées refusées sur google.<pays> (« b%74nI », « /%75rl »),
--    btnI / gfns refusés, maps.google.<pays> limité à la racine (?cid=…).
--    Vérifié le 16/10 : les 8 liens enregistrés en prod restent acceptés.

-- 1. Ancienne simulation d'abonnement ---------------------------------------
revoke all on function public.owner_set_subscription(uuid, text)
  from public, anon, authenticated;

-- 2. Écritures du parcours public : serveur uniquement -----------------------
revoke all on function public.submit_feedback(text, integer, text)
  from public, anon, authenticated;
grant execute on function public.submit_feedback(text, integer, text) to service_role;

revoke all on function public.record_scan(text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.record_scan(text, text, text, text) to service_role;

-- 3. Fonctions admin / revendeur : jamais pour le rôle anonyme ---------------
do $$
declare f text;
begin
  foreach f in array array[
    'public.admin_assign_batch(uuid, uuid)',
    'public.admin_assign_stands(uuid, text[])',
    'public.admin_create_reseller(text, text, integer)',
    'public.admin_list_resellers()',
    'public.admin_reset_stand(uuid)',
    'public.admin_unsubscribed_contacts()',
    'public.reseller_overview()',
    'public.reseller_stands()'
  ] loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated, service_role', f);
  end loop;
end $$;

-- 4. Droits de table ---------------------------------------------------------
-- Organisations : création (name, owner_id) et renommage (name) conservés
-- (20261009115000) ; suppression réservée à l'admin (admin_delete_account).
revoke delete, truncate on public.organizations from anon, authenticated;

-- Commerces : création conservée (onboarding, contrôlée par la RLS) ;
-- modification limitée aux champs du formulaire de l'espace ; pas de
-- suppression (les retours privés partiraient avec, en cascade).
revoke insert, update, delete, truncate on public.establishments from anon;
revoke insert, update, delete, truncate on public.establishments from authenticated;
grant insert (org_id, name, google_review_url) on public.establishments to authenticated;
grant update (name, google_review_url, google_place_id, welcome_message,
              brand_color, feedback_enabled, scan_mode)
  on public.establishments to authenticated;

-- Tables écrites uniquement par des fonctions SECURITY DEFINER ou le service
-- role : aucune écriture directe (la RLS les bloquait déjà, sans politique).
revoke insert, update, delete, truncate on
  public.customers, public.feedback, public.scans, public.subscriptions,
  public.resellers
  from anon, authenticated;

-- 5. search_path figé ---------------------------------------------------------
alter function public.stands_guard() set search_path = '';

-- 6. Liens de fiche Google : règle durcie --------------------------------------
create or replace function public.is_allowed_review_url(p_url text)
returns boolean
language plpgsql
immutable
set search_path to ''
as $$
declare m text[]; v_host text; v_rest text; v_path text; v_query text; v_gm text[];
begin
  if p_url is null then return true; end if;
  if length(p_url) > 2048 or p_url ~ '[[:space:][:cntrl:]\\]' then return false; end if;
  m := regexp_match(p_url, '^https://([A-Za-z0-9.-]+)(:443)?([/?#].*)?$');
  if m is null then return false; end if;
  v_host := lower(m[1]);
  v_rest := coalesce(m[3], '/');
  v_path := coalesce(nullif(split_part(split_part(v_rest, '?', 1), '#', 1), ''), '/');
  -- Segments « . » / « .. » (meme encodes) et barres encodees : le navigateur
  -- les resoudrait (/maps/../amp/... = redirecteur), donc refuses.
  if v_path ~* '(^|/)(\.|%2e){1,2}(/|$)' or v_rest ~* '%2f|%5c' then return false; end if;

  if v_host in ('g.page', 'maps.app.goo.gl', 'share.google') then return true; end if;
  if v_host = 'goo.gl' then return v_path like '/maps/%'; end if;
  if v_host = 'g.co' then return v_path like '/kgs/%'; end if;
  if v_host = 'search.google.com' then return v_path like '/local/%'; end if;

  v_gm := regexp_match(v_host, '^(www\.|maps\.)?google\.([a-z.]+)$');
  if v_gm is null or v_gm[2] <> all (array['com','fr','be','ch','lu','ca','de','es','it','pt','nl','at','ie','co.uk']) then
    return false;
  end if;
  -- Lettres encodees (%74 = « t »...) : jamais dans un lien de fiche, seul
  -- moyen de deguiser un parametre (« b%74nI ») ou un chemin (« /%75rl »).
  if v_rest ~* '%(4[1-9a-f]|5[0-9a]|6[1-9a-f]|7[0-9a])' then return false; end if;
  v_query := coalesce(substring(v_rest from '[?#].*$'), '');
  -- « J'ai de la chance » (btnI, gfns) redirige vers le premier resultat.
  if v_query ~* '(btni|gfns)' then return false; end if;
  if v_path ~ '^/(maps|search)(/|$)' then return true; end if;
  -- maps.google.<pays>/?cid=... (ancien format de fiche) : racine uniquement.
  return coalesce(v_gm[1], '') = 'maps.' and v_path = '/';
end;
$$;
