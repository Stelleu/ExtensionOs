-- Columns applied via SQL Editor during development. Safe to re-run
-- against a database that already has some or all of them.

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS minimum_booking_notice_hours integer not null default 24,
  ADD COLUMN IF NOT EXISTS cancellation_policy text not null default 'Deposits are required to secure your appointment. Deposits are non-refundable in case of late cancellation or no-show.',
  ADD COLUMN IF NOT EXISTS payment_link_url text,
  ADD COLUMN IF NOT EXISTS payment_confirmation_window_hours integer not null default 4,
  ADD COLUMN IF NOT EXISTS maintenance_reminder_days_before integer not null default 3,
  ADD COLUMN IF NOT EXISTS cancellation_cutoff_hours integer not null default 24;

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS hair_addon_pricing jsonb not null default '[]'::jsonb;

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS image_consent boolean not null default false;

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS cancelled_reason text,
  ADD COLUMN IF NOT EXISTS confirmation_token uuid not null default gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS confirmation_deadline timestamptz,
  ADD COLUMN IF NOT EXISTS stylist_notified_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_confirmation_token
  ON bookings (confirmation_token);
