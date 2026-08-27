-- Run after 001_core_account_data.sql and 002_admin_access.sql.
create table if not exists public.content_items (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  content_type text not null check (content_type in ('project', 'achievement', 'publication', 'article', 'opportunity', 'announcement')),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_items enable row level security;

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$ select exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin') $$;

drop policy if exists "Authenticated users read content" on public.content_items;
drop policy if exists "Users create their own content" on public.content_items;
drop policy if exists "Owners or admins update content" on public.content_items;
drop policy if exists "Owners or admins delete content" on public.content_items;
create policy "Authenticated users read content" on public.content_items
  for select to authenticated using (true);
create policy "Users create their own content" on public.content_items
  for insert to authenticated with check (auth.uid() = owner_id);
create policy "Owners or admins update content" on public.content_items
  for update to authenticated using (auth.uid() = owner_id or public.is_current_user_admin()) with check (auth.uid() = owner_id or public.is_current_user_admin());
create policy "Owners or admins delete content" on public.content_items
  for delete to authenticated using (auth.uid() = owner_id or public.is_current_user_admin());
