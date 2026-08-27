import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const OpportunityDetailModal: React.FC = () => {
  const {
    selectedOpportunity,
    setSelectedOpportunity,
    toggleSaveItem,
    isItemSaved,
    currentUser,
    showToast
  } = useApp();

  const [coverNote, setCoverNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!selectedOpportunity) return null;

  const isSaved = isItemSaved(selectedOpportunity.id);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Application successfully sent to ${selectedOpportunity.organization}!`);
    setSelectedOpportunity(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-start overflow-y-auto p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setSelectedOpportunity(null)}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Opportunities</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleSaveItem(selectedOpportunity.id)}
              className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                isSaved ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                bookmark
              </span>
            </button>
            <button
              onClick={() => setSelectedOpportunity(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 md:p-6 space-y-4">
          <div className="flex items-start gap-3">
            {selectedOpportunity.organizationLogo ? (
              <img
                src={selectedOpportunity.organizationLogo}
                alt={selectedOpportunity.organization}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-white font-bold text-base flex items-center justify-center shrink-0">
                {selectedOpportunity.organization.charAt(0)}
              </div>
            )}
            <div>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider font-mono">
                {selectedOpportunity.type}
              </span>
              <h1 className="font-heading text-lg md:text-xl font-bold text-slate-900 mt-1">
                {selectedOpportunity.title}
              </h1>
              <p className="text-xs text-slate-700 font-semibold">
                {selectedOpportunity.organization} • <span className="font-normal text-slate-500">{selectedOpportunity.location}</span>
              </p>
              <p className="text-[11px] text-red-600 font-bold mt-0.5 font-mono">
                Application Deadline: {selectedOpportunity.deadline}
              </p>
            </div>
          </div>

          {/* Description */}
          <section className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-1.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Role Overview &amp; Responsibilities</h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedOpportunity.description}
            </p>
          </section>

          {/* Required Skills */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Required Skills &amp; Competencies</h2>
            <div className="flex flex-wrap gap-1.5">
              {(selectedOpportunity.skillsRequired || []).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/60 font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Application Box */}
          {!isApplying ? (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-900 font-bold">Ready to apply?</p>
                <p className="text-[11px] text-slate-500">Your verified IRE academic profile and skills will be submitted.</p>
              </div>
              <button
                onClick={() => setIsApplying(true)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-2xs"
              >
                Start Direct Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Submit Application</h3>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Personal Note / Cover Pitch</label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself, your focus areas in IRE, and relevant projects..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-blue-600 text-[16px]">description</span>
                  <span className="font-bold text-slate-900 font-mono">{currentUser.name}_Verified_CV.pdf</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold font-mono">✓ Attached</span>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-2xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
