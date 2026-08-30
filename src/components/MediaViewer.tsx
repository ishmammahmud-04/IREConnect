import React, { useState } from 'react';

export const MediaViewer: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  return (
    <>
      <button type="button" onClick={() => { setZoom(1); setOpen(true); }} className={`block h-full w-full cursor-zoom-in ${className}`} aria-label={`View ${alt} larger`}>
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-4" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col items-end gap-2" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.25))} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white">-</button>
              <span className="min-w-12 text-center text-xs font-bold text-white">{zoom.toFixed(2)}x</span>
              <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white">+</button>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white">Close</button>
            </div>
            <div className="max-h-[85vh] w-full overflow-auto rounded-xl bg-slate-950/70 p-2">
              <img src={src} alt={alt} className="mx-auto max-h-[82vh] w-auto max-w-full object-contain transition-transform" style={{ transform: `scale(${zoom})` }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};