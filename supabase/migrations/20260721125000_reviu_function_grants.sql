-- Reviu — Correct least-privilege EXECUTE grants.
--
-- Postgres grants EXECUTE to PUBLIC by default, and PUBLIC includes anon.
-- Revoking "from anon" alone leaves the PUBLIC grant in place, so anon could
-- still call the function. We must revoke from PUBLIC and grant back only the
-- roles that legitimately call each function.
--
-- Critical: feedback_notification_target returns a merchant's email and has no
-- internal guard — it must be reachable ONLY by the service role (server-side).

-- Internal / service-role only ---------------------------------------------
revoke all on function public.feedback_notification_target(uuid) from public, anon, authenticated;
grant execute on function public.feedback_notification_target(uuid) to service_role;

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- Signed-in only (admin checks remain internal via is_admin()) --------------
do $$
declare
  fn text;
  authed_fns text[] := array[
    'public.bind_account()',
    'public.claim_stand(text, uuid, text)',
    'public.owner_set_subscription(uuid, text)',
    'public.set_stand_target(uuid, text)',
    'public.is_admin()',
    'public.is_super_admin()',
    'public.my_stats()',
    'public.my_scan_counts()',
    'public.generate_stands(integer, text)',
    'public.admin_list_stands(integer)',
    'public.admin_list_stands_full(integer, text)',
    'public.admin_list_subscriptions()',
    'public.admin_set_subscription(uuid, text)',
    'public.admin_validate_batch(uuid)',
    'public.admin_mark_batch_exported(uuid)',
    'public.admin_batch_export_rows(uuid)',
    'public.admin_list_batches()',
    'public.admin_set_stand_status(uuid, text, text)',
    'public.admin_replace_stand(uuid, text, text)',
    'public.admin_list_audit(integer)',
    'public.admin_list_customers(text)',
    'public.admin_update_account(uuid, text, text, text)',
    'public.admin_set_account_disabled(uuid, boolean)',
    'public.admin_delete_account(uuid)',
    'public.admin_assign_stand(text, uuid)',
    'public.admin_transfer_stand(uuid, uuid)'
  ];
begin
  foreach fn in array authed_fns loop
    execute format('revoke all on function %s from public, anon', fn);
    execute format('grant execute on function %s to authenticated', fn);
  end loop;
end $$;

-- The public review journey stays anon-callable (guarded internally by design):
--   resolve_stand, record_scan, submit_feedback, activate_stand,
--   self_set_subscription — left untouched.
