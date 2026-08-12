-- ============================================================
-- ExtensionOS — Core booking schema (v1, multi-salon)
-- ============================================================
-- Scope on purpose: businesses, services, clients, bookings.
-- Everything else (staff accounts beyond a single owner, SMS
-- provider, payment provider details) is deliberately left out
-- so this is buildable in one pass and customizable later.

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- BUSINESSES
-- ------------------------------------------------------------
-- One row per salon/stylist. owner_id ties it to a Supabase Auth
-- user so RLS can scope every other table to "my salon only".
create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  slug text unique not null,            -- matches SalonProfile.slug / [slug] route
  tagline text,
  bio text,
  logo_url text,
  hero_image_url text,
  template_id text default 'luxury-black-gold',
  instagram text,
  email text,
  phone text,
  location text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SERVICES
-- ------------------------------------------------------------
create table services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,                          -- "Tape-In Extensions"
  base_price numeric(10,2) not null,            -- price without hair addon
  deposit_amount numeric(10,2) not null,
  duration_minutes int not null default 120,
  requires_hair_addon boolean not null default false, -- ask "do you need hair?"
  is_extension_service boolean not null default true, -- eligible for 6-week reminder
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- CLIENTS
-- ------------------------------------------------------------
create table clients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  visit_count int not null default 0,           -- loyalty: number of completed visits
  health_notes text,                            -- e.g. "Psoriasis — avoid scalp pressure"
  health_notes_consent boolean not null default false, -- explicit opt-in to store this
  created_at timestamptz not null default now()
);

comment on column clients.health_notes is
  'Special-category data under UK GDPR. Only store with health_notes_consent = true. Never include in bulk exports or notifications.';

-- ------------------------------------------------------------
-- BOOKINGS
-- ------------------------------------------------------------
create type booking_status as enum (
  'pending_payment',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

create type hair_texture as enum ('straight', 'body-wavy', 'kinky-curly', 'yaki', 'kinky');

create table bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  client_id uuid not null references clients(id) on delete restrict,
  service_id uuid not null references services(id) on delete restrict,

  appointment_date date not null,
  appointment_time time not null,

  -- hair addon (only relevant if services.requires_hair_addon)
  wants_hair_addon boolean not null default false,
  hair_length text,                             -- '14"', '18"', '22"', '26"'
  hair_texture hair_texture,
  hair_addon_price numeric(10,2) not null default 0,

  -- price snapshot at time of booking (service prices can change later
  -- without retroactively altering past bookings)
  service_price numeric(10,2) not null,
  total_price numeric(10,2) not null,
  deposit_amount numeric(10,2) not null,
  deposit_paid boolean not null default false,
  stripe_payment_intent_id text,

  status booking_status not null default 'pending_payment',

  -- maintenance retention loop
  maintenance_due_date date,
  maintenance_reminder_sent boolean not null default false,

  created_at timestamptz not null default now()
);

create index idx_bookings_business on bookings(business_id);
create index idx_bookings_client on bookings(client_id);
create index idx_bookings_date on bookings(appointment_date);
create index idx_bookings_maintenance_due
  on bookings(maintenance_due_date)
  where maintenance_reminder_sent = false;

-- ------------------------------------------------------------
-- AVAILABILITY
-- ------------------------------------------------------------
-- Recurring weekly hours, e.g. "Monday 09:00–17:00".
-- A day can have more than one row (e.g. split shift 09:00–12:00
-- and 14:00–18:00) — just insert two rows for the same day_of_week.
create table availability (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0 = Sunday
  start_time time not null,
  end_time time not null,
  check (start_time < end_time)
);

create index idx_availability_business on availability(business_id, day_of_week);

-- ------------------------------------------------------------
-- BLOCKED TIMES
-- ------------------------------------------------------------
-- One-off exceptions: holidays, appointments off-system, etc.
-- Leave start_time/end_time null to block the whole day
-- (e.g. "15 August — Holiday"); set both to block just part of it
-- (e.g. "15 August, 12:00–13:00 — Lunch").
create table blocked_times (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  date date not null,
  start_time time,
  end_time time,
  reason text,
  check (
    (start_time is null and end_time is null)
    or (start_time is not null and end_time is not null and start_time < end_time)
  )
);

create index idx_blocked_times_business on blocked_times(business_id, date);

-- ------------------------------------------------------------
-- FUNCTION: available slots for a given business/service/date
-- ------------------------------------------------------------
-- Generates 30-minute candidate start times inside the salon's
-- opening hours for that weekday, then removes anything that:
--   a) doesn't leave enough room before closing for the service's
--      full duration,
--   b) overlaps an existing non-cancelled booking, or
--   c) falls inside a blocked_times entry (full day or partial).
-- Call from a server action / API route, e.g.:
--   select * from get_available_slots(
--     '<business_id>', '<service_id>', '2026-08-14'
--   );
create or replace function get_available_slots(
  p_business_id uuid,
  p_service_id uuid,
  p_date date
)
returns table (slot_time time) as $$
declare
  v_duration int;
  v_day_of_week smallint;
