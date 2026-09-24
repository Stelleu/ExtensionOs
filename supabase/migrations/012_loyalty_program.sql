-- Simple visit-milestone loyalty (informational only; no auto pricing).
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS loyalty_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS loyalty_visits_required integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS loyalty_discount_percent integer NOT NULL DEFAULT 10;

ALTER TABLE public.businesses
  DROP CONSTRAINT IF EXISTS businesses_loyalty_visits_required_check;

ALTER TABLE public.businesses
  ADD CONSTRAINT businesses_loyalty_visits_required_check
  CHECK (loyalty_visits_required BETWEEN 2 AND 50);

ALTER TABLE public.businesses
  DROP CONSTRAINT IF EXISTS businesses_loyalty_discount_percent_check;

ALTER TABLE public.businesses
  ADD CONSTRAINT businesses_loyalty_discount_percent_check
  CHECK (loyalty_discount_percent BETWEEN 5 AND 50);

COMMENT ON COLUMN public.businesses.loyalty_enabled IS
  'When true, show visit-milestone progress to stylists and a quiet note on the public page. Does not change prices.';
