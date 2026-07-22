-- Reviu — Real, DB-backed admin roles (replaces email-only admin gating).
--
-- Before: is_admin() matched the caller's email against the app_admins table —
-- a single fragile condition tied to an email address. Now admin authority is a
-- proper `role` on profiles, checked server-side. app_admins is kept only as a
-- break-glass bootstrap so we can never lock ourselves out.

alter table public.profiles
  add column if not exists role text not null default 'user'
  check (role in ('user','admin','super_admin'));

-- Promote the founder account to super_admin (idempotent).
update public.profiles p
  set role = 'super_admin'
from auth.users u
where u.id = p.id and lower(u.email) = 'yoan.oliveira30@gmail.com';

-- Full admin (present + future privileged users go through the role).
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path to 'public'
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','super_admin')
  ) or exists (
    -- break-glass bootstrap only
    select 1 from public.app_admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path to 'public'
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'super_admin'
  ) or exists (
    select 1 from public.app_admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke execute on function public.is_super_admin() from anon;
