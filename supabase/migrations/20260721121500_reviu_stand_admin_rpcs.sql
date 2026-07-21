-- Reviu — Admin RPCs for batch lifecycle, stand status, replacement, listings.
-- All are SECURITY DEFINER and guarded by is_admin(); every sensitive mutation
-- is recorded in stand_audit.

-- Validate a draft batch: locks it against deletion/modification of its stands.
create or replace function public.admin_validate_batch(p_batch uuid)
returns void language plpgsql security definer set search_path to 'public' as $$
declare v_actor uuid := auth.uid(); v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  update public.stand_batches set status = 'validated', validated_at = now()
  where id = p_batch and status = 'draft';
  if not found then raise exception 'batch_not_draft'; end if;
  insert into public.stand_audit (batch_id, action, actor, actor_email)
  values (p_batch, 'batch_validated', v_actor, v_email);
end; $$;

-- Mark a batch exported (idempotent): permanently locks it. Called by the
-- supplier export route once the file is produced.
create or replace function public.admin_mark_batch_exported(p_batch uuid)
returns void language plpgsql security definer set search_path to 'public' as $$
declare v_actor uuid := auth.uid(); v_email text := lower(coalesce(auth.jwt() ->> 'email','')); v_prev text;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  select status into v_prev from public.stand_batches where id = p_batch;
  if v_prev is null then raise exception 'batch_not_found'; end if;
  if v_prev <> 'exported' then
    update public.stand_batches
      set status = 'exported', exported_at = now(), exported_by = v_actor,
          validated_at = coalesce(validated_at, now())
    where id = p_batch;
    insert into public.stand_audit (batch_id, action, actor, actor_email)
    values (p_batch, 'batch_exported', v_actor, v_email);
  end if;
end; $$;

-- Rows for the supplier Excel file (includes the derived activation secret).
create or replace function public.admin_batch_export_rows(p_batch uuid)
returns table(code text, status text, secret text, label text, created_at timestamptz)
language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select s.code, s.status, public.derive_stand_secret(s.code), s.label, s.created_at
    from public.stands s
    where s.batch_id = p_batch
    order by s.created_at, s.code;
end; $$;

-- List batches with live activation counts.
create or replace function public.admin_list_batches()
returns table(id uuid, label text, status text, quantity integer,
              created_at timestamptz, validated_at timestamptz, exported_at timestamptz,
              activated integer)
language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select b.id, b.label, b.status, b.quantity, b.created_at, b.validated_at, b.exported_at,
           (select count(*)::int from public.stands s where s.batch_id = b.id and s.status = 'active')
    from public.stand_batches b
    order by b.created_at desc;
end; $$;

-- Change a stand's lifecycle status (defective / lost / suspended / disabled /
-- retired / reactivate). Never allows reverting to 'blank' (no recycling).
create or replace function public.admin_set_stand_status(p_stand uuid, p_status text, p_note text default null)
returns void language plpgsql security definer set search_path to 'public' as $$
declare v_old text; v_est uuid; v_actor uuid := auth.uid(); v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if p_status not in ('active','disabled','suspended','defective','lost','retired') then
    raise exception 'invalid_status';
  end if;
  select status, establishment_id into v_old, v_est from public.stands where id = p_stand;
  if v_old is null then raise exception 'stand_not_found'; end if;
  if v_old = 'replaced' then raise exception 'stand_replaced'; end if;
  if p_status = 'active' and v_est is null then raise exception 'stand_not_activated'; end if;

  update public.stands
    set status = p_status, status_note = nullif(trim(p_note),''), status_changed_at = now()
  where id = p_stand;

  insert into public.stand_audit (stand_id, action, detail, actor, actor_email)
  values (p_stand, 'status_changed',
          jsonb_build_object('from', v_old, 'to', p_status, 'note', nullif(trim(p_note),'')),
          v_actor, v_email);
end; $$;

-- Replace a faulty/lost stand: transfer its assignment (org, establishment,
-- target, subscription) to a NEW blank stand, activate the new one, mark the
-- old as 'replaced'. The old public identifier is retired but never reused.
create or replace function public.admin_replace_stand(p_old uuid, p_new_code text, p_reason text default null)
returns text language plpgsql security definer set search_path to 'public' as $$
declare v_old record; v_new record; v_actor uuid := auth.uid(); v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  select * into v_old from public.stands where id = p_old;
  if v_old is null then raise exception 'stand_not_found'; end if;
  if v_old.establishment_id is null then raise exception 'stand_not_activated'; end if;
  select * into v_new from public.stands where code = lower(trim(p_new_code));
  if v_new is null then raise exception 'new_stand_not_found'; end if;
  if v_new.status <> 'blank' then raise exception 'new_stand_not_blank'; end if;

  update public.stands
    set org_id = v_old.org_id, establishment_id = v_old.establishment_id,
        status = 'active', activated_at = now(), target_url = v_old.target_url
  where id = v_new.id;

  update public.subscriptions set stand_id = v_new.id where stand_id = p_old;

  update public.stands
    set status = 'replaced', replaced_by = v_new.id,
        status_note = nullif(trim(p_reason),''), status_changed_at = now()
  where id = p_old;

  insert into public.stand_audit (stand_id, action, detail, actor, actor_email)
  values (p_old, 'replaced',
          jsonb_build_object('new_stand', v_new.id, 'new_code', v_new.code, 'reason', nullif(trim(p_reason),'')),
          v_actor, v_email);
  return v_new.code;
end; $$;

-- Recent audit trail for the admin history view.
create or replace function public.admin_list_audit(p_limit integer default 200)
returns table(id bigint, stand_id uuid, code text, batch_id uuid, action text,
              detail jsonb, actor_email text, created_at timestamptz)
language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select a.id, a.stand_id, s.code, a.batch_id, a.action, a.detail, a.actor_email, a.created_at
    from public.stand_audit a
    left join public.stands s on s.id = a.stand_id
    order by a.created_at desc
    limit greatest(1, least(p_limit, 1000));
end; $$;

-- Restrict the new admin RPCs to signed-in users (admin check is internal).
revoke execute on function public.admin_validate_batch(uuid) from anon;
revoke execute on function public.admin_mark_batch_exported(uuid) from anon;
revoke execute on function public.admin_batch_export_rows(uuid) from anon;
revoke execute on function public.admin_list_batches() from anon;
revoke execute on function public.admin_set_stand_status(uuid, text, text) from anon;
revoke execute on function public.admin_replace_stand(uuid, text, text) from anon;
revoke execute on function public.admin_list_audit(integer) from anon;
