/**
 * Tamanhos de grade suportados pelo editor.
 */
export type GridSize = 8 | 16 | 32 | 64;

/**
 * Valor de um pixel: uma cor em hexadecimal (#rrggbb) ou `null` para
 * representar transparência real (nunca uma cor "falsa" como branco).
 */
export type PixelValue = string | null;

/**
 * Representação lógica da arte: uma matriz de pixels "achatada" (row-major),
 * acompanhada do tamanho da grade. Usar um array plano em vez de array de
 * arrays torna clonagem, serialização e flood fill mais simples e baratos.
 */
export interface PixelData {
  size: GridSize;
  /** length === size * size, index = row * size + col */
  pixels: PixelValue[];
}

/**
 * Ferramentas disponíveis na barra lateral.
 */
export type ToolId = 'pencil' | 'eraser' | 'eyedropper' | 'fill';

/**
 * Formato do arquivo de projeto exportado/importado em JSON.
 */
export interface ProjectFile {
  format: 'pixel-studio-project';
  version: 1;
  name: string;
  size: GridSize;
  pixels: PixelValue[];
  palette: string[];
  currentColor: string;
  savedAt: string;
}

export interface ToastMessage {
  id: number;
  text: string;
  tone: 'info' | 'success' | 'error';
}
