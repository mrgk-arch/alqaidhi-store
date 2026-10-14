import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastData {
  id: number;
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 bg-ink-800 border border-gold-400/30 rounded-xl shadow-lg shadow-gold-500/10 backdrop-blur-md transition-all duration-300 w-full ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <p className="text-sm text-ink-50 flex-1">{toast.message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="text-ink-400 hover:text-ink-200 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
