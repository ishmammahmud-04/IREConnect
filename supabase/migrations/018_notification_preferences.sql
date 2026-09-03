-- Complete notification delivery for workflow changes and published department content.
-- Run after migrations 001-017.

create or replace function public.notification_preference_enabled(
  target_user_id uuid,
  preference_key text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when jsonb_typeof(p.notification_settings) = 'object'
      and p.notification_settings ? preference_key
      then lower(p.notification_settings ->> preference_key) not in ('false', '0')
    else true
  end
  from public.profiles p
  where p.user_id = target_user_id;
$$;

create or replace function public.notify_workflow_recipient()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  preference_key text;
  notification_title text;
  notification_message text;
  notification_type text;
begin
  if new.recipient_id is not null
    and new.status = 'pending'
    and (tg_op = 'INSERT' or old.status is distinct from new.status)
    and new.workflow_type in ('connection_request', 'mentorship_request') then
    preference_key := case when new.workflow_type = 'mentorship_request'
      then 'mentorshipRequests' else 'connectionRequests' end;
    if public.notification_preference_enabled(new.recipient_id, preference_key) then
      insert into public.notifications (user_id, title, message, notification_type, avatar_url)
      values (
        new.recipient_id,
        case when new.workflow_type = 'mentorship_request' then 'New mentorship request' else 'New connection request' end,
        case when new.workflow_type = 'mentorship_request' then 'Someone requested your mentorship.' else 'Someone wants to connect with you.' end,
        case when new.workflow_type = 'mentorship_request' then 'mentorship' else 'connection' end,
        null
      );
    end if;
  elsif tg_op = 'UPDATE'
    and old.status is distinct from new.status
    and new.status = 'accepted'
    and new.requester_id is not null
    and new.workflow_type = 'connection_request'
    and public.notification_preference_enabled(new.requester_id, 'acceptedConnections') then
    insert into public.notifications (user_id, title, message, notification_type, avatar_url)
    values (new.requester_id, 'Connection accepted', 'Your connection request was accepted.', 'connection', null);
  end if;
  return new;
end;
$$;

drop trigger if exists workflow_recipient_notification on public.workflow_items;
create trigger workflow_recipient_notification
after insert or update on public.workflow_items
for each row execute procedure public.notify_workflow_recipient();

create or replace function public.notify_message_recipient()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recipient_id uuid;
begin
  select case when c.participant_a = new.sender_id then c.participant_b else c.participant_a end
    into recipient_id
    from public.conversations c
    where c.id = new.conversation_id;
  if recipient_id is not null
    and recipient_id <> new.sender_id
    and public.notification_preference_enabled(recipient_id, 'messages') then
    insert into public.notifications (user_id, title, message, notification_type, avatar_url)
    values (recipient_id, 'New message', 'You have a new message from a connected member.', 'message', null);
  end if;
  return new;
end;
$$;

drop trigger if exists message_recipient_notification on public.messages;
create trigger message_recipient_notification
after insert on public.messages
for each row execute procedure public.notify_message_recipient();

create or replace function public.notify_published_content()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_type text;
  target_preference text;
  target_title text;
begin
  if new.content_type not in ('announcement', 'event') then
    return new;
  end if;
  target_type := new.content_type;
  target_preference := case
    when new.content_type = 'announcement' then 'announcements'
    else 'events'
  end;
  target_title := coalesce(new.data ->> 'title', 'New ' || target_type);
  insert into public.notifications (user_id, title, message, notification_type, avatar_url)
  select p.user_id,
    case when new.content_type = 'event' then 'New department event'
      else 'New department announcement' end,
    target_title,
    target_type,
    null
  from public.profiles p
  where p.user_id <> coalesce(new.owner_id, '00000000-0000-0000-0000-000000000000'::uuid)
    and public.notification_preference_enabled(p.user_id, target_preference);
  return new;
end;
$$;

drop trigger if exists published_content_notification on public.content_items;
create trigger published_content_notification
after insert on public.content_items
for each row execute procedure public.notify_published_content();
