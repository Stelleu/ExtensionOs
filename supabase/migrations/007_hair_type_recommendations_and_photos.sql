-- Natural hair recommendations + stylist hair-type photo overrides
-- Columns already live in some environments; IF NOT EXISTS keeps this idempotent.

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS hair_type_recommendations jsonb not null default '{}'::jsonb;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS hair_type_photos jsonb not null default '{}'::jsonb;
