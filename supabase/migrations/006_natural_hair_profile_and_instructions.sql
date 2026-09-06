-- Sync columns already applied in Supabase (safe to re-run).

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS natural_hair_profile jsonb;

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS prep_instructions text not null default 'Please arrive with clean, dry hair. Avoid heavy oils or styling products on the day of your appointment. Bring any inspiration photos you would like to share with your stylist.',
  ADD COLUMN IF NOT EXISTS care_instructions text not null default 'Avoid oil-based products at the bonds, sleep with hair in a loose braid, and book maintenance every 6–8 weeks for best results.';
