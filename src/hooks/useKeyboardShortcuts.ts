import { useEffect, useRef } from 'react';

export interface ShortcutHandlers {
  onPencil: () => void;
  onEraser: () => void;
  onEyedropper: () => void;
  onFill: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}

/**
 * Registra os atalhos de teclado do editor uma única vez. Os handlers mais
 * recentes ficam em uma ref para que o listener nunca precise ser
 * removido/readicionado a cada renderização.
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers): void {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;

      const mod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (mod && key === 'z' && event.shiftKey) {
        event.preventDefault();
        handlersRef.current.onRedo();
        return;
      }
      if (mod && key === 'z') {
        event.preventDefault();
        handlersRef.current.onUndo();
        return;
      }
      if (mod && key === 's') {
        event.preventDefault();
        handlersRef.current.onSave();
        return;
      }
      if (mod) return;

      switch (key) {
        case 'p':
          handlersRef.current.onPencil();
          break;
        case 'e':
          handlersRef.current.onEraser();
          break;
        case 'i':
          handlersRef.current.onEyedropper();
          break;
        case 'f':
          handlersRef.current.onFill();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
