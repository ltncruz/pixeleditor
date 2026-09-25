import type { PixelData } from '../types/pixel';
import { createExportCanvas } from './canvas';

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPixelDataAsPng(
  data: PixelData,
  targetPx: number,
  fileName: string,
): Promise<void> {
  const canvas = createExportCanvas(data, targetPx);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Não foi possível gerar o PNG.'));
        return;
      }
      downloadBlob(blob, fileName);
      resolve();
    }, 'image/png');
  });
}
