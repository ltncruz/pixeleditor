import { RedoIcon, UndoIcon } from './Icons';

interface HistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function HistoryControls({ canUndo, canRedo, onUndo, onRedo }: HistoryControlsProps) {
  return (
    <>
      <button
        type="button"
        className="btn btn--icon btn--ghost"
        onClick={onUndo}
        disabled={!canUndo}
        title="Desfazer (Ctrl/Cmd+Z)"
        aria-label="Desfazer"
      >
        <UndoIcon />
      </button>
      <button
        type="button"
        className="btn btn--icon btn--ghost"
        onClick={onRedo}
        disabled={!canRedo}
        title="Refazer (Ctrl/Cmd+Shift+Z)"
        aria-label="Refazer"
      >
        <RedoIcon />
      </button>
    </>
  );
}
