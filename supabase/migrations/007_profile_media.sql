-- Run after migrations 001-006.
alter table public.profiles add column if not exists banner_url text;
alter table public.profiles add column if not exists avatar_path text;
alter table public.profiles add column if not exists banner_path text;
notify pgrst, 'reload schema';

insert into storage.buckets (id, name, public)
values ('profile-media', 'profile-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Users upload profile media" on storage.objects;
drop policy if exists "Users update profile media" on storage.objects;
drop policy if exists "Users delete profile media" on storage.objects;
drop policy if exists "Anyone can view profile media" on storage.objects;

create policy "Anyone can view profile media" on storage.objects
  for select using (bucket_id = 'profile-media');
create policy "Users upload profile media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'profile-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users update profile media" on storage.objects
  for update to authenticated
  using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'profile-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete profile media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = auth.uid()::text);