-- Reviu - Prospection par e-mail (commerces de proximite).
--
-- Les prospects viennent de donnees publiques (OpenStreetMap : adresse e-mail
-- publiee par le commerce lui-meme). Une sequence de 3 e-mails courts part
-- depuis une boite d'envoi dediee (SMTP), au rythme fixe par
-- /api/outreach/send. Toute desinscription est definitive (outreach_optouts),
-- y compris si le commerce est re-importe plus tard.
--
-- Acces : UNIQUEMENT par le serveur (service role). RLS sans politique.

create table if not exists public.outreach_prospects (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  business_name text,
  category text,
  city text,
  website text,
  -- Origine de la donnee (obligation d'information RGPD), ex. "osm:node/123".
  source text not null,
  -- new : jamais contacte ; active : sequence en cours ; done : sequence
  -- terminee ; replied / not_interested : arrete a la main depuis l'admin ;
  -- unsubscribed : desinscrit ; bounced : adresse invalide.
  status text not null default 'new'
    check (status in ('new', 'active', 'done', 'replied', 'not_interested',
                      'unsubscribed', 'bounced')),
  step int not null default 0,
  last_sent_at timestamptz,
  next_send_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists outreach_prospects_queue_idx
  on public.outreach_prospects (status, next_send_at);

create table if not exists public.outreach_sends (
  id bigint generated always as identity primary key,
  prospect_id uuid not null references public.outreach_prospects (id) on delete cascade,
  step int not null,
  ok boolean not null,
  error text,
  sent_at timestamptz not null default now()
);
create index if not exists outreach_sends_day_idx
  on public.outreach_sends (sent_at);

create table if not exists public.outreach_optouts (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

alter table public.outreach_prospects enable row level security;
alter table public.outreach_sends enable row level security;
alter table public.outreach_optouts enable row level security;
revoke all on table public.outreach_prospects from public, anon, authenticated;
revoke all on table public.outreach_sends from public, anon, authenticated;
revoke all on table public.outreach_optouts from public, anon, authenticated;
grant all on table public.outreach_prospects to service_role;
grant all on table public.outreach_sends to service_role;
grant all on table public.outreach_optouts to service_role;
