import React from 'react';
import { useApp } from '../context/AppContext';
import { MediaViewer } from './MediaViewer';

export const ResearchDetailModal: React.FC = () => {
  const {
    selectedPublication,
    setSelectedPublication,
    toggleSaveItem,
    isItemSaved,
    showToast,
    currentUser,
    deletePublishedContent,
    setCreateModalEditingItem,
    setIsCreateModalOpen
  } = useApp();

  if (!selectedPublication) return null;

  const isSaved = isItemSaved(selectedPublication.id);
 const canManage = selectedPublication.ownerId === currentUser.id || selectedPublication.authors?.includes(currentUser.name);

 const handleShare = async () => {
   const shareText = `${selectedPublication.title} — ${selectedPublication.externalUrl || window.location.href}`;
   try {
     await navigator.clipboard.writeText(shareText);
     showToast('Publication link copied to clipboard!');
   } catch {
     showToast('Share text ready to copy: ' + shareText);
   }
 };

 const handleDelete = async () => {
   const ok = await deletePublishedContent('publication', selectedPublication.id);
   if (ok) setSelectedPublication(null);
 };

 const handleEdit = () => {
   setCreateModalEditingItem({ type: 'publication', item: selectedPublication });
   setIsCreateModalOpen(true);
   setSelectedPublication(null);
 };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-start overflow-y-auto p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 relative animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setSelectedPublication(null)}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleSaveItem(selectedPublication.id)}
              className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                isSaved ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                bookmark
              </span>
            </button>
            <button
              onClick={() => setSelectedPublication(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Paper Main Content */}
        <div className="p-5 md:p-8 space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200/60 font-mono">
              <span className="material-symbols-outlined text-[13px]">description</span>
              <span>{selectedPublication.publicationType} • {selectedPublication.status}</span>
            </div>

            <h1 className="font-heading text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
              {selectedPublication.title}
            </h1>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 pt-0.5">
              <span className="font-bold text-slate-900">Authors:</span>
              <span>{selectedPublication.authors.join(', ')}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
              <span><strong>Journal:</strong> {selectedPublication.journal}</span>
              <span><strong>DOI:</strong> <a href={`https://doi.org/${selectedPublication.doi}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{selectedPublication.doi}</a></span>
              <span><strong>Date:</strong> {selectedPublication.date}</span>
            </div>
          </div>

          {selectedPublication.coverImage && (
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <div className="h-56 w-full bg-slate-100 md:h-72">
                <MediaViewer src={selectedPublication.coverImage} alt={selectedPublication.title} />
              </div>
            </section>
          )}

          {/* Abstract Box */}
          <section className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 space-y-2">
            <h2 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">subject</span>
              Abstract
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedPublication.abstract}
            </p>
          </section>

          {/* Keywords */}
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Keywords &amp; Discipline</h3>
            <div className="flex flex-wrap gap-1.5">
              {(selectedPublication.keywords || []).map((kw) => (
                <span key={kw} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Actions Button Strip */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            {selectedPublication.externalUrl && (
              <a href={selectedPublication.externalUrl} target="_blank" rel="noreferrer" className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                Open publication link
              </a>
            )}
            {selectedPublication.pdfUrl && <a href={selectedPublication.pdfUrl} target="_blank" rel="noreferrer" className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-2xs">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>Read Full Paper</span>
            </a>}

            {selectedPublication.pdfUrl && <a href={selectedPublication.pdfUrl} download={`${selectedPublication.title}.pdf`} className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs">
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download PDF</span>
            </a>}

            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>Share</span>
            </button>

            {canManage && (
              <>
                <button
                  onClick={handleEdit}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
