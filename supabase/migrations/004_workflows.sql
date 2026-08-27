-- Run after migrations 001–003. Stores social and admin workflow records.
create table if not exists public.workflow_items (
  id text primary key,
  workflow_type text not null check (workflow_type in ('connection_request', 'mentorship_request', 'verification_request', 'moderation_report')),
  requester_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid references auth.users(id) on delete cascade,
  status text not null default 'pending',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workflow_items enable row level security;
drop policy if exists "Participants read workflow items" on public.workflow_items;
drop policy if exists "Users create workflow items" on public.workflow_items;
drop policy if exists "Recipients or admins update workflow items" on public.workflow_items;

create policy "Participants read workflow items" on public.workflow_items for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = recipient_id or public.is_current_user_admin());
create policy "Users create workflow items" on public.workflow_items for insert to authenticated
  with check (auth.uid() = requester_id);
create policy "Recipients or admins update workflow items" on public.workflow_items for update to authenticated
  using (auth.uid() = recipient_id or public.is_current_user_admin())
  with check (auth.uid() = recipient_id or public.is_current_user_admin());
