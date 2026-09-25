import { useEffect, useRef, useState } from 'react';
import { CanvasEditor } from './components/CanvasEditor';
import { ColorPicker } from './components/ColorPicker';
import { ExportDialog } from './components/ExportDialog';
import { Header } from './components/Header';
import { Palette } from './components/Palette';
import { Toast } from './components/Toast';
import { Toolbar } from './components/Toolbar';
import { DEFAULT_COLOR, DEFAULT_GRID_SIZE, DEFAULT_PALETTE, STORAGE_KEYS } from './constants';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePixelGrid } from './hooks/usePixelGrid';
import type { GridSize, ToastMessage, ToolId } from './types/pixel';
import { exportPixelDataAsPng } from './utils/exportPng';
import { importImageAsPixelData } from './utils/importImage';
import {
  buildProjectFile,
  downloadJsonFile,
  parseProjectFile,
  readFileAsText,
  serializeProject,
} from './utils/projectFile';

const TOAST_DURATION_MS = 2600;

export function App() {
  const grid = usePixelGrid(DEFAULT_GRID_SIZE);

  const [activeTool, setActiveTool] = useState<ToolId>('pencil');
  const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR);

  // Tamanho atual do lápis e da borracha.
  // 1 significa 1×1, 2 significa 2×2, etc.
  const [brushSize, setBrushSize] = useState(1);

  const [palette, setPalette] = useLocalStorage<string[]>(
    STORAGE_KEYS.palette,
    DEFAULT_PALETTE,
  );

  const [projectName, setProjectName] = useState('pixel-art');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toastIdRef = useRef(0);

  function addToast(
    text: string,
    tone: ToastMessage['tone'] = 'info',
  ) {
    const id = ++toastIdRef.current;

    setToasts((prev) => [
      ...prev,
      {
        id,
        text,
        tone,
      },
    ]);

    window.setTimeout(() => {
      setToasts((prev) =>
        prev.filter((toast) => toast.id !== id),
      );
    }, TOAST_DURATION_MS);
  }

  // Restaura a última sessão salva no navegador, se existir.
  // Um projeto ausente ou corrompido simplesmente resulta
  // em uma tela em branco.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        STORAGE_KEYS.project,
      );

      if (!stored) {
        return;
      }

      const project = parseProjectFile(stored);

      grid.loadGrid({
        size: project.size,
        pixels: project.pixels,
      });

      setCurrentColor(project.currentColor);
      setProjectName(project.name);
    } catch {
      // Projeto salvo corrompido:
      // ignora e começa em branco.
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectGridSize(size: GridSize) {
    if (size === grid.size) {
      return;
    }

    if (grid.hasContent) {
      const confirmed = window.confirm(
        `Alterar o tamanho da grade para ${size}×${size} vai redimensionar o desenho atual. Continuar?`,
      );

      if (!confirmed) {
        return;
      }
    }

    grid.setGridSize(size);
  }

  function handleClear() {
    if (!grid.hasContent) {
      return;
    }

    const confirmed = window.confirm(
      'Limpar toda a arte da tela? Você pode desfazer essa ação depois.',
    );

    if (!confirmed) {
      return;
    }

    grid.clearGrid();
    addToast('Tela limpa.');
  }

  function handleColorPicked(color: string) {
    setCurrentColor(color);
  }

  function handleTransparentPicked() {
    addToast(
      'Esse pixel é transparente — nenhuma cor para copiar.',
    );
  }

  function handleAddToPalette() {
    const normalized = currentColor.toLowerCase();

    setPalette((prev) =>
      prev.some(
        (color) =>
          color.toLowerCase() === normalized,
      )
        ? prev
        : [...prev, currentColor],
    );
  }

  function handleRemoveFromPalette(color: string) {
    setPalette((prev) =>
      prev.filter((entry) => entry !== color),
    );
  }

  function handleSaveProject() {
    const project = buildProjectFile({
      name: projectName,
      size: grid.size,
      pixels: grid.gridRef.current.pixels,
      palette,
      currentColor,
    });

    try {
      window.localStorage.setItem(
        STORAGE_KEYS.project,
        serializeProject(project),
      );

      addToast(
        'Projeto salvo no navegador.',
        'success',
      );
    } catch {
      addToast(
        'Não foi possível salvar: armazenamento indisponível.',
        'error',
      );
    }
  }

  function handleExportProject() {
    const project = buildProjectFile({
      name: projectName,
      size: grid.size,
      pixels: grid.gridRef.current.pixels,
      palette,
      currentColor,
    });

    downloadJsonFile(
      serializeProject(project),
      `${projectName || 'pixel-art'}.json`,
    );

    addToast(
      'Projeto exportado.',
      'success',
    );
  }

  async function handleImportProject(file: File) {
    try {
      const text = await readFileAsText(file);
      const project = parseProjectFile(text);

      grid.loadGrid({
        size: project.size,
        pixels: project.pixels,
      });

      setCurrentColor(project.currentColor);

      setPalette(
        project.palette.length > 0
          ? project.palette
          : DEFAULT_PALETTE,
      );

      setProjectName(project.name);
      setExportDialogOpen(false);

      addToast(
        'Projeto importado.',
        'success',
      );
    } catch (error) {
      addToast(
        error instanceof Error
          ? error.message
          : 'Erro ao importar o projeto.',
        'error',
      );
    }
  }

  async function handleImportImage(file: File) {
    try {
      const data = await importImageAsPixelData(
        file,
        grid.size,
      );

      grid.loadGrid(data);
      setExportDialogOpen(false);

      addToast(
        'Imagem importada.',
        'success',
      );
    } catch (error) {
      addToast(
        error instanceof Error
          ? error.message
          : 'Erro ao importar a imagem.',
        'error',
      );
    }
  }

  async function handleExportPng(targetPx: number) {
    try {
      await exportPixelDataAsPng(
        grid.gridRef.current,
        targetPx,
        `${projectName || 'pixel-art'}.png`,
      );

      setExportDialogOpen(false);

      addToast(
        'PNG exportado.',
        'success',
      );
    } catch {
      addToast(
        'Erro ao exportar o PNG.',
        'error',
      );
    }
  }

  useKeyboardShortcuts({
    onPencil: () => setActiveTool('pencil'),
    onEraser: () => setActiveTool('eraser'),
    onEyedropper: () => setActiveTool('eyedropper'),
    onFill: () => setActiveTool('fill'),
    onUndo: grid.undo,
    onRedo: grid.redo,
    onSave: handleSaveProject,
  });

  return (
    <div className="app">
      <Header
        gridSize={grid.size}
        canUndo={grid.canUndo}
        canRedo={grid.canRedo}
        onUndo={grid.undo}
        onRedo={grid.redo}
        onSave={handleSaveProject}
        onOpenExport={() =>
          setExportDialogOpen(true)
        }
      />

      <Toolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        gridSize={grid.size}
        onSelectGridSize={handleSelectGridSize}
        onClear={handleClear}
        hasContent={grid.hasContent}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
      />

      <main className="app__canvas">
        <CanvasEditor
          grid={grid}
          tool={activeTool}
          currentColor={currentColor}
          brushSize={brushSize}
          onColorPicked={handleColorPicked}
          onTransparentPicked={
            handleTransparentPicked
          }
        />
      </main>

      <aside
        className="app__palette panel"
        aria-label="Paleta e cor atual"
      >
        <Palette
          colors={palette}
          currentColor={currentColor}
          onSelect={setCurrentColor}
          onAddCurrent={handleAddToPalette}
          onRemove={handleRemoveFromPalette}
        />

        <div className="panel__section">
          <span className="panel__title">
            COR ATUAL
          </span>

          <ColorPicker
            color={currentColor}
            onChange={setCurrentColor}
          />
        </div>
      </aside>

      {exportDialogOpen && (
        <ExportDialog
          gridSize={grid.size}
          projectName={projectName}
          onProjectNameChange={setProjectName}
          onClose={() =>
            setExportDialogOpen(false)
          }
          onExportPng={handleExportPng}
          onExportProject={
            handleExportProject
          }
          onImportProject={
            handleImportProject
          }
          onImportImage={handleImportImage}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
