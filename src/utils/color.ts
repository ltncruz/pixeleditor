export interface Rgb {
  r: number;
  g: number;
  b: number;
}

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function isValidHex(value: string): boolean {
  return HEX_PATTERN.test(value);
}

/** Normaliza para minúsculas e garante o prefixo `#`. Não valida o formato. */
export function normalizeHex(value: string): string {
  const trimmed = value.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  return withHash.toLowerCase();
}

export function hexToRgb(hex: string): Rgb {
  const normalized = normalizeHex(hex);
  const r = parseInt(normalized.slice(1, 3), 16) || 0;
  const g = parseInt(normalized.slice(3, 5), 16) || 0;
  const b = parseInt(normalized.slice(5, 7), 16) || 0;
  return { r, g, b };
}

function toHexByte(value: number): string {
  return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}
