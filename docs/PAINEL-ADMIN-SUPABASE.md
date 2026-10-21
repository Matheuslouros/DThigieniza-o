# D&T Higienização — painel de mídia

## O que foi implementado
- Página privada **/admin** para login do usuário Supabase autorizado
- Upload de fotos e vídeos até 40 MB (limite atual visto no bucket)
- Excluir arquivos e editar títulos
- Trocar a senha da conta conectada
- Nova galeria dinâmica na Home e na página Depoimentos, mantendo as imagens existentes
- Acesso protegido por políticas RLS do Postgres e do Storage

## 1. Banco de dados e segurança

Confirme que o UID do usuário no menu Authentication > Users é:
**78268e19-c3f6-46fa-935d-bc16551e084d**

Se o UID não corresponder à conta do dono, corrija a linha INSERT em `supabase/painel.sql` antes de executar.

Abra Supabase > SQL Editor e execute o script `supabase/painel.sql` integralmente, no projeto que contém o bucket público `dt-media`.
Ele cria as tabelas `site_admins` e `site_media` e regras RLS que só permitem alterações ao UID cadastrado.
Também substitui as políticas antigas cujo nome começa com `DT admin ` no Storage para não deixar usuários autenticados comuns com acesso amplo.

**Segurança:** se alguma outra política permissiva do bucket `dt-media` for criada no futuro, ela também pode permitir alterações. Confira todas as políticas em Storage > Policies.
O bucket público permite baixar arquivos por URL. Isso é necessário para exibir os trabalhos aos visitantes.

## 2. Configurar Vercel

Em Vercel > projeto D&T Higienização > Settings > Environment Variables, adicione:

- `REACT_APP_SUPABASE_URL` = Project URL do Supabase (Settings > API)
- `REACT_APP_SUPABASE_PUBLISHABLE_KEY` = publishable key com prefixo `sb_publishable_`

Defina ambas nos ambientes Production e Preview. Faça **Redeploy**, pois o React lê variáveis na compilação. Nunca use uma secret key (`sb_secret_`) ou service_role no frontend.

## 3. Entrar

Depois de publicar o novo código, acesse `https://SEU-DOMINIO/admin`.
Entre com o e-mail e a senha que foram cadastrados no menu Authentication > Users do Supabase.
Não existe cadastro público de administradores. Novos administradores exigem autorização explícita na tabela `site_admins`.

## 4. Verificação

1. Entre com a conta autorizada e envie uma foto pequena.
2. Confirme se ela aparece na Home e na página Depoimentos.
3. Edite o título e confirme a atualização na galeria.
4. Envie um vídeo MP4 pequeno e teste a reprodução.
5. Exclua um arquivo e confirme que desapareceu da galeria.
6. Saia do painel; usuários comuns não devem conseguir enviar arquivos.
7. Altere a senha e teste o login novamente.

## Notas

Arquivos antigos continuam aparecendo nas seções originais, sem perda de conteúdo.
A galeria dinâmica usa a tabela `site_media` e os arquivos ficam na pasta `site-gallery/` dentro do bucket `dt-media`.
Não é necessário adicionar bibliotecas extras: a integração usa APIs oficiais do Supabase via fetch.
O painel não ficará funcional até que o SQL esteja aplicado e as variáveis estejam presentes no deploy.
