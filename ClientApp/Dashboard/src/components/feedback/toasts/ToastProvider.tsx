import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast } from './Toast';
import type { ToastProps } from './Toast';

export interface ToastMessage extends Omit<ToastProps, 'id' | 'onClose'> {
  id?: string;
}

interface ToastContextType {
  success: (message: string, options?: Partial<ToastMessage>) => void;
  error: (message: string, options?: Partial<ToastMessage>) => void;
  warning: (message: string, options?: Partial<ToastMessage>) => void;
  info: (message: string, options?: Partial<ToastMessage>) => void;
  custom: (toast: ToastMessage) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: ToastMessage) => {
    const id = toast.id || `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastProps = {
      id,
      type: toast.type || 'info',
      message: toast.message || '',
      title: toast.title,
      duration: toast.duration,
      action: toast.action,
      onClose: removeToast,
    };

    setToasts(prev => {
      const filtered = prev.filter(t => t.id !== id);
      return [newToast, ...filtered].slice(0, maxToasts);
    });
  }, [maxToasts, removeToast]);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((message: string, options?: Partial<ToastMessage>) => {
    addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message: string, options?: Partial<ToastMessage>) => {
    addToast({ type: 'error', message, ...options });
  }, [addToast]);

  const warning = useCallback((message: string, options?: Partial<ToastMessage>) => {
    addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = useCallback((message: string, options?: Partial<ToastMessage>) => {
    addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const custom = useCallback((toast: ToastMessage) => {
    addToast(toast);
  }, [addToast]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <ToastContext.Provider
      value={{
        success,
        error,
        warning,
        info,
        custom,
        remove: removeToast,
        clear: clearToasts
      }}
    >
      {children}

      <div className={`fixed z-50 pointer-events-none ${positionClasses[position]}`}>
        <div className="flex flex-col gap-2 pointer-events-auto">
          <AnimatePresence>
            {toasts.map(toast => (
              <Toast key={toast.id} {...toast} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;

