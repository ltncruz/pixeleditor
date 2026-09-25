import { PROJECT_FILE_FORMAT } from '../constants';
import type { GridSize, PixelValue, ProjectFile } from '../types/pixel';

const VALID_SIZES: GridSize[] = [8, 16, 32, 64];

export interface BuildProjectFileInput {
  name: string;
  size: GridSize;
  pixels: PixelValue[];
  palette: string[];
  currentColor: string;
}

export function buildProjectFile(input: BuildProjectFileInput): ProjectFile {
  return {
    format: PROJECT_FILE_FORMAT,
    version: 1,
    name: input.name,
    size: input.size,
    pixels: input.pixels,
    palette: input.palette,
    currentColor: input.currentColor,
    savedAt: new Date().toISOString(),
  };
}

export function serializeProject(project: ProjectFile): string {
  return JSON.stringify(project, null, 2);
}

/**
 * Faz o parse e valida a estrutura mínima de um arquivo de projeto.
 * Lança um erro com mensagem amigável quando o arquivo é inválido.
 */
export function parseProjectFile(json: string): ProjectFile {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('O arquivo não é um JSON válido.');
  }

  if (typeof data !== 'object' || data === null) {
    throw new Error('Arquivo de projeto inválido.');
  }

  const candidate = data as Record<string, unknown>;

  if (candidate.format !== PROJECT_FILE_FORMAT) {
    throw new Error('Este arquivo não é um projeto do Pixel Studio.');
  }
  if (!VALID_SIZES.includes(candidate.size as GridSize)) {
    throw new Error('Tamanho de grade inválido no arquivo de projeto.');
  }
  if (!Array.isArray(candidate.pixels) || candidate.pixels.length !== (candidate.size as number) ** 2) {
    throw new Error('Os dados de pixels do projeto estão corrompidos.');
  }
  if (!Array.isArray(candidate.palette)) {
    throw new Error('A paleta do projeto está corrompida.');
  }

  return {
    format: PROJECT_FILE_FORMAT,
    version: 1,
    name: typeof candidate.name === 'string' ? candidate.name : 'projeto-sem-nome',
    size: candidate.size as GridSize,
    pixels: candidate.pixels as PixelValue[],
    palette: candidate.palette as string[],
    currentColor: typeof candidate.currentColor === 'string' ? candidate.currentColor : '#ffffff',
    savedAt: typeof candidate.savedAt === 'string' ? candidate.savedAt : new Date().toISOString(),
  };
}

export function downloadJsonFile(content: string, fileName: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsText(file);
  });
}
