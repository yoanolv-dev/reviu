-- Reviu — Performance: RLS init-plan, FK indexes, aggregate RPCs.
--
-- 1) Wrap auth.uid() in (select auth.uid()) so Postgres evaluates it ONCE per
--    query instead of once per row (Supabase lint 0003_auth_rls_initplan).
-- 2) Index the foreign keys hit by every RLS check (esp. organizations.owner_id).
-- 3) Replace client-side scan counting (fetch-all-rows) with SQL aggregates.

-- --- 1. RLS policies -------------------------------------------------------
drop policy if exists "profiles self select" on public.profiles;
create policy "profiles self select" on public.profiles
  for select using (id = (select auth.uid()));
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (id = (select auth.uid()));
drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self insert" on public.profiles
  for insert with check (id = (select auth.uid()));

drop policy if exists "org owner all" on public.organizations;
create policy "org owner all" on public.organizations
  for all using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "establishments by owner" on public.establishments;
create policy "establishments by owner" on public.establishments
  for all using (org_id in (select id from public.organizations where owner_id = (select auth.uid())))
  with check (org_id in (select id from public.organizations where owner_id = (select auth.uid())));

-- stands: direct writes are already revoked; this policy now governs SELECT only.
drop policy if exists "stands by owner" on public.stands;
create policy "stands read by owner" on public.stands
  for select using (org_id in (select id from public.organizations where owner_id = (select auth.uid())));

drop policy if exists "scans select by owner" on public.scans;
create policy "scans select by owner" on public.scans
  for select using (stand_id in (
    select s.id from public.stands s
    join public.organizations o on o.id = s.org_id
    where o.owner_id = (select auth.uid())
  ));

drop policy if exists "feedback select by owner" on public.feedback;
create policy "feedback select by owner" on public.feedback
  for select using (establishment_id in (
    select e.id from public.establishments e
    join public.organizations o on o.id = e.org_id
    where o.owner_id = (select auth.uid())
  ));

drop policy if exists "subscriptions readable by owner" on public.subscriptions;
create policy "subscriptions readable by owner" on public.subscriptions
  for select using (stand_id in (
    select s.id from public.stands s
    join public.organizations o on o.id = s.org_id
    where o.owner_id = (select auth.uid())
  ));

drop policy if exists "customers self select" on public.customers;
create policy "customers self select" on public.customers
  for select using (user_id = (select auth.uid()));

-- --- 2. Foreign-key indexes ------------------------------------------------
create index if not exists organizations_owner_id_idx on public.organizations(owner_id);
create index if not exists customers_user_id_idx on public.customers(user_id);
create index if not exists feedback_stand_id_idx on public.feedback(stand_id);

-- --- 3. Aggregate RPCs (scoped to the caller's stands) ---------------------
create or replace function public.my_stats()
returns table(views bigint, clicks bigint)
language sql stable security definer set search_path to 'public' as $$
  select
    count(*) filter (where sc.kind = 'view'),
    count(*) filter (where sc.kind = 'click')
  from public.scans sc
  where sc.stand_id in (
    select s.id from public.stands s
    join public.organizations o on o.id = s.org_id
    where o.owner_id = (select auth.uid())
  );
$$;

create or replace function public.my_scan_counts()
returns table(stand_id uuid, views bigint)
language sql stable security definer set search_path to 'public' as $$
  select sc.stand_id, count(*)
  from public.scans sc
  where sc.kind = 'view' and sc.stand_id in (
    select s.id from public.stands s
    join public.organizations o on o.id = s.org_id
    where o.owner_id = (select auth.uid())
  )
  group by sc.stand_id;
$$;

revoke execute on function public.my_stats() from anon;
revoke execute on function public.my_scan_counts() from anon;
