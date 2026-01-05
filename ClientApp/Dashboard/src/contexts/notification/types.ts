// Notification Context Types

import type { ToastMessage } from '../../components/feedback/toasts/ToastProvider';

export interface NotificationContextType {
  notifications: ToastMessage[];
  addNotification: (notification: Omit<ToastMessage, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (title: string, message?: string) => string;
  showError: (title: string, message?: string) => string;
  showWarning: (title: string, message?: string) => string;
  showInfo: (title: string, message?: string) => string;
}

export interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
}

export type { ToastMessage };

