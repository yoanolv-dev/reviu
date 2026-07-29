-- Reviu - Production-grade stand generation: batches, audit trail, lifecycle.
--
-- Context: stands carry a permanent PUBLIC identifier (`code`) printed in the
-- QR code and NFC chip. After a batch is validated/exported to the supplier,
-- that identifier must never change, be recycled, or be deleted by accident.
-- This migration introduces production batches (lots), an append-only audit
-- trail, and the lifecycle statuses needed to manage defective/lost/replaced
-- stands. Immutability enforcement and grants live in the next migration.

-- ---------------------------------------------------------------------------
-- Production batches (lots)
-- ---------------------------------------------------------------------------
create table if not exists public.stand_batches (
  id           uuid primary key default gen_random_uuid(),
  label        text,
  -- draft: freshly generated, can still be corrected/deleted
  -- validated: reviewed, locked against deletion/modification
  -- exported: supplier file produced, fully locked (identifiers are now physical)
  status       text not null default 'draft'
               check (status in ('draft','validated','exported')),
  quantity     integer not null default 0,
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  validated_at timestamptz,
  exported_at  timestamptz,
  exported_by  uuid references auth.users(id) on delete set null,
  notes        text
);

alter table public.stand_batches enable row level security;
-- No policies on purpose: the table is reached only through SECURITY DEFINER
-- RPCs guarded by is_admin(). Direct PostgREST access is denied for everyone.
revoke all on public.stand_batches from anon, authenticated;

-- ---------------------------------------------------------------------------
-- stands: batch link + lifecycle columns + richer status set
-- ---------------------------------------------------------------------------
alter table public.stands
  add column if not exists batch_id          uuid references public.stand_batches(id),
  add column if not exists replaced_by        uuid references public.stands(id),
  add column if not exists status_note        text,
  add column if not exists status_changed_at  timestamptz;

-- Widen the status domain to cover the full physical lifecycle.
--   blank     : generated, not yet activated by a merchant
--   active    : activated, redirecting
--   disabled  : deactivated (soft)
--   suspended : temporarily paused (e.g. unpaid, dispute)
--   defective : hardware fault reported
--   lost      : reported lost/stolen
--   replaced  : superseded by another stand (see replaced_by)
--   retired   : permanently taken out of service
alter table public.stands drop constraint if exists stands_status_check;
alter table public.stands add constraint stands_status_check
  check (status in ('blank','active','disabled','suspended','defective','lost','replaced','retired'));

create index if not exists stands_batch_id_idx on public.stands(batch_id);

-- ---------------------------------------------------------------------------
-- Append-only audit trail for every sensitive stand/batch operation
-- ---------------------------------------------------------------------------
create table if not exists public.stand_audit (
  id          bigint generated always as identity primary key,
  stand_id    uuid references public.stands(id),
  batch_id    uuid references public.stand_batches(id),
  action      text not null,          -- generated | batch_validated | batch_exported
                                       -- status_changed | replaced | activated | admin_edit
  detail      jsonb,
  actor       uuid,                   -- auth.uid() of the operator (null = anon/self-service)
  actor_email text,
  created_at  timestamptz not null default now()
);

create index if not exists stand_audit_stand_idx on public.stand_audit(stand_id, created_at desc);
create index if not exists stand_audit_batch_idx on public.stand_audit(batch_id, created_at desc);
create index if not exists stand_audit_created_idx on public.stand_audit(created_at desc);

alter table public.stand_audit enable row level security;
-- Read/write only through SECURITY DEFINER RPCs (admins). Append-only in practice.
revoke all on public.stand_audit from anon, authenticated;
