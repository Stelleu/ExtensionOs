-- Faster public calendar: one RPC for a date range + index for booking lookups.
-- get_available_dates reuses get_available_slots via EXISTS so slot logic stays
-- in one place and cannot drift.

create or replace function public.get_available_dates(
  p_business_id uuid,
  p_service_id uuid,
  p_start_date date,
  p_end_date date
)
returns table (available_date date)
language plpgsql
stable
as $$
begin
  if p_end_date < p_start_date then
    return;
  end if;

  return query
  select g.d::date as available_date
  from generate_series(p_start_date, p_end_date, interval '1 day') as g(d)
  where extract(dow from g.d)::smallint in (
    select a.day_of_week
    from public.availability a
    where a.business_id = p_business_id
  )
  and exists (
    select 1
    from public.get_available_slots(p_business_id, p_service_id, g.d::date)
  )
  order by 1;
end;
$$;

comment on function public.get_available_dates(uuid, uuid, date, date) is
  'Returns dates in [p_start_date, p_end_date] that have at least one slot from get_available_slots. Working weekdays only.';

-- Partial composite index matching availability filters (excludes cancelled/no_show).
create index if not exists idx_bookings_business_date
  on public.bookings (business_id, appointment_date)
  where status not in ('cancelled', 'no_show');
