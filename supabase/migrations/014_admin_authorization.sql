-- Run after migrations 001-013.
-- Establishes a separate admin authorization and audit boundary.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id) on delete restrict,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.admin_audit_logs enable row level security;

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and status = 'active'
  )
$$;

revoke all on public.admin_users from anon, authenticated;
revoke all on public.admin_audit_logs from anon, authenticated;

drop policy if exists "Admins read their authorization" on public.admin_users;
create policy "Admins read their authorization"
  on public.admin_users for select to authenticated
  using (user_id = auth.uid() and public.is_current_user_admin());

drop policy if exists "Admins read audit logs" on public.admin_audit_logs;
create policy "Admins read audit logs"
  on public.admin_audit_logs for select to authenticated
  using (public.is_current_user_admin());

