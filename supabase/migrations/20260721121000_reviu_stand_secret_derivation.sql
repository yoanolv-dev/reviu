-- Reviu - Activation secret derived from the public code (HMAC), not stored.
--
-- The stand carries ONE public identifier (`code`) in its QR/NFC. Activation is
-- gated by a short secret that is printed discreetly on the stand but NEVER
-- encoded in the QR/NFC, so scanning the code alone cannot hijack a blank stand.
--
-- Design: secret = HMAC-SHA256(server_key, code) mapped to 8 Crockford base32
-- chars. The key lives in Supabase Vault (server-only). Nothing secret is
-- stored per stand, yet the supplier export can always re-derive the exact
-- secret. Clients cannot call the derivation function (EXECUTE revoked), so the
-- code being public does not leak the secret.

-- 1. Server-only HMAC key (created once, permanent - do NOT rotate: rotating it
--    would change every already-printed stand's activation secret).
do $$
begin
  if not exists (select 1 from vault.secrets where name = 'stand_activation_key') then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'stand_activation_key',
      'HMAC key used to derive stand activation secrets (permanent)'
    );
  end if;
end $$;

-- 2. Track which secret scheme a stand uses (null = legacy/no secret).
alter table public.stands add column if not exists secret_version smallint;

-- 3. Derivation function - SECURITY DEFINER, NOT callable by clients.
create or replace function public.derive_stand_secret(p_code text)
returns text
language plpgsql
stable
security definer
set search_path to 'public'
as $$
declare
  v_key text;
  v_raw bytea;
  v_out text := '';
  j int;
  alpha text := '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; -- Crockford base32 (no I,L,O,U), 32 chars → no modulo bias
begin
  select decrypted_secret into v_key
  from vault.decrypted_secrets where name = 'stand_activation_key';
  if v_key is null then raise exception 'activation_key_missing'; end if;
  v_raw := extensions.hmac(lower(p_code), v_key, 'sha256'); -- 32 bytes
  for j in 0..7 loop
    v_out := v_out || substr(alpha, 1 + (get_byte(v_raw, j) % 32), 1);
  end loop;
  return v_out;
end;
$$;

-- The code is public; the secret must not be derivable by clients.
revoke all on function public.derive_stand_secret(text) from public, anon, authenticated;

-- 4. Rewrite generate_stands: crypto-secure code, batch-scoped, audited.
--    Returns the derived secret once (admin records it for the supplier file).
drop function if exists public.generate_stands(integer, text);
create function public.generate_stands(p_count integer, p_label text default null)
returns table(code text, secret text)
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  i int := 0; j int; v_code text; v_secret text; v_batch uuid;
  v_actor uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_label text := nullif(trim(p_label), '');
  alphabet text := 'abcdefghjkmnpqrstuvwxyz23456789'; -- 31, no ambiguous chars
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if p_count is null or p_count < 1 or p_count > 500 then raise exception 'invalid_count'; end if;

  insert into public.stand_batches (label, status, created_by, quantity)
  values (v_label, 'draft', v_actor, 0)
  returning id into v_batch;

  while i < p_count loop
    v_code := '';
    for j in 1..7 loop
      v_code := v_code || substr(alphabet, 1 + (get_byte(extensions.gen_random_bytes(1), 0) % length(alphabet)), 1);
    end loop;
    begin
      insert into public.stands (code, status, label, batch_id, secret_version)
      values (v_code, 'blank', v_label, v_batch, 1);
      v_secret := public.derive_stand_secret(v_code);
      code := v_code; secret := v_secret; return next;
      i := i + 1;
    exception when unique_violation then
      null; -- rare 7-char collision: retry without counting
    end;
  end loop;

  update public.stand_batches set quantity = p_count where id = v_batch;
  insert into public.stand_audit (batch_id, action, detail, actor, actor_email)
  values (v_batch, 'generated',
          jsonb_build_object('count', p_count, 'label', v_label), v_actor, v_email);
