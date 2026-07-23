-- Emailing d'abonnement : liste des commerçants ayant des présentoirs mais
-- aucun abonnement de suivi actif (cible des relances). Admin uniquement.
-- (Appliquée en production le 23/07/2026.)
create or replace function public.admin_unsubscribed_contacts()
returns table(org_id uuid, org_name text, email text, full_name text,
              stand_count integer)
language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
    select o.id, o.name,
           coalesce(cu.email, au.email) as email,
           coalesce(cu.full_name, pr.full_name) as full_name,
           (select count(*)::int from public.stands s where s.org_id = o.id)
    from public.organizations o
    left join public.customers cu on cu.id = o.customer_id
    left join auth.users au on au.id = o.owner_id
    left join public.profiles pr on pr.id = o.owner_id
    where not o.disabled
      and coalesce(cu.email, au.email) is not null
      and exists (select 1 from public.stands s where s.org_id = o.id)
      and not exists (
        select 1 from public.stands s
        join public.subscriptions sub on sub.stand_id = s.id
        where s.org_id = o.id and sub.status in ('active','trialing')
      )
    order by o.created_at desc;
end; $$;

grant execute on function public.admin_unsubscribed_contacts() to authenticated;
