-- Reviu - Detailed stand listing for the admin console (assignment + status).
create or replace function public.admin_list_stands_full(p_limit integer default 500, p_search text default null)
returns table(
  id uuid, code text, status text, batch_label text,
  org_id uuid, establishment_id uuid, establishment_name text, owner_email text,
  target_url text, activated_at timestamptz, status_note text,
  created_at timestamptz, sub_status text
)
language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select s.id, s.code, s.status, b.label,
           s.org_id, s.establishment_id, e.name,
           coalesce(cu.email, au.email),
           s.target_url, s.activated_at, s.status_note, s.created_at, sub.status
    from public.stands s
    left join public.stand_batches b on b.id = s.batch_id
    left join public.establishments e on e.id = s.establishment_id
    left join public.organizations o on o.id = s.org_id
    left join public.customers cu on cu.id = o.customer_id
    left join auth.users au on au.id = o.owner_id
    left join public.subscriptions sub on sub.stand_id = s.id
    where p_search is null
       or s.code ilike '%' || p_search || '%'
       or e.name ilike '%' || p_search || '%'
    order by s.created_at desc
    limit greatest(1, least(p_limit, 2000));
end; $$;

revoke execute on function public.admin_list_stands_full(integer, text) from anon;
