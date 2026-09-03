import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { FeedComment, FeedReactionSummary, VisibilityLevel } from '../types';
import { supabase } from '../lib/supabase';

type FeedEntry = { id: string; type: 'project' | 'achievement' | 'publication' | 'article' | 'opportunity' | 'announcement'; title: string; summary: string; ownerId?: string; visibility?: VisibilityLevel; date?: string };

export const ActivityFeed: React.FC = () => {
  const {
    currentUser, users, projects, achievements, publications, articles, opportunities, announcements,
    feedComments, feedReactions, hydrateFeedInteractions, toggleFeedReaction, addFeedComment, deleteFeedComment,
    submitReport, setSelectedProject, setSelectedPublication, setSelectedAchievement, setSelectedArticle, setSelectedOpportunity, getConnectionStatus
  } = useApp();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [publishedAt, setPublishedAt] = useState<Record<string, string>>({});
  const [interactionState, setInteractionState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [interactionError, setInteractionError] = useState<string | null>(null);
  const [interactionRetry, setInteractionRetry] = useState(0);

  const entries = useMemo(() => ([
    ...projects.map((item) => ({ id: item.id, type: 'project' as const, title: item.title, summary: item.description, ownerId: item.ownerId })),
    ...achievements.map((item) => ({ id: item.id, type: 'achievement' as const, title: item.title, summary: item.description, ownerId: item.ownerId, visibility: item.visibility, date: item.date })),
    ...publications.map((item) => ({ id: item.id, type: 'publication' as const, title: item.title, summary: item.abstract, ownerId: item.ownerId, visibility: item.visibility, date: item.date })),
    ...articles.map((item) => ({ id: item.id, type: 'article' as const, title: item.title, summary: item.subtitle, ownerId: item.ownerId, date: item.date })),
    ...opportunities.map((item) => ({ id: item.id, type: 'opportunity' as const, title: item.title, summary: item.description, ownerId: item.ownerId, date: item.deadline })),
    ...announcements.map((item) => ({ id: item.id, type: 'announcement' as const, title: item.title, summary: item.description, ownerId: item.ownerId, date: item.date }))
  ] as FeedEntry[]).filter((item) => {
    if (!item.ownerId || item.ownerId === currentUser.id || !item.visibility || item.visibility === 'public') return true;
    if (item.visibility === 'department') return users.find((u) => u.id === item.ownerId)?.department === currentUser.department;
    return item.visibility === 'connections' && item.ownerId ? getConnectionStatus(item.ownerId) === 'connected' : false;
  }).sort((a, b) => (publishedAt[b.id] || b.date || '').localeCompare(publishedAt[a.id] || a.date || '')).slice(0, 8), [projects, achievements, publications, articles, opportunities, announcements, currentUser, users, getConnectionStatus, publishedAt]);
  const commentsByContentId = useMemo(() => {
    const grouped: Record<string, FeedComment[]> = {};
    feedComments.forEach((comment) => {
      (grouped[comment.contentId] ||= []).push(comment);
    });
    return grouped;
  }, [feedComments]);
  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);

  useEffect(() => {
    if (!entries.length) {
      setInteractionState('ready');
      setInteractionError(null);
      return;
    }
    const ids = entries.map((entry) => entry.id);
    let isCurrent = true;
    setInteractionState('loading');
    setInteractionError(null);
    void Promise.all([
      supabase.from('content_items').select('id,created_at').in('id', ids),
      supabase.from('content_comments').select('*').in('content_id', ids).order('created_at', { ascending: true }),
      supabase.from('content_reactions').select('content_id,user_id').in('content_id', ids)
    ]).then(([contentResult, commentsResult, reactionsResult]) => {
      if (!isCurrent) return;
      const queryError = contentResult.error || commentsResult.error || reactionsResult.error;
      if (queryError) {
        setInteractionState('error');
        setInteractionError(queryError.message || 'Activity interactions could not be loaded.');
        return;
      }
      const timestamps: Record<string, string> = {};
      (contentResult.data || []).forEach((row) => {
        if (row.created_at) timestamps[row.id] = row.created_at;
      });
      setPublishedAt(timestamps);
      const comments: FeedComment[] = (commentsResult.data || []).map((row) => ({ id: row.id, contentId: row.content_id, userId: row.user_id, body: row.body, createdAt: row.created_at }));
      const reactions: Record<string, FeedReactionSummary> = {};
      (reactionsResult.data || []).forEach((row) => {
        reactions[row.content_id] = { count: (reactions[row.content_id]?.count || 0) + 1, reacted: reactions[row.content_id]?.reacted || row.user_id === currentUser.id };
      });
      hydrateFeedInteractions(comments, reactions);
      setInteractionState('ready');
    }).catch((error: unknown) => {
      if (!isCurrent) return;
      setInteractionState('error');
      setInteractionError(error instanceof Error ? error.message : 'Activity interactions could not be loaded.');
    });
    return () => {
      isCurrent = false;
    };
  }, [entries, currentUser.id, interactionRetry]);

  const openEntry = (entry: FeedEntry) => {
    if (entry.type === 'project') setSelectedProject(projects.find((item) => item.id === entry.id) || null);
    if (entry.type === 'achievement') setSelectedAchievement(achievements.find((item) => item.id === entry.id) || null);
    if (entry.type === 'publication') setSelectedPublication(publications.find((item) => item.id === entry.id) || null);
    if (entry.type === 'article') setSelectedArticle(articles.find((item) => item.id === entry.id) || null);
    if (entry.type === 'opportunity') setSelectedOpportunity(opportunities.find((item) => item.id === entry.id) || null);
  };
  const hasInteractions = entries.some((entry) => Boolean(commentsByContentId[entry.id]?.length) || Boolean(feedReactions[entry.id]));

  return <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 md:p-5">
    <div className="flex items-center justify-between mb-3">
      <div><h2 className="font-heading text-[16px] md:text-[18px] font-bold text-slate-900">Activity &amp; Community</h2><p className="text-xs text-slate-500">What your department is publishing and discussing.</p></div>
      <span className="material-symbols-outlined text-blue-600">dynamic_feed</span>
    </div>
    <div className="space-y-3">
      {(interactionState === 'loading' || (interactionState === 'idle' && entries.length > 0)) && <div role="status" className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-500">Loading reactions and comments…</div>}
      {interactionState === 'error' && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"><p>We couldn’t load reactions and comments for this feed.</p><p className="mt-1 text-xs text-rose-600">{interactionError}</p><button type="button" onClick={() => setInteractionRetry((value) => value + 1)} className="mt-2 text-xs font-bold text-rose-700 underline underline-offset-2">Try again</button></div>}
      {interactionState === 'ready' && entries.length > 0 && !hasInteractions && <p className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-500">No reactions or comments yet. Start the conversation by responding to a post.</p>}
      {entries.map((entry) => {
        const comments = commentsByContentId[entry.id] || [];
        const reaction = feedReactions[entry.id] || { count: 0, reacted: false };
        const owner = entry.ownerId ? usersById.get(entry.ownerId) : undefined;
        return <article key={`${entry.type}-${entry.id}`} className="rounded-xl border border-slate-200 p-3.5">
          <div className="flex items-start gap-2">
            {owner && <img src={owner.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1"><p className="text-[11px] text-slate-500">{owner?.name || 'Department member'} · {entry.type} · {publishedAt[entry.id] ? new Date(publishedAt[entry.id]).toLocaleString() : 'Recently published'}</p><button onClick={() => openEntry(entry)} className="text-left font-bold text-sm text-slate-900 hover:text-blue-600">{entry.title}</button><p className="text-xs text-slate-600 line-clamp-2 mt-1">{entry.summary}</p></div>
            <button onClick={() => submitReport(entry.title, 'Inappropriate Content', `Reported from activity feed (${entry.type}).`)} className="text-slate-400 hover:text-rose-600" aria-label="Report content"><span className="material-symbols-outlined text-[18px]">flag</span></button>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs">
            <button onClick={() => void toggleFeedReaction(entry.id)} className={reaction.reacted ? 'text-blue-600 font-bold' : 'text-slate-500'}><span className="material-symbols-outlined text-[16px] align-middle">thumb_up</span> {reaction.count}</button>
            <span className="text-slate-500">{comments.length} comment{comments.length === 1 ? '' : 's'}</span>
          </div>
          {comments.length > 0 && <div className="mt-2 space-y-1.5">{comments.map((comment) => <div key={comment.id} className="flex items-start justify-between gap-2 bg-slate-50 rounded-lg px-2.5 py-1.5 text-xs"><span><b>{usersById.get(comment.userId)?.name || 'Member'}:</b> {comment.body}</span><span className="flex gap-1">{comment.userId !== currentUser.id && <button onClick={() => submitReport(entry.title, 'Harassment', `Reported comment: ${comment.body}`)} className="text-slate-400 hover:text-rose-600" aria-label="Report comment">⚑</button>}{comment.userId === currentUser.id && <button onClick={() => void deleteFeedComment(comment.id)} className="text-slate-400 hover:text-rose-600" aria-label="Delete comment">×</button>}</span></div>)}</div>}
          <form onSubmit={(event) => { event.preventDefault(); const body = drafts[entry.id] || ''; void addFeedComment(entry.id, body); setDrafts((prev) => ({ ...prev, [entry.id]: '' })); }} className="flex gap-2 mt-2"><input aria-label={`Comment on ${entry.title}`} value={drafts[entry.id] || ''} onChange={(event) => setDrafts((prev) => ({ ...prev, [entry.id]: event.target.value }))} placeholder="Add a comment…" className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" /><button type="submit" className="text-xs font-bold text-blue-600 disabled:text-slate-300" disabled={!drafts[entry.id]?.trim()}>Post</button></form>
        </article>;
      })}
      {entries.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">Publish something to start the conversation.</p>}
    </div>
  </section>;
};
