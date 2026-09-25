import { useRef, useState } from 'react';
import { EXPORT_SIZE_OPTIONS } from '../constants';
import { CloseIcon, ExportIcon, ImportIcon } from './Icons';

interface ExportDialogProps {
  gridSize: number;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onClose: () => void;
  onExportPng: (targetPx: number) => void;
  onExportProject: () => void;
  onImportProject: (file: File) => void;
  onImportImage: (file: File) => void;
}

export function ExportDialog({
  gridSize,
  projectName,
  onProjectNameChange,
  onClose,
  onExportPng,
  onExportProject,
  onImportProject,
  onImportImage,
}: ExportDialogProps) {
  const [exportSize, setExportSize] = useState<number>(256);
  const projectInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="export-dialog-title">
        <div className="modal__header">
          <h2 id="export-dialog-title" className="modal__title">
            Exportar &amp; projeto
          </h2>
          <button type="button" className="btn btn--icon btn--ghost" onClick={onClose} aria-label="Fechar">
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <section className="modal__section">
          <span className="modal__section-title">PROJETO</span>
          <label className="field-label" htmlFor="project-name">
            Nome do arquivo
          </label>
          <input
            id="project-name"
            type="text"
            className="colorpicker__hex"
            value={projectName}
            onChange={(event) => onProjectNameChange(event.target.value)}
            spellCheck={false}
          />
        </section>

        <section className="modal__section">
          <span className="modal__section-title">IMAGEM (PNG)</span>
          <label className="field-label" htmlFor="export-size">
            Tamanho de exportação
          </label>
          <select
            id="export-size"
            className="colorpicker__hex"
            value={exportSize}
            onChange={(event) => setExportSize(Number(event.target.value))}
          >
            <option value={gridSize}>
              {gridSize} × {gridSize} (nativo)
            </option>
            {EXPORT_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} × {size}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn--primary btn--block" onClick={() => onExportPng(exportSize)}>
            <ExportIcon width={16} height={16} />
            <span>Exportar PNG</span>
          </button>
          <span className="modal__hint">Transparência preservada, sem linhas de grade e sem suavização.</span>
        </section>

        <section className="modal__section">
          <span className="modal__section-title">ARQUIVO DE PROJETO</span>
          <button type="button" className="btn btn--block" onClick={onExportProject}>
            <ExportIcon width={16} height={16} />
            <span>Exportar projeto (.json)</span>
          </button>
          <div>
            <button
              type="button"
              className="btn btn--block"
              onClick={() => projectInputRef.current?.click()}
            >
              <ImportIcon width={16} height={16} />
              <span>Importar projeto (.json)</span>
            </button>
            <input
              ref={projectInputRef}
              type="file"
              accept="application/json,.json"
              className="colorpicker__native"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onImportProject(file);
                event.target.value = '';
              }}
            />
          </div>
        </section>

        <section className="modal__section">
          <span className="modal__section-title">IMPORTAR IMAGEM</span>
          <button type="button" className="btn btn--block" onClick={() => imageInputRef.current?.click()}>
            <ImportIcon width={16} height={16} />
            <span>Importar PNG como pixel art</span>
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/*"
            className="colorpicker__native"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImportImage(file);
              event.target.value = '';
            }}
          />
          <span className="modal__hint">
            A imagem é redimensionada para {gridSize} × {gridSize} usando nearest-neighbor.
          </span>
        </section>
      </div>
    </div>
  );
}
