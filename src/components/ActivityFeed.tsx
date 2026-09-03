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
  }).sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 8), [projects, achievements, publications, articles, opportunities, announcements, currentUser, users, getConnectionStatus]);

  useEffect(() => {
    if (!entries.length) return;
    const ids = entries.map((entry) => entry.id);
    void Promise.all([
      supabase.from('content_comments').select('*').in('content_id', ids).order('created_at', { ascending: true }),
      supabase.from('content_reactions').select('content_id,user_id').in('content_id', ids)
    ]).then(([commentsResult, reactionsResult]) => {
      if (commentsResult.error || reactionsResult.error) return;
      const comments: FeedComment[] = (commentsResult.data || []).map((row) => ({ id: row.id, contentId: row.content_id, userId: row.user_id, body: row.body, createdAt: row.created_at }));
      const reactions: Record<string, FeedReactionSummary> = {};
      (reactionsResult.data || []).forEach((row) => {
        reactions[row.content_id] = { count: (reactions[row.content_id]?.count || 0) + 1, reacted: reactions[row.content_id]?.reacted || row.user_id === currentUser.id };
      });
      hydrateFeedInteractions(comments, reactions);
    });
  }, [entries, currentUser.id]);

  const openEntry = (entry: FeedEntry) => {
    const item = ({ project: projects, achievement: achievements, publication: publications, article: articles, opportunity: opportunities, announcement: announcements }[entry.type] as any[]).find((value) => value.id === entry.id);
    if (entry.type === 'project') setSelectedProject(item);
    if (entry.type === 'achievement') setSelectedAchievement(item);
    if (entry.type === 'publication') setSelectedPublication(item);
    if (entry.type === 'article') setSelectedArticle(item);
    if (entry.type === 'opportunity') setSelectedOpportunity(item);
  };

  return <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 md:p-5">
    <div className="flex items-center justify-between mb-3">
      <div><h2 className="font-heading text-[16px] md:text-[18px] font-bold text-slate-900">Activity &amp; Community</h2><p className="text-xs text-slate-500">What your department is publishing and discussing.</p></div>
      <span className="material-symbols-outlined text-blue-600">dynamic_feed</span>
    </div>
    <div className="space-y-3">
      {entries.map((entry) => {
        const comments = feedComments.filter((comment) => comment.contentId === entry.id);
        const reaction = feedReactions[entry.id] || { count: 0, reacted: false };
        const owner = users.find((user) => user.id === entry.ownerId);
        return <article key={`${entry.type}-${entry.id}`} className="rounded-xl border border-slate-200 p-3.5">
          <div className="flex items-start gap-2">
            {owner && <img src={owner.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1"><p className="text-[11px] text-slate-500">{owner?.name || 'Department member'} · {entry.type}</p><button onClick={() => openEntry(entry)} className="text-left font-bold text-sm text-slate-900 hover:text-blue-600">{entry.title}</button><p className="text-xs text-slate-600 line-clamp-2 mt-1">{entry.summary}</p></div>
            <button onClick={() => submitReport(entry.title, 'Inappropriate Content', `Reported from activity feed (${entry.type}).`)} className="text-slate-400 hover:text-rose-600" aria-label="Report content"><span className="material-symbols-outlined text-[18px]">flag</span></button>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs">
            <button onClick={() => void toggleFeedReaction(entry.id)} className={reaction.reacted ? 'text-blue-600 font-bold' : 'text-slate-500'}><span className="material-symbols-outlined text-[16px] align-middle">thumb_up</span> {reaction.count}</button>
            <span className="text-slate-500">{comments.length} comment{comments.length === 1 ? '' : 's'}</span>
          </div>
          {comments.length > 0 && <div className="mt-2 space-y-1.5">{comments.map((comment) => <div key={comment.id} className="flex items-start justify-between gap-2 bg-slate-50 rounded-lg px-2.5 py-1.5 text-xs"><span><b>{users.find((user) => user.id === comment.userId)?.name || 'Member'}:</b> {comment.body}</span><span className="flex gap-1">{comment.userId !== currentUser.id && <button onClick={() => submitReport(entry.title, 'Harassment', `Reported comment: ${comment.body}`)} className="text-slate-400 hover:text-rose-600" aria-label="Report comment">⚑</button>}{comment.userId === currentUser.id && <button onClick={() => void deleteFeedComment(comment.id)} className="text-slate-400 hover:text-rose-600" aria-label="Delete comment">×</button>}</span></div>)}</div>}
          <form onSubmit={(event) => { event.preventDefault(); const body = drafts[entry.id] || ''; void addFeedComment(entry.id, body); setDrafts((prev) => ({ ...prev, [entry.id]: '' })); }} className="flex gap-2 mt-2"><input value={drafts[entry.id] || ''} onChange={(event) => setDrafts((prev) => ({ ...prev, [entry.id]: event.target.value }))} placeholder="Add a comment…" className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" /><button className="text-xs font-bold text-blue-600 disabled:text-slate-300" disabled={!drafts[entry.id]?.trim()}>Post</button></form>
        </article>;
      })}
      {entries.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">Publish something to start the conversation.</p>}
    </div>
  </section>;
};
