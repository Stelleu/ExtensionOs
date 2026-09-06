-- Service-role-only helper for scripts/verify-setup.ts.
-- information_schema / cron / storage.buckets are not exposed via PostgREST,
-- so the script calls this RPC with SUPABASE_SERVICE_ROLE_KEY.
--
-- Do not run verify:setup against a production database with real client data
-- unless you intentionally want to audit that environment.

create or replace function public.verify_setup_checks()
returns table (check_id text, ok boolean, detail text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_default text;
  v_data_type text;
  v_udt text;
  v_public boolean;
begin
  foreach check_id in array array[
    'businesses.minimum_booking_notice_hours',
    'businesses.cancellation_policy',
    'businesses.payment_link_url',
    'businesses.payment_confirmation_window_hours',
    'businesses.maintenance_reminder_days_before',
    'businesses.cancellation_cutoff_hours'
  ]
  loop
    ok := exists (
      select 1
      from information_schema.columns c
      where c.table_schema = 'public'
        and c.table_name = split_part(check_id, '.', 1)
        and c.column_name = split_part(check_id, '.', 2)
    );
    detail := case when ok then 'present' else 'missing column' end;
    return next;
  end loop;

  foreach check_id in array array[
    'bookings.confirmation_token',
    'bookings.confirmation_deadline',
    'bookings.stylist_notified_at',
    'bookings.cancelled_reason'
  ]
  loop
    ok := exists (
      select 1
      from information_schema.columns c
      where c.table_schema = 'public'
        and c.table_name = split_part(check_id, '.', 1)
        and c.column_name = split_part(check_id, '.', 2)
    );
    detail := case when ok then 'present' else 'missing column' end;
    return next;
  end loop;

  check_id := 'bookings.confirmation_token default (gen_random_uuid)';
  select c.column_default into v_default
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'bookings'
    and c.column_name = 'confirmation_token';
  ok := v_default is not null and v_default ilike '%gen_random_uuid%';
  detail := coalesce(v_default, 'null');
  return next;

  check_id := 'bookings.hair_texture is text';
  select c.data_type, c.udt_name into v_data_type, v_udt
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'bookings'
    and c.column_name = 'hair_texture';
  ok := v_data_type = 'text';
  detail := coalesce(v_data_type || '/' || v_udt, 'missing');
  return next;

  check_id := 'services.hair_addon_pricing';
  ok := exists (
    select 1 from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'services'
      and c.column_name = 'hair_addon_pricing'
  );
  detail := case when ok then 'present' else 'missing column' end;
  return next;

  check_id := 'clients.image_consent';
  ok := exists (
    select 1 from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'clients'
      and c.column_name = 'image_consent'
  );
  detail := case when ok then 'present' else 'missing column' end;
  return next;

  check_id := 'cron.job expire-pending-bookings';
  begin
    ok := exists (
      select 1 from cron.job j where j.jobname = 'expire-pending-bookings'
    );
    detail := case when ok then 'present' else 'missing job' end;
  exception
    when undefined_table then
      ok := false;
      detail := 'cron.job not available (pg_cron not installed?)';
    when insufficient_privilege then
      ok := false;
      detail := 'no privilege to read cron.job';
  end;
  return next;

  check_id := 'cron.job send-maintenance-reminders';
  begin
    ok := exists (
      select 1 from cron.job j where j.jobname = 'send-maintenance-reminders'
    );
    detail := case when ok then 'present' else 'missing job' end;
  exception
    when undefined_table then
      ok := false;
      detail := 'cron.job not available (pg_cron not installed?)';
    when insufficient_privilege then
      ok := false;
      detail := 'no privilege to read cron.job';
  end;
  return next;

  check_id := 'storage.buckets business-assets (public)';
  begin
    select b.public into v_public
    from storage.buckets b
    where b.id = 'business-assets' or b.name = 'business-assets'
    limit 1;
    ok := found and coalesce(v_public, false);
    detail := case
      when not found then 'bucket missing'
      when not coalesce(v_public, false) then 'bucket exists but not public'
      else 'public'
    end;
  exception
    when undefined_table then
      ok := false;
      detail := 'storage.buckets not available';
    when insufficient_privilege then
      ok := false;
      detail := 'no privilege to read storage.buckets';
  end;
  return next;
end;
$$;

revoke all on function public.verify_setup_checks() from public;
grant execute on function public.verify_setup_checks() to service_role;
