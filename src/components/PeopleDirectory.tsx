import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PeopleDirectory: React.FC = () => {
  const {
    users,
    setSelectedUserForProfile,
    sendConnectionRequest,
    openMentorshipRequest
  } = useApp();

  const [activeSegment, setActiveSegment] = useState<'students' | 'alumni' | 'faculty'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');
  const [selectedSkillFilter] = useState('All');
  const [facultyStatusFilter, setFacultyStatusFilter] = useState<'all' | 'current' | 'former'>('all');

  const filteredUsers = (users || []).filter((u) => {
    // Segment filter
    if (activeSegment === 'students' && u.role !== 'student') return false;
    if (activeSegment === 'alumni' && u.role !== 'alumni') return false;
    if (activeSegment === 'faculty' && u.role !== 'faculty' && u.role !== 'former_faculty') return false;

    // Faculty current / former sub-filter
    if (activeSegment === 'faculty') {
      if (facultyStatusFilter === 'current' && u.role !== 'faculty') return false;
      if (facultyStatusFilter === 'former' && u.role !== 'former_faculty') return false;
    }

    // Search query
    const q = (searchQuery || '').toLowerCase();
    const userSkills = u.skills || [];
    const userSpecs = u.specialization || [];
    const matchesSearch =
      !q ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.headline && u.headline.toLowerCase().includes(q)) ||
      userSkills.some((s) => s && s.toLowerCase().includes(q)) ||
      userSpecs.some((s) => s && s.toLowerCase().includes(q)) ||
      (u.location && u.location.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Batch filter
    if (selectedBatchFilter !== 'All' && u.batch !== selectedBatchFilter) return false;

    // Skill filter
    if (selectedSkillFilter !== 'All' && !userSkills.includes(selectedSkillFilter) && !userSpecs.includes(selectedSkillFilter)) return false;

    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="font-heading text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
          People Directory
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mt-0.5">
          Explore and connect with current students, alumni working globally, and leading academic faculty.
        </p>
      </div>

      {/* Search & Segmented Controls */}
      <div className="space-y-2.5">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeSegment} by name, skill, specialization, company...`}
            className="w-full h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-2xs"
          />
        </div>

        {/* Segment Tabs */}
        <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 max-w-xs">
          <button
            onClick={() => {
              setActiveSegment('students');
              setSelectedBatchFilter('All');
            }}
            className={`flex-1 py-1 text-center rounded-md text-xs font-bold transition-all ${
              activeSegment === 'students'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => {
              setActiveSegment('alumni');
              setSelectedBatchFilter('All');
            }}
            className={`flex-1 py-1 text-center rounded-md text-xs font-bold transition-all ${
              activeSegment === 'alumni'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alumni
          </button>
          <button
            onClick={() => {
              setActiveSegment('faculty');
              setSelectedBatchFilter('All');
            }}
            className={`flex-1 py-1 text-center rounded-md text-xs font-bold transition-all ${
              activeSegment === 'faculty'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faculty
          </button>
        </div>

        {/* Dynamic Filters Row */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {activeSegment === 'faculty' ? (
            <>
              <button
                onClick={() => setFacultyStatusFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  facultyStatusFilter === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                All Faculty
              </button>
              <button
                onClick={() => setFacultyStatusFilter('current')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  facultyStatusFilter === 'current'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Current Faculty
              </button>
              <button
                onClick={() => setFacultyStatusFilter('former')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  facultyStatusFilter === 'former'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Former Faculty / Emeritus
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedBatchFilter('All')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  selectedBatchFilter === 'All'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                All Batches
              </button>
              <button
                onClick={() => setSelectedBatchFilter('Batch 7')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  selectedBatchFilter === 'Batch 7'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Batch 7 (2026)
              </button>
              <button
                onClick={() => setSelectedBatchFilter('Batch 6')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  selectedBatchFilter === 'Batch 6'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Batch 6 (2025)
              </button>
              <button
                onClick={() => setSelectedBatchFilter('Batch 3')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  selectedBatchFilter === 'Batch 3'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Batch 3 (2021)
              </button>
              <button
                onClick={() => setSelectedBatchFilter('Batch 2')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  selectedBatchFilter === 'Batch 2'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Batch 2 (2020)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {(filteredUsers || []).map((person) => (
          <div
            key={person.id}
            onClick={() => setSelectedUserForProfile(person)}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3 mb-2.5">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer"
                  onClick={() => setSelectedUserForProfile(person)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h3
                      onClick={() => setSelectedUserForProfile(person)}
                      className="font-heading text-xs font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                    >
                      {person.name}
                    </h3>
                    <span className="material-symbols-outlined text-blue-600 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {person.designation || person.headline}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    {person.role === 'former_faculty' ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-bold border border-slate-200">
                        {person.periodServed || 'Former Faculty'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold border border-blue-200/60 font-mono">
                        {person.batch || person.role.replace('_', ' ')}
                      </span>
                    )}

                    {person.isAvailableForMentorship && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[9px] font-bold border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Mentor
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mt-1">
                {person.bio}
              </p>

              {/* Specialization or Skills Chips */}
              <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-slate-100">
                {(person.specialization || person.skills || []).slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 text-[10px] font-medium border border-slate-200/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={(event) => { event.stopPropagation(); setSelectedUserForProfile(person); }}
                className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View Profile
              </button>

              {person.isAvailableForMentorship ? (
                <button
                  onClick={(event) => { event.stopPropagation(); openMentorshipRequest(person); }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs"
                >
                  Request Mentor
                </button>
              ) : (
                <button
                  onClick={(event) => { event.stopPropagation(); sendConnectionRequest(person.id); }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="material-symbols-outlined text-[32px] text-slate-400">person_search</span>
          <h3 className="font-heading text-sm font-bold text-slate-900">No members match the filters</h3>
          <p className="text-xs text-slate-500">Try resetting batch or skill selections.</p>
        </div>
      )}
    </div>
  );
};
