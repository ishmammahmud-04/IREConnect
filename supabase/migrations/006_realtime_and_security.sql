-- Run after migrations 001-005.
-- Realtime is enabled for the tables that drive inboxes and admin queues.
alter table public.workflow_items replica identity full;
alter table public.notifications replica identity full;
do $$
begin
  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime'
      and n.nspname = 'public'
      and c.relname = 'workflow_items'
  ) then
    alter publication supabase_realtime add table public.workflow_items;
  end if;

  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime'
      and n.nspname = 'public'
      and c.relname = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end;
$$;

-- Database notifications make incoming requests visible without a client-side refresh.
create or replace function public.notify_workflow_recipient()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.recipient_id is not null and new.status = 'pending' and (tg_op = 'INSERT' or old.status is distinct from new.status) then
    insert into public.notifications (user_id, title, message, notification_type, avatar_url)
    values (
      new.recipient_id,
      case when new.workflow_type = 'mentorship_request' then 'New mentorship request' else 'New connection request' end,
      case when new.workflow_type = 'mentorship_request' then 'Someone requested your mentorship.' else 'Someone wants to connect with you.' end,
      case when new.workflow_type = 'mentorship_request' then 'mentorship' else 'connection' end,
      null
    );
  end if;
  return new;
end;
$$;

drop trigger if exists workflow_recipient_notification on public.workflow_items;
create trigger workflow_recipient_notification
after insert or update on public.workflow_items
for each row execute procedure public.notify_workflow_recipient();

-- Prevent request spoofing and direct client-side admin mutations.
drop policy if exists "Users create workflow items" on public.workflow_items;
create policy "Users create workflow items" on public.workflow_items for insert to authenticated
  with check (
    auth.uid() = requester_id
    and workflow_type in ('connection_request', 'mentorship_request', 'moderation_report')
  );

drop policy if exists "Recipients or admins update workflow items" on public.workflow_items;
drop policy if exists "Recipients update request status" on public.workflow_items;
create policy "Recipients update request status" on public.workflow_items for update to authenticated
  using (auth.uid() = recipient_id and workflow_type in ('connection_request', 'mentorship_request'))
  with check (auth.uid() = recipient_id and workflow_type in ('connection_request', 'mentorship_request'));

-- The Edge Function uses the service role only after validating the caller as an admin.
create or replace function public.is_current_user_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin') $$;
