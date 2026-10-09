-- Reviu - Tickets de support (commercant <-> admin).
--
-- Un commercant ouvre une demande depuis son espace (Aide) ; l'admin repond
-- depuis /admin/support. Chaque message part aussi par e-mail.
--
-- Acces : UNIQUEMENT par le serveur (service role), apres verification de la
-- session cote Next.js (le commercant ne voit que ses tickets, l'admin tous).
-- RLS activee sans aucune politique : rien n'est lisible ni modifiable depuis
-- le navigateur avec la cle publique.
--
-- Migration d'ajout uniquement : sans effet sur l'existant.

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  -- Pas de cle etrangere : un compte supprime par l'admin garde l'historique.
  org_id uuid,
  user_id uuid not null,
  email text not null,
  subject text not null check (length(subject) between 1 and 200),
  stand_code text,
  -- open : en attente de l'admin ; answered : en attente du commercant ;
  -- closed : resolu.
  status text not null default 'open'
    check (status in ('open', 'answered', 'closed')),
  last_author text not null default 'client'
    check (last_author in ('client', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists support_tickets_status_idx
  on public.support_tickets (status, updated_at desc);
create index if not exists support_tickets_user_idx
  on public.support_tickets (user_id, updated_at desc);
create index if not exists support_tickets_org_idx
  on public.support_tickets (org_id);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets (id),
  author text not null check (author in ('client', 'admin')),
  author_email text,
  body text not null check (length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index if not exists support_messages_ticket_idx
  on public.support_messages (ticket_id, created_at);

alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
revoke all on table public.support_tickets from public, anon, authenticated;
revoke all on table public.support_messages from public, anon, authenticated;
grant all on table public.support_tickets to service_role;
grant all on table public.support_messages to service_role;
