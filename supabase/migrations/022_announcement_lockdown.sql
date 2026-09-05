-- Migration 022: Restrict announcement creation to administrators
-- Run after migrations 001-021 in Supabase SQL Editor.

-- Replace content_items insert policy so non-admin users cannot insert rows with content_type = 'announcement'
drop policy if exists "Users create their own content" on public.content_items;

create policy "Users create their own content" on public.content_items
  for insert to authenticated
  with check (
    auth.uid() = owner_id
    and (content_type <> 'announcement' or public.is_current_user_admin())
  );
