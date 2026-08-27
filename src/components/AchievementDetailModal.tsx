import React from 'react';
import { useApp } from '../context/AppContext';

export const AchievementDetailModal: React.FC = () => {
  const {
    selectedAchievement,
    setSelectedAchievement,
    setSelectedProject,
    projects,
    toggleSaveItem,
    isItemSaved,
    showToast
  } = useApp();

  if (!selectedAchievement) return null;

  const isSaved = isItemSaved(selectedAchievement.id);
  const relatedProject = projects.find((p) => p.id === selectedAchievement.relatedProjectId);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Achievement link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-start overflow-y-auto p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 relative animate-in zoom-in-95 duration-200">
        {/* Navigation Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setSelectedAchievement(null)}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleSaveItem(selectedAchievement.id)}
              className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                isSaved ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                bookmark
              </span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
            <button
              onClick={() => setSelectedAchievement(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Hero Image Area */}
        {selectedAchievement.image && (
          <div className="w-full aspect-[21/8] bg-slate-100 overflow-hidden relative">
            <img
              src={selectedAchievement.image}
              alt={selectedAchievement.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Content Layout */}
        <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Core Narrative */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    military_tech
                  </span>
                  {selectedAchievement.category}
                </span>
                <span>•</span>
                <span className="font-mono">{selectedAchievement.date}</span>
              </div>

              <h1 className="font-heading text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
                {selectedAchievement.title}
              </h1>
            </div>

            {/* Author Block */}
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <img
                src={selectedAchievement.personAvatar}
                alt={selectedAchievement.personName}
                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-xs text-slate-900">{selectedAchievement.personName}</h4>
                <p className="text-[11px] text-slate-500">{selectedAchievement.personRole}</p>
              </div>
            </div>

            {/* Narrative Article */}
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>{selectedAchievement.description}</p>
              <p>
                The team engineered a robust modular autonomy stack capable of operating without GPS reliance in simulated disaster recovery zones, outpacing runner-up institutions by a wide benchmark margin.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              <button
                onClick={() => showToast('Opening certificate verification document...')}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>View Official Certificate</span>
              </button>

              {selectedAchievement.verificationUrl && (
                <a
                  href={selectedAchievement.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Validation URL</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Bento Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            {/* Awarding Organization */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span>Verified Achievement</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Awarding Organization</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedAchievement.organization}</p>
              </div>
            </div>

            {/* Related Project Card */}
            {relatedProject && (
              <div
                onClick={() => {
                  setSelectedAchievement(null);
                  setSelectedProject(relatedProject);
                }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-600 transition-colors cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  <span>Related Project</span>
                  <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-blue-600">
                    arrow_forward
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <img
                    src={relatedProject.coverImage}
                    alt={relatedProject.title}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 truncate leading-tight">
                      {relatedProject.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">{relatedProject.category}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Collaborators */}
            {selectedAchievement.collaborators && selectedAchievement.collaborators.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Collaborators</h4>
                <div className="space-y-1.5">
                  {(selectedAchievement.collaborators || []).map((collab) => (
                    <div key={collab.name} className="flex items-center gap-2 text-xs">
                      {collab.avatar ? (
                        <img src={collab.avatar} alt={collab.name} className="w-6 h-6 rounded-md object-cover border border-slate-200" />
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">
                          {collab.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{collab.name}</p>
                        <p className="text-[10px] text-slate-500">{collab.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applied Skills */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Applied Skills</h4>
              <div className="flex flex-wrap gap-1">
                {(selectedAchievement.appliedSkills || []).map((sk) => (
                  <span
                    key={sk}
                    className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200/60 font-mono"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
