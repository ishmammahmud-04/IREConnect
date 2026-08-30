# Deployment

## Supabase

Run migrations `001` through `007` in Supabase SQL Editor in filename order. This creates the tables, realtime publication, admin policies, profile-media bucket, and Storage policies.

Deploy the admin function with the Supabase CLI from the project root:

```powershell
supabase functions deploy admin-action
```

The function uses the platform-provided `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` secrets. Never put the service-role key in `.env` or browser code.

## Frontend

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`, then run:

```powershell
npm install
npm run build
```

### Password reset email

In Supabase Dashboard > Authentication > URL Configuration, set the Site URL to
the deployed Vercel origin and add that same origin with a trailing slash to the
Redirect URLs, for example `https://ireconnect.vercel.app/`. The reset flow uses
that URL after the user chooses a new password.

For production delivery, configure a custom SMTP provider under Authentication
> SMTP Settings. The default Supabase email service is rate-limited and is not
intended for reliable production mail delivery. Also check the provider's spam
folder and its delivery logs when testing.

Serve the built app over HTTPS in production. Camera access requires HTTPS or `localhost`.

## Security tests

Run `supabase/tests/001_profile_media_security.sql` with a pgTAP-enabled Supabase test runner after applying the migrations.