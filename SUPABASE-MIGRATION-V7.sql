-- BAYLOS V7: OPTIONAL/RECOMMENDED migration for 1-4 product images.
-- This does NOT create a new Supabase project and does NOT delete existing data.
-- Run once in Supabase SQL Editor.

alter table public.products
  add column if not exists image_urls jsonb;

-- Existing image_url remains the primary/backward-compatible image.
update public.products
set image_urls = jsonb_build_array(image_url)
where image_urls is null and image_url is not null;

-- Storage bucket used by the admin uploader. If your existing bucket already
-- exists, the insert below simply does nothing.
insert into storage.buckets (id, name, public)
values ('product-images','product-images',true)
on conflict (id) do nothing;

-- Public read for product images. Upload/update/delete should be protected by
-- your existing Supabase auth/RLS policies; do not put service_role in GitHub.
create policy if not exists "Baylos product images public read"
on storage.objects for select
using (bucket_id = 'product-images');

-- Authenticated admin uploads. If your project already has stricter storage
-- policies, keep those instead of duplicating policies.
create policy if not exists "Baylos product images authenticated insert"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images');

create policy if not exists "Baylos product images authenticated update"
on storage.objects for update to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

create policy if not exists "Baylos product images authenticated delete"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images');
