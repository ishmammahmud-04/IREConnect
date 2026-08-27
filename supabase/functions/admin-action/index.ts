import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

type Action = 'verify_user' | 'reject_verification' | 'remove_content' | 'dismiss_report' | 'publish_announcement';

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) return json({ error: 'Authentication required.' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const token = authorization.slice('Bearer '.length);
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error: userError } = await userClient.auth.getUser(token);
    if (userError || !user) return json({ error: 'Invalid session.' }, 401);

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: profile } = await adminClient.from('profiles').select('role').eq('user_id', user.id).single();
    if (profile?.role !== 'admin') return json({ error: 'Administrator access required.' }, 403);

    const body = await request.json() as { action: Action; workflowId?: string; title?: string; description?: string; category?: string; isPinned?: string };
    if (!body.action) return json({ error: 'Action is required.' }, 400);

    if (body.action === 'publish_announcement') {
      if (!body.title?.trim() || !body.description?.trim()) return json({ error: 'Title and description are required.' }, 400);
      const announcement = { id: crypto.randomUUID(), title: body.title.trim(), description: body.description.trim(), category: body.category || 'General', isPinned: body.isPinned === 'true', author: 'IRE Admin Desk', date: 'Just now' };
      const { error } = await adminClient.from('content_items').insert({ id: announcement.id, owner_id: user.id, content_type: 'announcement', data: announcement });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true, announcement });
    }

    if (!body.workflowId) return json({ error: 'Workflow ID is required.' }, 400);
    const { data: workflow, error: workflowError } = await adminClient.from('workflow_items').select('*').eq('id', body.workflowId).single();
    if (workflowError || !workflow) return json({ error: 'Workflow item not found.' }, 404);

    if (body.action === 'verify_user' || body.action === 'reject_verification') {
      if (workflow.workflow_type !== 'verification_request') return json({ error: 'Invalid verification workflow.' }, 400);
      const status = body.action === 'verify_user' ? 'verified' : 'rejected';
      const verificationStatus = body.action === 'verify_user' ? 'Verified Student' : 'Rejected';
      await adminClient.from('workflow_items').update({ status, updated_at: new Date().toISOString() }).eq('id', body.workflowId);
      await adminClient.from('profiles').update({ verification_status: verificationStatus, updated_at: new Date().toISOString() }).eq('user_id', workflow.requester_id);
      await adminClient.from('notifications').insert({ user_id: workflow.requester_id, title: body.action === 'verify_user' ? 'Identity verified' : 'Verification update', message: body.action === 'verify_user' ? 'Your account has been verified.' : 'Your verification request was rejected.', notification_type: 'verification' });
      return json({ ok: true });
    }

    if (workflow.workflow_type !== 'moderation_report') return json({ error: 'Invalid moderation workflow.' }, 400);
    if (body.action === 'remove_content') {
      const contentId = typeof workflow.data?.contentId === 'string' ? workflow.data.contentId : null;
      if (contentId) await adminClient.from('content_items').delete().eq('id', contentId);
    }
    const status = body.action === 'remove_content' ? 'dismissed' : 'resolved';
    const { error } = await adminClient.from('workflow_items').update({ status, updated_at: new Date().toISOString() }).eq('id', body.workflowId);
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected server error.' }, 500);
  }
});

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
