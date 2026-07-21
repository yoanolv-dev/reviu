-- Reviu — Admin account management (list, edit, disable, delete, assign, transfer).
-- All SECURITY DEFINER + is_admin() (delete is super_admin only). Account-level
-- events are recorded in stand_audit with a null stand_id.

alter table public.organizations
  add column if not exists disabled boolean not null default false;

-- A disabled account must stop redirecting immediately.
create or replace function public.resolve_stand(p_code text)
returns table(status text, target_type text, establishment_id uuid, name text,
              google_review_url text, logo_url text, brand_color text,
              welcome_message text, feedback_enabled boolean, target_url text)
language sql stable security definer set search_path to 'public'
as $$
  select case when o.disabled then 'disabled' else s.status end,
         s.target_type, e.id, e.name, e.google_review_url,
         e.logo_url, e.brand_color, e.welcome_message, e.feedback_enabled,
         coalesce(s.target_url, e.google_review_url)
  from public.stands s
  left join public.establishments e on e.id = s.establishment_id
  left join public.organizations o on o.id = s.org_id
  where s.code = p_code;
$$;

create or replace function public.admin_list_customers(p_search text default null)
returns table(org_id uuid, org_name text, establishment_id uuid, establishment_name text,
              email text, full_name text, disabled boolean,
              stand_count integer, active_count integer, tracked_count integer,
              created_at timestamptz)
language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select o.id, o.name, e.id, e.name,
           coalesce(cu.email, au.email), coalesce(cu.full_name, pr.full_name),
           o.disabled,
           (select count(*)::int from public.stands s where s.org_id = o.id),
           (select count(*)::int from public.stands s where s.org_id = o.id and s.status = 'active'),
           (select count(*)::int from public.stands s
              join public.subscriptions sub on sub.stand_id = s.id
              where s.org_id = o.id and sub.status in ('active','trialing')),
           o.created_at
    from public.organizations o
    left join lateral (
      select e2.* from public.establishments e2 where e2.org_id = o.id order by e2.created_at limit 1
    ) e on true
    left join public.customers cu on cu.id = o.customer_id
    left join auth.users au on au.id = o.owner_id
    left join public.profiles pr on pr.id = o.owner_id
    where p_search is null
       or o.name ilike '%' || p_search || '%'
       or e.name ilike '%' || p_search || '%'
       or coalesce(cu.email, au.email) ilike '%' || p_search || '%'
    order by o.created_at desc;
end; $$;

create or replace function public.admin_update_account(p_org uuid, p_org_name text, p_est_name text, p_full_name text)
returns void language plpgsql security definer set search_path to 'public' as $$
declare v_cust uuid; v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if nullif(trim(p_org_name), '') is not null then
    update public.organizations set name = trim(p_org_name) where id = p_org;
  end if;
  if nullif(trim(p_est_name), '') is not null then
    update public.establishments set name = trim(p_est_name)
    where id = (select id from public.establishments where org_id = p_org order by created_at limit 1);
  end if;
  select customer_id into v_cust from public.organizations where id = p_org;
  if v_cust is not null and p_full_name is not null then
    update public.customers set full_name = nullif(trim(p_full_name), '') where id = v_cust;
  end if;
  insert into public.stand_audit (action, detail, actor, actor_email)
  values ('account_edit', jsonb_build_object('org', p_org), auth.uid(), v_email);
end; $$;

create or replace function public.admin_set_account_disabled(p_org uuid, p_disabled boolean)
returns void language plpgsql security definer set search_path to 'public' as $$
declare v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  update public.organizations set disabled = p_disabled where id = p_org;
  if p_disabled then
    update public.stands set status = 'suspended', status_changed_at = now()
    where org_id = p_org and status = 'active';
  else
    update public.stands set status = 'active', status_changed_at = now()
    where org_id = p_org and status = 'suspended' and establishment_id is not null;
  end if;
  insert into public.stand_audit (action, detail, actor, actor_email)
  values (case when p_disabled then 'account_disabled' else 'account_enabled' end,
          jsonb_build_object('org', p_org), auth.uid(), v_email);
