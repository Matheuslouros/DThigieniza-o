# Painel D&T Higienização — ativação

## O que foi implementado
- Nova rota **/admin** (fora do menu público), com login por e-mail e senha.
- Upload de fotos/vídeos, descrição, categoria e exclusão.
- Nova galeria pública na página inicial e na página de depoimentos.
- As fotos antigas continuam aparecendo mesmo antes da configuração do Supabase.
- Sem dependências npm novas nem necessidade de servidor Python.

## Como ativar (necessário antes de entrar em produção)
1. Crie um projeto em https://supabase.com/dashboard.
2. Abra **SQL Editor**, cole e execute `supabase/setup.sql` uma única vez num projeto novo.
3. No Supabase, abra **Authentication > Users** e crie ou convide o e-mail do dono. Defina uma senha forte. Desative cadastro público em Authentication > Providers / Email, caso não precise de novas contas.
4. No SQL Editor execute, trocando pelo e-mail verdadeiro do dono:
   ```sql
   insert into public.site_admins(user_id)
   select id from auth.users where lower(email) = lower('EMAIL_DO_DONO_AQUI')
   on conflict do nothing;
   ```
   Isso autoriza **apenas** o usuário cadastrado. Só configurar um link secreto de /admin **não** protege o painel: a segurança está na autenticação e RLS.
5. Em **Project Settings / Connect / API Keys**, copie a **Project URL** e a chave **publishable** (`sb_publishable_...`). No painel Vercel do site, configure:
   ```
   REACT_APP_SUPABASE_URL=https://SEU_PROJETO.supabase.co
   REACT_APP_SUPABASE_PUBLISHABLE_KEY=sb_publishable_SUA_CHAVE
   ```
   Configure para Production (e Preview quando necessário), faça redeploy e acesse `https://SEU_DOMINIO/admin`.
6. Teste: login correto, foto, vídeo curto, exclusão, visitante anônimo e acesso negado para usuário sem permissão.
7. **Nunca** coloque `service_role`, `sb_secret_...`, senha, nem qualquer segredo de administração no código do navegador ou no repositório.

## Informações úteis
- Arquivos aceitos: JPG, PNG, WEBP, GIF, MP4, WEBM e MOV, até 40 MiB. Vídeos MOV de iPhone podem não reproduzir em alguns navegadores; prefira MP4 (H.264).
- Vídeos grandes devem ser comprimidos ou hospedados em plataforma própria; confirme as cotas de Storage do seu plano.
- As imagens atuais em `src/mock.js` são preservadas. Novos uploads aparecem em **Trabalhos recentes** e **Depoimentos**.
- O conteúdo é publicado imediatamente, sem push Git ou novo deploy. A rota /admin depende da regra de rewrite no `vercel.json`.
- O bucket foi configurado como público para clientes visualizarem os arquivos. Não envie documentos privados nem fotos sem consentimento.
- Alterar/deletar `public.site_admins` só pelo SQL Editor/administrador do projeto, nunca a partir da página /admin.
- Se já aplicou a migration, não reaplique sem verificar políticas existentes (CREATE POLICY não é idempotente).
