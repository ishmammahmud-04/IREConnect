-- Run after migrations 001-007.
-- Enforce the same institutional email requirement at the database boundary.
alter table public.profiles alter column verification_status set default 'Verified Student';

create or replace function public.require_uftb_email()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if lower(coalesce(new.email, '')) !~ '^[^@[:space:]]+@uftb\.[a-z]{2,}(\.[a-z]{2,})?$' then
    raise exception 'Only UFTB email addresses may access this network';
  end if;
  return new;
end;
$$;

drop trigger if exists require_uftb_email_on_signup on auth.users;
create trigger require_uftb_email_on_signup
before insert on auth.users
for each row execute procedure public.require_uftb_email();

-- Remove existing non-UFTB profiles from directory visibility. Delete their auth users
-- separately from the Supabase Auth dashboard if needed.
delete from public.profiles
where user_id in (select id from auth.users where lower(email) !~ '^[^@[:space:]]+@uftb\.[a-z]{2,}(\.[a-z]{2,})?$');

update public.profiles
set verification_status = case
  when role = 'alumni' then 'Verified Alumni'
  when role = 'faculty' then 'Verified Faculty'
  else 'Verified Student'
end
where verification_status = 'Pending Verification';