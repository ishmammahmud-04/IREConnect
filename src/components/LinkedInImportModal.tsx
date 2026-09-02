import React from 'react';
import { useApp } from '../context/AppContext';

export const LinkedInImportModal: React.FC = () => {
  const { isLinkedInModalOpen, setIsLinkedInModalOpen } = useApp();

  if (!isLinkedInModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-sm font-bold text-slate-900">LinkedIn</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              LinkedIn import is not connected yet. Add your LinkedIn profile URL from Profile Settings instead.
            </p>
          </div>
          <button type="button" onClick={() => setIsLinkedInModalOpen(false)} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label="Close LinkedIn dialog">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <button type="button" onClick={() => setIsLinkedInModalOpen(false)} className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800">
          Close
        </button>
      </div>
    </div>
  );
};
