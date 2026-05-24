
-- 1. Helper: is a site accessible (published or owned)?
CREATE OR REPLACE FUNCTION public.site_is_accessible(_site_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.wedding_sites
    WHERE id = _site_id AND (is_published = true OR owner_id = auth.uid())
  )
$$;

-- 2. Public view without pix_key
CREATE OR REPLACE VIEW public.wedding_sites_public
WITH (security_invoker = off) AS
SELECT id, owner_id, slug, bride_name, groom_name, wedding_date, location,
       story, welcome_message, hero_image_url, is_published, created_at, updated_at
FROM public.wedding_sites
WHERE is_published = true;

GRANT SELECT ON public.wedding_sites_public TO anon, authenticated;

-- 3. RPC to fetch pix_key per slug (one-at-a-time, no bulk harvest)
CREATE OR REPLACE FUNCTION public.get_site_pix(_slug text)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT pix_key FROM public.wedding_sites
  WHERE slug = _slug AND is_published = true
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.get_site_pix(text) TO anon, authenticated;

-- 4. Tighten wedding_sites SELECT to owner only
DROP POLICY IF EXISTS "Anyone can view published sites" ON public.wedding_sites;
CREATE POLICY "Owner can view own site"
  ON public.wedding_sites FOR SELECT
  USING (auth.uid() = owner_id);

-- 5. Replace child-table visibility policies with the definer function
DROP POLICY IF EXISTS "Gift items visible if site visible" ON public.gift_items;
CREATE POLICY "Gift items visible if site visible"
  ON public.gift_items FOR SELECT
  USING (public.site_is_accessible(site_id));

DROP POLICY IF EXISTS "Photos visible if site visible" ON public.site_photos;
CREATE POLICY "Photos visible if site visible"
  ON public.site_photos FOR SELECT
  USING (public.site_is_accessible(site_id));

-- 6. Fix the broken storage read policy on wedding-media
DROP POLICY IF EXISTS "Public read wedding-media objects" ON storage.objects;
CREATE POLICY "Public read wedding-media objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-media');
