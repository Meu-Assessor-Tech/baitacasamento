
-- Recreate view with security_invoker=on
DROP VIEW IF EXISTS public.wedding_sites_public;

-- Restore public SELECT on wedding_sites (needed for the view + child policies)
DROP POLICY IF EXISTS "Owner can view own site" ON public.wedding_sites;
CREATE POLICY "Anyone can view published sites"
  ON public.wedding_sites FOR SELECT
  USING (is_published = true OR owner_id = auth.uid());

-- Block pix_key column for non-owners (column-level grant)
REVOKE SELECT (pix_key) ON public.wedding_sites FROM anon, authenticated;

-- Recreate the view as security_invoker (now safe because anon can SELECT
-- everything except pix_key on the underlying table)
CREATE VIEW public.wedding_sites_public
WITH (security_invoker = on) AS
SELECT id, owner_id, slug, bride_name, groom_name, wedding_date, location,
       story, welcome_message, hero_image_url, is_published, created_at, updated_at
FROM public.wedding_sites
WHERE is_published = true;

GRANT SELECT ON public.wedding_sites_public TO anon, authenticated;

-- Owner-only RPC to read their own PIX key
CREATE OR REPLACE FUNCTION public.get_my_site_pix(_site_id uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT pix_key FROM public.wedding_sites
  WHERE id = _site_id AND owner_id = auth.uid()
  LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.get_my_site_pix(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_site_pix(uuid) TO authenticated;

-- Owner-only RPC to update their own PIX key
CREATE OR REPLACE FUNCTION public.set_my_site_pix(_site_id uuid, _pix text)
RETURNS void
LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = public
AS $$
  UPDATE public.wedding_sites SET pix_key = _pix
  WHERE id = _site_id AND owner_id = auth.uid()
$$;
REVOKE EXECUTE ON FUNCTION public.set_my_site_pix(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_my_site_pix(uuid, text) TO authenticated;

-- Tighten storage policy: only owners list their own files.
-- Public bucket URLs (/object/public/...) still serve files to guests.
DROP POLICY IF EXISTS "Public read wedding-media objects" ON storage.objects;
CREATE POLICY "Owners list own wedding-media"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'wedding-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
