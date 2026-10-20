# D&T Higienização — como ativar o painel do dono

## O que o dono poderá fazer
- Criar a própria conta com e-mail e senha, pelo endereço DO_SITE/admin.
- Confirmar o cadastro pelo e-mail.
- Entrar e publicar/excluir fotos e vídeos dos serviços.
- Alterar a senha pelo botão **Alterar senha** (informa a senha atual).
- Recuperar a senha pelo botão **Esqueci minha senha** (recebe um link por e-mail).

**Importante:** a conta do Supabase é SUA, para configurar o armazenamento uma única vez. A conta que o dono cria em /admin é separada: ele não precisa acessar o painel do Supabase.

**Segurança:** cadastro não libera permissão administrativa automaticamente. Somente as pessoas autorizadas na tabela site_admins conseguem publicar e excluir mídias. A primeira autorização é feita uma vez pelo responsável técnico.

## 1. Criar uma conta grátis no Supabase
1. Acesse https://supabase.com/dashboard e faça seu cadastro com e-mail ou GitHub.
2. Clique em **New project**.
3. Escolha o nome "dt-higienizacao", uma senha forte para o banco e uma região próxima.
4. Abra o projeto criado. Guarde a senha do banco com segurança e nunca a envie pelo WhatsApp.

## 2. Preparar o armazenamento das fotos
1. No Supabase, vá a **SQL Editor** e escolha **New query**.
2. No repositório do GitHub, abra o arquivo supabase/setup.sql.
3. Copie o conteúdo inteiro, cole no editor e clique em **Run**.
4. Isso cria o espaço de fotos/vídeos, as tabelas e as proteções de acesso.
5. Faça isso somente uma vez num projeto novo.

## 3. Fazer os e-mails chegarem corretamente
1. No Supabase, abra **Authentication → URL Configuration**.
2. Coloque o endereço do site em **Site URL**.
3. Em **Redirect URLs**, permita exatamente o endereço do site seguido de /admin (exemplo: https://www.exemplo.com/admin).
4. Em **Authentication → Providers → Email**, mantenha o e-mail ativo, cadastro permitido e confirmação de e-mail ligada.
5. Os e-mails enviados pelo serviço padrão têm limites baixos e são para testes. Para o sistema em produção, é recomendável configurar um servidor de e-mail próprio (SMTP), em Authentication → SMTP Settings.
6. Depois de cadastrar o primeiro dono, você pode bloquear novos cadastros nas configurações de Auth, evitando registros indesejados. Troca e recuperação de senha continuam disponíveis.

## 4. Conectar o Supabase com o Vercel
1. No Supabase, copie a **Project URL** e a chave **publishable** (começa com sb_publishable_) em Project Settings / Connect / API Keys.
2. No Vercel, abra o projeto da D&T Higienização, entre em **Settings → Environment Variables**.
3. Adicione as variáveis:
       REACT_APP_SUPABASE_URL = https://SEU_PROJETO.supabase.co
       REACT_APP_SUPABASE_PUBLISHABLE_KEY = sb_publishable_SUA_CHAVE
4. Salve as duas para Production (e Preview, se for testar), integre a mudança aprovada à branch main e faça o novo deploy.
5. Depois abra o endereço do site seguido de /admin.

**Nunca coloque a chave secret/service_role nem senhas de usuário no frontend, GitHub ou variáveis que começam com REACT_APP_.**

## 5. Cadastro inicial do dono (somente uma liberação)
1. O dono visita DO_SITE/admin e clica em **Criar conta**.
2. Ele escolhe o próprio e-mail, cria uma senha com ao menos 10 caracteres e confirma a senha.
3. Recebe um e-mail de confirmação e clica no link.
4. A pessoa que administra o Supabase abre **SQL Editor → New query** e executa este comando, trocando EMAIL_DO_DONO_AQUI pelo e-mail verdadeiro:

       insert into public.site_admins(user_id)
       select id
       from auth.users
       where lower(email) = lower('EMAIL_DO_DONO_AQUI')
         and email_confirmed_at is not null
       on conflict do nothing;

5. Pronto: agora a conta do dono poderá entrar no painel. Ele não precisará pedir para você publicar fotos, vídeos ou alterar a própria senha.

## 6. Como ele altera ou recupera a senha
- **Quer trocar:** abre /admin, faz login, clica em **Alterar senha**, informa a senha atual e a nova duas vezes. Depois entra novamente com a nova senha.
- **Esqueceu:** abre /admin, clica em **Esqueci minha senha**, informa o e-mail, abre o link recebido e cadastra uma senha nova.
- Se o e-mail não chegar, confira o spam, o endereço autorizado em Authentication → URL Configuration e o SMTP.

## 7. Testes antes de abrir ao dono
- Cadastro de conta com e-mail de confirmação funcionando.
- Conta não autorizada recebe acesso negado.
- Após liberação, o dono faz login e publica foto e vídeo curto.
- As publicações aparecem em "Trabalhos recentes" e "Depoimentos", sem redeploy.
- Botão de excluir funciona e o site público mantém suas fotos antigas.
- Troca de senha e recuperação por e-mail funcionam.
- Teste no celular e em desktop e atualize diretamente a página /admin.

## Notas importantes
- Formatos permitidos: JPG, PNG, WEBP, GIF, MP4, WEBM e MOV, no máximo 40 MiB. Prefira MP4 (H.264) para vídeos em celulares; MOV pode falhar em alguns navegadores.
- Confirme as cotas do seu plano Supabase. Para vídeos grandes, prefira compressão ou serviço dedicado de vídeo.
- Os arquivos são públicos para serem vistos pelos visitantes; use fotos autorizadas.
- As fotos já cadastradas no site continuam aparecendo.
- O banco usa regras RLS: ninguém recebe o privilégio administrativo simplesmente por ter um login.
- Não execute novamente o arquivo SQL de criação sem conferir as políticas já existentes.
