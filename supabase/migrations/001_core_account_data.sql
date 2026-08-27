-- Run this file in Supabase Dashboard > SQL Editor before using the persisted app features.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('student', 'alumni', 'faculty', 'admin')),
  verification_status text not null default 'Pending Verification',
  avatar_url text,
  department text not null default 'IoT & Robotics Engineering',
  headline text not null default '',
  bio text not null default '',
  location text not null default '',
  skills jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  external_links jsonb not null default '{}'::jsonb,
  privacy jsonb not null default '{}'::jsonb,
  notification_settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  notification_type text not null check (notification_type in ('connection', 'mentorship', 'opportunity', 'announcement', 'event', 'verification')),
  avatar_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

alter table public.profiles enable row level security;
alter table public.notifications enable row level security;
alter table public.saved_items enable row level security;

drop policy if exists "Users manage their own profile" on public.profiles;
drop policy if exists "Users read their own notifications" on public.notifications;
drop policy if exists "Users update their own notifications" on public.notifications;
drop policy if exists "Users manage their own saved items" on public.saved_items;
create policy "Users manage their own profile" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read their own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users update their own notifications" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own saved items" on public.saved_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- A signed-in user may edit their profile, but may not self-promote or alter verification.
create or replace function public.prevent_self_privilege_changes()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() = old.user_id and (new.role is distinct from old.role or new.verification_status is distinct from old.verification_status) then
    raise exception 'Only an administrator can change role or verification status';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileges on public.profiles;
create trigger protect_profile_privileges before update on public.profiles for each row execute procedure public.prevent_self_privilege_changes();

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, role, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case when new.raw_user_meta_data ->> 'role' in ('student', 'alumni', 'faculty') then new.raw_user_meta_data ->> 'role' else 'student' end,
    null
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_profile_for_new_user();

-- Backfill accounts that were created before this migration ran.
insert into public.profiles (user_id, full_name, role, avatar_url)
select
  id,
  coalesce(raw_user_meta_data ->> 'full_name', split_part(email, '@', 1)),
  case when raw_user_meta_data ->> 'role' in ('student', 'alumni', 'faculty') then raw_user_meta_data ->> 'role' else 'student' end,
  null
from auth.users
on conflict (user_id) do nothing;
