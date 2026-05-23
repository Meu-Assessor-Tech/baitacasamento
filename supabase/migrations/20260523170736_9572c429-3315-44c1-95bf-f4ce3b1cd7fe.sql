
create or replace function public.touch_updated_at()
returns trigger language plpgsql
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

-- Replace broad public read with object-level reads only (no listing)
drop policy if exists "Public read wedding-media" on storage.objects;
create policy "Public read wedding-media objects"
on storage.objects for select
using (bucket_id = 'wedding-media' and auth.role() = 'anon' is not null);
