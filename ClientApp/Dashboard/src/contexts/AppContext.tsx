import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/app';

interface AppSettings {
  language: string;
  sidebarCollapsed: boolean;
  dashboardLayout: string;
  autoRefresh: boolean;
  refreshInterval: number;
  compactMode: boolean;
  showNotifications: boolean;
}

interface AppContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  isOnline: boolean;
  lastActivity: Date;
  updateActivity: () => void;
}

const defaultSettings: AppSettings = {
  language: 'en',
  sidebarCollapsed: false,
  dashboardLayout: 'default',
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  compactMode: false,
  showNotifications: true
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastActivity, setLastActivity] = useState(new Date());

  // Initialize settings from localStorage
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }, [settings]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track user activity
  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      setLastActivity(new Date());
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
  }, []);

  const updateActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  // Apply language changes to document
  useEffect(() => {
    document.documentElement.lang = settings.language;
    
    // Find language direction (RTL for Arabic)
    const isRTL = settings.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [settings.language]);

  // Apply sidebar collapsed state to body class
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', settings.sidebarCollapsed);
  }, [settings.sidebarCollapsed]);

  // Apply compact mode
  useEffect(() => {
    document.body.classList.toggle('compact-mode', settings.compactMode);
  }, [settings.compactMode]);

  const value: AppContextType = {
    settings,
    updateSettings,
    resetSettings,
    isOnline,
    lastActivity,
    updateActivity
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};