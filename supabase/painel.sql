-- D&T Higienização: projeto Supabase já configurado (2026-10-21).
-- Este arquivo é apenas uma verificação NÃO DESTRUTIVA.
-- As tabelas public.site_admins e public.site_media, o bucket dt-media,
-- as políticas RLS e a função is_dt_admin() já existiam.
-- O administrador inicial foi autorizado diretamente via integração Supabase.
-- Não recriar nem substituir políticas existentes sem auditoria.
SELECT
  (SELECT count(*) FROM public.site_admins) AS administradores_autorizados,
  (SELECT count(*) FROM storage.buckets WHERE id = 'dt-media' AND public) AS buckets_validos,
  (SELECT count(*) FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname LIKE 'DT admin %') AS politicas_storage;
