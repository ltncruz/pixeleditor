import type { GridSize } from './types/pixel';

export const GRID_SIZES: GridSize[] = [8, 16, 32, 64];

export const DEFAULT_GRID_SIZE: GridSize = 16;

/** Resolução interna do canvas, em pixels reais, por célula da grade. */
export const CELL_RESOLUTION = 24;

/** Profundidade máxima da pilha de undo/redo, para evitar crescimento ilimitado. */
export const HISTORY_LIMIT = 50;

export const EXPORT_SIZE_OPTIONS = [128, 256, 512] as const;

export const DEFAULT_PALETTE: string[] = [
  '#1a1a2e',
  '#16213e',
  '#0f3460',
  '#533483',
  '#e94560',
  '#f38181',
  '#fce38a',
  '#eaffd0',
  '#95e1d3',
  '#3fc1c9',
  '#364f6b',
  '#fc5185',
  '#f5f5f5',
  '#c0c0c0',
  '#6b6b6b',
  '#000000',
];

export const DEFAULT_COLOR = '#e94560';

export const STORAGE_KEYS = {
  palette: 'pixel-studio:palette',
  project: 'pixel-studio:project',
} as const;

export const PROJECT_FILE_FORMAT = 'pixel-studio-project' as const;
