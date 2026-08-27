-- Run with the Supabase database test harness after migrations 001-007.
begin;
select plan(4);

select ok(exists (select 1 from storage.buckets where id = 'profile-media'), 'profile media bucket exists');
select ok((select public from storage.buckets where id = 'profile-media') = true, 'profile media is readable by profile viewers');
select ok(exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users upload profile media'), 'uploads require the authenticated role');
select ok(exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users delete profile media'), 'deletes are scoped by user folder');

select * from finish();
rollback;