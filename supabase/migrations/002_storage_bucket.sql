-- Run this alone in Supabase SQL Editor if uploads fail with "Bucket not found"
insert into storage.buckets (id, name, public)
values ('business-assets', 'business-assets', true)
on conflict (id) do nothing;

-- Policies (safe to re-run if you drop+recreate; skip if they already exist)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and policyname = 'business assets are publicly readable'
  ) then
    create policy "business assets are publicly readable"
      on storage.objects for select
      using (bucket_id = 'business-assets');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and policyname = 'owners can upload business assets'
  ) then
    create policy "owners can upload business assets"
      on storage.objects for insert
      with check (
        bucket_id = 'business-assets'
        and auth.role() = 'authenticated'
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and policyname = 'owners can update own business assets'
  ) then
    create policy "owners can update own business assets"
      on storage.objects for update
      using (
        bucket_id = 'business-assets'
        and auth.role() = 'authenticated'
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and policyname = 'owners can delete own business assets'
  ) then
    create policy "owners can delete own business assets"
      on storage.objects for delete
      using (
        bucket_id = 'business-assets'
        and auth.role() = 'authenticated'
      );
  end if;
end $$;
