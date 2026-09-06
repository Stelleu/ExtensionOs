-- Live DB already stores bookings.hair_texture as text.
-- 001 still created a Postgres enum; convert if this migration runs on a
-- database that still has the enum type.

ALTER TABLE bookings
  ALTER COLUMN hair_texture TYPE text USING hair_texture::text;

DROP TYPE IF EXISTS hair_texture;
