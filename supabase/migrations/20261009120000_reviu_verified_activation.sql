-- Reviu - Activation verifiee par code e-mail (etape 1/2 : ajouts uniquement).
--
-- Contexte : le secret d'activation est imprime SUR le presentoir. N'importe
-- quel client au comptoir peut le photographier. Ce secret prouve donc
-- seulement « j'ai eu le presentoir sous les yeux », pas « je suis le
-- commercant ». D'ou les regles suivantes :
--   - le secret ne sert qu'UNE fois : tant que le presentoir est vierge
--     (statut 'blank'). Une fois active, il ne permet plus rien ;
--   - l'activation exige en plus une adresse e-mail VERIFIEE (code a 6 chiffres
--     envoye par e-mail) : le presentoir est rattache a un vrai compte, sans
--     faute de frappe possible, et jamais au compte de quelqu'un d'autre ;
--   - les essais (secret, envoi et saisie de code) sont limites ;
--   - le lien de redirection doit etre un lien Google (pas de lien de
--     phishing sur un presentoir detourne).
--
-- Cette migration n'ajoute que de nouveaux objets, appelables UNIQUEMENT par le
-- serveur (service role). Elle ne change rien au comportement actuel de la
-- prod. Le verrouillage des anciennes fonctions est dans la migration
-- 20261009121000_reviu_activation_lockdown.sql, a appliquer a la mise en prod.

