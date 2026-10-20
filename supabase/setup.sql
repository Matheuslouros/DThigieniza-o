-- Executar no SQL Editor do projeto Supabase escolhido.
-- A tabela de administradores NUNCA é preenchida pelo navegador.
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;
grant select on public.site_admins to authenticated;

create policy "Admin consulta a propria autorizacao"
  on public.site_admins for select to authenticated
  using (user_id = (select auth.uid()));

-- Definer consulta tabela interna sem dar acesso a terceiros.
create or replace function public.is_dt_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.site_admins
    where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_dt_admin() from public;
grant execute on function public.is_dt_admin() to authenticated;

create table if not exists public.site_media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  title text not null default '' check (char_length(title) <= 120),
  category text not null default 'Outros'
    check (category in ('Sofás','Cadeiras','Colchões','Tapetes','Automotivos','Outros')),
  kind text not null check (kind in ('image', 'video')),
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists site_media_created_at_idx on public.site_media(created_at desc);
alter table public.site_media enable row level security;
revoke all on public.site_media from anon, authenticated;
grant select on public.site_media to anon, authenticated;
grant insert, update, delete on public.site_media to authenticated;

create policy "Qualquer visitante le publicados"
  on public.site_media for select to anon, authenticated using (published = true);
create policy "Administradores leem todos"
  on public.site_media for select to authenticated using ((select public.is_dt_admin()));
create policy "Apenas administradores criam"
  on public.site_media for insert to authenticated with check ((select public.is_dt_admin()));
create policy "Apenas administradores editam"
  on public.site_media for update to authenticated
  using ((select public.is_dt_admin())) with check ((select public.is_dt_admin()));
create policy "Apenas administradores apagam"
  on public.site_media for delete to authenticated using ((select public.is_dt_admin()));

-- Limite por arquivo: 40 MiB, observadas também as cotas do plano do Supabase.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dt-media', 'dt-media', true, 41943040,
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "DT admin faz upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'dt-media' and (select public.is_dt_admin()));
create policy "DT admin lista arquivos" on storage.objects
  for select to authenticated
  using (bucket_id = 'dt-media' and (select public.is_dt_admin()));
create policy "DT admin exclui arquivos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'dt-media' and (select public.is_dt_admin()));

-- DEPOIS de criar o usuário dono em Authentication > Users, executar separadamente:
-- insert into public.site_admins(user_id)
-- select id from auth.users where lower(email) = lower('EMAIL_DO_DONO_AQUI')
-- on conflict do nothing;
