import type { PixelData } from '../types/pixel';

/**
 * Redesenha a grade inteira em um contexto 2D. Usado para redraws completos
 * (undo/redo, fill, clear, import, resize) — nunca a cada movimento de
 * mouse durante um traço, que é tratado com um desenho incremental
 * diretamente no componente do canvas.
 */
export function renderPixelData(ctx: CanvasRenderingContext2D, data: PixelData): void {
  const { size, pixels } = data;
  const canvas = ctx.canvas;
  const cellPx = canvas.width / size;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const color = pixels[row * size + col];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(col * cellPx, row * cellPx, cellPx, cellPx);
      }
    }
  }
}

/**
 * Gera um canvas off-screen com a arte renderizada em `targetPx` (largura e
 * altura, em pixels). Os limites de cada célula são arredondados
 * individualmente para eliminar frestas/sobreposições quando o fator de
 * escala não é inteiro, garantindo pixels perfeitamente nítidos e sem
 * anti-aliasing.
 */
export function createExportCanvas(data: PixelData, targetPx: number): HTMLCanvasElement {
  const { size, pixels } = data;
  const canvas = document.createElement('canvas');
  canvas.width = targetPx;
  canvas.height = targetPx;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, targetPx, targetPx);

  const scale = targetPx / size;

  for (let row = 0; row < size; row++) {
    const y0 = Math.round(row * scale);
    const y1 = Math.round((row + 1) * scale);
    for (let col = 0; col < size; col++) {
      const color = pixels[row * size + col];
      if (!color) continue;
      const x0 = Math.round(col * scale);
      const x1 = Math.round((col + 1) * scale);
      ctx.fillStyle = color;
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
  }

  return canvas;
}
