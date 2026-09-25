import { useEffect, useMemo, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { CELL_RESOLUTION } from '../constants';
import type { ToolId } from '../types/pixel';
import type { UsePixelGridResult } from '../hooks/usePixelGrid';
import { renderPixelData } from '../utils/canvas';
import styles from './CanvasEditor.module.css';

interface CanvasEditorProps {
  grid: UsePixelGridResult;
  tool: ToolId;
  currentColor: string;
  brushSize: number;
  onColorPicked: (color: string) => void;
  onTransparentPicked: () => void;
}

interface Cell {
  row: number;
  col: number;
}

function cellFromPoint(
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement,
  size: number,
): Cell | null {
  const rect = canvas.getBoundingClientRect();

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  if (
    x < 0 ||
    y < 0 ||
    x >= rect.width ||
    y >= rect.height ||
    rect.width === 0 ||
    rect.height === 0
  ) {
    return null;
  }

  const col = Math.min(
    size - 1,
    Math.floor((x / rect.width) * size),
  );

  const row = Math.min(
    size - 1,
    Math.floor((y / rect.height) * size),
  );

  return {
    row,
    col,
  };
}

export function CanvasEditor({
  grid,
  tool,
  currentColor,
  brushSize,
  onColorPicked,
  onTransparentPicked,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isPaintingRef = useRef(false);

  const lastCellRef = useRef<Cell | null>(null);

  const resolutionPx =
    grid.size * CELL_RESOLUTION;

  const overlayStyle = useMemo(
    () => ({
      backgroundSize: `${100 / grid.size}% ${
        100 / grid.size
      }%`,
    }),
    [grid.size],
  );

  // Redraw completo:
  // roda apenas quando há uma confirmação
  // de alteração na grade ou mudança de tamanho.
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    renderPixelData(
      ctx,
      grid.gridRef.current,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid.version, grid.size]);

  // Desenha visualmente uma única célula
  // diretamente no canvas.
  function drawCellImmediate(
    row: number,
    col: number,
    color: string | null,
  ) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const cellPx =
      canvas.width / grid.size;

    const x =
      col * cellPx;

    const y =
      row * cellPx;

    ctx.clearRect(
      x,
      y,
      cellPx,
      cellPx,
    );

    if (color) {
      ctx.fillStyle = color;

      ctx.fillRect(
        x,
        y,
        cellPx,
        cellPx,
      );
    }
  }

  // Aplica o lápis ou borracha usando
  // o tamanho atual do pincel.
  function paintBrush(
    row: number,
    col: number,
    color: string | null,
  ) {
    const offset =
      Math.floor(brushSize / 2);

    for (
      let rowOffset = 0;
      rowOffset < brushSize;
      rowOffset++
    ) {
      for (
        let colOffset = 0;
        colOffset < brushSize;
        colOffset++
      ) {
        const targetRow =
          row + rowOffset - offset;

        const targetCol =
          col + colOffset - offset;

        // Impede o pincel de tentar
        // desenhar fora da grade.
        if (
          targetRow < 0 ||
          targetCol < 0 ||
          targetRow >= grid.size ||
          targetCol >= grid.size
        ) {
          continue;
        }

        const changed =
          grid.paintDuringStroke(
            targetRow,
            targetCol,
            color,
          );

        if (changed) {
          drawCellImmediate(
            targetRow,
            targetCol,
            color,
          );
        }
      }
    }
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const cell =
      cellFromPoint(
        event.clientX,
        event.clientY,
        canvas,
        grid.size,
      );

    if (!cell) {
      return;
    }

    canvas.setPointerCapture(
      event.pointerId,
    );

    if (tool === 'fill') {
      grid.applyFill(
        cell.row,
        cell.col,
        currentColor,
      );

      return;
    }

    if (tool === 'eyedropper') {
      const picked =
        grid.getPixelColor(
          cell.row,
          cell.col,
        );

      if (picked) {
        onColorPicked(picked);
      } else {
        onTransparentPicked();
      }

      return;
    }

    // Lápis ou borracha:
    // inicia um único traço.
    isPaintingRef.current = true;

    lastCellRef.current =
      cell;

    grid.beginStroke();

    const color =
      tool === 'eraser'
        ? null
        : currentColor;

    paintBrush(
      cell.row,
      cell.col,
      color,
    );
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) {
    if (!isPaintingRef.current) {
      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const cell =
      cellFromPoint(
        event.clientX,
        event.clientY,
        canvas,
        grid.size,
      );

    if (!cell) {
      return;
    }

    const last =
      lastCellRef.current;

    if (
      last &&
      last.row === cell.row &&
      last.col === cell.col
    ) {
      return;
    }

    lastCellRef.current =
      cell;

    const color =
      tool === 'eraser'
        ? null
        : currentColor;

    paintBrush(
      cell.row,
      cell.col,
      color,
    );
  }

  function endPaintingGesture(
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) {
    if (
      isPaintingRef.current
    ) {
      grid.endStroke();
    }

    isPaintingRef.current =
      false;

    lastCellRef.current =
      null;

    const canvas =
      canvasRef.current;

    if (
      canvas &&
      canvas.hasPointerCapture(
        event.pointerId,
      )
    ) {
      canvas.releasePointerCapture(
        event.pointerId,
      );
    }
  }

  return (
    <div
      className={styles.stage}
      role="group"
      aria-label="Área de desenho do pixel art"
    >
      <div
        className={
          styles.checkerboard
        }
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        width={resolutionPx}
        height={resolutionPx}
        className={styles.canvas}
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          endPaintingGesture
        }
        onPointerCancel={
          endPaintingGesture
        }
        aria-label={`Grade de pixel art ${grid.size} por ${grid.size}`}
      />

      <div
        className={
          styles.gridLines
        }
        style={overlayStyle}
        aria-hidden="true"
      />
    </div>
  );
}
