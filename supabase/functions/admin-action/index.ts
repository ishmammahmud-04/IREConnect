import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

type Action = 'verify_user' | 'reject_verification' | 'remove_content' | 'dismiss_report' | 'publish_announcement' | 'delete_account';

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
    const body = await request.json() as { action: Action; workflowId?: string; title?: string; description?: string; category?: string; isPinned?: boolean | string; targetUserId?: string };
    if (!body.action || !['verify_user', 'reject_verification', 'remove_content', 'dismiss_report', 'publish_announcement', 'delete_account'].includes(body.action)) {
      return json({ error: 'A valid action is required.' }, 400);
    }

    if (body.action === 'delete_account') {
      const targetUserId = body.targetUserId || user.id;
      if (targetUserId !== user.id) {
        const { data: adminUser, error: adminError } = await adminClient
          .from('admin_users')
          .select('user_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
        if (adminError || !adminUser) return json({ error: 'Administrator access required.' }, 403);
      }
      if (targetUserId !== user.id) {
        const { error: auditError } = await adminClient.from('admin_audit_logs').insert({
          admin_id: user.id, action: 'DELETED_ACCOUNT', target_type: 'user', target_id: targetUserId, metadata: {}
        });
        if (auditError) return json({ error: auditError.message }, 500);
      }
      const { error } = await adminClient.auth.admin.deleteUser(targetUserId);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    const { data: adminUser, error: adminError } = await adminClient
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    if (adminError || !adminUser) return json({ error: 'Administrator access required.' }, 403);

    if (body.action === 'publish_announcement') {
      if (!body.title?.trim() || !body.description?.trim()) return json({ error: 'Title and description are required.' }, 400);
      const isPinned = body.isPinned === true || body.isPinned === 'true';
      const announcement = { id: crypto.randomUUID(), title: body.title.trim(), description: body.description.trim(), category: body.category || 'General', isPinned, author: 'IRE Admin Desk', date: 'Just now' };
      const { error } = await adminClient.from('content_items').insert({ id: announcement.id, owner_id: user.id, content_type: 'announcement', data: announcement });
      if (error) return json({ error: error.message }, 400);
      const { error: auditError } = await adminClient.from('admin_audit_logs').insert({
        admin_id: user.id,
        action: 'PUBLISHED_ANNOUNCEMENT',
        target_type: 'announcement',
        target_id: announcement.id,
        metadata: { title: announcement.title }
      });
      if (auditError) return json({ error: auditError.message }, 500);
      return json({ ok: true, announcement });
    }

    if (!body.workflowId) return json({ error: 'Workflow ID is required.' }, 400);
    const { data: workflow, error: workflowError } = await adminClient.from('workflow_items').select('*').eq('id', body.workflowId).single();
    if (workflowError || !workflow) return json({ error: 'Workflow item not found.' }, 404);

    if (body.action === 'verify_user' || body.action === 'reject_verification') {
      if (workflow.workflow_type !== 'verification_request') return json({ error: 'Invalid verification workflow.' }, 400);
      const status = body.action === 'verify_user' ? 'verified' : 'rejected';
      const verificationStatus = body.action === 'verify_user' ? 'Verified Student' : 'Rejected';
      const { error: workflowUpdateError } = await adminClient.from('workflow_items').update({ status, updated_at: new Date().toISOString() }).eq('id', body.workflowId);
      if (workflowUpdateError) return json({ error: workflowUpdateError.message }, 500);
      const { error: profileError } = await adminClient.from('profiles').update({ verification_status: verificationStatus, updated_at: new Date().toISOString() }).eq('user_id', workflow.requester_id);
      if (profileError) return json({ error: profileError.message }, 500);
      const { error: notificationError } = await adminClient.from('notifications').insert({ user_id: workflow.requester_id, title: body.action === 'verify_user' ? 'Identity verified' : 'Verification update', message: body.action === 'verify_user' ? 'Your account has been verified.' : 'Your verification request was rejected.', notification_type: 'verification' });
      if (notificationError) return json({ error: notificationError.message }, 500);
      const { error: auditError } = await adminClient.from('admin_audit_logs').insert({
        admin_id: user.id,
        action: body.action === 'verify_user' ? 'APPROVED_USER' : 'REJECTED_USER',
        target_type: 'user',
        target_id: workflow.requester_id,
        metadata: { workflowId: body.workflowId }
      });
      if (auditError) return json({ error: auditError.message }, 500);
      return json({ ok: true });
    }

    if (workflow.workflow_type !== 'moderation_report') return json({ error: 'Invalid moderation workflow.' }, 400);
    if (body.action === 'remove_content') {
      const contentId = typeof workflow.data?.contentId === 'string' ? workflow.data.contentId : null;
      if (contentId) {
        const { data: content, error: contentError } = await adminClient.from('content_items').select('data').eq('id', contentId).maybeSingle();
        if (contentError) return json({ error: contentError.message }, 500);
        if (!content) return json({ error: 'Reported content was not found.' }, 404);
        if (content) {
          const data = {
            ...(content.data as Record<string, unknown>),
            status: 'removed',
            removedAt: new Date().toISOString(),
            removedBy: user.id
          };
        const { error: contentUpdateError } = await adminClient.from('content_items').update({ data, updated_at: new Date().toISOString() }).eq('id', contentId);
        if (contentUpdateError) return json({ error: contentUpdateError.message }, 500);
        }
      } else return json({ error: 'Reported content identifier is missing.' }, 400);
    }
    const status = body.action === 'remove_content' ? 'dismissed' : 'resolved';
    const { error } = await adminClient.from('workflow_items').update({ status, updated_at: new Date().toISOString() }).eq('id', body.workflowId);
    if (error) return json({ error: error.message }, 400);
    const { error: auditError } = await adminClient.from('admin_audit_logs').insert({
      admin_id: user.id,
      action: body.action === 'remove_content' ? 'REMOVED_POST' : 'RESOLVED_REPORT',
      target_type: 'moderation_report',
      target_id: body.workflowId,
      metadata: { action: body.action }
    });
    if (auditError) return json({ error: auditError.message }, 500);
    const { error: notificationError } = await adminClient.from('notifications').insert({
      user_id: workflow.requester_id,
      title: body.action === 'remove_content' ? 'Report resolved' : 'Report dismissed',
      message: body.action === 'remove_content' ? 'The content you reported was removed.' : 'The content report was reviewed and dismissed.',
      notification_type: 'content_interaction'
    });
    if (notificationError) return json({ error: notificationError.message }, 500);
    return json({ ok: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected server error.' }, 500);
  }
});

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
