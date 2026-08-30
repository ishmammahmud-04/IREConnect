-- Run after migration 001. Records the policy versions accepted at signup.
alter table public.profiles add column if not exists terms_accepted_at timestamptz;
alter table public.profiles add column if not exists privacy_policy_accepted_at timestamptz;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    user_id, full_name, role, batch, student_id, avatar_url, terms_accepted_at, privacy_policy_accepted_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case when new.raw_user_meta_data ->> 'role' in ('student', 'alumni', 'faculty') then new.raw_user_meta_data ->> 'role' else 'student' end,
    nullif(new.raw_user_meta_data ->> 'batch', ''),
    nullif(new.raw_user_meta_data ->> 'student_id', ''),
    null,
    case when new.raw_user_meta_data ->> 'terms_accepted' = 'true' then now() else null end,
    case when new.raw_user_meta_data ->> 'privacy_policy_accepted' = 'true' then now() else null end
  )
  on conflict (user_id) do update
    set full_name = excluded.full_name,
        role = excluded.role,
        batch = excluded.batch,
        student_id = excluded.student_id,
        terms_accepted_at = excluded.terms_accepted_at,
        privacy_policy_accepted_at = excluded.privacy_policy_accepted_at;
  return new;
end;
$$;