end; $$;

-- Hard delete of the business records. Physical identifiers are RETIRED and
-- unassigned (never recycled). The auth user is not removed here (requires the
-- auth admin API). Super admin only.
create or replace function public.admin_delete_account(p_org uuid)
returns void language plpgsql security definer set search_path to 'public' as $$
declare v_cust uuid; v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
begin
  if not public.is_super_admin() then raise exception 'not_super_admin'; end if;
  select customer_id into v_cust from public.organizations where id = p_org;

  delete from public.feedback where establishment_id in
    (select id from public.establishments where org_id = p_org);
  delete from public.scans where stand_id in
    (select id from public.stands where org_id = p_org);
  delete from public.subscriptions where stand_id in
    (select id from public.stands where org_id = p_org);

  update public.stands
    set status = 'retired', org_id = null, establishment_id = null,
        target_url = null, status_note = 'compte supprimé', status_changed_at = now()
  where org_id = p_org;

  delete from public.establishments where org_id = p_org;
  delete from public.organizations where id = p_org;
  if v_cust is not null and not exists (select 1 from public.organizations where customer_id = v_cust) then
    delete from public.customers where id = v_cust;
  end if;

  insert into public.stand_audit (action, detail, actor, actor_email)
  values ('account_deleted', jsonb_build_object('org', p_org), auth.uid(), v_email);
end; $$;

-- Manually attribute a blank stand to an establishment (admin activation).
create or replace function public.admin_assign_stand(p_code text, p_establishment_id uuid)
returns void language plpgsql security definer set search_path to 'public' as $$
declare v_org uuid; v_url text; v_stand uuid; v_status text; v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  select org_id, google_review_url into v_org, v_url from public.establishments where id = p_establishment_id;
  if v_org is null then raise exception 'establishment_not_found'; end if;
  select id, status into v_stand, v_status from public.stands where code = lower(trim(p_code));
  if v_stand is null then raise exception 'stand_not_found'; end if;
  if v_status <> 'blank' then raise exception 'stand_already_assigned'; end if;

  update public.stands
    set org_id = v_org, establishment_id = p_establishment_id, status = 'active',
        activated_at = now(), target_url = coalesce(target_url, v_url)
  where id = v_stand;

  insert into public.stand_audit (stand_id, action, detail, actor, actor_email)
  values (v_stand, 'assigned', jsonb_build_object('establishment', p_establishment_id), auth.uid(), v_email);
end; $$;

-- Transfer an active stand to a different establishment/account.
create or replace function public.admin_transfer_stand(p_stand uuid, p_target_establishment_id uuid)
returns void language plpgsql security definer set search_path to 'public' as $$
declare v_org uuid; v_url text; v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  select org_id, google_review_url into v_org, v_url from public.establishments where id = p_target_establishment_id;
  if v_org is null then raise exception 'establishment_not_found'; end if;
  if not exists (select 1 from public.stands where id = p_stand) then raise exception 'stand_not_found'; end if;

  update public.stands
    set org_id = v_org, establishment_id = p_target_establishment_id,
        target_url = coalesce(target_url, v_url), status = 'active', status_changed_at = now()
  where id = p_stand;

  insert into public.stand_audit (stand_id, action, detail, actor, actor_email)
  values (p_stand, 'transferred', jsonb_build_object('establishment', p_target_establishment_id), auth.uid(), v_email);
end; $$;

revoke execute on function public.admin_list_customers(text) from anon;
revoke execute on function public.admin_update_account(uuid, text, text, text) from anon;
revoke execute on function public.admin_set_account_disabled(uuid, boolean) from anon;
revoke execute on function public.admin_delete_account(uuid) from anon;
revoke execute on function public.admin_assign_stand(text, uuid) from anon;
revoke execute on function public.admin_transfer_stand(uuid, uuid) from anon;
