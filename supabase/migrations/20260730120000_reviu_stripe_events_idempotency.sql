-- Idempotence des webhooks Stripe.
--
-- Stripe peut redelivrer un meme evenement (retries reseau, rejeu manuel depuis
-- le dashboard). Sans garde, une commande boutique declenche alors des e-mails
-- en double (client + exploitant), et tout futur traitement a effet de bord se
-- rejoue. On enregistre chaque `event.id` deja traite : le webhook insere
-- l'identifiant au debut du traitement ; une insertion en conflit (deja present)
-- signifie « deja traite » et le webhook acquitte sans rejouer. La ligne est
-- retiree si le traitement echoue, pour laisser Stripe reessayer.
--
-- Acces : ecrit et lu UNIQUEMENT par le client service role du webhook (hors
-- session utilisateur). RLS active sans policy = aucun acces via les cles
-- publiques (anon / authenticated), qui n'ont de toute facon aucun privilege
-- ici. La table ne stocke aucune donnee personnelle.

create table if not exists public.stripe_events (
  event_id    text primary key,
  type        text not null,
  received_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

revoke all on public.stripe_events from anon, authenticated;
