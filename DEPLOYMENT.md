# Deployment

## Supabase

Run migrations `001` through `022` in Supabase SQL Editor in numerical order. This creates core tables, authentication rules, media buckets, messaging, activity feeds, notification preferences, event RSVP support, full-text search, public profiles, and administrator security policies.

Deploy the edge functions with the Supabase CLI from the project root:

```powershell
supabase functions deploy admin-action
supabase functions deploy send-notification-email
```

The functions use platform-provided `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` secrets.

### Email Notifications (Resend)
For time-sensitive transactional emails (connection requests, mentorship requests, and deadline reminders):
1. Sign up at [Resend](https://resend.com) and generate an API key.
2. Set the following secrets in Supabase Dashboard > Edge Functions > Secrets (or via `supabase secrets set`):
   - `RESEND_API_KEY`: Your Resend API key (e.g. `re_123...`)
   - `NOTIFICATION_FROM_EMAIL`: Sender address (defaults to `IRE Network <notifications@resend.dev>`)
   - `CRON_SECRET`: Optional secret token for scheduled cron triggering of deadline reminders
3. To trigger deadline reminders automatically, schedule an HTTP POST to `https://<project-ref>.functions.supabase.co/send-notification-email` with header `x-cron-secret: <CRON_SECRET>` and payload `{"type":"check_deadlines"}` once daily via pg_cron or GitHub Actions.

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