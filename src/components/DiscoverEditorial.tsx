import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DiscoverEditorial: React.FC = () => {
  const {
    activeDiscoverCategory,
    setActiveDiscoverCategory,
    globalSearchQuery,
    setGlobalSearchQuery,
    articles,
    publications,
    achievements,
    projects,
    setSelectedArticle,
    setSelectedPublication,
    setSelectedAchievement,
    setSelectedProject,
    setIsCreateModalOpen
  } = useApp();

  const categories = [
    'For You',
    'Achievements',
    'Research Papers',
    'Journals',
    'Blogs',
    'Projects',
    'Certifications'
  ];

  // Filter items based on active category & global search
  const q = (globalSearchQuery || '').toLowerCase();

  const filteredArticles = (articles || []).filter(
    (a) =>
      (!q ||
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.tags && a.tags.some((t) => t && t.toLowerCase().includes(q)))) &&
      (activeDiscoverCategory === 'For You' || activeDiscoverCategory === 'Blogs')
  );

  const filteredPublications = (publications || []).filter(
    (p) =>
      (!q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.keywords && p.keywords.some((k) => k && k.toLowerCase().includes(q)))) &&
      (activeDiscoverCategory === 'For You' ||
        activeDiscoverCategory === 'Research Papers' ||
        activeDiscoverCategory === 'Journals')
  );

  const filteredAchievements = (achievements || []).filter(
    (ach) =>
      (!q ||
        (ach.title && ach.title.toLowerCase().includes(q)) ||
        (ach.organization && ach.organization.toLowerCase().includes(q))) &&
      (activeDiscoverCategory === 'For You' ||
        activeDiscoverCategory === 'Achievements' ||
        activeDiscoverCategory === 'Certifications')
  );

  const filteredProjects = (projects || []).filter(
    (proj) =>
      (!q ||
        (proj.title && proj.title.toLowerCase().includes(q)) ||
        (proj.technologies && proj.technologies.some((t) => t && t.toLowerCase().includes(q)))) &&
      (activeDiscoverCategory === 'For You' || activeDiscoverCategory === 'Projects')
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Editorial Hero Intro */}
      <section className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-200 mb-1.5">
              Knowledge Repository
            </div>
            <h1 className="font-heading text-[24px] md:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">
              Discover &amp; Publications
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl mt-0.5">
              Peer-reviewed research, engineering blogs, national trophies, and project archives across our department.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5 shrink-0 self-start md:self-auto shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Add to Discover</span>
          </button>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full pt-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Search achievements, papers, blogs, projects, technologies..."
            className="w-full h-10 pl-10 pr-10 rounded-xl border border-slate-200 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs md:text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => {
            const isActive = activeDiscoverCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveDiscoverCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Hero Card - Only on 'For You' or 'Research Papers' */}
      {(activeDiscoverCategory === 'For You' || activeDiscoverCategory === 'Research Papers') && !globalSearchQuery && publications.length > 0 && (
        <article
          onClick={() => setSelectedPublication(publications[0])}
          className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all duration-300 overflow-hidden flex flex-col lg:flex-row group cursor-pointer"
        >
          <div className="w-full lg:w-1/2 h-56 lg:h-auto min-h-[240px] relative overflow-hidden bg-slate-900">
            <img
              src={publications[0].coverImage}
              alt={publications[0].title}
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-600/95 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                Featured Research Paper
              </span>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-5 lg:p-6 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span className="font-bold text-slate-700">{publications[0].journal}</span>
                <span>•</span>
                <span>DOI: {publications[0].doi}</span>
              </div>
              <h2 className="font-heading text-[18px] md:text-[22px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {publications[0].title}
              </h2>
              <p className="text-xs md:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {publications[0].abstract}
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-slate-700">
                <span className="material-symbols-outlined text-[16px] text-blue-600">group</span>
                <span className="text-xs font-semibold">
                  By {publications[0].authors.join(', ')}
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {(publications[0]?.keywords || []).slice(0, 3).map((kw) => (
                  <span key={kw} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/60">
                    {kw}
                  </span>
                ))}
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs">
                Read Paper
              </button>
            </div>
          </div>
        </article>
      )}

      {/* Bento Grid Editorial Modules */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Achievements Card (Span 6 or 12) */}
        {filteredAchievements.map((ach) => (
          <article
            key={ach.id}
            onClick={() => setSelectedAchievement(ach)}
            className="md:col-span-6 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      emoji_events
                    </span>
                  </div>
                  <div>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[9px] font-bold uppercase tracking-widest border border-amber-200">
                      {ach.category}
                    </span>
                    <h3 className="font-heading text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mt-0.5">
                      {ach.title}
                    </h3>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-1">
                {ach.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <img
                  src={ach.personAvatar}
                  alt={ach.personName}
                  className="w-6 h-6 rounded-md object-cover border border-slate-200"
                />
                <span className="font-bold text-slate-900">{ach.personName}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 font-bold">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span>Verified Award</span>
              </div>
            </div>
          </article>
        ))}

        {/* Technical Blog / Article Cards (Span 6) */}
        {filteredArticles.map((art) => (
          <article
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="md:col-span-6 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col group"
          >
            <div className="w-full h-40 relative overflow-hidden bg-slate-900">
              <img
                src={art.coverImage}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 shadow-2xs">
                Technical Blog
              </div>
              <div className="absolute top-2.5 right-2.5 bg-[#0F172A]/90 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-700">
                {art.readingTime}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {art.category}
                </span>
                <h3 className="font-heading text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mt-0.5">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {art.subtitle}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <img
                    src={art.author.avatar}
                    alt={art.author.name}
                    className="w-5 h-5 rounded object-cover border border-slate-200"
                  />
                  <span className="font-medium text-slate-700">{art.author.name}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">{art.date}</span>
              </div>
            </div>
          </article>
        ))}

        {/* Project Showcase Cards (Span 6) */}
        {filteredProjects.map((proj) => (
          <article
            key={proj.id}
            onClick={() => setSelectedProject(proj)}
            className="md:col-span-6 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col group"
          >
            <div className="h-40 w-full relative overflow-hidden bg-slate-900">
              <img
                src={proj.coverImage}
                alt={proj.title}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-900">
                Project Showcase
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
              <div>
                <h3 className="font-heading text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {proj.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {(proj.technologies || []).map((t) => (
                  <span key={t} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-medium rounded border border-slate-200/60">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Empty State */}
      {filteredArticles.length === 0 &&
        filteredPublications.length === 0 &&
        filteredAchievements.length === 0 &&
        filteredProjects.length === 0 && (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-2.5">
            <span className="material-symbols-outlined text-[40px] text-slate-400">search_off</span>
            <h3 className="font-heading text-base font-bold text-slate-900">No matching content found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try modifying your search keywords or switching category filters.
            </p>
            <button
              onClick={() => {
                setGlobalSearchQuery('');
                setActiveDiscoverCategory('For You');
              }}
              className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Reset Filters
            </button>
          </div>
        )}
    </div>
  );
};
