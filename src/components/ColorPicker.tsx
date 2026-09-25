import { useEffect, useState } from 'react';
import { hexToRgb, isValidHex, normalizeHex } from '../utils/color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [hexDraft, setHexDraft] = useState(color);

  useEffect(() => {
    setHexDraft(color);
  }, [color]);

  const rgb = hexToRgb(color);

  function commitHexDraft(value: string) {
    const normalized = normalizeHex(value);
    if (isValidHex(normalized)) {
      onChange(normalized);
    } else {
      setHexDraft(color);
    }
  }

  return (
    <div className="colorpicker">
      <div className="colorpicker__row">
        <label className="colorpicker__swatch" style={{ background: color }} title="Abrir seletor de cor">
          <input
            type="color"
            className="colorpicker__native"
            value={color}
            onChange={(event) => onChange(event.target.value)}
            aria-label="Selecionar cor"
          />
        </label>
        <input
          type="text"
          className="colorpicker__hex"
          value={hexDraft}
          onChange={(event) => setHexDraft(event.target.value)}
          onBlur={(event) => commitHexDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur();
            }
          }}
          spellCheck={false}
          maxLength={7}
          aria-label="Código hexadecimal da cor"
        />
      </div>
      <span className="colorpicker__rgb">
        RGB {rgb.r}, {rgb.g}, {rgb.b}
      </span>
    </div>
  );
}
