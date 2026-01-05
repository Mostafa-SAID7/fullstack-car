import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { NotificationContextType, NotificationProviderProps } from './types';
import type { ToastMessage } from '../../components/feedback/toasts/ToastProvider';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  defaultDuration = 5000
}) => {
  const [notifications, setNotifications] = useState<ToastMessage[]>([]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addNotification = useCallback((notification: Omit<ToastMessage, 'id'>): string => {
    const id = generateId();
    const newNotification: ToastMessage = {
      ...notification,
      id,
      duration: notification.duration ?? defaultDuration
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Limit the number of notifications
      return updated.slice(0, maxNotifications);
    });

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [generateId, defaultDuration, maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((title: string, message?: string): string => {
    return addNotification({
      type: 'success',
      title,
      message: message ?? ''
    });
  }, [addNotification]);

  const showError = useCallback((title: string, message?: string): string => {
    return addNotification({
      type: 'error',
      title,
      message: message ?? '',
      duration: 0 // Don't auto-dismiss errors
    });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message?: string): string => {
    return addNotification({
      type: 'warning',
      title,
      message: message ?? ''
    });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message?: string): string => {
    return addNotification({
      type: 'info',
      title,
      message: message ?? ''
    });
  }, [addNotification]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key to clear all notifications
      if (event.key === 'Escape' && notifications.length > 0) {
        clearAllNotifications();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [notifications.length, clearAllNotifications]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
