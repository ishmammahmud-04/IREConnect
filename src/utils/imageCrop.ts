export interface CropImageOptions {
  aspectRatio: number;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  outputWidth?: number;
  outputHeight?: number;
  quality?: number;
  mimeType?: string;
  fileName?: string;
}

const loadImage = (file: File): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    URL.revokeObjectURL(objectUrl);
    resolve(image);
  };

  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('Image processing failed.'));
  };

  image.src = objectUrl;
});

const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> => new Promise((resolve, reject) => {
  canvas.toBlob((blob) => {
    if (blob) {
      resolve(blob);
      return;
    }
    reject(new Error('Image processing failed.'));
  }, mimeType, quality);
});

export const cropImageFile = async (file: File, options: CropImageOptions): Promise<File> => {
  const {
    aspectRatio,
    zoom = 1,
    offsetX = 0,
    offsetY = 0,
    outputWidth = 1400,
    outputHeight,
    quality = 0.9,
    mimeType = 'image/jpeg',
    fileName = `cropped-${Date.now()}.jpg`
  } = options;

  const image = await loadImage(file);
  const naturalWidth = image.naturalWidth || image.width;
  const naturalHeight = image.naturalHeight || image.height;
  const effectiveZoom = Math.min(Math.max(zoom, 1), 2.5);

  let cropWidth = naturalWidth;
  let cropHeight = naturalHeight;

  if (naturalWidth / naturalHeight > aspectRatio) {
    cropHeight = naturalHeight / effectiveZoom;
    cropWidth = cropHeight * aspectRatio;
  } else {
    cropWidth = naturalWidth / effectiveZoom;
    cropHeight = cropWidth / aspectRatio;
  }

  if (cropWidth > naturalWidth) cropWidth = naturalWidth;
  if (cropHeight > naturalHeight) cropHeight = naturalHeight;

  const maxOffsetX = Math.max(0, naturalWidth - cropWidth);
  const maxOffsetY = Math.max(0, naturalHeight - cropHeight);
  const centerX = naturalWidth / 2 + offsetX * naturalWidth * 0.8;
  const centerY = naturalHeight / 2 + offsetY * naturalHeight * 0.8;
  const sourceX = Math.min(Math.max(centerX - cropWidth / 2, 0), maxOffsetX);
  const sourceY = Math.min(Math.max(centerY - cropHeight / 2, 0), maxOffsetY);

  const canvas = document.createElement('canvas');
  const finalWidth = outputWidth || Math.round(cropWidth);
  const finalHeight = outputHeight || Math.round(finalWidth / aspectRatio);
  canvas.width = finalWidth;
  canvas.height = finalHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is not available in this browser.');
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await canvasToBlob(canvas, mimeType, quality);
  return new File([blob], fileName, { type: mimeType });
};
