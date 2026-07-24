-- Perf RLS : éviter la réévaluation de auth.uid()/is_admin() pour chaque ligne
-- (lint auth_rls_initplan). On enveloppe les appels dans un sous-select pour
-- qu'ils soient évalués une seule fois par requête.
-- (Appliquée en production le 24/07/2026.)
drop policy if exists resellers_select_self on public.resellers;
create policy resellers_select_self on public.resellers
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
