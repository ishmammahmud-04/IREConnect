-- Run after 001–004. Lets authenticated members discover department profiles,
-- while retaining write access only to their own record.
drop policy if exists "Users manage their own profile" on public.profiles;
drop policy if exists "Authenticated users read profiles" on public.profiles;
drop policy if exists "Users update their own profile" on public.profiles;

create policy "Authenticated users read profiles" on public.profiles
  for select to authenticated using (true);
create policy "Users update their own profile" on public.profiles
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
