-- Run after 001_core_account_data.sql. Safe for projects where 001 was already applied.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('student', 'alumni', 'faculty', 'admin'));

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

-- Promote an account only from the SQL Editor or trusted server-side code:
-- update public.profiles set role = 'admin', verification_status = 'Admin'
-- where user_id = (select id from auth.users where email = 'admin@example.edu');
