import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 4.5 19.5 9.5 8 21H3v-5Z" />
      <path d="M12.5 6.5 17.5 11.5" />
    </svg>
  );
}

export function EraserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M18 13.5 10.5 21H6l-3-3 9-9 6.5 6.5Z" />
      <path d="m7 8 9 9" />
      <path d="M13.5 3.5 20 10" />
    </svg>
  );
}

export function EyedropperIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m19 3 2 2-3.5 3.5-2-2Z" />
      <path d="M15.5 6.5 6 16l-2 4 4-2 9.5-9.5Z" />
    </svg>
  );
}

export function FillIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 3 9.5 9.5-6 6L3 12Z" />
      <path d="M11 5 5 11" />
      <path d="M17 15c1.4 1.6 2 2.7 2 3.6a2 2 0 1 1-4 0c0-.9.6-2 2-3.6Z" />
    </svg>
  );
}

export function UndoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 8H3V4" />
      <path d="M3.5 13.5A8 8 0 1 0 6 6.5L3 9" />
    </svg>
  );
}

export function RedoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M17 8h4V4" />
      <path d="M20.5 13.5A8 8 0 1 1 18 6.5L21 9" />
    </svg>
  );
}

export function ExportIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 15V3" />
      <path d="m7 8 5-5 5 5" />
      <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

export function ImportIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m6 7 1 13h10l1-13" />
    </svg>
  );
}

export function SaveIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 4h11l3 3v13H5Z" />
      <path d="M8 4v6h8V4" />
      <path d="M8 21v-7h8v7" />
    </svg>
  );
}
