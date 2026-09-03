import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cropImageFile } from '../utils/imageCrop';

interface ImageCropModalProps {
  file: File;
  mode: 'avatar' | 'banner' | 'cover';
  onClose: () => void;
  onApply: (file: File) => void | Promise<void>;
}

const getAspectRatio = (mode: ImageCropModalProps['mode']) => {
  if (mode === 'avatar') return 1;
  if (mode === 'banner') return 3;
  return 16 / 9;
};

export const ImageCropModal: React.FC<ImageCropModalProps> = ({ file, mode, onClose, onApply }) => {
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const dragStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => () => URL.revokeObjectURL(imageUrl), [imageUrl]);

  const aspectRatio = getAspectRatio(mode);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: event.clientX, y: event.clientY, offsetX, offsetY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;
    setOffsetX(dragStartRef.current.offsetX + dx / 240);
    setOffsetY(dragStartRef.current.offsetY + dy / 240);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    dragStartRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleApply = async () => {
    setIsProcessing(true);
    try {
      const processedFile = await cropImageFile(file, {
        aspectRatio,
        zoom,
        offsetX,
        offsetY,
        outputWidth: mode === 'avatar' ? 800 : mode === 'banner' ? 1800 : 1400,
        outputHeight: mode === 'avatar' ? 800 : mode === 'banner' ? 600 : 900,
        quality: 0.9,
        mimeType: 'image/jpeg',
        fileName: `${mode}-${Date.now()}.jpg`
      });
      await onApply(processedFile);
      onClose();
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : 'Could not crop that image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="crop-photo-title">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Crop photo</p>
            <h3 id="crop-photo-title" className="font-heading text-base font-bold text-slate-900">
              {mode === 'avatar' ? 'Profile photo' : mode === 'banner' ? 'Profile banner' : 'Cover image'}
            </h3>
            <p className="mt-1 max-w-[28rem] truncate text-[10px] text-slate-500" title={file.name}>
              {file.name} · JPG, JPEG, PNG, WEBP, or BMP · max 5 MB
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100">Close</button>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-xl border border-slate-200 bg-slate-100 p-2">
            <div
              className="relative mx-auto overflow-hidden rounded-xl border border-slate-200 bg-slate-200"
              style={{ aspectRatio: `${aspectRatio}`, maxHeight: '60vh', width: '100%' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <img
                src={imageUrl}
                alt="Crop preview"
                className="pointer-events-none h-full w-full select-none object-cover"
                style={{
                  transform: `translate(${offsetX * 120}px, ${offsetY * 120}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
              />
              <div className="pointer-events-none absolute inset-0 ring-2 ring-slate-900/20 ring-inset" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              <span>Zoom</span>
              <span>{zoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              aria-label="Zoom crop preview"
              min={1}
              max={2.5}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-2 w-full accent-blue-600"
            />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setOffsetX((value) => value - 0.1)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Move left</button>
            <button type="button" onClick={() => setOffsetX((value) => value + 0.1)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Move right</button>
            <button type="button" onClick={() => setOffsetY((value) => value - 0.1)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Move up</button>
            <button type="button" onClick={() => setOffsetY((value) => value + 0.1)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Move down</button>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="button" disabled={isProcessing} onClick={() => void handleApply()} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isProcessing ? 'Cropping…' : 'Apply crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
