import { CloseIcon, PlusIcon } from './Icons';

interface PaletteProps {
  colors: string[];
  currentColor: string;
  onSelect: (color: string) => void;
  onAddCurrent: () => void;
  onRemove: (color: string) => void;
}

export function Palette({ colors, currentColor, onSelect, onAddCurrent, onRemove }: PaletteProps) {
  return (
    <div className="panel__section">
      <span className="panel__title">PALETA</span>
      <div className="swatch-grid" role="group" aria-label="Cores da paleta">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className="swatch"
            style={{ background: color }}
            aria-pressed={color.toLowerCase() === currentColor.toLowerCase()}
            aria-label={`Selecionar cor ${color}`}
            title={color}
            onClick={() => onSelect(color)}
          >
            <span
              className="swatch__remove"
              role="button"
              tabIndex={0}
              aria-label={`Remover cor ${color} da paleta`}
              onClick={(event) => {
                event.stopPropagation();
                onRemove(color);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemove(color);
                }
              }}
            >
              <CloseIcon width={10} height={10} />
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="btn btn--ghost btn--block" onClick={onAddCurrent}>
        <PlusIcon width={16} height={16} />
        <span>Adicionar cor atual</span>
      </button>
    </div>
  );
}
