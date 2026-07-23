-- Phase 2 revendeurs : attribution des présentoirs à un revendeur + commission
-- récurrente sur les abonnements. Additif : n'altère aucun comportement existant.
-- Toutes les écritures passent par des RPC SECURITY DEFINER (comme les stands).
-- (Appliquée en production le 23/07/2026.)

create table if not exists public.resellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  code text unique not null,
  display_name text,
  commission_cents integer not null default 100,   -- 1,00 € / mois par abo actif
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.resellers enable row level security;

-- Lecture : le revendeur voit sa propre fiche ; les admins voient tout.
drop policy if exists resellers_select_self on public.resellers;
create policy resellers_select_self on public.resellers
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
-- Aucune policy d'écriture : tout passe par les RPC ci-dessous.

-- Attribution physique d'un présentoir à un revendeur.
alter table public.stands
  add column if not exists reseller_id uuid references public.resellers(id) on delete set null;
create index if not exists stands_reseller_id_idx on public.stands(reseller_id);

-- ── Espace revendeur (données du revendeur connecté) ────────────────────────
create or replace function public.reseller_overview()
returns table(reseller_id uuid, code text, display_name text, commission_cents integer,
              total_stands integer, deployed_stands integer, active_subs integer,
              monthly_commission_cents integer)
language sql stable security definer set search_path to 'public' as $$
  select r.id, r.code, r.display_name, r.commission_cents,
         (select count(*)::int from public.stands s where s.reseller_id = r.id),
         (select count(*)::int from public.stands s
            where s.reseller_id = r.id and s.establishment_id is not null),
         (select count(*)::int from public.stands s
            join public.subscriptions sub on sub.stand_id = s.id
            where s.reseller_id = r.id and sub.status in ('active','trialing')),
         (select count(*)::int from public.stands s
            join public.subscriptions sub on sub.stand_id = s.id
            where s.reseller_id = r.id and sub.status in ('active','trialing')) * r.commission_cents
  from public.resellers r
  where r.user_id = auth.uid() and r.active;
$$;

create or replace function public.reseller_stands()
returns table(code text, status text, deployed boolean, sub_active boolean,
              activated_at timestamptz)
language sql stable security definer set search_path to 'public' as $$
  select s.code, s.status, (s.establishment_id is not null),
         coalesce(sub.status in ('active','trialing'), false),
         s.activated_at
  from public.stands s
  join public.resellers r on r.id = s.reseller_id
  left join public.subscriptions sub on sub.stand_id = s.id
  where r.user_id = auth.uid()
  order by s.activated_at desc nulls last, s.code;
$$;

-- ── Administration des revendeurs ───────────────────────────────────────────
create or replace function public.admin_create_reseller(
  p_email text,
  p_name text default null,
  p_commission_cents integer default 100
) returns table(id uuid, code text)
language plpgsql security definer set search_path to 'public' as $$
declare v_uid uuid; v_code text; v_id uuid;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  select au.id into v_uid from auth.users au
    where lower(au.email) = lower(trim(p_email)) limit 1;
  if v_uid is null then raise exception 'user_not_found'; end if;

  loop
    v_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    exit when not exists (select 1 from public.resellers r where r.code = v_code);
  end loop;

  insert into public.resellers (user_id, code, display_name, commission_cents)
  values (v_uid, v_code, nullif(trim(p_name), ''),
          greatest(0, coalesce(p_commission_cents, 100)))
  on conflict (user_id) do update
    set display_name = coalesce(nullif(trim(p_name), ''), public.resellers.display_name),
        commission_cents = greatest(0, coalesce(p_commission_cents, 100)),
        active = true
  returning resellers.id, resellers.code into v_id, v_code;

  return query select v_id, v_code;
end; $$;

create or replace function public.admin_assign_stands(
  p_reseller uuid,
  p_codes text[]
) returns integer
language plpgsql security definer set search_path to 'public' as $$
declare v_count integer;
        v_actor uuid := auth.uid();
        v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if not exists (select 1 from public.resellers r where r.id = p_reseller) then
    raise exception 'reseller_not_found';
  end if;

  with upd as (
    update public.stands s
      set reseller_id = p_reseller
    where s.code = any(p_codes)
      and (s.reseller_id is null or s.reseller_id = p_reseller)
    returning s.id
  )
  select count(*)::int into v_count from upd;

  insert into public.stand_audit (action, detail, actor, actor_email)
  values ('reseller_assigned',
          jsonb_build_object('reseller', p_reseller, 'assigned', v_count,
                             'codes', p_codes),
          v_actor, v_email);

  return v_count;
end; $$;

create or replace function public.admin_assign_batch(
  p_reseller uuid,
  p_batch uuid
) returns integer
language plpgsql security definer set search_path to 'public' as $$
declare v_count integer;
        v_actor uuid := auth.uid();
        v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if not exists (select 1 from public.resellers r where r.id = p_reseller) then
    raise exception 'reseller_not_found';
  end if;

  with upd as (
    update public.stands s
      set reseller_id = p_reseller
    where s.batch_id = p_batch
      and (s.reseller_id is null or s.reseller_id = p_reseller)
    returning s.id
  )
  select count(*)::int into v_count from upd;

  insert into public.stand_audit (batch_id, action, detail, actor, actor_email)
  values (p_batch, 'reseller_assigned',
          jsonb_build_object('reseller', p_reseller, 'assigned', v_count,
                             'batch', p_batch),
          v_actor, v_email);

  return v_count;
end; $$;

create or replace function public.admin_list_resellers()
returns table(id uuid, user_id uuid, email text, code text, display_name text,
              commission_cents integer, active boolean, total_stands integer,
              active_subs integer, monthly_commission_cents integer,
              created_at timestamptz)
language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select r.id, r.user_id, au.email, r.code, r.display_name, r.commission_cents,
           r.active,
           (select count(*)::int from public.stands s where s.reseller_id = r.id),
           (select count(*)::int from public.stands s
              join public.subscriptions sub on sub.stand_id = s.id
              where s.reseller_id = r.id and sub.status in ('active','trialing')),
           (select count(*)::int from public.stands s
              join public.subscriptions sub on sub.stand_id = s.id
              where s.reseller_id = r.id and sub.status in ('active','trialing'))
             * r.commission_cents,
           r.created_at
    from public.resellers r
    left join auth.users au on au.id = r.user_id
    order by r.created_at desc;
end; $$;

grant execute on function public.reseller_overview() to authenticated;
grant execute on function public.reseller_stands() to authenticated;
grant execute on function public.admin_create_reseller(text, text, integer) to authenticated;
grant execute on function public.admin_assign_stands(uuid, text[]) to authenticated;
grant execute on function public.admin_assign_batch(uuid, uuid) to authenticated;
grant execute on function public.admin_list_resellers() to authenticated;
