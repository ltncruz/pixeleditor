import type { ToastMessage } from '../types/pixel';

interface ToastProps {
  toasts: ToastMessage[];
}

export function Toast({ toasts }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.tone === 'info' ? '' : `toast--${toast.tone}`}`}>
          {toast.text}
        </div>
      ))}
    </div>
  );
}
