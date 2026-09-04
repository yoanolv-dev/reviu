-- Reviu - Reinitialisation d'un presentoir (cycle de prospection revendeur).
--
-- Besoin : l'administrateur prepare un presentoir pour un prospect (activation
-- normale au scan : nom du commerce + lien Google), fait la demo, et si le
-- prospect refuse, veut REINITIALISER le presentoir pour le reproposer a un
-- autre commercant.
--
-- `admin_set_stand_status` interdit VOLONTAIREMENT le retour a 'blank' (garde-fou
-- anti-recyclage accidentel). On ajoute donc une action DEDIEE et separee,
-- reservee a l'admin, avec son propre garde-fou, qui defait proprement
-- l'activation :
--   - detache le presentoir (org, etablissement, lien Google, date) -> 'blank'
--   - efface les stats de demo (scans) et les retours (feedback) du presentoir
--   - supprime l'etablissement (et l'organisation) "prospect" cree pour la demo
--     s'il n'est plus rattache a aucun autre presentoir ; le client (e-mail) est
--     conserve
--   - refuse si un abonnement actif existe (securite : vrai client payant)
--   - trace l'action dans stand_audit
--
-- IMPORTANT : le `code` (identifiant public grave dans le QR + la puce NFC) n'est
-- JAMAIS touche - il reste immuable (garanti aussi par le trigger stands_guard).
-- Sont egalement conserves : le secret d'activation, le lot et l'attribution
-- revendeur.

create or replace function public.admin_reset_stand(p_stand uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_status text;
  v_est uuid;
  v_org uuid;
  v_sub text;
  v_actor uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;

  select status, establishment_id, org_id
    into v_status, v_est, v_org
  from public.stands where id = p_stand;
  if v_status is null then raise exception 'stand_not_found'; end if;
  if v_status = 'blank' then return; end if;            -- deja vierge : no-op
  if v_status not in ('active', 'suspended', 'disabled') then
    -- 'replaced' / 'defective' / 'lost' / 'retired' : etats a ne pas recycler.
    raise exception 'stand_not_resettable';
  end if;

  -- Securite : ne jamais reinitialiser un presentoir avec un abonnement actif.
  select status into v_sub from public.subscriptions where stand_id = p_stand;
  if v_sub in ('active', 'trialing', 'past_due') then
    raise exception 'stand_has_subscription';
  end if;

  -- 1. Detache le presentoir -> vierge (le code grave reste intact).
  update public.stands
    set org_id = null, establishment_id = null, target_url = null,
        status = 'blank', activated_at = null,
        status_note = null, status_changed_at = now()
  where id = p_stand;

  -- 2. Remet les compteurs a zero : scans et retours de la demo.
  delete from public.scans where stand_id = p_stand;
  delete from public.feedback where stand_id = p_stand;

  -- 3. Nettoie l'etablissement "prospect" s'il n'est plus utilise ailleurs.
  if v_est is not null
     and not exists (select 1 from public.stands where establishment_id = v_est) then
    delete from public.feedback where establishment_id = v_est;
    delete from public.establishments where id = v_est;
  end if;

  -- 4. Nettoie l'organisation "prospect" si plus aucun presentoir ni
  --    etablissement ne s'y rattache (le client / e-mail est conserve).
  if v_org is not null
     and not exists (select 1 from public.stands where org_id = v_org)
     and not exists (select 1 from public.establishments where org_id = v_org) then
    delete from public.organizations where id = v_org;
  end if;

  -- 5. Trace.
  insert into public.stand_audit (stand_id, action, detail, actor, actor_email)
  values (p_stand, 'reset',
          jsonb_build_object('from', v_status, 'establishment', v_est),
          v_actor, v_email);
end;
$$;

revoke execute on function public.admin_reset_stand(uuid) from anon;
