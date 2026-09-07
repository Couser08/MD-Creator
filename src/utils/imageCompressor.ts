/**
 * High-performance client-side image optimization & compression utility.
 * Optimizes images directly in browser memory using HTML5 Canvas and WebP/JPEG encoding.
 * Eliminates server roundtrips, reduces IndexedDB footprint, and ensures 100% offline persistence.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
  preferWebP?: boolean;
}

export interface CompressionResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  savingsPercentage: number;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  mimeType: string;
  fileName: string;
}

/**
 * Format bytes into human-readable string (e.g. "1.2 MB", "450 KB")
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Check if the browser supports Canvas to WebP export
 */
function supportsWebPExport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

/**
 * Compress and optimize an image file or blob.
 */
export async function optimizeImage(
  file: File | Blob,
  fileName = 'image.png',
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    maxSizeBytes = 800 * 1024, // 800 KB target budget
    preferWebP = true,
  } = options;

  const originalSize = file.size;

  // 1. Handle SVG images - preserve vector XML directly without rasterizing
  if (file.type === 'image/svg+xml' || fileName.toLowerCase().endsWith('.svg')) {
    const text = await file.text();
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
    return {
      dataUrl,
      originalSize,
      compressedSize: text.length,
      savingsPercentage: 0,
      originalWidth: 800,
      originalHeight: 600,
      width: 800,
      height: 600,
      mimeType: 'image/svg+xml',
      fileName,
    };
  }

  // 2. Handle animated GIFs - do not compress via canvas to avoid losing frames
  if (file.type === 'image/gif' || fileName.toLowerCase().endsWith('.gif')) {
    const dataUrl = await fileToDataUrl(file);
    return {
      dataUrl,
      originalSize,
      compressedSize: originalSize,
      savingsPercentage: 0,
      originalWidth: 0,
      originalHeight: 0,
      width: 0,
      height: 0,
      mimeType: 'image/gif',
      fileName,
    };
  }

  // 3. Load image into HTMLImageElement
  const img = await loadImageFromBlob(file);
  const originalWidth = img.naturalWidth || img.width;
  const originalHeight = img.naturalHeight || img.height;

  // 4. Calculate smart dimensions preserving aspect ratio
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  if (targetWidth > maxWidth || targetHeight > maxHeight) {
    const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
    targetWidth = Math.round(targetWidth * ratio);
    targetHeight = Math.round(targetHeight * ratio);
  }

  // 5. Setup high-DPI canvas with bicubic smooth scaling
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackUrl = await fileToDataUrl(file);
    return {
      dataUrl: fallbackUrl,
      originalSize,
      compressedSize: originalSize,
      savingsPercentage: 0,
      originalWidth,
      originalHeight,
      width: targetWidth,
      height: targetHeight,
      mimeType: file.type || 'image/png',
      fileName,
    };
  }

  // Enable highest quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Determine output MIME type: prefer WebP if supported, otherwise JPEG
  const canWebP = preferWebP && supportsWebPExport();
  const outputMime = canWebP ? 'image/webp' : 'image/jpeg';

  // If saving as JPEG, fill white background to prevent black transparent areas
  if (outputMime === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // 6. Progressive compression loop to meet target size budget
  let currentQuality = quality;
  let dataUrl = canvas.toDataURL(outputMime, currentQuality);
  let compressedBytes = estimateDataUrlBytes(dataUrl);

  // If still above budget and quality can be stepped down safely
  if (compressedBytes > maxSizeBytes && currentQuality > 0.5) {
    currentQuality = 0.72;
    dataUrl = canvas.toDataURL(outputMime, currentQuality);
    compressedBytes = estimateDataUrlBytes(dataUrl);
  }

  if (compressedBytes > maxSizeBytes && currentQuality > 0.55) {
    currentQuality = 0.58;
    dataUrl = canvas.toDataURL(outputMime, currentQuality);
    compressedBytes = estimateDataUrlBytes(dataUrl);
  }

  // If compressed version is actually larger than original and original was already small, keep original
  if (compressedBytes > originalSize && originalSize < 500 * 1024) {
    dataUrl = await fileToDataUrl(file);
    compressedBytes = originalSize;
  }

  const savings = originalSize > 0 
    ? Math.max(0, Math.round(((originalSize - compressedBytes) / originalSize) * 100))
    : 0;

  return {
    dataUrl,
    originalSize,
    compressedSize: compressedBytes,
    savingsPercentage: savings,
    originalWidth,
    originalHeight,
    width: targetWidth,
    height: targetHeight,
    mimeType: outputMime,
    fileName,
  };
}

/**
 * Load Blob into an HTMLImageElement
 */
function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Convert File/Blob directly to standard Data URL
 */
function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Accurately calculate the byte size of a Base64 Data URL
 */
function estimateDataUrlBytes(dataUrl: string): number {
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) return dataUrl.length;
  const base64Str = dataUrl.slice(commaIdx + 1);
  const padding = (base64Str.endsWith('==') ? 2 : base64Str.endsWith('=') ? 1 : 0);
  return Math.floor((base64Str.length * 3) / 4) - padding;
}
