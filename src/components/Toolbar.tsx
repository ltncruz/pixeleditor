import type { ToolId } from '../types/pixel';
import { EraserIcon, EyedropperIcon, FillIcon, PencilIcon, TrashIcon } from './Icons';
import { GridSelector } from './GridSelector';

interface ToolDefinition {
  id: ToolId;
  label: string;
  shortcut: string;
  Icon: typeof PencilIcon;
}

const TOOLS: ToolDefinition[] = [
  { id: 'pencil', label: 'Lápis', shortcut: 'P', Icon: PencilIcon },
  { id: 'eraser', label: 'Borracha', shortcut: 'E', Icon: EraserIcon },
  { id: 'eyedropper', label: 'Conta-gotas', shortcut: 'I', Icon: EyedropperIcon },
  { id: 'fill', label: 'Balde de tinta', shortcut: 'F', Icon: FillIcon },
];

interface ToolbarProps {
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
  gridSize: number;
  onSelectGridSize: (size: 8 | 16 | 32 | 64) => void;
  onClear: () => void;
  hasContent: boolean;
}

export function Toolbar({ activeTool, onSelectTool, gridSize, onSelectGridSize, onClear, hasContent }: ToolbarProps) {
  return (
    <aside className="app__toolbar panel" aria-label="Ferramentas">
      <div className="panel__section">
        <span className="panel__title">FERRAMENTAS</span>
        <div className="tool-list" role="group" aria-label="Selecionar ferramenta">
          {TOOLS.map(({ id, label, shortcut, Icon }) => (
            <button
              key={id}
              type="button"
              className="tool"
              aria-pressed={activeTool === id}
              title={`${label} (${shortcut})`}
              onClick={() => onSelectTool(id)}
            >
              <Icon />
              <span>{label}</span>
              <span className="tool__shortcut">{shortcut}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel__section">
        <span className="panel__title">GRADE</span>
        <GridSelector value={gridSize} onChange={onSelectGridSize} />
      </div>

      <div className="panel__section">
        <span className="panel__title">TELA</span>
        <button
          type="button"
          className="btn btn--danger btn--block"
          onClick={onClear}
          title="Limpar toda a arte"
          disabled={!hasContent}
        >
          <TrashIcon width={16} height={16} />
          <span>Limpar tela</span>
        </button>
      </div>
    </aside>
  );
}
