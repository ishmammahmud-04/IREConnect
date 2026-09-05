import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = [
  'https://ireconnect.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const getCorsHeaders = (request: Request) => {
  const origin = request.headers.get('Origin') || '';
  const customOrigin = Deno.env.get('ALLOWED_ORIGIN');
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || (customOrigin && origin === customOrigin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin'
  };
};

type NotificationPayload =
  | {
      type: 'connection_request';
      recipientId: string;
      requesterName: string;
    }
  | {
      type: 'mentorship_request';
      recipientId: string;
      requesterName: string;
      topic?: string;
    }
  | {
      type: 'check_deadlines';
    };

Deno.serve(async (request) => {
  const corsHeaders = getCorsHeaders(request);
  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const appUrl = Deno.env.get('APP_URL') || 'https://ireconnect.vercel.app';
    const fromEmail = Deno.env.get('NOTIFICATION_FROM_EMAIL') || 'IRE Network <notifications@resend.dev>';

    // Authentication check
    const authorization = request.headers.get('Authorization');
    const cronSecret = request.headers.get('x-cron-secret') || new URL(request.url).searchParams.get('cron_secret');
    const expectedCronSecret = Deno.env.get('CRON_SECRET');

    const isCronAuthorized = Boolean(expectedCronSecret && cronSecret === expectedCronSecret);

    let callingUserId: string | null = null;
    if (!isCronAuthorized) {
      if (!authorization?.startsWith('Bearer ')) {
        return json({ error: 'Authentication required.' }, 401);
      }
      const token = authorization.slice('Bearer '.length);
      const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
      const { data: { user }, error: userError } = await userClient.auth.getUser(token);
      if (userError || !user) return json({ error: 'Invalid session.' }, 401);
      callingUserId = user.id;
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const body = await request.json() as NotificationPayload;

    if (!body || !body.type) {
      return json({ error: 'Invalid request payload.' }, 400);
    }

    // Helper to send email via Resend
    const sendResendEmail = async (to: string, subject: string, text: string) => {
      if (!resendApiKey) {
        console.warn('RESEND_API_KEY is not configured in environment. Skipping email dispatch.');
        return { ok: false, reason: 'RESEND_API_KEY not configured' };
      }
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [to],
            subject,
            text
          })
        });
        const result = await response.json();
        return { ok: response.ok, result };
      } catch (err) {
        console.error('Failed to call Resend API:', err);
        return { ok: false, error: String(err) };
      }
    };

    // Helper to check user's notification preference in DB
    const isPreferenceEnabled = async (userId: string, preferenceKey: string): Promise<boolean> => {
      const { data, error } = await adminClient.rpc('notification_preference_enabled', {
        target_user_id: userId,
        preference_key: preferenceKey
      });
      if (error) {
        // Fallback directly to profile notification_settings
        const { data: profile } = await adminClient
          .from('profiles')
          .select('notification_settings')
          .eq('user_id', userId)
          .maybeSingle();
        if (profile?.notification_settings && typeof profile.notification_settings === 'object') {
          return profile.notification_settings[preferenceKey] !== false;
        }
        return true;
      }
      return Boolean(data);
    };

    // Helper to fetch user email and name
    const getUserDetails = async (userId: string) => {
      const { data: authUserData } = await adminClient.auth.admin.getUserById(userId);
      const email = authUserData?.user?.email;
      const { data: profile } = await adminClient
        .from('profiles')
        .select('full_name')
        .eq('user_id', userId)
        .maybeSingle();
      const name = profile?.full_name || email?.split('@')[0] || 'Member';
      return { email, name };
    };

    // Case 1: Connection request
    if (body.type === 'connection_request') {
      const { recipientId, requesterName } = body;
      if (!recipientId) return json({ error: 'recipientId is required.' }, 400);

      const enabled = await isPreferenceEnabled(recipientId, 'connectionRequests');
      if (!enabled) return json({ ok: true, skipped: 'User preference disabled' });

      const { email: recipientEmail, name: recipientName } = await getUserDetails(recipientId);
      if (!recipientEmail) return json({ ok: false, error: 'Recipient email not found' }, 404);

      const subject = `New connection request from ${requesterName} on IRE Network`;
      const text = `Hi ${recipientName},\n\n${requesterName} has sent you a connection request on IRE Network.\n\nView and respond to your request here:\n${appUrl}/network\n\n— The IRE Network Team`;

      const res = await sendResendEmail(recipientEmail, subject, text);
      return json({ ok: true, sent: res.ok, result: res });
    }

    // Case 2: Mentorship request
    if (body.type === 'mentorship_request') {
      const { recipientId, requesterName, topic } = body;
      if (!recipientId) return json({ error: 'recipientId is required.' }, 400);

      const enabled = await isPreferenceEnabled(recipientId, 'mentorshipRequests');
      if (!enabled) return json({ ok: true, skipped: 'User preference disabled' });

      const { email: recipientEmail, name: recipientName } = await getUserDetails(recipientId);
      if (!recipientEmail) return json({ ok: false, error: 'Recipient email not found' }, 404);

      const subject = `New mentorship request from ${requesterName} on IRE Network`;
      const topicLine = topic ? ` regarding "${topic}"` : '';
      const text = `Hi ${recipientName},\n\n${requesterName} has requested your mentorship${topicLine} on IRE Network.\n\nReview this request and respond here:\n${appUrl}/network\n\n— The IRE Network Team`;

      const res = await sendResendEmail(recipientEmail, subject, text);
      return json({ ok: true, sent: res.ok, result: res });
    }

    // Case 3: Deadline reminders (within 48 hours for saved opportunities)
    if (body.type === 'check_deadlines') {
      // Must be admin or cron
      if (!isCronAuthorized && callingUserId) {
        const { data: adminUser } = await adminClient
          .from('admin_users')
          .select('user_id')
          .eq('user_id', callingUserId)
          .eq('status', 'active')
          .maybeSingle();
        if (!adminUser) return json({ error: 'Unauthorized to trigger deadline checks.' }, 403);
      }

      // 1. Fetch opportunities
      const { data: oppItems, error: oppError } = await adminClient
        .from('content_items')
        .select('*')
        .eq('content_type', 'opportunity');
      if (oppError) return json({ error: oppError.message }, 500);

      const now = Date.now();
      const twoDaysMs = 48 * 60 * 60 * 1000;
      const closingSoonOpps: { id: string; title: string; organization: string; deadline: string }[] = [];

      for (const item of oppItems || []) {
        const d = item.data as { title?: string; organization?: string; deadline?: string };
        if (!d.deadline) continue;
        const parsedDate = Date.parse(d.deadline);
        if (isNaN(parsedDate)) continue;
        const diff = parsedDate - now;
        if (diff > 0 && diff <= twoDaysMs) {
          closingSoonOpps.push({
            id: item.id,
            title: d.title || 'Untitled Opportunity',
            organization: d.organization || 'IRE Lab / Partner',
            deadline: d.deadline
          });
        }
      }

      if (closingSoonOpps.length === 0) {
        return json({ ok: true, message: 'No opportunities closing within 48 hours.' });
      }

      let sentCount = 0;
      for (const opp of closingSoonOpps) {
        const { data: savedRows } = await adminClient
          .from('saved_items')
          .select('user_id')
          .eq('item_id', opp.id);

        for (const row of savedRows || []) {
          const userId = row.user_id;
          const enabled = await isPreferenceEnabled(userId, 'deadlineReminders');
          if (!enabled) continue;

          const { email, name } = await getUserDetails(userId);
          if (!email) continue;

          const subject = `Reminder: Opportunity closing soon — ${opp.title}`;
          const text = `Hi ${name},\n\nThe opportunity "${opp.title}" from ${opp.organization} that you saved is closing soon (Deadline: ${opp.deadline}).\n\nApply or review details here:\n${appUrl}/opportunities\n\n— The IRE Network Team`;

          await sendResendEmail(email, subject, text);
          sentCount++;
        }
      }

      return json({ ok: true, opportunitiesChecked: closingSoonOpps.length, emailsSent: sentCount });
    }

    return json({ error: 'Unsupported notification action.' }, 400);
  } catch (err) {
    console.error('Unhandled error in send-notification-email:', err);
    return json({ error: (err as Error).message || 'Internal error' }, 500);
  }
});
