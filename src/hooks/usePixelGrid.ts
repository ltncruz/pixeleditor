import { useCallback, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { HISTORY_LIMIT } from '../constants';
import type { GridSize, PixelData, PixelValue } from '../types/pixel';
import { floodFill } from '../utils/floodFill';
import { clonePixelData, createEmptyPixelData, getPixel, isEmpty, resizePixelData } from '../utils/pixelData';

export interface UsePixelGridResult {
  /** Fonte da verdade mutável. Sempre leia a partir daqui para dados atuais. */
  gridRef: MutableRefObject<PixelData>;
  size: GridSize;
  /**
   * Incrementado somente em confirmações discretas (fim de traço, fill,
   * clear, undo, redo, resize, import) — nunca a cada movimento de mouse.
   * Componentes observam este valor para saber quando refazer um redraw
   * completo do canvas.
   */
  version: number;
  canUndo: boolean;
  canRedo: boolean;
  hasContent: boolean;

  beginStroke: () => void;
  /** Retorna `true` quando o pixel realmente mudou (útil para redesenhar só quando necessário). */
  paintDuringStroke: (row: number, col: number, color: PixelValue) => boolean;
  endStroke: () => void;

  applyFill: (row: number, col: number, color: PixelValue) => void;
  clearGrid: () => void;
  undo: () => void;
  redo: () => void;
  setGridSize: (size: GridSize) => void;
  loadGrid: (data: PixelData) => void;
  getPixelColor: (row: number, col: number) => PixelValue;
}

export function usePixelGrid(initialSize: GridSize): UsePixelGridResult {
  const gridRef = useRef<PixelData>(createEmptyPixelData(initialSize));
  const [size, setSize] = useState<GridSize>(initialSize);
  const [version, setVersion] = useState(0);

  const undoStackRef = useRef<PixelData[]>([]);
  const redoStackRef = useRef<PixelData[]>([]);
  // O valor em si não é lido — existe só para forçar uma nova renderização
  // sempre que as pilhas de undo/redo mudam, já que elas vivem em refs.
  const [, setHistoryVersion] = useState(0);

  const pendingStrokeSnapshotRef = useRef<PixelData | null>(null);
  const strokeChangedRef = useRef(false);

  const pushUndoSnapshot = useCallback((snapshot: PixelData) => {
    undoStackRef.current.push(snapshot);
    if (undoStackRef.current.length > HISTORY_LIMIT) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];
  }, []);

  const bumpRender = useCallback(() => setVersion((v) => v + 1), []);
  const bumpHistory = useCallback(() => setHistoryVersion((v) => v + 1), []);

  const beginStroke = useCallback(() => {
    pendingStrokeSnapshotRef.current = clonePixelData(gridRef.current);
    strokeChangedRef.current = false;
  }, []);

  /**
   * Muta a grade diretamente, SEM disparar nenhum estado do React. É
   * chamada a cada pixel atravessado durante um traço (potencialmente
   * dezenas de vezes por segundo), então o componente do canvas é
   * responsável por desenhar essa célula imediatamente e de forma
   * imperativa (ver `CanvasEditor`) — nenhuma re-renderização acontece
   * até `endStroke`.
   */
  const paintDuringStroke = useCallback((row: number, col: number, color: PixelValue) => {
    const current = gridRef.current;
    const idx = row * current.size + col;
    if (current.pixels[idx] === color) return false;
    current.pixels[idx] = color;
    strokeChangedRef.current = true;
    return true;
  }, []);

  const endStroke = useCallback(() => {
    if (strokeChangedRef.current && pendingStrokeSnapshotRef.current) {
      pushUndoSnapshot(pendingStrokeSnapshotRef.current);
      // Um único re-render ao final do traço (não a cada pixel): garante um
      // redraw completo de segurança e atualiza botões como undo/clear.
      bumpRender();
      bumpHistory();
    }
    pendingStrokeSnapshotRef.current = null;
    strokeChangedRef.current = false;
  }, [pushUndoSnapshot, bumpRender, bumpHistory]);

  const applyFill = useCallback(
    (row: number, col: number, color: PixelValue) => {
      const current = gridRef.current;
      const result = floodFill(current, row, col, color);
      if (result === current) return; // no-op: já é a cor de destino

      pushUndoSnapshot(clonePixelData(current));
      gridRef.current = result;
      bumpRender();
      bumpHistory();
    },
    [pushUndoSnapshot, bumpRender, bumpHistory],
  );

  const clearGrid = useCallback(() => {
    const current = gridRef.current;
    if (isEmpty(current)) return;

    pushUndoSnapshot(clonePixelData(current));
    gridRef.current = createEmptyPixelData(current.size);
    bumpRender();
    bumpHistory();
  }, [pushUndoSnapshot, bumpRender, bumpHistory]);

  const undo = useCallback(() => {
    const previous = undoStackRef.current.pop();
    if (!previous) return;
    redoStackRef.current.push(clonePixelData(gridRef.current));
    gridRef.current = previous;
    setSize(previous.size);
    bumpRender();
    bumpHistory();
  }, [bumpRender, bumpHistory]);

  const redo = useCallback(() => {
    const next = redoStackRef.current.pop();
    if (!next) return;
    undoStackRef.current.push(clonePixelData(gridRef.current));
    gridRef.current = next;
    setSize(next.size);
    bumpRender();
    bumpHistory();
  }, [bumpRender, bumpHistory]);

  const setGridSize = useCallback(
    (newSize: GridSize) => {
      const current = gridRef.current;
      if (newSize === current.size) return;

      const nextData = isEmpty(current) ? createEmptyPixelData(newSize) : resizePixelData(current, newSize);

      pushUndoSnapshot(clonePixelData(current));
      gridRef.current = nextData;
      setSize(newSize);
      bumpRender();
      bumpHistory();
    },
    [pushUndoSnapshot, bumpRender, bumpHistory],
  );

  const loadGrid = useCallback(
    (data: PixelData) => {
      undoStackRef.current = [];
      redoStackRef.current = [];
      gridRef.current = clonePixelData(data);
      setSize(data.size);
      bumpRender();
      bumpHistory();
    },
    [bumpRender, bumpHistory],
  );

  const getPixelColor = useCallback((row: number, col: number) => getPixel(gridRef.current, row, col), []);

  return {
    gridRef,
    size,
    version,
    canUndo: undoStackRef.current.length > 0,
    canRedo: redoStackRef.current.length > 0,
    hasContent: !isEmpty(gridRef.current),
    beginStroke,
    paintDuringStroke,
    endStroke,
    applyFill,
    clearGrid,
    undo,
    redo,
    setGridSize,
    loadGrid,
    getPixelColor,
  };
}
