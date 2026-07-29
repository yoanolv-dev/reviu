-- Reviu - Comportement au scan, par établissement.
--
-- Le lien physique gravé dans les présentoirs (r.reviu.fr/<code>) pointe vers
-- notre serveur : on peut donc changer ce qui se passe au scan sans jamais
-- retoucher un présentoir. Ce réglage laisse chaque commerçant choisir :
--   'direct' (défaut) : redirection instantanée vers l'avis Google (1 scan).
--   'page'            : affiche la page reviu (message + retour privé conforme).
-- Les statistiques (scan/clic) restent enregistrées dans les deux cas.

alter table public.establishments
  add column if not exists scan_mode text not null default 'direct'
  check (scan_mode in ('direct', 'page'));

-- resolve_stand renvoie désormais aussi scan_mode. DROP/CREATE nécessaire car on
-- ne peut pas changer le type de retour avec CREATE OR REPLACE. Logique inchangée.
drop function if exists public.resolve_stand(text);
create function public.resolve_stand(p_code text)
returns table(
  status text, target_type text, establishment_id uuid, name text,
  google_review_url text, logo_url text, brand_color text, welcome_message text,
  feedback_enabled boolean, scan_mode text, target_url text
)
language sql
stable
security definer
set search_path to 'public'
as $function$
  select case when o.disabled then 'disabled' else s.status end,
         s.target_type, e.id, e.name, e.google_review_url,
         e.logo_url, e.brand_color, e.welcome_message, e.feedback_enabled,
         coalesce(e.scan_mode, 'direct'),
         coalesce(s.target_url, e.google_review_url)
  from public.stands s
  left join public.establishments e on e.id = s.establishment_id
  left join public.organizations o on o.id = s.org_id
  where s.code = p_code;
$function$;

grant execute on function public.resolve_stand(text) to anon, authenticated, service_role;
