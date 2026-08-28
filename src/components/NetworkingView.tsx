import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';

export const NetworkingView: React.FC = () => {
  const {
    currentUser,
    users,
    connectionRequests,
    acceptConnectionRequest,
    declineConnectionRequest,
    sendConnectionRequest,
    setSelectedUserForProfile,
    openMentorshipRequest,
    showToast,
    getConnectionCount,
    getConnectionStatus,
    getConnectionUsers,
    openChat
  } = useApp();

  const [activeTab, setActiveTab] = useState<'connections' | 'requests' | 'mentorship'>('connections');
  const [requestsSubTab, setRequestsSubTab] = useState<'received' | 'sent'>('received');
  const [mentorshipTopic, setMentorshipTopic] = useState('All Topics');
  const [isAvailableToggle, setIsAvailableToggle] = useState(currentUser.isAvailableForMentorship || false);

  const mentorshipTopics = [
    'All Topics',
    'Career',
    'Robotics',
    'IoT',
    'Software Engineering',
    'AI',
    'Research',
    'Higher Studies',
    'Entrepreneurship',
    'Interview Prep'
  ];

  const mentors = users.filter((u) => u.isAvailableForMentorship || u.role === 'faculty' || u.role === 'alumni');

  const filteredMentors = mentors.filter((m) => {
    if (mentorshipTopic === 'All Topics') return true;
    return (
      (m.mentorshipCategories && m.mentorshipCategories.includes(mentorshipTopic)) ||
      (m.skills && m.skills.some((s) => s.toLowerCase().includes(mentorshipTopic.toLowerCase()))) ||
      (m.specialization && m.specialization.some((s) => s.toLowerCase().includes(mentorshipTopic.toLowerCase())))
    );
  });

  const connectionList = getConnectionUsers('connected');
  const pendingOutgoing = getConnectionUsers('pending', 'outgoing');
  const suggestedPeople = users.filter((u) => u.id !== currentUser.id && getConnectionStatus(u.id) === 'none');

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-200 mb-1.5">
          People and Mentoring
        </div>
        <h1 className="font-heading text-[24px] md:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
          People and Mentoring
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mt-0.5">
          Connect with students, alumni, and faculty members.
        </p>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1">
        <button onClick={() => setActiveTab('connections')} className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${activeTab === 'connections' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
          Connections ({getConnectionCount(currentUser.id)})
        </button>
        <button onClick={() => setActiveTab('requests')} className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all relative ${activeTab === 'requests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
          Requests ({connectionRequests.length})
          {connectionRequests.length > 0 && <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-mono font-bold">{connectionRequests.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab('mentorship')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'mentorship'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">school</span>
          <span>Find a Mentor</span>
        </button>
      </div>

      {/* Tab 1: Connections */}
      {activeTab === 'connections' && (
        <div className="space-y-6">
          {/* People You May Know */}
          <section className="space-y-2.5">
            <h2 className="font-heading text-[16px] font-bold text-slate-900">
              People You May Know
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(suggestedPeople || []).slice(0, 3).map((person) => (
                <div
                  key={person.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col items-center text-center justify-between hover:shadow-xs transition-all"
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      onClick={() => setSelectedUserForProfile(person)}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 mb-2.5 cursor-pointer hover:scale-105 transition-transform"
                    />
                    <h3
                      onClick={() => setSelectedUserForProfile(person)}
                      className="font-bold text-xs text-slate-900 hover:text-blue-600 cursor-pointer"
                    >
                      {person.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{person.headline}</p>
                    <span className="text-[10px] text-blue-600 mt-1 font-medium">
                      {person.mutualConnectionsCount || 3} mutual connections
                    </span>
                  </div>

                  <button
                    onClick={() => { if (getConnectionStatus(person.id) === 'none') sendConnectionRequest(person.id); }}
                    disabled={getConnectionStatus(person.id) !== 'none'}
                    className={`mt-3.5 w-full py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 ${getConnectionStatus(person.id) === 'connected' ? 'bg-emerald-100 text-emerald-700' : getConnectionStatus(person.id) === 'pending' ? 'bg-slate-100 text-slate-500' : 'border border-slate-300 text-slate-800 hover:bg-slate-50'}`}
                  >
                    <span className="material-symbols-outlined text-[15px]">person_add</span>
                    <span>{getConnectionStatus(person.id) === 'connected' ? 'Connected' : getConnectionStatus(person.id) === 'pending' ? 'Pending' : 'Connect'}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Active Network Connections */}
          <section className="space-y-2.5">
            <h2 className="font-heading text-[16px] font-bold text-slate-900">
              Your Established Connections
            </h2>
            <div className="space-y-2">
              {(connectionList || []).map((person) => (
                <div
                  key={person.id}
                  className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3"
                >
                  <div
                    onClick={() => setSelectedUserForProfile(person)}
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900 truncate hover:text-blue-600">
                          {person.name}
                        </h4>
                        <span className="material-symbols-outlined text-blue-600 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{person.headline}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{person.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openChat(person)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => setSelectedUserForProfile(person)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                      title="Profile"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: Connection Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* Sub-tabs: Received vs Sent */}
          <div className="flex justify-center border-b border-slate-200">
            <button
              onClick={() => setRequestsSubTab('received')}
              className={`px-5 py-2 text-xs font-bold border-b-2 transition-all ${
                requestsSubTab === 'received'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Received ({connectionRequests.length})
            </button>
            <button
              onClick={() => setRequestsSubTab('sent')}
              className={`px-5 py-2 text-xs font-bold border-b-2 transition-all ${
                requestsSubTab === 'sent'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Sent ({pendingOutgoing.length})
            </button>
          </div>

          {requestsSubTab === 'received' ? (
            <div className="space-y-2.5">
              {(connectionRequests || []).length > 0 ? (
                (connectionRequests || []).map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={req.user.avatar}
                        alt={req.user.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-xs text-slate-900">{req.user.name}</h3>
                        <p className="text-xs text-slate-500">{req.user.headline}</p>
                        <p className="text-[10px] text-blue-600 font-medium flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[13px]">group</span>
                          <span>{req.mutualConnections} mutual connections • {req.timestamp}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => declineConnectionRequest(req.id)}
                        className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => acceptConnectionRequest(req.id)}
                        className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-2xs"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="material-symbols-outlined text-[36px] text-slate-400">mark_email_read</span>
                  <h3 className="font-heading text-sm font-bold text-slate-900">No pending requests</h3>
                  <p className="text-xs text-slate-500">You are all caught up on your incoming connection invites.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingOutgoing.length > 0 ? pendingOutgoing.map((person) => (
                <div key={person.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <button type="button" onClick={() => setSelectedUserForProfile(person)} className="flex min-w-0 items-center gap-3 text-left">
                    <img src={person.avatar} alt={person.name} className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-cover" />
                    <span className="min-w-0">
                      <strong className="block truncate text-xs text-slate-900">{person.name}</strong>
                      <span className="block truncate text-xs text-slate-500">{person.headline}</span>
                    </span>
                  </button>
                  <span className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">Pending</span>
                </div>
              )) : (
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <span className="material-symbols-outlined text-[36px] text-slate-400">outbox</span>
                  <h3 className="font-heading text-sm font-bold text-slate-900">No sent requests</h3>
                  <p className="text-xs text-slate-500">Your outgoing connection requests will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

          {/* Tab 3: Mentoring */}
      {activeTab === 'mentorship' && (
        <div className="space-y-4">
          {/* Availability Switch Banner */}
          <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <span className="font-heading font-bold text-sm text-slate-900 block">
                Available for Mentorship
              </span>
              <p className="text-xs text-slate-500">
                Toggle your profile status to signal willingness to guide junior students and project teams.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isAvailableToggle}
                onChange={(e) => {
                  setIsAvailableToggle(e.target.checked);
                  showToast(e.target.checked ? 'You are now marked Available for Mentorship!' : 'Mentorship status turned off');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Mentorship Categories */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {mentorshipTopics.map((topic) => {
              const isSelected = mentorshipTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setMentorshipTopic(topic)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(filteredMentors || []).map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-2.5">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer"
                      onClick={() => setSelectedUserForProfile(mentor)}
                    />
                    <div>
                      <h3
                        onClick={() => setSelectedUserForProfile(mentor)}
                        className="font-bold text-xs text-slate-900 hover:text-blue-600 cursor-pointer leading-tight"
                      >
                        {mentor.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {mentor.designation || mentor.headline}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-amber-600 text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span>4.9 (32 sessions)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-slate-100">
                    {(mentor.mentorshipCategories || ['AI', 'Robotics', 'Career']).map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200/60"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => openMentorshipRequest(mentor)}
                  className="mt-4 w-full py-1.5 rounded-lg border border-blue-600 text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors"
                >
                  Request Mentorship Session
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
