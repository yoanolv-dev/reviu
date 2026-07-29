-- Offre incluse (sans abonnement) : la modification du lien de redirection d'un
-- présentoir fait désormais partie de l'espace Reviu INCLUS avec l'achat unique
-- du présentoir. On retire le verrou `subscription_required` du RPC
-- set_stand_target, qui contredisait le nouveau positionnement.
--
-- Garde-fous conservés :
--  - vérification de propriété du présentoir (un compte ne modifie que ses
--    présentoirs) - INCHANGÉE ;
--  - l'adresse encodée QR/NFC du présentoir (`code`) reste immuable - non
--    touchée ici, seul `target_url` (la destination) est modifiable.
-- (Appliquée en production le 28/07/2026.)
create or replace function public.set_stand_target(p_stand_id uuid, p_url text)
  returns void
  language plpgsql
  security definer
  set search_path to 'public'
as $function$
declare v_owns boolean;
begin
  select exists(
    select 1 from public.stands s
    join public.organizations o on o.id = s.org_id
    where s.id = p_stand_id and o.owner_id = auth.uid()
  ) into v_owns;
  if not v_owns then raise exception 'stand_not_owned'; end if;

  update public.stands set target_url = nullif(trim(p_url), '') where id = p_stand_id;
end; $function$;
