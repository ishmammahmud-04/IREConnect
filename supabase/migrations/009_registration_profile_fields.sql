-- Run after migrations 001-008.
-- Store the role and identity details selected during self-registration.
alter table public.profiles add column if not exists batch text;
alter table public.profiles add column if not exists student_id text;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
begin
  insert into public.profiles (user_id, full_name, role, batch, student_id, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case when requested_role in ('student', 'alumni', 'faculty') then requested_role else 'student' end,
    nullif(new.raw_user_meta_data ->> 'batch', ''),
    nullif(new.raw_user_meta_data ->> 'student_id', ''),
    null
  )
  on conflict (user_id) do update
    set full_name = excluded.full_name,
        role = excluded.role,
        batch = excluded.batch,
        student_id = excluded.student_id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();
