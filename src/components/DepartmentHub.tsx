import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Announcement, DepartmentEvent } from '../types';

export const DepartmentHub: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    announcements,
    events,
    createDepartmentEvent,
    createAnnouncement,
    createDepartmentMilestone,
    updateDepartmentMilestone,
    deleteDepartmentMilestone,
    milestones,
    achievements,
    users,
    setSelectedAchievement,
    setSelectedUserForProfile,
    toggleEventRsvp,
    showToast,
    networkStats,
    openCreateModalWithType,
    updatePublishedContent,
    deletePublishedContent
  } = useApp();

  const [activeTab, setActiveTab] = useState<'announcements' | 'events' | 'hall_of_fame' | 'history'>('announcements');
  const [selectedAnnouncementCategory, setSelectedAnnouncementCategory] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCategory, setFormCategory] = useState('Workshop');
  const [editingMilestone, setEditingMilestone] = useState<{ id: string; year: string; title: string; description: string } | null>(null);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState<Set<string>>(new Set());
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingEvent, setEditingEvent] = useState<DepartmentEvent | null>(null);

  const categories = ['All', 'Exam Notice', 'Workshop', 'Equipment', 'General'];

  const filteredAnnouncements = (announcements || []).filter((ann) => {
    if (selectedAnnouncementCategory !== 'All' && ann.category !== selectedAnnouncementCategory) return false;
    return true;
  });

  const formerFaculty = (users || []).filter((u) => u.role === 'former_faculty');
  const canManageDepartment = isAdmin;

  const resetForm = () => {
    setFormTitle(''); setFormDescription(''); setFormDate(''); setFormTime(''); setFormLocation(''); setFormCategory('Workshop'); setIsAdding(false);
    setEditingAnnouncement(null); setEditingEvent(null); setEditingMilestone(null);
  };
  useEffect(() => {
    if (isAdding) resetForm();
  }, [activeTab]);
  const canManageItem = (item: { ownerId?: string; owner_id?: string }) => canManageDepartment || item.ownerId === currentUser.id || item.owner_id === currentUser.id;
  const startAnnouncementEdit = (item: Announcement) => {
    setEditingAnnouncement(item); setFormTitle(item.title); setFormDescription(item.description); setFormCategory(item.category); setIsAdding(true);
  };
  const startEventEdit = (item: DepartmentEvent) => {
    setEditingEvent(item); setFormTitle(item.title); setFormDescription(item.description); setFormDate(item.date); setFormTime(item.time); setFormLocation(item.location); setFormCategory(item.category); setIsAdding(true);
  };

  const submitDepartmentItem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;
    if (activeTab === 'announcements') {
      if (editingAnnouncement) {
        await updatePublishedContent('announcement', { ...editingAnnouncement, title: formTitle.trim(), description: formDescription.trim(), category: formCategory });
        resetForm();
        return;
      }
      await createAnnouncement({ title: formTitle.trim(), description: formDescription.trim(), category: formCategory as any, author: currentUser.name, date: 'Just now' });
    } else if (activeTab === 'events') {
      if (editingEvent) {
        await updatePublishedContent('event', { ...editingEvent, title: formTitle.trim(), description: formDescription.trim(), date: formDate || 'TBA', time: formTime || 'TBA', location: formLocation || 'TBA', category: formCategory });
        resetForm();
        return;
      }
      const newEvent: DepartmentEvent = {
        id: `event-${Date.now()}`, ownerId: currentUser.id, title: formTitle.trim(), date: formDate || 'TBA', time: formTime || 'TBA', location: formLocation || 'IRE Innovation Hub', description: formDescription.trim(), organizer: currentUser.name, coverImage: '', isUpcoming: true, category: formCategory, participantsCount: 0, attendeesAvatars: [], attendeesCount: 0, isUserRsvped: false
      };
      await createDepartmentEvent(newEvent);
    } else if (canManageDepartment) {
      if (editingMilestone) {
        await updateDepartmentMilestone({ ...editingMilestone, year: formDate.trim(), title: formTitle.trim(), description: formDescription.trim() });
      } else {
        await createDepartmentMilestone({ id: `milestone-${Date.now()}`, year: formDate.trim(), title: formTitle.trim(), description: formDescription.trim() });
      }
    }
    resetForm();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-200 mb-1.5">
          Department Information
        </div>
        <h1 className="font-heading text-[24px] md:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
          Department Information
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mt-0.5">
          Notices, events, department history, and student achievements.
        </p>
      </div>

      {((activeTab === 'announcements' || activeTab === 'events') || (canManageDepartment && activeTab === 'history')) && (
        <div className="flex justify-end">
          <button type="button" onClick={() => isAdding ? resetForm() : setIsAdding(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800">
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>{isAdding ? 'Close editor' : activeTab === 'history' ? 'Add milestone' : activeTab === 'events' ? 'Add event or workshop' : 'Add announcement'}</span>
          </button>
        </div>
      )}

      {canManageDepartment && activeTab === 'hall_of_fame' && (
        <div className="flex justify-end">
          <button type="button" onClick={() => openCreateModalWithType('achievement')} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800">
            <span className="material-symbols-outlined text-[16px]">add</span><span>Add Hall of Fame entry</span>
          </button>
        </div>
      )}

      {isAdding && ((activeTab === 'announcements' || activeTab === 'events') || canManageDepartment) && (
        <form onSubmit={submitDepartmentItem} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <input required value={formTitle} onChange={(event) => setFormTitle(event.target.value)} placeholder={activeTab === 'history' ? 'Milestone title' : activeTab === 'events' ? 'Event or workshop title' : 'Announcement title'} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-600" />
          <textarea required rows={3} value={formDescription} onChange={(event) => setFormDescription(event.target.value)} placeholder="Description" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600" />
          {activeTab === 'history' && <input required value={formDate} onChange={(event) => setFormDate(event.target.value)} placeholder="Year" className="rounded-lg border border-slate-200 px-3 py-2 text-xs" />}
          {activeTab === 'events' && <div className="grid grid-cols-1 gap-2 sm:grid-cols-3"><input value={formDate} onChange={(event) => setFormDate(event.target.value)} placeholder="Date, e.g. 18 Sep" className="rounded-lg border border-slate-200 px-3 py-2 text-xs" /><input value={formTime} onChange={(event) => setFormTime(event.target.value)} placeholder="Time" className="rounded-lg border border-slate-200 px-3 py-2 text-xs" /><input value={formLocation} onChange={(event) => setFormLocation(event.target.value)} placeholder="Location" className="rounded-lg border border-slate-200 px-3 py-2 text-xs" /></div>}
          {(activeTab === 'announcements' || activeTab === 'events') && <select value={formCategory} onChange={(event) => setFormCategory(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs"><option>Workshop</option><option>General</option><option>Exam Notice</option><option>Equipment</option><option>Competition</option></select>}
          <div className="flex justify-end"><button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">Publish</button></div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-1">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'announcements'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">campaign</span>
          <span>Announcements ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'events'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">event</span>
          <span>Events &amp; Workshops ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hall_of_fame')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'hall_of_fame'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            military_tech
          </span>
          <span>Hall of Fame</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">auto_stories</span>
          <span>History &amp; Legacy</span>
        </button>
      </div>

      {/* Tab 1: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedAnnouncementCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedAnnouncementCategory === c
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className={`bg-white rounded-xl border p-4 md:p-5 shadow-2xs hover:shadow-xs transition-all ${
                  ann.isPinned ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ann.category === 'Exam Notice'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : ann.category === 'Workshop'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {ann.isPinned && (
                        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          push_pin
                        </span>
                      )}
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{ann.date}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">By {ann.author}</span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <button type="button" onClick={() => setExpandedAnnouncements((previous) => { const next = new Set(previous); if (next.has(ann.id)) next.delete(ann.id); else next.add(ann.id); return next; })} className="flex-1 text-left">
                    <h2 className="font-heading text-sm md:text-base font-bold text-slate-900 mb-1 leading-snug">{ann.title}</h2>
                    <p className={`text-xs text-slate-600 leading-relaxed ${expandedAnnouncements.has(ann.id) ? '' : 'line-clamp-2'}`}>{ann.description}</p>
                  </button>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">{expandedAnnouncements.has(ann.id) ? 'expand_less' : 'expand_more'}</span>
                </div>
                {canManageItem(ann) && <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => startAnnouncementEdit(ann)} className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50">Edit</button>
                  <button type="button" onClick={() => void deletePublishedContent('announcement', ann.id)} className="rounded-md border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-50">Delete</button>
                </div>}

                {ann.image && (
                  <div className="mt-3 rounded-lg overflow-hidden max-h-56 bg-slate-100 border border-slate-200">
                    <img src={ann.image} alt={ann.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Events & Workshops */}
      {activeTab === 'events' && (
        <div className="space-y-3">
          {(events || []).map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center font-bold shrink-0 border border-blue-200">
                  <span className="text-[10px] uppercase font-mono tracking-wider">
                    {evt.date?.split(' ')[0]}
                  </span>
                  <span className="text-[17px] font-extrabold leading-none">{evt.date?.split(' ')[1]?.replace(',', '')}</span>
                </div>

                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
                    {evt.category}
                  </span>
                  <h3 className="font-heading text-sm md:text-base font-bold text-slate-900">{evt.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 max-w-xl">
                    {evt.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">schedule</span>
                      <span className="font-mono text-[11px]">{evt.time}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">location_on</span>
                      <span>{evt.location}</span>
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      <span className="material-symbols-outlined text-[14px]">groups</span>
                      <span>{evt.attendeesCount} Attending</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col items-center gap-2 w-full md:w-auto shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100">
                {canManageItem(evt) && <div className="flex gap-2">
                  <button type="button" onClick={() => startEventEdit(evt)} className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50">Edit</button>
                  <button type="button" onClick={() => void deletePublishedContent('event', evt.id)} className="rounded-md border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-50">Delete</button>
                </div>}
                <button
                  onClick={() => toggleEventRsvp(evt.id)}
                  className={`w-full md:w-32 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                    evt.isUserRsvped
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {evt.isUserRsvped ? '✓ Confirmed' : 'RSVP Now'}
                </button>
                <button
                  onClick={() => showToast('Event added to Google / iCal Calendar!')}
                  className="w-full md:w-32 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Add to Calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Hall of Fame */}
      {activeTab === 'hall_of_fame' && (
        <div className="space-y-4">
          <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 text-center space-y-1 shadow-2xs">
            <span className="material-symbols-outlined text-[32px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              military_tech
            </span>
            <h2 className="font-heading text-base font-bold text-slate-900">
              IRE Laureates &amp; Departmental Trophies
            </h2>
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Honoring outstanding national competition champions, IEEE best paper recipients, and distinguished alumni.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(achievements || []).map((ach) => (
              <div
                key={ach.id}
                onClick={() => setSelectedAchievement(ach)}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-start gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    emoji_events
                  </span>
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-blue-600 font-mono">{ach.category} • {ach.date}</span>
                  <h3 className="font-heading text-xs md:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">{ach.organization}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 pt-0.5">{ach.description}</p>
                  <p className="text-[11px] text-blue-600 font-bold pt-1">Recipient: {ach.personName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: History & Archive */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Narrative Card */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-2xs space-y-3">
            <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">history_edu</span>
              <span>Our Origins &amp; Mission</span>
            </h2>
            <div className="space-y-2 text-xs md:text-sm text-slate-700 leading-relaxed">
              <p>
                Department origins and mission information are maintained by authorized administrators.
              </p>
              <p>
                The department network grows with every verified member and published project, alongside its research labs and academic community.
              </p>
            </div>

            {/* Timeline */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">Departmental Milestones</h3>
              <div className="space-y-3 relative before:absolute before:left-2.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-200">
                {milestones.length > 0 ? milestones.map((milestone) => <div key={milestone.id} className="pl-7 relative"><div className="w-2 h-2 rounded-full bg-blue-600 absolute left-[7px] top-1 ring-3 ring-white"></div><div className="flex justify-between gap-3"><div><h4 className="font-bold text-xs text-slate-900">{milestone.year} — {milestone.title}</h4><p className="text-xs text-slate-500">{milestone.description}</p></div>{canManageItem(milestone) && <div className="flex gap-2"><button type="button" onClick={() => { setEditingMilestone(milestone); setFormDate(milestone.year); setFormTitle(milestone.title); setFormDescription(milestone.description); setIsAdding(true); }} className="text-[11px] font-bold text-slate-700">Edit</button><button type="button" onClick={() => void deleteDepartmentMilestone(milestone.id)} className="text-[11px] font-bold text-rose-700">Delete</button></div>}</div></div>) : <p className="pl-7 text-xs text-slate-500">No milestones have been added yet.</p>}
              </div>
            </div>
          </section>

          {/* Former Faculty & Emeritus Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-2xs space-y-3">
            <h2 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">school</span>
              <span>Former Faculty &amp; Emeritus Professors</span>
            </h2>
            <p className="text-xs text-slate-500">
              Honoring distinguished faculty members who helped shape the IRE curriculum and research labs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {(formerFaculty || []).map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedUserForProfile(f)}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 transition-colors cursor-pointer flex items-center gap-3 group"
                >
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 leading-tight">
                      {f.name}
                    </h3>
                    <p className="text-xs text-blue-600 font-medium">{f.designation}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Tenure: {f.periodServed}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{f.currentAffiliation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
