import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AdminControlSuite: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    adminVerificationQueue = [],
    verificationRequests = [],
    approveVerification,
    rejectVerification,
    flaggedItems = [],
    moderationReports = [],
    resolveFlaggedItem,
    resolveModerationReport,
    publishAnnouncement,
    addAnnouncement,
    showToast,
    networkStats
  } = useApp();

  const [adminTab, setAdminTab] = useState<'verification' | 'moderation' | 'broadcast' | 'analytics'>('verification');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState('General');
  const [broadcastDescription, setBroadcastDescription] = useState('');
  const [broadcastIsPinned, setBroadcastIsPinned] = useState(false);

  if (!isAdmin) return null;

  const activeQueue = adminVerificationQueue.length > 0 ? adminVerificationQueue : verificationRequests;
  const activeReports = flaggedItems.length > 0 ? flaggedItems : moderationReports;
  const pendingQueue = activeQueue.filter((item) => (item.status || 'Pending') === 'Pending');

  const handlePublishBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastDescription) return;

    const postAnnouncement = publishAnnouncement || addAnnouncement;
    if (postAnnouncement) {
      postAnnouncement({
        title: broadcastTitle,
        category: broadcastCategory as any,
        description: broadcastDescription,
        isPinned: broadcastIsPinned,
        author: currentUser.name
      });
    }

    setBroadcastTitle('');
    setBroadcastDescription('');
    setBroadcastIsPinned(false);
  };

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'remove') => {
    if (resolveFlaggedItem) {
      resolveFlaggedItem(reportId, action);
    } else if (resolveModerationReport) {
      resolveModerationReport(reportId, action === 'remove' ? 'remove' : 'approve');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold tracking-widest uppercase border border-rose-200 mb-1.5">
          <span className="material-symbols-outlined text-[13px]">security</span>
          <span>Department Administration</span>
        </div>
        <h1 className="font-heading text-[24px] md:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
          Admin &amp; Moderation Operations
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mt-0.5">
          Review departmental identity verification requests, audit flagged content, publish official bulletins, and track network metrics.
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-1">
        <button
          onClick={() => setAdminTab('verification')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'verification'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          <span>Verification Queue ({pendingQueue.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('moderation')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'moderation'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">flag</span>
          <span>Content Moderation ({activeReports.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('broadcast')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'broadcast'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">campaign</span>
          <span>Publish Broadcast</span>
        </button>

        <button
          onClick={() => setAdminTab('analytics')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'analytics'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">insights</span>
          <span>Statistics</span>
        </button>
      </div>

      {/* Tab 1: Verification Queue */}
      {adminTab === 'verification' && (
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">info</span>
            <span>
              All IREConnect student and alumni accounts require departmental verification to ensure a closed, authentic academic environment.
            </span>
          </div>

          {pendingQueue.length > 0 ? (
            pendingQueue.map((item: any) => {
              const userName = item.userName || item.user?.name || 'User';
              const userAvatar = item.avatar || item.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=64748b&color=fff`;
              const userEmail = item.email || item.user?.email || 'user@university.edu';
              const requestedRole = item.requestedRole || item.user?.role || 'student';
              const batch = item.batch || item.user?.batch || 'Not provided';
              const submissionDate = item.submissionDate || item.submittedAt || 'Date unavailable';
              const idOrProgram = item.studentIdOrEmployeeId || item.degreeProgram || 'Not provided';
              const docUrl = item.documentUrl || item.evidenceDocUrl;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-xs md:text-sm font-bold text-slate-900">{userName}</h3>
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase font-mono border border-blue-200/60">
                          {String(requestedRole).replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-mono">
                        Institutional Email: <strong className="text-slate-900">{userEmail}</strong>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5 font-mono">
                        <span>Program/ID: <strong className="text-slate-700">{idOrProgram}</strong></span>
                        <span>Batch: <strong className="text-slate-700">{batch}</strong></span>
                        <span>Date: <strong className="text-slate-700">{submissionDate}</strong></span>
                      </div>

                      {docUrl && (
                        <div className="pt-1">
                          <button
                            onClick={() => showToast(`Viewing verification documentation for ${userName}...`)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                          >
                            <span className="material-symbols-outlined text-[14px]">attachment</span>
                            <span>View Proof of Enrollment / Graduation (PDF/Doc)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => rejectVerification(item.id)}
                      className="flex-1 md:flex-none px-3.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveVerification(item.id)}
                      className="flex-1 md:flex-none px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-2xs"
                    >
                      ✓ Verify &amp; Issue Badge
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
              <span className="material-symbols-outlined text-[32px] text-emerald-600">verified</span>
              <h3 className="font-heading text-sm font-bold text-slate-900">All verification queues cleared</h3>
              <p className="text-xs text-slate-500">There are no pending identity verification requests at this time.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Content Moderation */}
      {adminTab === 'moderation' && (
        <div className="space-y-3">
          {activeReports.length > 0 ? (
            activeReports.map((item: any) => {
              const itemTitle = item.title || item.contentTitle || 'Untitled content';
              const itemType = item.type || item.contentType || 'Content';
              const timestamp = item.timestamp || item.date || 'Date unavailable';
              const reason = item.reason || 'No reason provided';
              const reportedBy = item.reportedBy || 'Unknown member';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold uppercase border border-amber-200">
                        Flagged {itemType}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{timestamp}</span>
                    </div>

                    <h3 className="font-heading text-xs md:text-sm font-bold text-slate-900">{itemTitle}</h3>
                    <p className="text-xs text-rose-600 font-medium">Flag Reason: {reason}</p>
                    <p className="text-[11px] text-slate-500">Reported By: {reportedBy}</p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => handleResolveReport(item.id, 'dismiss')}
                      className="flex-1 md:flex-none px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => handleResolveReport(item.id, 'remove')}
                      className="flex-1 md:flex-none px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-2xs"
                    >
                      Remove Content
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
              <span className="material-symbols-outlined text-[32px] text-emerald-600">check_circle</span>
              <h3 className="font-heading text-sm font-bold text-slate-900">No flagged reports</h3>
              <p className="text-xs text-slate-500">Community standards are fully compliant.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Publish Broadcast */}
      {adminTab === 'broadcast' && (
        <form onSubmit={handlePublishBroadcast} className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-2xs space-y-4">
          <h2 className="font-heading text-sm md:text-base font-bold text-slate-900">
            Publish Official Department Announcement
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Title</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g., Final Examination Schedule & Lab Safety Guidelines"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={broadcastCategory}
                  onChange={(e) => setBroadcastCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="General">General Notice</option>
                  <option value="Exam Notice">Exam Notice</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Equipment">Equipment Arrival</option>
                </select>
              </div>

              <div className="flex items-center pt-4">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-900">
                  <input
                    type="checkbox"
                    checked={broadcastIsPinned}
                    onChange={(e) => setBroadcastIsPinned(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <span>Pin to top of Home Dashboard</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Message / Description</label>
              <textarea
                required
                rows={4}
                value={broadcastDescription}
                onChange={(e) => setBroadcastDescription(e.target.value)}
                placeholder="Provide full details, schedules, lab numbers, and instructions..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Broadcast Bulletin</span>
          </button>
        </form>
      )}

      {/* Tab 4: Analytics */}
      {adminTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">Verified Students</span>
              <p className="text-xl md:text-2xl font-extrabold font-mono text-slate-900">{networkStats.students}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">Alumni Enrolled</span>
              <p className="text-xl md:text-2xl font-extrabold font-mono text-slate-900">{networkStats.alumni}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">Active Projects</span>
              <p className="text-xl md:text-2xl font-extrabold font-mono text-slate-900">{networkStats.projects}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
