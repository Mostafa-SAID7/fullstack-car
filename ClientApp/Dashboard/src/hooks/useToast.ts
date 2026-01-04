import toast from 'react-hot-toast';

export interface ToastOptions {
  duration?: number;
  id?: string;
}

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      duration: options?.duration ?? 4000,
      id: options?.id,
    });
  };

  const showError = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      duration: options?.duration ?? 5000,
      id: options?.id,
    });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration ?? 4000,
      id: options?.id,
      icon: '⚠️',
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--border))',
        borderLeft: '4px solid hsl(38, 92%, 50%)', // Orange/warning color
      },
    });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration ?? 4000,
      id: options?.id,
      icon: 'ℹ️',
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--border))',
        borderLeft: '4px solid hsl(199, 89%, 48%)', // Blue/info color
      },
    });
  };

  const showLoading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      duration: options?.duration ?? 0, // Loading toasts don't auto-dismiss
      id: options?.id,
    });
  };

  const updateToast = (toastId: string, message: string, type: 'success' | 'error' | 'loading') => {
    switch (type) {
      case 'success':
        toast.success(message, { id: toastId });
        break;
      case 'error':
        toast.error(message, { id: toastId });
        break;
      case 'loading':
        toast.loading(message, { id: toastId });
        break;
    }
  };

  const dismissToast = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  const dismissAllToasts = () => {
    toast.dismiss();
  };

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    update: updateToast,
    dismiss: dismissToast,
    dismissAll: dismissAllToasts,
  };
};

// Export individual functions for convenience
export const toastSuccess = (message: string, options?: ToastOptions) => toast.success(message, options);
export const toastError = (message: string, options?: ToastOptions) => toast.error(message, options);
export const toastWarning = (message: string, options?: ToastOptions) =>
  toast(message, { ...options, icon: '⚠️', style: { borderLeft: '4px solid hsl(38, 92%, 50%)' } });
export const toastInfo = (message: string, options?: ToastOptions) =>
  toast(message, { ...options, icon: 'ℹ️', style: { borderLeft: '4px solid hsl(199, 89%, 48%)' } });
export const toastLoading = (message: string, options?: ToastOptions) => toast.loading(message, options);
