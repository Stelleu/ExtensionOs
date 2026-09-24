-- Part A: stylist confirmation reminder flag
-- Part B: configurable gap between appointments + get_available_slots update
-- Cron: notify-stylist-reminder every 15 minutes

alter table public.bookings
  add column if not exists reminder_sent boolean not null default false;

alter table public.businesses
  add column if not exists booking_buffer_minutes integer not null default 30;

comment on column public.bookings.reminder_sent is
  'True after notify-stylist-reminder has sent the mid-window deposit confirmation nudge.';

comment on column public.businesses.booking_buffer_minutes is
  'Trailing minutes after each booking during which no new booking may start.';

-- Recreate get_available_slots with trailing buffer on existing bookings.
-- Keeps minimum notice, blocked times, and cancelled/no_show exclusion unchanged.
create or replace function public.get_available_slots(
  p_business_id uuid,
  p_service_id uuid,
  p_date date
)
returns table (slot_time time without time zone)
language plpgsql
stable
as $$
declare
  v_duration int;
  v_day_of_week smallint;
  v_notice_hours int;
  v_buffer_minutes int;
  v_earliest_allowed timestamptz;
begin
  select duration_minutes into v_duration from services where id = p_service_id;
  select minimum_booking_notice_hours, booking_buffer_minutes
    into v_notice_hours, v_buffer_minutes
    from businesses where id = p_business_id;

  v_day_of_week := extract(dow from p_date);
  v_earliest_allowed := now() + (coalesce(v_notice_hours, 0) * interval '1 hour');
  v_buffer_minutes := coalesce(v_buffer_minutes, 0);

  if exists (
    select 1 from blocked_times
    where business_id = p_business_id
      and date = p_date
      and start_time is null
  ) then
    return;
  end if;

  return query
  with windows as (
    select start_time, end_time
    from availability
    where business_id = p_business_id
      and day_of_week = v_day_of_week
  ),
  candidates as (
    select (w.start_time + (n * interval '30 minutes'))::time as candidate
    from windows w,
      generate_series(
        0,
        floor(
          (extract(epoch from (w.end_time - w.start_time)) / 60 - v_duration) / 30
        )::int
      ) as n
  )
  select c.candidate
  from candidates c
  where
    -- minimum booking notice
    (p_date + c.candidate)::timestamptz >= v_earliest_allowed
    -- no overlap with existing booking + trailing buffer
    and not exists (
      select 1 from bookings b
      where b.business_id = p_business_id
        and b.appointment_date = p_date
        and b.status not in ('cancelled', 'no_show')
        and (c.candidate, c.candidate + (v_duration * interval '1 minute'))
          overlaps (
            b.appointment_time,
            b.appointment_time + (
              (
                (select duration_minutes from services where id = b.service_id)
                + v_buffer_minutes
              ) * interval '1 minute'
            )
          )
    )
    -- no overlap with partial-day block
    and not exists (
      select 1 from blocked_times bt
      where bt.business_id = p_business_id
        and bt.date = p_date
        and bt.start_time is not null
        and (c.candidate, c.candidate + (v_duration * interval '1 minute'))
          overlaps (bt.start_time, bt.end_time)
    )
  order by c.candidate;
end;
$$;

-- Schedule reminder Edge Function every 15 minutes.
-- Reuses Authorization headers from the existing send-maintenance-reminders job
-- so the service secret is not hardcoded in this migration file.
do $$
declare
  v_headers jsonb;
  v_url text := 'https://gvmfmgfdsexzdppjdvcn.supabase.co/functions/v1/notify-stylist-reminder';
  v_existing_id bigint;
begin
  select j.jobid into v_existing_id
  from cron.job j
  where j.jobname = 'notify-stylist-reminder';

  if v_existing_id is not null then
    perform cron.unschedule(v_existing_id);
  end if;

  select (
    regexp_match(
      j.command,
      'headers := ''(\{.*?\})''::jsonb'
    )
  )[1]::jsonb
  into v_headers
  from cron.job j
  where j.jobname = 'send-maintenance-reminders';

  if v_headers is null then
    raise notice 'Skipping notify-stylist-reminder cron: could not copy auth headers from send-maintenance-reminders';
    return;
  end if;

  perform cron.schedule(
    'notify-stylist-reminder',
    '*/15 * * * *',
    format(
      $cmd$
      select net.http_post(
        url := %L,
        headers := %L::jsonb,
        body := '{}'::jsonb
      );
      $cmd$,
      v_url,
      v_headers::text
    )
  );
end;
$$;
