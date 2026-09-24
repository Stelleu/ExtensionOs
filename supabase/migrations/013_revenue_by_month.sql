-- Monthly revenue aggregates for the authenticated stylist's own business.
-- Counts deposit_paid bookings in confirmed/completed only, by appointment_date month.

create or replace function public.get_revenue_by_month(
  p_business_id uuid,
  p_months integer default 6
)
returns table (
  month_start date,
  deposits_collected numeric,
  service_value numeric,
  booking_count bigint
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_months integer := coalesce(p_months, 6);
  v_start date;
begin
  if v_months < 1 then
    v_months := 1;
  elsif v_months > 24 then
    v_months := 24;
  end if;

  if auth.uid() is null then
    raise exception 'not authorized';
  end if;

  if not exists (
    select 1
    from public.businesses b
    where b.id = p_business_id
      and b.owner_id = auth.uid()
  ) then
    raise exception 'not authorized';
  end if;

  v_start := (
    date_trunc('month', (current_date)::timestamp)
    - ((v_months - 1) * interval '1 month')
  )::date;

  return query
  with months as (
    select gs::date as month_start
    from generate_series(
      v_start::timestamp,
      date_trunc('month', (current_date)::timestamp),
      interval '1 month'
    ) as gs
  ),
  agg as (
    select
      date_trunc('month', b.appointment_date::timestamp)::date as month_start,
      coalesce(sum(b.deposit_amount), 0) as deposits_collected,
      coalesce(sum(b.total_price), 0) as service_value,
      count(*)::bigint as booking_count
    from public.bookings b
    where b.business_id = p_business_id
      and b.deposit_paid = true
      and b.status in ('confirmed', 'completed')
      and b.appointment_date >= v_start
      and b.appointment_date < (
        date_trunc('month', (current_date)::timestamp) + interval '1 month'
      )::date
    group by 1
  )
  select
    m.month_start,
    coalesce(a.deposits_collected, 0)::numeric,
    coalesce(a.service_value, 0)::numeric,
    coalesce(a.booking_count, 0)::bigint
  from months m
  left join agg a on a.month_start = m.month_start
  order by m.month_start;
end;
$$;

revoke all on function public.get_revenue_by_month(uuid, integer) from public;
grant execute on function public.get_revenue_by_month(uuid, integer) to authenticated;

comment on function public.get_revenue_by_month(uuid, integer) is
  'Monthly deposits collected + service value for the caller-owned business. Actuals only; no forecasts.';