begin
  select duration_minutes into v_duration from services where id = p_service_id;
  v_day_of_week := extract(dow from p_date);

  -- whole day blocked -> no slots at all
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
    -- doesn't collide with an existing confirmed/pending booking
    not exists (
      select 1 from bookings b
      where b.business_id = p_business_id
        and b.appointment_date = p_date
        and b.status not in ('cancelled', 'no_show')
        and (c.candidate, c.candidate + (v_duration * interval '1 minute'))
          overlaps (b.appointment_time, b.appointment_time + (
            (select duration_minutes from services where id = b.service_id) * interval '1 minute'
          ))
    )
    -- doesn't collide with a partial-day block
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
$$ language plpgsql stable;

-- ------------------------------------------------------------
-- AUTOMATION: on completion, bump loyalty + schedule reminder
-- ------------------------------------------------------------
create or replace function handle_booking_completed()
returns trigger as $$
declare
  v_is_extension boolean;
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then

    update clients
      set visit_count = visit_count + 1
      where id = new.client_id;

    select is_extension_service into v_is_extension
      from services where id = new.service_id;

    if v_is_extension then
      new.maintenance_due_date := new.appointment_date + interval '42 days';
    end if;

  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_booking_completed
  before update on bookings
  for each row
  execute function handle_booking_completed();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table businesses enable row level security;
alter table services enable row level security;
alter table availability enable row level security;
alter table blocked_times enable row level security;
alter table clients enable row level security;
alter table bookings enable row level security;

-- Businesses: a stylist can read/update only her own salon row.
-- Public (anon) can read business profiles by slug — needed to
-- render the public booking page at /[slug].
create policy "business profile readable by anyone"
  on businesses for select
  using (true);

create policy "owner can update own business"
  on businesses for update
  using (owner_id = auth.uid());

-- Services: public can read active services for a given salon
-- (needed for the booking form on the public page).
create policy "services readable by anyone"
  on services for select
  using (active = true);

create policy "owner can manage own services"
  on services for all
  using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

-- Availability & blocked times: public needs to read them to compute
-- bookable slots on the public page, but only the owner can edit them.
create policy "availability readable by anyone"
  on availability for select
  using (true);

create policy "owner can manage own availability"
  on availability for all
  using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

create policy "blocked times readable by anyone"
  on blocked_times for select
  using (true);

create policy "owner can manage own blocked times"
  on blocked_times for all
  using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

-- Clients & bookings: NOT open to the anon key.
-- Client-facing booking submissions should go through a server-side
-- route (Next.js Server Action or API route using the service role key),
-- never a direct anon insert — this table holds health data and contact info.
create policy "owner can read own clients"
  on clients for select
  using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

create policy "owner can read own bookings"
  on bookings for select
  using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

-- Inserts/updates on clients & bookings: service_role only (i.e. your
-- server-side code), not exposed directly to the browser.
-- ------------------------------------------------------------
-- MIGRATION: consultation_form_schema + owner insert + storage
-- ------------------------------------------------------------
-- Appended for HairBoss SaaS wiring. Does not duplicate RLS policies.

alter table services
  add column if not exists consultation_form_schema jsonb;

-- Required for onboarding: authenticated owners must create their business row.
create policy "owner can insert own business"
  on businesses for insert
  with check (owner_id = auth.uid());

-- Owner may update booking status (completed / no_show / cancelled) from dashboard.
-- Inserts of bookings/clients remain service-role-only (no insert policies for authenticated).
create policy "owner can update own bookings"
  on bookings for update
  using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

create policy "owner can update own clients"
  on clients for update
  using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

create policy "owner can delete own clients"
  on clients for delete
  using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

-- Storage bucket for logos / hero images
insert into storage.buckets (id, name, public)
values ('business-assets', 'business-assets', true)
on conflict (id) do nothing;

create policy "business assets are publicly readable"
  on storage.objects for select
  using (bucket_id = 'business-assets');

create policy "owners can upload business assets"
  on storage.objects for insert
  with check (
    bucket_id = 'business-assets'
    and auth.role() = 'authenticated'
  );

create policy "owners can update own business assets"
  on storage.objects for update
  using (
    bucket_id = 'business-assets'
    and auth.role() = 'authenticated'
  );

create policy "owners can delete own business assets"
  on storage.objects for delete
  using (
    bucket_id = 'business-assets'
    and auth.role() = 'authenticated'
  );
