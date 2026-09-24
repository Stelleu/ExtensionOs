-- Public page gallery photo URLs managed from dashboard settings.
alter table public.businesses
  add column if not exists gallery_urls jsonb not null default '[]'::jsonb;

comment on column public.businesses.gallery_urls is
  'Ordered list of public gallery image URLs for the salon page.';
