import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage, User } from '../types';
import { supabase } from '../lib/supabase';

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

export const ChatModal: React.FC = () => {
  const {
    currentUser,
    users,
    getConnectionUsers,
    chatTargetUser,
    isChatModalOpen,
    setIsChatModalOpen,
    setSelectedUserForProfile,
    showToast
  } = useApp();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(chatTargetUser);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const connections = useMemo(() => getConnectionUsers('connected'), [getConnectionUsers]);
  const filteredConnections = connections.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (isChatModalOpen && chatTargetUser) setSelectedUser(chatTargetUser);
  }, [isChatModalOpen, chatTargetUser]);

  useEffect(() => {
    if (!isChatModalOpen || !selectedUser) return;
    let active = true;
    const loadConversation = async () => {
      setIsLoading(true);
      const [first, second] = [currentUser.id, selectedUser.id].sort();
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('id')
        .eq('participant_a', first)
        .eq('participant_b', second)
        .maybeSingle();
      if (conversationError) {
        showToast(`Could not open chat: ${conversationError.message}`);
        setIsLoading(false);
        return;
      }
      if (!active) return;
      setConversationId(conversation?.id || null);
      if (conversation?.id) {
        const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversation.id).order('created_at', { ascending: true });
        if (error) showToast(`Could not load messages: ${error.message}`);
        if (active) setMessages((data || []).map(messageRowToMessage));
      } else {
        setMessages([]);
      }
      setIsLoading(false);
    };
    void loadConversation();
    return () => { active = false; };
  }, [isChatModalOpen, selectedUser, currentUser.id, showToast]);

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        setMessages((previous) => previous.some((message) => message.id === payload.new.id) ? previous : [...previous, messageRowToMessage(payload.new)]);
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [conversationId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!isChatModalOpen) return null;

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser || (!body.trim() && !attachment) || isSending) return;
    setIsSending(true);
    try {
      let activeConversationId = conversationId;
      if (!activeConversationId) {
        const [first, second] = [currentUser.id, selectedUser.id].sort();
        const { data, error } = await supabase.from('conversations').upsert(
          { participant_a: first, participant_b: second, updated_at: new Date().toISOString() },
          { onConflict: 'participant_a,participant_b' }
        ).select('id').single();
        if (error) throw error;
        activeConversationId = data.id;
        setConversationId(activeConversationId);
      }
      let attachmentUrl: string | undefined;
      if (attachment) {
        if (attachment.size > MAX_ATTACHMENT_SIZE) throw new Error('Attachments must be 10 MB or smaller.');
        const path = `${currentUser.id}/${activeConversationId}/${crypto.randomUUID()}-${attachment.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error } = await supabase.storage.from('chat-media').upload(path, attachment);
        if (error) throw error;
        const { data } = supabase.storage.from('chat-media').getPublicUrl(path);
        attachmentUrl = data.publicUrl;
      }
      const { data, error } = await supabase.from('messages').insert({
        conversation_id: activeConversationId,
        sender_id: currentUser.id,
        body: body.trim(),
        attachment_url: attachmentUrl,
        attachment_name: attachment?.name || null,
        attachment_type: attachment?.type || null
      }).select('*').single();
      if (error) throw error;
      setMessages((previous) => previous.some((message) => message.id === data.id) ? previous : [...previous, messageRowToMessage(data)]);
      setBody('');
      setAttachment(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onMouseDown={() => setIsChatModalOpen(false)}>
      <section className="flex h-[min(720px,90vh)] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label="Messages" onMouseDown={(event) => event.stopPropagation()}>
        <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-sm font-bold text-slate-900">Messages</h2>
              <button type="button" onClick={() => setIsChatModalOpen(false)} className="rounded-lg p-1 text-slate-500 hover:bg-white" aria-label="Close messages">×</button>
            </div>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search connections" className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {filteredConnections.map((user) => (
              <button type="button" key={user.id} onClick={() => setSelectedUser(user)} className={`flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-white ${selectedUser?.id === user.id ? 'bg-white shadow-sm' : ''}`}>
                <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <span className="min-w-0 truncate text-xs font-semibold text-slate-800">{user.name}</span>
              </button>
            ))}
            {filteredConnections.length === 0 && <p className="p-3 text-xs text-slate-500">No accepted connections found.</p>}
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          {selectedUser ? (
            <>
              <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                <button type="button" onClick={() => setSelectedUserForProfile(selectedUser)} className="flex min-w-0 items-center gap-2 text-left">
                  <img src={selectedUser.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <span className="truncate text-sm font-bold text-slate-900">{selectedUser.name}</span>
                </button>
                <button type="button" onClick={() => setIsChatModalOpen(false)} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label="Close messages">×</button>
              </header>
              <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-5">
                {isLoading ? <p className="text-center text-xs text-slate-500">Loading messages…</p> : messages.length === 0 ? <p className="text-center text-xs text-slate-500">Start the conversation.</p> : messages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs ${message.senderId === currentUser.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 shadow-sm'}`}>
                      {message.body && <p className="whitespace-pre-wrap">{message.body}</p>}
                      {message.attachmentUrl && <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className="mt-1 block underline">{message.attachmentName || 'Open attachment'}</a>}
                      <time className="mt-1 block text-[9px] opacity-70">{new Date(message.createdAt).toLocaleString()}</time>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <form onSubmit={sendMessage} className="border-t border-slate-200 p-3">
                {attachment && <p className="mb-2 truncate text-[11px] text-slate-600">{attachment.name}</p>}
                <div className="flex items-end gap-2">
                  <label className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="Attach a picture or file">
                    <span className="material-symbols-outlined text-[19px]">attach_file</span>
                    <input type="file" accept="image/*,.pdf,.doc,.docx,.txt,.zip" className="hidden" onChange={(event) => setAttachment(event.target.files?.[0] || null)} />
                  </label>
                  <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={1} placeholder="Write a message…" className="max-h-28 min-h-10 flex-1 resize-y rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500" />
                  <button type="submit" disabled={isSending || (!body.trim() && !attachment)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{isSending ? 'Sending…' : 'Send'}</button>
                </div>
              </form>
            </>
          ) : <div className="flex flex-1 items-center justify-center text-sm text-slate-500">Select an accepted connection to message.</div>}
        </div>
      </section>
    </div>
  );
};

const messageRowToMessage = (row: Record<string, unknown>): ChatMessage => ({
  id: String(row.id),
  conversationId: String(row.conversation_id),
  senderId: String(row.sender_id),
  body: String(row.body || ''),
  attachmentUrl: typeof row.attachment_url === 'string' ? row.attachment_url : undefined,
  attachmentName: typeof row.attachment_name === 'string' ? row.attachment_name : undefined,
  attachmentType: typeof row.attachment_type === 'string' ? row.attachment_type : undefined,
  createdAt: String(row.created_at)
});
