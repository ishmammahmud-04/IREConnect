alter table public.profiles
  add column if not exists cv_url text,
  add column if not exists cv_path text;

notify pgrst, 'reload schema';
