-- Persistent department history milestones.
create table if not exists public.department_milestones (
  id text primary key,
  year text not null,
  title text not null,
  description text not null,
  created_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade
);

alter table public.department_milestones enable row level security;

grant select, insert, update, delete on public.department_milestones to authenticated;

drop policy if exists "Authenticated users read department milestones" on public.department_milestones;
create policy "Authenticated users read department milestones"
  on public.department_milestones for select to authenticated using (true);

drop policy if exists "Admins manage department milestones" on public.department_milestones;
create policy "Admins manage department milestones"
  on public.department_milestones for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());
