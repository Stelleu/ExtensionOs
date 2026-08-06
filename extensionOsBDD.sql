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
  business_id uuid references businesses(id)
  on delete cascade,
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
  business_id uuid references businesses(id)
  on delete cascade,
  name text not null,
  phone text,
  email text,

  -- cheveux
  hair_length text,
  hair_texture text,
  hair_color text,
  health_notes text,                            -- e.g. "Psoriasis — avoid scalp pressure"

  
  visit_count int not null default 0,           -- loyalty: number of completed visits
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

create type hair_texture as enum ('straight', 'body wave', 'kinky curly','yaki', 'kinky');

create table bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete restrict,
  service_id uuid not null references services(id) on delete restrict,
  business_id uuid references businesses(id) on delete cascade,

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

create index idx_bookings_client on bookings(client_id);
create index idx_bookings_business on bookings(business_id);
create index idx_bookings_date on bookings(appointment_date);
create index idx_bookings_maintenance_due
  on bookings(maintenance_due_date)
  where maintenance_reminder_sent = false;

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