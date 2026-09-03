-- Reactions and comments for persisted content. Visibility is enforced through content_items.
create table if not exists public.content_reactions (
  content_id text not null references public.content_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null default 'like' check (reaction in ('like')),
  created_at timestamptz not null default now(),
  primary key (content_id, user_id)
);

create table if not exists public.content_comments (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references public.content_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(trim(body)) > 0 and length(body) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.content_reactions enable row level security;
alter table public.content_comments enable row level security;

create or replace function public.can_view_content(target_content_id text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.content_items item
    left join public.profiles owner_profile on owner_profile.user_id = item.owner_id
    left join public.profiles viewer_profile on viewer_profile.user_id = auth.uid()
    where item.id = target_content_id
      and (
        coalesce(item.data->>'visibility', 'public') = 'public'
        or item.owner_id = auth.uid()
        or exists (
          select 1 from public.admin_users admin
          where admin.user_id = auth.uid() and admin.status = 'active'
        )
        or (item.data->>'visibility' = 'department' and owner_profile.department = viewer_profile.department)
        or (item.data->>'visibility' = 'connections' and exists (
          select 1 from public.workflow_items connection
          where connection.workflow_type = 'connection_request' and connection.status = 'accepted'
            and ((connection.requester_id = auth.uid() and connection.recipient_id = item.owner_id)
              or (connection.recipient_id = auth.uid() and connection.requester_id = item.owner_id))
        ))
      )
  );
$$;

alter table public.notifications
  drop constraint if exists notifications_notification_type_check;

alter table public.notifications
  add constraint notifications_notification_type_check
  check (notification_type in ('connection', 'mentorship', 'opportunity', 'announcement', 'event', 'message', 'verification', 'content_interaction'));

create or replace function public.notify_content_interaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  content_owner uuid;
  content_title text;
  actor_name text;
  owner_notification_settings jsonb;
  content_interactions_enabled boolean;
begin
  select item.owner_id, coalesce(item.data->>'title', 'your content'), owner_profile.notification_settings
    into content_owner, content_title, owner_notification_settings
    from public.content_items item
    left join public.profiles owner_profile on owner_profile.user_id = item.owner_id
    where item.id = new.content_id;

  if content_owner is null or content_owner = new.user_id then
    return new;
  end if;

  -- Support both profile JSON naming conventions and default to enabled for
  -- missing or unrecognized values.
  content_interactions_enabled := case
    when jsonb_typeof(owner_notification_settings) = 'object'
      and owner_notification_settings ? 'contentInteractions' then
      case lower(owner_notification_settings->>'contentInteractions')
        when 'false' then false
        when '0' then false
        else true
      end
    when jsonb_typeof(owner_notification_settings) = 'object'
      and owner_notification_settings ? 'content_interactions' then
      case lower(owner_notification_settings->>'content_interactions')
        when 'false' then false
        when '0' then false
        else true
      end
    else true
  end;

  if not content_interactions_enabled then
    return new;
  end if;

  select coalesce(full_name, 'A department member')
    into actor_name
    from public.profiles
    where user_id = new.user_id;

  insert into public.notifications (user_id, title, message, notification_type)
  values (
    content_owner,
    case when tg_table_name = 'content_reactions' then 'New reaction' else 'New comment' end,
    case when tg_table_name = 'content_reactions'
      then actor_name || ' liked "' || content_title || '".'
      else actor_name || ' commented on "' || content_title || '".'
    end,
    'content_interaction'
  );
  return new;
end;
$$;

drop trigger if exists content_reaction_notification on public.content_reactions;
create trigger content_reaction_notification
after insert on public.content_reactions
for each row execute procedure public.notify_content_interaction();

drop trigger if exists content_comment_notification on public.content_comments;
create trigger content_comment_notification
after insert on public.content_comments
for each row execute procedure public.notify_content_interaction();

drop policy if exists "Members read visible reactions" on public.content_reactions;
drop policy if exists "Members manage own reactions" on public.content_reactions;
create policy "Members read visible reactions" on public.content_reactions for select to authenticated using (public.can_view_content(content_id));
create policy "Members manage own reactions" on public.content_reactions for all to authenticated
  using (auth.uid() = user_id and public.can_view_content(content_id))
  with check (auth.uid() = user_id and public.can_view_content(content_id));

drop policy if exists "Members read visible comments" on public.content_comments;
drop policy if exists "Members create visible comments" on public.content_comments;
drop policy if exists "Owners delete comments" on public.content_comments;
create policy "Members read visible comments" on public.content_comments for select to authenticated using (public.can_view_content(content_id));
create policy "Members create visible comments" on public.content_comments for insert to authenticated
  with check (auth.uid() = user_id and public.can_view_content(content_id));
create policy "Owners delete comments" on public.content_comments for delete to authenticated using (auth.uid() = user_id);

-- Existing content reads must also respect the same visibility rules.
drop policy if exists "Authenticated users read content" on public.content_items;
create policy "Authenticated users read content" on public.content_items for select to authenticated
  using (public.can_view_content(id));
