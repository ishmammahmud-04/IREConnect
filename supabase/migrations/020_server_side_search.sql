-- Migration 020: Server-side full-text search for profiles
-- Run after migrations 001-019 in Supabase SQL Editor.

-- 1. Add generated tsvector column combining full_name, headline, skills, and bio
alter table public.profiles
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(full_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(headline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(skills::text, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(bio, '')), 'C')
  ) stored;

-- 2. Create GIN index for high-performance full-text search
create index if not exists profiles_search_idx
  on public.profiles using gin (search_vector);

-- 3. Search function that ranks results using ts_rank and respects RLS
create or replace function public.search_profiles(query text)
returns setof public.profiles
language sql
stable
security invoker
set search_path = public
as $$
  select *
  from public.profiles
  where search_vector @@ websearch_to_tsquery('english', query)
  order by
    ts_rank(search_vector, websearch_to_tsquery('english', query)) desc,
    full_name asc;
$$;

grant execute on function public.search_profiles(text) to authenticated;
