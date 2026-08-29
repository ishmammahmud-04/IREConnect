import React from 'react';
import { useApp } from '../context/AppContext';

export const ProjectDetailModal: React.FC = () => {
  const {
    selectedProject,
    setSelectedProject,
    setSelectedUserForProfile,
    users,
    toggleSaveItem,
    isItemSaved,
    showToast,
    currentUser,
    deletePublishedContent,
    setCreateModalEditingItem,
    setIsCreateModalOpen
  } = useApp();

  if (!selectedProject) return null;

  const isSaved = isItemSaved(selectedProject.id);
  const canManage = selectedProject.ownerId === currentUser.id;

  const handleShare = async () => {
    const shareText = `${selectedProject.title} — ${selectedProject.demoUrl || selectedProject.githubUrl || window.location.href}`;
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('Project link copied to clipboard!');
    } catch {
      showToast('Share text ready to copy: ' + shareText);
    }
  };

  const handleDelete = async () => {
    const ok = await deletePublishedContent('project', selectedProject.id);
    if (ok) setSelectedProject(null);
  };

  const handleEdit = () => {
    setCreateModalEditingItem({ type: 'project', item: selectedProject });
    setIsCreateModalOpen(true);
    setSelectedProject(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-start overflow-y-auto p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 relative animate-in zoom-in-95 duration-200">
        {/* Top Action Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleSaveItem(selectedProject.id)}
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
            {canManage && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                  title="Edit project"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  title="Delete project"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </>
            )}
            <button
              onClick={() => setSelectedProject(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Hero Cover */}
        <div className="w-full aspect-[21/8] bg-slate-100 overflow-hidden relative">
          <img
            src={selectedProject.coverImage}
            alt={selectedProject.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Details */}
        <div className="p-5 md:p-6 space-y-5">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/60 font-mono">
                {selectedProject.category}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {selectedProject.batch} • {selectedProject.year}
              </span>
            </div>

            <h1 className="font-heading text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
              {selectedProject.title}
            </h1>

            {/* Links */}
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors text-xs font-bold shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">code</span>
                  <span>GitHub Repository</span>
                </a>
              )}
              {selectedProject.demoUrl && (
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs font-bold shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  <span>Live Demo</span>
                </a>
              )}
              {selectedProject.docUrl && (
                <a
                  href={selectedProject.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span>Technical Documentation</span>
                </a>
              )}
            </div>
          </div>

          {/* 2-Column Bento Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
            {/* Left: Problem & Solution */}
            <div className="md:col-span-8 space-y-4">
              <section className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 space-y-2.5">
                <h2 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">Problem Statement</h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedProject.problem}
                </p>

                <h2 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">Engineered Solution</h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedProject.solution}
                </p>
              </section>

              {/* Technologies */}
              <section className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 space-y-2">
                <h2 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">Technologies &amp; Architecture</h2>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedProject.technologies || []).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200/60 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>

              {/* Media Gallery */}
              {selectedProject.mediaGallery && selectedProject.mediaGallery.length > 0 && (
                <section className="space-y-2">
                  <h2 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">Project Media &amp; Benchmarks</h2>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(selectedProject.mediaGallery || []).map((img, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={img} alt={`Media ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right: Supervisor & Team Members */}
            <div className="md:col-span-4 space-y-3.5">
              {/* Supervisor */}
              {selectedProject.supervisor && (
                <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-2.5 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block font-mono">
                    Faculty Supervisor
                  </span>
                  <div className="flex items-center gap-2.5">
                    {selectedProject.supervisor.avatar && (
                      <img
                        src={selectedProject.supervisor.avatar}
                        alt={selectedProject.supervisor.name || 'Supervisor'}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-xs text-white">{selectedProject.supervisor.name || 'Faculty Advisor'}</h4>
                      <p className="text-[10px] text-slate-400">{selectedProject.supervisor.designation || 'Faculty Member'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Members */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Team Members ({selectedProject.teamMembers?.length || 0})
                </h3>
                <div className="space-y-2">
                  {(selectedProject.teamMembers || []).map((member) => (
                    <div
                      key={member.id}
                      onClick={() => {
                        const target = users.find((u) => u.id === member.id);
                        if (target) setSelectedUserForProfile(target);
                      }}
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
