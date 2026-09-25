import { ExportIcon, SaveIcon } from './Icons';
import { HistoryControls } from './HistoryControls';

interface HeaderProps {
  gridSize: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onOpenExport: () => void;
}

export function Header({ gridSize, canUndo, canRedo, onUndo, onRedo, onSave, onOpenExport }: HeaderProps) {
  return (
    <header className="app__header header">
      <div className="header__brand">
        <span className="header__mark" aria-hidden="true" />
        <span className="header__title">PIXEL STUDIO</span>
        <span className="header__subtitle">
          {gridSize}×{gridSize}
        </span>
      </div>
      <div className="header__actions">
        <HistoryControls canUndo={canUndo} canRedo={canRedo} onUndo={onUndo} onRedo={onRedo} />
        <div className="header__divider" aria-hidden="true" />
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onSave}
          title="Salvar projeto no navegador (Ctrl/Cmd+S)"
        >
          <SaveIcon width={16} height={16} />
          <span>Salvar</span>
        </button>
        <button type="button" className="btn btn--primary" onClick={onOpenExport} title="Exportar e gerenciar arquivos">
          <ExportIcon width={16} height={16} />
          <span>Exportar</span>
        </button>
      </div>
    </header>
  );
}
