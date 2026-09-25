import type { GridSize, PixelData, PixelValue } from '../types/pixel';

export function createEmptyPixelData(size: GridSize): PixelData {
  return { size, pixels: new Array<PixelValue>(size * size).fill(null) };
}

export function indexOf(size: GridSize, row: number, col: number): number {
  return row * size + col;
}

export function getPixel(data: PixelData, row: number, col: number): PixelValue {
  return data.pixels[indexOf(data.size, row, col)] ?? null;
}

/**
 * Clonagem rasa do array de pixels. Como cada elemento é um valor primitivo
 * (string ou null), um `.slice()` já garante uma cópia independente e
 * barata — não é necessário clonar "profundamente".
 */
export function clonePixelData(data: PixelData): PixelData {
  return { size: data.size, pixels: data.pixels.slice() };
}

export function isEmpty(data: PixelData): boolean {
  return data.pixels.every((pixel) => pixel === null);
}

/**
 * Reamostra a arte para um novo tamanho de grade usando nearest-neighbor,
 * preservando a proporção do desenho original (a mesma técnica usada ao
 * importar uma imagem).
 */
export function resizePixelData(data: PixelData, newSize: GridSize): PixelData {
  const next = createEmptyPixelData(newSize);
  for (let row = 0; row < newSize; row++) {
    const srcRow = Math.min(data.size - 1, Math.floor((row * data.size) / newSize));
    for (let col = 0; col < newSize; col++) {
      const srcCol = Math.min(data.size - 1, Math.floor((col * data.size) / newSize));
      next.pixels[indexOf(newSize, row, col)] = getPixel(data, srcRow, srcCol);
    }
  }
  return next;
}
