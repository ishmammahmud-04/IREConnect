-- Migration 021: Privacy-preserving public profile function
-- Run after migrations 001-020 in Supabase SQL Editor.

-- Returns a sanitized JSON object for public profile consumption by anyone (including the 'anon' role).
-- Evaluates privacy settings and returns NULL for any field not marked 'public'.
create or replace function public.get_public_profile(target_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  p public.profiles%rowtype;
  auth_email text;
  priv jsonb;
  can_cv boolean;
  can_email boolean;
  can_phone boolean;
  can_experience boolean;
  can_projects boolean;
  can_achievements boolean;
  can_publications boolean;
  can_links boolean;
  public_links jsonb;
  public_projects jsonb;
  public_achievements jsonb;
  public_publications jsonb;
begin
  -- 1. Fetch profile
  select * into p from public.profiles where user_id = target_id;
  if not found then
    return null;
  end if;

  -- 2. Fetch account email from auth.users
  select email into auth_email from auth.users where id = target_id;

  -- 3. Evaluate privacy flags (defaulting to 'private' if not set)
  priv := coalesce(p.privacy, '{}'::jsonb);
  can_cv := coalesce(priv ->> 'cv', 'private') = 'public';
  can_email := coalesce(priv ->> 'email', 'private') = 'public';
  can_phone := coalesce(priv ->> 'phone', 'private') = 'public';
  can_experience := coalesce(priv ->> 'experience', 'private') = 'public';
  can_projects := coalesce(priv ->> 'projects', 'private') = 'public';
  can_achievements := coalesce(priv ->> 'achievements', 'private') = 'public';
  can_publications := coalesce(priv ->> 'publications', 'private') = 'public';
  can_links := coalesce(priv ->> 'externalLinks', 'private') = 'public';

  -- 4. Sanitize external links
  if can_links then
    public_links := coalesce(p.external_links, '{}'::jsonb);
    if not can_phone then
      public_links := public_links - 'phone';
    end if;
    if not can_email then
      public_links := public_links - 'email';
    end if;
  else
    public_links := null;
  end if;

  -- 5. Query content items if permitted
  if can_projects then
    select coalesce(jsonb_agg(data), '[]'::jsonb)
      into public_projects
      from public.content_items
      where owner_id = target_id and content_type = 'project';
  else
    public_projects := null;
  end if;

  if can_achievements then
    select coalesce(jsonb_agg(data), '[]'::jsonb)
      into public_achievements
      from public.content_items
      where owner_id = target_id and content_type = 'achievement';
  else
    public_achievements := null;
  end if;

  if can_publications then
    select coalesce(jsonb_agg(data), '[]'::jsonb)
      into public_publications
      from public.content_items
      where owner_id = target_id and content_type = 'publication';
  else
    public_publications := null;
  end if;

  -- 6. Construct and return sanitized response
  return jsonb_build_object(
    'id', p.user_id,
    'name', p.full_name,
    'role', p.role,
    'verificationStatus', p.verification_status,
    'avatar', coalesce(p.avatar_url, ''),
    'bannerUrl', p.banner_url,
    'department', p.department,
    'headline', p.headline,
    'bio', p.bio,
    'location', p.location,
    'batch', p.batch,
    'skills', coalesce(p.skills, '[]'::jsonb),
    'education', coalesce(p.education, '[]'::jsonb),
    'email', case when can_email then auth_email else null end,
    'cvUrl', case when can_cv then p.cv_url else null end,
    'experience', case when can_experience then p.experience else null end,
    'externalLinks', public_links,
    'projects', public_projects,
    'achievements', public_achievements,
    'publications', public_publications
  );
end;
$$;

-- Permit anonymous and authenticated users to call this safe RPC
grant execute on function public.get_public_profile(uuid) to anon, authenticated;
