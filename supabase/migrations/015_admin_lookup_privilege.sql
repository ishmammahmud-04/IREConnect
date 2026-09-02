-- Run after migration 014.
-- Allow an authenticated session to read its own admin authorization row.
-- Row-level security still prevents access to other admins' rows.

grant select on public.admin_users to authenticated;
grant select on public.admin_audit_logs to authenticated;

drop policy if exists "Admins read their authorization" on public.admin_users;
create policy "Admins read their authorization"
  on public.admin_users for select to authenticated
  using (user_id = auth.uid());

