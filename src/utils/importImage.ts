import type { GridSize, PixelData, PixelValue } from '../types/pixel';
import { indexOf } from './pixelData';

/** Pixels com alfa abaixo deste limite são tratados como totalmente transparentes. */
const ALPHA_THRESHOLD = 32;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível carregar a imagem.'));
    };
    img.src = url;
  });
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, '0');
}

/**
 * Importa uma imagem e converte para a representação interna de pixels no
 * tamanho de grade escolhido. A amostragem é feita manualmente, lendo o
 * pixel de origem mais próximo do centro de cada célula de destino — em vez
 * de depender do redimensionamento do navegador (que pode suavizar mesmo
 * com `imageSmoothingEnabled = false` ao reduzir uma imagem) — garantindo
 * um resultado nearest-neighbor real, fiel ao estilo pixel art.
 */
export async function importImageAsPixelData(file: File, size: GridSize): Promise<PixelData> {
  const img = await loadImage(file);

  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = img.naturalWidth || img.width;
  sourceCanvas.height = img.naturalHeight || img.height;
  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) {
    throw new Error('Não foi possível processar a imagem.');
  }
  sourceCtx.imageSmoothingEnabled = false;
  sourceCtx.drawImage(img, 0, 0);

  const { width: srcWidth, height: srcHeight } = sourceCanvas;
  const sourceData = sourceCtx.getImageData(0, 0, srcWidth, srcHeight).data;

  const pixels: PixelValue[] = new Array(size * size).fill(null);

  for (let row = 0; row < size; row++) {
    const srcY = Math.min(srcHeight - 1, Math.floor(((row + 0.5) * srcHeight) / size));
    for (let col = 0; col < size; col++) {
      const srcX = Math.min(srcWidth - 1, Math.floor(((col + 0.5) * srcWidth) / size));
      const offset = (srcY * srcWidth + srcX) * 4;
      const alpha = sourceData[offset + 3];

      if (alpha < ALPHA_THRESHOLD) {
        pixels[indexOf(size, row, col)] = null;
      } else {
        const r = sourceData[offset];
        const g = sourceData[offset + 1];
        const b = sourceData[offset + 2];
        pixels[indexOf(size, row, col)] = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
    }
  }

  return { size, pixels };
}
