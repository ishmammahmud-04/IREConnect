import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Opportunity } from '../types';

export const OpportunitiesBoard: React.FC = () => {
  const {
    opportunities,
    setSelectedOpportunity,
    toggleSaveItem,
    isItemSaved,
    currentUser,
    setIsCreateModalOpen
  } = useApp();

  const [activeType, setActiveType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillMatchOnly, setSkillMatchOnly] = useState(false);

  const types = ['All', 'Internship', 'Full-time Job', 'Research Position', 'Competition'];

  const userSkills = currentUser.skills || [];

  const getMatchedSkills = (opp: Opportunity) => {
    const required = opp.requiredSkills || [];
    return required.filter((skill) =>
      userSkills.some((userSkill) => userSkill.trim().toLowerCase() === skill.trim().toLowerCase())
    );
  };

  const filteredOpps = opportunities.filter((opp) => {
    if (activeType !== 'All' && opp.type !== activeType) return false;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      opp.title.toLowerCase().includes(q) ||
      opp.organization.toLowerCase().includes(q) ||
      opp.requiredSkills.some((skill) => skill.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (skillMatchOnly) {
      const matched = getMatchedSkills(opp);
      if (matched.length === 0) return false;
    }

    return true;
  });

  // Recommended opportunities: at least one skill match, sorted descending by match count
  const recommendedOpps = opportunities
    .map((opp) => ({ opp, matchedSkills: getMatchedSkills(opp) }))
    .filter(({ matchedSkills }) => matchedSkills.length > 0)
    .sort((a, b) => b.matchedSkills.length - a.matchedSkills.length)
    .map(({ opp }) => opp);

  const renderOpportunityCard = (opp: Opportunity, isRecommendedCard = false) => {
    const isSaved = isItemSaved(opp.id);
    const requiredSkills = opp.requiredSkills || [];
    const matchedSkills = getMatchedSkills(opp);

    return (
      <div
        key={`${isRecommendedCard ? 'rec-' : ''}${opp.id}`}
        onClick={() => setSelectedOpportunity(opp)}
        className={`bg-white rounded-xl border p-4 md:p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
          isRecommendedCard ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200'
        }`}
      >
        <div className="flex items-start gap-3.5">
          {opp.organizationLogo ? (
            <img
              src={opp.organizationLogo}
              alt={opp.organization}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-base flex items-center justify-center shrink-0">
              {opp.organization.charAt(0)}
            </div>
          )}

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
                {opp.type}
              </span>

              {/* Badge: 3 of 5 skills match */}
              {requiredSkills.length > 0 ? (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                    matchedSkills.length > 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {matchedSkills.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  )}
                  {matchedSkills.length} of {requiredSkills.length} skills match
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-500 text-[10px] font-medium border border-slate-200">
                  Open to all skills
                </span>
              )}
            </div>

            <h2 className="font-heading text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
              {opp.title}
            </h2>

            <p className="text-xs text-slate-700 font-medium">
              {opp.organization} • <span className="font-normal text-slate-500">{opp.location}</span>
            </p>

            <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl pt-0.5 leading-relaxed">
              {opp.description}
            </p>

            <div className="flex flex-wrap gap-1 pt-1.5">
              {requiredSkills.map((skill) => {
                const isMatch = matchedSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
                return (
                  <span
                    key={skill}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      isMatch
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                        : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Column */}
        <div className="flex md:flex-col items-center md:items-end justify-between gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
          <div className="text-left md:text-right">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
              Deadline
            </span>
            <span className="text-xs font-mono font-bold text-slate-900">{opp.deadline}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveItem(opp.id);
              }}
              className={`p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors ${
                isSaved ? 'text-blue-600 border-blue-300 bg-blue-50/50' : 'text-slate-500'
              }`}
              title={isSaved ? 'Bookmarked' : 'Save'}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOpportunity(opp);
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-2xs"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-200 mb-1.5">
            Careers and Research
          </div>
          <h1 className="font-heading text-[24px] md:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Opportunities Board
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Find internships, research positions, jobs, and student opportunities.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5 self-start md:self-auto shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">post_add</span>
          <span>Post an Opportunity</span>
        </button>
      </div>

      {/* Search & Type Filters */}
      <div className="space-y-2.5">
        <div className="relative w-full">
          <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            aria-label="Search opportunities"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, company, robotics lab, or skill required..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeType === t
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700 select-none bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <input
              type="checkbox"
              checked={skillMatchOnly}
              onChange={(e) => setSkillMatchOnly(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-0"
            />
            <span>Matches My Skills Only</span>
          </label>
        </div>
      </div>

      {/* Recommended for You Section (only if at least one opportunity has skill overlap) */}
      {!searchQuery && activeType === 'All' && recommendedOpps.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">
                auto_awesome
              </span>
              <h2 className="font-heading text-base font-bold text-slate-900">
                Recommended for You
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                {recommendedOpps.length} matched
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Ranked by skill match
            </span>
          </div>

          <div className="space-y-3">
            {recommendedOpps.slice(0, 3).map((opp) => renderOpportunityCard(opp, true))}
          </div>
        </div>
      )}

      {/* All / Filtered Opportunities List */}
      <div className="space-y-3">
        {!searchQuery && activeType === 'All' && recommendedOpps.length > 0 && (
          <div className="pt-2">
            <h2 className="font-heading text-sm font-bold text-slate-700 uppercase tracking-wider">
              All Opportunities ({filteredOpps.length})
            </h2>
          </div>
        )}

        {filteredOpps.map((opp) => renderOpportunityCard(opp, false))}
      </div>

      {filteredOpps.length === 0 && (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <span className="material-symbols-outlined text-[36px] text-slate-400">work_off</span>
          <h3 className="font-heading text-sm font-bold text-slate-900">No opportunities found</h3>
          <p className="text-xs text-slate-500">Try resetting filters or checking back soon.</p>
        </div>
      )}
    </div>
  );
};
