import { GRID_SIZES } from '../constants';
import type { GridSize } from '../types/pixel';

interface GridSelectorProps {
  value: number;
  onChange: (size: GridSize) => void;
}

export function GridSelector({ value, onChange }: GridSelectorProps) {
  return (
    <div className="segmented" role="group" aria-label="Tamanho da grade">
      {GRID_SIZES.map((size) => (
        <button
          key={size}
          type="button"
          className="segmented__option"
          aria-pressed={value === size}
          title={`${size} × ${size}`}
          onClick={() => onChange(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
