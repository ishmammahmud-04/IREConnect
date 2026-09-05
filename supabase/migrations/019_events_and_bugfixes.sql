-- Migration 019: Tier 1 Bug Fixes & Event RSVP Support
-- Run after migrations 001-018.

-- 1. Allow 'event' as a valid content_type in content_items
alter table public.content_items drop constraint if exists content_items_content_type_check;
alter table public.content_items add constraint content_items_content_type_check
  check (content_type in ('project', 'achievement', 'publication', 'article', 'opportunity', 'announcement', 'event'));

-- 2. Create event_rsvps table for persistent attendee tracking
create table if not exists public.event_rsvps (
  event_id text not null references public.content_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

alter table public.event_rsvps enable row level security;

drop policy if exists "Authenticated users read event RSVPs" on public.event_rsvps;
create policy "Authenticated users read event RSVPs"
  on public.event_rsvps for select to authenticated
  using (true);

drop policy if exists "Users manage own event RSVPs" on public.event_rsvps;
create policy "Users manage own event RSVPs"
  on public.event_rsvps for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. Solidify is_current_user_admin() single source of truth based on admin_users table
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
  );
$$;
