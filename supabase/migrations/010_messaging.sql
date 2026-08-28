-- Run after migrations 001-009.
-- Direct messaging is limited to members with an accepted connection.
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  participant_a uuid not null references auth.users(id) on delete cascade,
  participant_b uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_distinct_participants check (participant_a <> participant_b),
  constraint conversations_ordered_participants check (participant_a < participant_b),
  unique (participant_a, participant_b)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null default '',
  attachment_url text,
  attachment_name text,
  attachment_type text,
  created_at timestamptz not null default now(),
  constraint messages_have_content check (length(trim(body)) > 0 or attachment_url is not null)
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create or replace function public.is_connected_to(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workflow_items
    where workflow_type = 'connection_request'
      and status = 'accepted'
      and ((requester_id = auth.uid() and recipient_id = target_user)
        or (requester_id = target_user and recipient_id = auth.uid()))
  );
$$;

drop policy if exists "Connected members read conversations" on public.conversations;
drop policy if exists "Connected members create conversations" on public.conversations;
create policy "Connected members read conversations" on public.conversations
  for select to authenticated using (auth.uid() = participant_a or auth.uid() = participant_b);
create policy "Connected members create conversations" on public.conversations
  for insert to authenticated
  with check (
    (auth.uid() = participant_a or auth.uid() = participant_b)
    and public.is_connected_to(case when auth.uid() = participant_a then participant_b else participant_a end)
  );

drop policy if exists "Conversation members read messages" on public.messages;
drop policy if exists "Conversation members send messages" on public.messages;
create policy "Conversation members read messages" on public.messages
  for select to authenticated using (
    exists (select 1 from public.conversations c where c.id = conversation_id and (auth.uid() = c.participant_a or auth.uid() = c.participant_b))
  );
create policy "Conversation members send messages" on public.messages
  for insert to authenticated
  with check (
    auth.uid() = sender_id and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (auth.uid() = c.participant_a or auth.uid() = c.participant_b)
    )
  );

insert into storage.buckets (id, name, public)
values ('chat-media', 'chat-media', true)
on conflict (id) do nothing;

drop policy if exists "Members upload chat attachments" on storage.objects;
drop policy if exists "Members delete own chat attachments" on storage.objects;
create policy "Members upload chat attachments" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'chat-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Members delete own chat attachments" on storage.objects
  for delete to authenticated
  using (bucket_id = 'chat-media' and (storage.foldername(name))[1] = auth.uid()::text);

alter table public.messages replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime' and n.nspname = 'public' and c.relname = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end;
$$;
