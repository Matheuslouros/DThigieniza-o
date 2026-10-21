-- D&T Higienização: painel de fotos e vídeos
-- Execute no SQL Editor do MESMO projeto Supabase que contém o bucket dt-media.
-- Confirme antes que o UID abaixo é o administrador correto (Authentication > Users).
-- Esta migração substitui as antigas policies "DT admin ..." do bucket por regras restritas.
BEGIN;

CREATE TABLE IF NOT EXISTS public.site_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.site_admins ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.site_admins TO authenticated;

DROP POLICY IF EXISTS "dt_site_admin_self_select" ON public.site_admins;
CREATE POLICY "dt_site_admin_self_select"
ON public.site_admins FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

-- UID da conta criada em Authentication > Users (confirmado em captura da tela).
INSERT INTO public.site_admins (user_id)
VALUES ('78268e19-c3f6-46fa-935d-bc16551e084d'::uuid)
ON CONFLICT (user_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.site_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 120),
  kind text NOT NULL CHECK (kind IN ('image', 'video')),
  storage_path text NOT NULL UNIQUE CHECK (storage_path LIKE 'site-gallery/%'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.site_media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_media TO authenticated;

DROP POLICY IF EXISTS "dt_media_public_list" ON public.site_media;
DROP POLICY IF EXISTS "dt_media_admin_insert" ON public.site_media;
DROP POLICY IF EXISTS "dt_media_admin_edit" ON public.site_media;
DROP POLICY IF EXISTS "dt_media_admin_delete" ON public.site_media;

CREATE POLICY "dt_media_public_list" ON public.site_media
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "dt_media_admin_insert" ON public.site_media
FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.site_admins WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "dt_media_admin_edit" ON public.site_media
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.site_admins WHERE user_id = (SELECT auth.uid())))
WITH CHECK (EXISTS (SELECT 1 FROM public.site_admins WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "dt_media_admin_delete" ON public.site_media
FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.site_admins WHERE user_id = (SELECT auth.uid())));

-- Bucket público para leitura de fotos/vídeos; não permite upload público.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'dt-media' AND public = true)
  THEN
    RAISE EXCEPTION 'Bucket dt-media público não encontrado. Confira Storage > Files.';
  END IF;
END
$$;

-- Remover as três políticas antigas cujo nome começa com "DT admin".
-- IMPORTANTE: confira em Storage > Policies caso outras políticas tenham sido adicionadas.
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname LIKE 'DT admin %'
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "dt_site_media_admin_select" ON storage.objects;
DROP POLICY IF EXISTS "dt_site_media_admin_upload" ON storage.objects;
DROP POLICY IF EXISTS "dt_site_media_admin_delete" ON storage.objects;

-- Admin pode listar, enviar e apagar SOMENTE na subpasta site-gallery.
CREATE POLICY "dt_site_media_admin_select" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'dt-media' AND name LIKE 'site-gallery/%'
  AND EXISTS (SELECT 1 FROM public.site_admins WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY "dt_site_media_admin_upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'dt-media' AND name LIKE 'site-gallery/%'
  AND EXISTS (SELECT 1 FROM public.site_admins WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY "dt_site_media_admin_delete" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'dt-media' AND name LIKE 'site-gallery/%'
  AND EXISTS (SELECT 1 FROM public.site_admins WHERE user_id = (SELECT auth.uid()))
);

COMMIT;
