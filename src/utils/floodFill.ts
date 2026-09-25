import type { PixelData, PixelValue } from '../types/pixel';
import { indexOf } from './pixelData';

/**
 * Preenche a região conectada de mesma cor a partir de (startRow, startCol).
 * Implementação iterativa (pilha explícita) para não depender do limite de
 * profundidade de recursão do motor JS em grades grandes.
 *
 * Retorna a MESMA referência de `data` quando não há nada a fazer (cor de
 * destino já é a cor de preenchimento), o que permite ao chamador detectar
 * um no-op sem custo extra.
 */
export function floodFill(
  data: PixelData,
  startRow: number,
  startCol: number,
  fillColor: PixelValue,
): PixelData {
  const { size, pixels } = data;
  const startIndex = indexOf(size, startRow, startCol);
  const targetColor = pixels[startIndex];

  if (targetColor === fillColor) {
    return data;
  }

  const next = pixels.slice();
  const stack: number[] = [startIndex];

  while (stack.length > 0) {
    const idx = stack.pop() as number;
    if (next[idx] !== targetColor) continue;

    next[idx] = fillColor;

    const row = Math.floor(idx / size);
    const col = idx % size;

    if (row > 0) stack.push(idx - size);
    if (row < size - 1) stack.push(idx + size);
    if (col > 0) stack.push(idx - 1);
    if (col < size - 1) stack.push(idx + 1);
  }

  return { size, pixels: next };
}
