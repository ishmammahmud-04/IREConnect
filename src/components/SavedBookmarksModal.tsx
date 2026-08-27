import React from 'react';
import { useApp } from '../context/AppContext';

export const SavedBookmarksModal: React.FC = () => {
  const {
    isSavedModalOpen,
    setIsSavedModalOpen,
    savedItemIds,
    projects,
    publications,
    articles,
    opportunities,
    achievements,
    setSelectedProject,
    setSelectedPublication,
    setSelectedArticle,
    setSelectedOpportunity,
    toggleSaveItem
  } = useApp();

  if (!isSavedModalOpen) return null;

  const savedProjects = (projects || []).filter((p) => savedItemIds?.has ? savedItemIds.has(p.id) : false);
  const savedPublications = (publications || []).filter((p) => savedItemIds?.has ? savedItemIds.has(p.id) : false);
  const savedArticles = (articles || []).filter((a) => savedItemIds?.has ? savedItemIds.has(a.id) : false);
  const savedOpps = (opportunities || []).filter((o) => savedItemIds?.has ? savedItemIds.has(o.id) : false);
  const savedAchievements = (achievements || []).filter((ach) => savedItemIds?.has ? savedItemIds.has(ach.id) : false);

  const totalSaved =
    (savedProjects?.length || 0) +
    (savedPublications?.length || 0) +
    (savedArticles?.length || 0) +
    (savedOpps?.length || 0) +
    (savedAchievements?.length || 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              bookmark
            </span>
            <h2 className="font-heading text-sm font-bold text-slate-900">
              Saved Bookmarks ({totalSaved})
            </h2>
          </div>
          <button
            onClick={() => setIsSavedModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* List Content */}
        <div className="p-5 space-y-2.5 max-h-[65vh] overflow-y-auto">
          {totalSaved === 0 ? (
            <div className="p-8 text-center space-y-1.5">
              <span className="material-symbols-outlined text-[28px] text-slate-400">bookmark_border</span>
              <p className="text-xs text-slate-700 font-bold">No saved items yet.</p>
              <p className="text-[11px] text-slate-500">Click the bookmark icon on any paper, article, or project to save it here.</p>
            </div>
          ) : (
            <>
              {savedProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setIsSavedModalOpen(false);
                    setSelectedProject(p);
                  }}
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between hover:border-blue-600 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={p.coverImage} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold uppercase text-blue-600 font-mono">Project</span>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 truncate">{p.title}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{p.category} • {p.batch}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveItem(p.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}

              {savedPublications.map((pub) => (
                <div
                  key={pub.id}
                  onClick={() => {
                    setIsSavedModalOpen(false);
                    setSelectedPublication(pub);
                  }}
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between hover:border-blue-600 transition-colors cursor-pointer group"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold uppercase text-blue-600 font-mono">Research Paper</span>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 truncate">{pub.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{pub.journal} • {pub.date}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveItem(pub.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}

              {savedArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    setIsSavedModalOpen(false);
                    setSelectedArticle(art);
                  }}
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between hover:border-blue-600 transition-colors cursor-pointer group"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold uppercase text-blue-600 font-mono">Technical Blog</span>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 truncate">{art.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate">By {art.author.name} • {art.readingTime}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveItem(art.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}

              {savedOpps.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => {
                    setIsSavedModalOpen(false);
                    setSelectedOpportunity(opp);
                  }}
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between hover:border-blue-600 transition-colors cursor-pointer group"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold uppercase text-emerald-700 font-mono">{opp.type}</span>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 truncate">{opp.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{opp.organization} • Deadline: {opp.deadline}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveItem(opp.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
