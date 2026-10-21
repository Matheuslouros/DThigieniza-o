# Painel D&T Higienização — estado e publicação

## Já feito (conferido diretamente no Supabase em 21/10/2026)
- Projeto Supabase `lgjlqseypfznqjhutduu` ativo.
- Bucket público `dt-media` (40 MB/arquivo, formatos de imagem e vídeo permitidos).
- Tabelas `public.site_admins` e `public.site_media` com RLS habilitado.
- Políticas de listagem/edição de mídia e upload/exclusão que verificam `is_dt_admin()`.
- UID inicial `78268e19-c3f6-46fa-935d-bc16551e084d` inserido em `site_admins` e confirmado.
- Frontend para login, arquivos e senha preparado nesta branch; **ainda não publicado/testado**.

**Não execute scripts antigos de criação de tabelas ou remoção de políticas.**
O arquivo `supabase/painel.sql` agora contém apenas consultas de verificação.

## Próxima etapa: Vercel

Identifique a Vercel que hospeda o domínio de produção e adicione as variáveis de ambiente em Production/Preview:

- `REACT_APP_SUPABASE_URL=https://lgjlqseypfznqjhutduu.supabase.co`
- `REACT_APP_SUPABASE_PUBLISHABLE_KEY` = chave pública `sb_publishable_...` obtida do painel Supabase.

Depois faça deploy/redeploy de uma prévia e teste `/admin`. Nunca exponha `sb_secret_` ou `service_role`.

## Teste antes de mesclar PR
- Login da conta autorizada; acesso negado a contas comuns.
- Upload de foto e vídeo pequeno, visualização na Home e em Depoimentos.
- Edição de título, exclusão e troca de senha.
- Conferir políticas e erros no navegador.
