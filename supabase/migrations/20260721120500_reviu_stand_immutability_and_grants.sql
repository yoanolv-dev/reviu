-- Reviu — Immutability & least-privilege for the public identifier.
--
-- Problem found in audit: the `authenticated` (and `anon`) roles held
-- INSERT/UPDATE/DELETE on public.stands. The RLS policy `stands by owner` is
-- FOR ALL and only checks org ownership, so a merchant could
--   PATCH /rest/v1/stands?id=eq.<their stand>  {"code":"..."}
-- and REWRITE the identifier printed on a physical stand, or DELETE the row.
-- That is the "already-manufactured stand becomes unusable" scenario.
--
-- Fix (defence in depth):
--   1. Trigger: the `code` can NEVER change, and rows can only be deleted while
--      still blank and not part of a validated/exported batch.
--   2. Revoke direct write privileges: every legitimate write already goes
--      through a SECURITY DEFINER RPC, so clients keep SELECT only.

-- ---------------------------------------------------------------------------
-- 1. Immutability trigger
-- ---------------------------------------------------------------------------
create or replace function public.stands_guard()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' then
    if new.code is distinct from old.code then
      raise exception 'code_immutable' using
        hint = 'The public identifier is permanent and cannot be modified.';
    end if;
    -- The physical id may not be moved between batches once assigned.
    if old.batch_id is not null and new.batch_id is distinct from old.batch_id then
      raise exception 'batch_immutable';
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    if old.status <> 'blank' then
      raise exception 'stand_delete_forbidden' using
        hint = 'Only blank stands can be deleted; use a status change instead.';
    end if;
    if exists (
      select 1 from public.stand_batches b
      where b.id = old.batch_id and b.status in ('validated','exported')
    ) then
      raise exception 'stand_delete_forbidden_locked' using
        hint = 'This batch is validated/exported and is permanently locked.';
    end if;
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists stands_guard_trg on public.stands;
create trigger stands_guard_trg
  before update or delete on public.stands
  for each row execute function public.stands_guard();

-- ---------------------------------------------------------------------------
-- 2. Least privilege on stands (keep SELECT; RLS still governs which rows)
-- ---------------------------------------------------------------------------
revoke insert, update, delete, truncate on public.stands from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Tighten EXECUTE on internal / privileged functions
--    (public self-service RPCs keep anon access; everything else does not)
-- ---------------------------------------------------------------------------
revoke execute on function public.handle_new_user() from anon, authenticated;

revoke execute on function public.generate_stands(integer, text) from anon;
revoke execute on function public.admin_list_stands(integer) from anon;
revoke execute on function public.admin_list_subscriptions() from anon;
revoke execute on function public.admin_set_subscription(uuid, text) from anon;
revoke execute on function public.bind_account() from anon;
revoke execute on function public.claim_stand(text, uuid, text) from anon;
revoke execute on function public.owner_set_subscription(uuid, text) from anon;
revoke execute on function public.set_stand_target(uuid, text) from anon;
