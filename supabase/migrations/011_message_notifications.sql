-- Allow chat messages to trigger recipient alerts and keep notifications consistent.
-- Run after migrations 001-010.

alter table public.notifications
  drop constraint if exists notifications_notification_type_check;

alter table public.notifications
  add constraint notifications_notification_type_check
  check (notification_type in ('connection', 'mentorship', 'opportunity', 'announcement', 'event', 'message', 'verification'));

create or replace function public.notify_message_recipient()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recipient_id uuid;
begin
  select case
    when c.participant_a = new.sender_id then c.participant_b
    else c.participant_a
  end
  into recipient_id
  from public.conversations c
  where c.id = new.conversation_id;

  if recipient_id is not null and recipient_id <> new.sender_id then
    insert into public.notifications (user_id, title, message, notification_type, avatar_url)
    values (
      recipient_id,
      'New message',
      'You have a new message from a connected member.',
      'message',
      null
    );
  end if;

  return new;
end;
$$;

drop trigger if exists message_recipient_notification on public.messages;
create trigger message_recipient_notification
after insert on public.messages
for each row execute procedure public.notify_message_recipient();
