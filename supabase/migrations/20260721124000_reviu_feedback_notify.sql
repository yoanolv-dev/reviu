-- Reviu — Transactional email on a NEW private feedback ("avis/retour" saved in
-- Reviu). NOTE: this only covers feedback recorded inside Reviu (the `feedback`
-- table, from /r/[code]/feedback). Google reviews are never seen by Reviu (the
-- stand only redirects to Google), so they cannot and must not be detected here.

-- submit_feedback now returns the new row id so the server action can notify.
drop function if exists public.submit_feedback(text, integer, text);
create function public.submit_feedback(p_code text, p_rating integer, p_message text)
returns uuid
language plpgsql security definer set search_path to 'public' as $$
declare v_stand uuid; v_est uuid; v_enabled boolean; v_id uuid;
begin
  select s.id, s.establishment_id, e.feedback_enabled
    into v_stand, v_est, v_enabled
  from public.stands s
  join public.establishments e on e.id = s.establishment_id
  where s.code = p_code and s.status = 'active';
  if v_est is null or v_enabled is not true then return null; end if;
  insert into public.feedback (stand_id, establishment_id, rating, message)
  values (v_stand, v_est, nullif(p_rating, 0), left(coalesce(p_message, ''), 2000))
  returning id into v_id;
  return v_id;
end; $$;

-- Notification target — merchant email + context. SERVICE ROLE ONLY (revoked
-- from anon/authenticated) so a public feedback submitter can never read a
-- merchant's email address.
create or replace function public.feedback_notification_target(p_feedback uuid)
returns table(email text, establishment_name text, rating integer, message text, created_at timestamptz)
language sql stable security definer set search_path to 'public' as $$
  select coalesce(cu.email, au.email), e.name, f.rating, f.message, f.created_at
  from public.feedback f
  join public.establishments e on e.id = f.establishment_id
  join public.organizations o on o.id = e.org_id
  left join public.customers cu on cu.id = o.customer_id
  left join auth.users au on au.id = o.owner_id
  where f.id = p_feedback;
$$;

revoke execute on function public.feedback_notification_target(uuid) from anon, authenticated;