-- 1. Limitation des essais ------------------------------------------------
create table if not exists public.rate_events (
  id bigint generated always as identity primary key,
  kind text not null,
  key text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_events_kind_key_idx
  on public.rate_events (kind, key, created_at desc);
create index if not exists rate_events_created_idx
  on public.rate_events (created_at);
alter table public.rate_events enable row level security;
revoke all on table public.rate_events from public, anon, authenticated;

-- Compte les evenements recents et en enregistre un nouveau si la limite n'est
-- pas atteinte. Renvoie false si la limite est atteinte (rien n'est enregistre).
create or replace function public.rl_allow(
  p_kind text, p_key text, p_window_seconds integer, p_max integer
)
returns boolean
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_count integer;
begin
  -- Serialise les appels concurrents sur la meme cle.
  perform pg_advisory_xact_lock(hashtext(p_kind || ':' || p_key));
  -- Menage : au-dela de 2 jours, les evenements ne servent plus (index sur
  -- created_at : suppression quasi gratuite).
  delete from public.rate_events where created_at < now() - interval '2 days';
  select count(*) into v_count from public.rate_events
  where kind = p_kind and key = p_key
    and created_at > now() - make_interval(secs => p_window_seconds);
  if v_count >= p_max then return false; end if;
  insert into public.rate_events (kind, key) values (p_kind, p_key);
  return true;
end;
$$;

create or replace function public.rl_count(
  p_kind text, p_key text, p_window_seconds integer
)
returns integer
language sql
security definer
set search_path to 'public'
as $$
  select count(*)::integer from public.rate_events
  where kind = p_kind and key = p_key
    and created_at > now() - make_interval(secs => p_window_seconds);
$$;

create or replace function public.rl_record(p_kind text, p_key text)
returns void
language sql
security definer
set search_path to 'public'
as $$
  insert into public.rate_events (kind, key) values (p_kind, p_key);
$$;

-- 2. Liens de redirection autorises : liens de fiche Google uniquement -------
-- Pas « tout ce qui est chez Google » : sites.google.com, docs.google.com
-- (formulaires), script.google.com et les redirecteurs (/url, /amp, btnI)
-- peuvent heberger ou rediriger vers n'importe quoi. Formes acceptees :
--   g.page/...  maps.app.goo.gl/...  share.google/...  goo.gl/maps/...
--   g.co/kgs/...  search.google.com/local/...
--   [www.|maps.]google.<pays>/maps... ou /search...  (pays : liste ci-dessous)
--   maps.google.<pays>/?cid=...  (hors /url)
-- https obligatoire, ni espace ni antislash ; « https://google.com@pirate.fr »
-- ou « https://google.pirate.fr » sont refuses. Meme regle cote serveur
-- Next.js : src/lib/review-url.ts (garder les deux alignees).
create or replace function public.is_allowed_review_url(p_url text)
returns boolean
language plpgsql
immutable
set search_path to ''
as $$
declare m text[]; v_host text; v_rest text; v_path text; v_query text; v_gm text[];
begin
  if p_url is null then return true; end if;
  if length(p_url) > 2048 or p_url ~ '[[:space:][:cntrl:]\\]' then return false; end if;
  m := regexp_match(p_url, '^https://([A-Za-z0-9.-]+)(:443)?([/?#].*)?$');
  if m is null then return false; end if;
  v_host := lower(m[1]);
  v_rest := coalesce(m[3], '/');
  v_path := coalesce(nullif(split_part(split_part(v_rest, '?', 1), '#', 1), ''), '/');
  -- Segments « . » / « .. » (meme encodes) et barres encodees : le navigateur
  -- les resoudrait (/maps/../amp/... = redirecteur), donc refuses.
  if v_path ~* '(^|/)(\.|%2e){1,2}(/|$)' or v_rest ~* '%2f|%5c' then return false; end if;

  if v_host in ('g.page', 'maps.app.goo.gl', 'share.google') then return true; end if;
  if v_host = 'goo.gl' then return v_path like '/maps/%'; end if;
  if v_host = 'g.co' then return v_path like '/kgs/%'; end if;
  if v_host = 'search.google.com' then return v_path like '/local/%'; end if;

  v_gm := regexp_match(v_host, '^(www\.|maps\.)?google\.([a-z.]+)$');
  if v_gm is null or v_gm[2] <> all (array['com','fr','be','ch','lu','ca','de','es','it','pt','nl','at','ie','co.uk']) then
    return false;
  end if;
  v_query := coalesce(substring(v_rest from '[?#].*$'), '');
  if v_query ~* 'btn(i|%49)' then return false; end if;
  if v_path ~ '^/(maps|search)(/|$)' then return true; end if;
  return coalesce(v_gm[1], '') = 'maps.' and v_path not like '/url%';
end;
$$;

-- 3. Verification du secret imprime -----------------------------------------
-- Saisie tolerante : espaces et tirets ignores, minuscules acceptees, et les
-- confusions courantes de l'alphabet Crockford corrigees (O -> 0, I/L -> 1).
-- Un presentoir SANS secret (anciens modeles) n'est jamais activable en
-- libre-service : il passe par l'admin (admin_assign_stand).
create or replace function public.stand_secret_matches(
  p_code text, p_pin text, p_hash text, p_sv smallint
)
returns boolean
language plpgsql
stable
security definer
set search_path to 'public'
as $$
declare v_pin text;
begin
  if p_pin is null then return false; end if;
  if p_sv is not null then
    v_pin := translate(upper(regexp_replace(p_pin, '[\s-]', '', 'g')), 'OIL', '011');
    return v_pin <> '' and v_pin = public.derive_stand_secret(p_code);
  end if;
  if p_hash is not null then
    return extensions.crypt(trim(p_pin), p_hash) = p_hash;
  end if;
  return false;
end;
$$;

-- Etape 1 du parcours : le secret est-il bon pour ce presentoir vierge ?
-- (aucune ecriture ; leve stand_not_found / stand_already_assigned / invalid_pin)
create or replace function public.check_stand_secret(p_code text, p_pin text)
returns void
language plpgsql
stable
security definer
set search_path to 'public'
as $$
declare v_code text; v_status text; v_hash text; v_sv smallint;
begin
  select code, status, claim_pin_hash, secret_version
    into v_code, v_status, v_hash, v_sv
  from public.stands where code = lower(trim(p_code));
  if v_code is null then raise exception 'stand_not_found'; end if;
  if v_status <> 'blank' then raise exception 'stand_already_assigned'; end if;
  if v_hash is null and v_sv is null then raise exception 'secret_missing'; end if;
  if not public.stand_secret_matches(v_code, p_pin, v_hash, v_sv) then
    raise exception 'invalid_pin';
  end if;
end;
$$;

-- 4. Activation par un compte VERIFIE ---------------------------------------
-- Appelee par le serveur apres verification de la session (auth.getUser) :
-- p_user_id / p_email viennent de la session, jamais de la saisie.
-- - rattache le client (e-mail) et ses anciennes organisations au compte ;
-- - reutilise un etablissement existant du compte (p_establishment_id) ou en
--   cree un nouveau (p_name, p_google_url) : plus de doublons ;
-- - active le presentoir (il suit le lien du commerce) et trace l'activation.
create or replace function public.activate_stand_verified(
  p_user_id uuid,
  p_email text,
  p_code text,
  p_pin text,
  p_establishment_id uuid default null,
  p_name text default null,
  p_google_url text default null,
  p_via text default 'scan'
)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_email text := lower(nullif(trim(p_email), ''));
  v_name text := nullif(trim(p_name), '');
  v_google text := nullif(trim(p_google_url), '');
  v_stand uuid; v_code text; v_status text; v_hash text; v_sv smallint;
  v_customer uuid; v_org uuid; v_est uuid; v_est_name text; v_est_url text;
  v_new_est boolean := false;
  v_disabled boolean;
begin
  if p_user_id is null or v_email is null then raise exception 'not_authenticated'; end if;

  -- Presentoir verrouille pendant l'activation (deux activations simultanees
  -- du meme presentoir ne peuvent pas reussir toutes les deux).
  select id, code, status, claim_pin_hash, secret_version
    into v_stand, v_code, v_status, v_hash, v_sv
  from public.stands where code = lower(trim(p_code))
  for update;
  if v_stand is null then raise exception 'stand_not_found'; end if;
  if v_status <> 'blank' then raise exception 'stand_already_assigned'; end if;
  if v_hash is null and v_sv is null then raise exception 'secret_missing'; end if;
  if not public.stand_secret_matches(v_code, p_pin, v_hash, v_sv) then
    raise exception 'invalid_pin';
  end if;

  -- Fiche client = l'e-mail verifie, rattachee au compte.
  insert into public.customers (email, user_id) values (v_email, p_user_id)
  on conflict (email) do update set user_id = excluded.user_id
  returning id into v_customer;

  -- Anciennes activations sans compte : le compte en devient proprietaire
  -- (meme logique que bind_account).
  update public.organizations set owner_id = p_user_id
  where customer_id = v_customer and owner_id is null;

  -- Organisation du compte (la plus ancienne, comme le tableau de bord).
  select id, coalesce(disabled, false) into v_org, v_disabled
  from public.organizations where owner_id = p_user_id
  order by created_at limit 1;

  if p_establishment_id is not null then
    select e.id, e.name, e.google_review_url, e.org_id
      into v_est, v_est_name, v_est_url, v_org
    from public.establishments e
    join public.organizations o on o.id = e.org_id
    where e.id = p_establishment_id and o.owner_id = p_user_id;
    if v_est is null then raise exception 'establishment_not_owned'; end if;
    select coalesce(disabled, false) into v_disabled
    from public.organizations where id = v_org;
  else
    if v_name is null then raise exception 'name_required'; end if;
    if not public.is_allowed_review_url(v_google) then
      raise exception 'invalid_review_url';
    end if;
    if v_org is null then
      insert into public.organizations (name, owner_id, customer_id)
      values (v_name, p_user_id, v_customer)
      returning id, coalesce(disabled, false) into v_org, v_disabled;
    end if;
    insert into public.establishments (org_id, name, google_review_url)
    values (v_org, v_name, v_google)
    returning id, name, google_review_url into v_est, v_est_name, v_est_url;
    v_new_est := true;
  end if;

  if v_disabled then raise exception 'account_disabled'; end if;

  -- Organisation creee depuis le tableau de bord (sans fiche client) : on la
  -- relie a l'e-mail verifie, pour les notifications.
  update public.organizations set customer_id = v_customer
  where id = v_org and customer_id is null;

  -- Pas de copie du lien dans target_url : le presentoir suit le lien du
  -- commerce (resolve_stand = coalesce(target_url, lien du commerce)). Un lien
  -- propre au presentoir reste possible ensuite (espace ou admin).
  update public.stands
    set org_id = v_org, establishment_id = v_est, status = 'active',
        activated_at = now(), status_changed_at = now()
  where id = v_stand;

  insert into public.stand_audit (stand_id, action, detail, actor, actor_email)
  values (v_stand, 'activated',
          jsonb_build_object('via', coalesce(nullif(trim(p_via), ''), 'scan'),
                             'verified_email', true,
                             'new_establishment', v_new_est),
          p_user_id, v_email);

  return jsonb_build_object(
    'stand_id', v_stand,
    'code', v_code,
    'establishment_id', v_est,
    'establishment_name', v_est_name,
    'google_url', coalesce(
      (select target_url from public.stands where id = v_stand), v_est_url),
    'new_establishment', v_new_est,
    'stands_on_account', (select count(*) from public.stands
                          where org_id = v_org and status = 'active')
  );
end;
$$;

-- 4 bis. Compte jamais confirme pour une adresse -----------------------------
-- Avant l'envoi d'un code, le serveur remplace le mot de passe d'un compte
-- jamais confirme par une valeur aleatoire (voir src/lib/auth-code.ts) : un
-- tiers qui aurait cree un compte avec l'adresse d'un commercant et un mot de
-- passe de son choix ne garde aucun acces une fois l'adresse confirmee.
create or replace function public.auth_unconfirmed_user_id(p_email text)
returns uuid
language sql
stable
security definer
set search_path to 'public'
as $$
  select u.id from auth.users u
  where lower(u.email) = lower(trim(p_email))
    and u.email_confirmed_at is null
    and u.deleted_at is null
  limit 1;
$$;

-- 5. Droits : serveur uniquement (service role) ------------------------------
do $$
declare
  fn text;
  server_fns text[] := array[
    'public.rl_allow(text, text, integer, integer)',
    'public.rl_count(text, text, integer)',
    'public.rl_record(text, text)',
    'public.stand_secret_matches(text, text, text, smallint)',
    'public.check_stand_secret(text, text)',
    'public.activate_stand_verified(uuid, text, text, text, uuid, text, text, text)',
    'public.auth_unconfirmed_user_id(text)'
  ];
begin
  foreach fn in array server_fns loop
    execute format('revoke all on function %s from public, anon, authenticated', fn);
    execute format('grant execute on function %s to service_role', fn);
  end loop;
end $$;

-- Fonction pure sans donnee : utilisable partout (et par les triggers).
grant execute on function public.is_allowed_review_url(text) to anon, authenticated, service_role;