end;
$$;
revoke execute on function public.generate_stands(integer, text) from anon;

-- 5. Activation now verifies against the derived secret (keeps legacy bcrypt path
--    for any pre-existing stand that still has a claim_pin_hash).
create or replace function public.activate_stand(p_code text, p_pin text, p_email text, p_name text, p_google_url text)
returns text
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_stand uuid; v_status text; v_hash text; v_sv smallint;
  v_email text; v_customer uuid; v_org uuid; v_est uuid;
  v_name text; v_google text;
begin
  v_email := lower(nullif(trim(p_email), ''));
  if v_email is null then raise exception 'email_required'; end if;
  v_name := nullif(trim(p_name), '');
  if v_name is null then raise exception 'name_required'; end if;
  v_google := nullif(trim(p_google_url), '');

  select id, status, claim_pin_hash, secret_version
    into v_stand, v_status, v_hash, v_sv
  from public.stands where code = p_code;
  if v_stand is null then raise exception 'stand_not_found'; end if;
  if v_status <> 'blank' then raise exception 'stand_already_assigned'; end if;

  if v_sv is not null then
    if p_pin is null or upper(trim(p_pin)) <> public.derive_stand_secret(p_code) then
      raise exception 'invalid_pin';
    end if;
  elsif v_hash is not null then
    if p_pin is null or extensions.crypt(p_pin, v_hash) <> v_hash then
      raise exception 'invalid_pin';
    end if;
  end if;

  insert into public.customers (email) values (v_email)
  on conflict (email) do update set email = excluded.email
  returning id into v_customer;

  select id into v_org from public.organizations
  where customer_id = v_customer order by created_at limit 1;
  if v_org is null then
    insert into public.organizations (name, customer_id) values (v_name, v_customer)
    returning id into v_org;
  end if;

  insert into public.establishments (org_id, name, google_review_url)
  values (v_org, v_name, v_google) returning id into v_est;

  update public.stands
    set org_id = v_org, establishment_id = v_est, status = 'active',
        activated_at = now(), target_url = coalesce(target_url, v_google)
  where id = v_stand;

  insert into public.stand_audit (stand_id, action, detail)
  values (v_stand, 'activated', jsonb_build_object('via', 'self_service'));

  return coalesce((select status from public.subscriptions where stand_id = v_stand), 'inactive');
end;
$$;

-- 6. Same secret logic for the signed-in claim path.
create or replace function public.claim_stand(p_code text, p_establishment_id uuid, p_pin text default null)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_org uuid; v_stand uuid; v_status text; v_hash text; v_sv smallint; v_esturl text;
begin
  select o.id into v_org
  from public.establishments e
  join public.organizations o on o.id = e.org_id
  where e.id = p_establishment_id and o.owner_id = auth.uid();
  if v_org is null then raise exception 'establishment_not_owned'; end if;

  select id, status, claim_pin_hash, secret_version into v_stand, v_status, v_hash, v_sv
  from public.stands where code = p_code;
  if v_stand is null then raise exception 'stand_not_found'; end if;
  if v_status <> 'blank' then raise exception 'stand_already_assigned'; end if;

  if v_sv is not null then
    if p_pin is null or upper(trim(p_pin)) <> public.derive_stand_secret(p_code) then
      raise exception 'invalid_pin';
    end if;
  elsif v_hash is not null then
    if p_pin is null or extensions.crypt(p_pin, v_hash) <> v_hash then
      raise exception 'invalid_pin';
    end if;
  end if;

  select google_review_url into v_esturl from public.establishments where id = p_establishment_id;

  update public.stands
    set org_id = v_org, establishment_id = p_establishment_id, status = 'active',
        activated_at = now(), target_url = coalesce(target_url, v_esturl)
  where id = v_stand;

  insert into public.stand_audit (stand_id, action, detail)
  values (v_stand, 'activated', jsonb_build_object('via', 'dashboard_claim'));
end;
$$;
revoke execute on function public.claim_stand(text, uuid, text) from anon;
