// App Context Types

export interface AppSettings {
  language: string;
  sidebarCollapsed: boolean;
  dashboardLayout: string;
  autoRefresh: boolean;
  refreshInterval: number;
  compactMode: boolean;
  showNotifications: boolean;
}

export interface AppContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  isOnline: boolean;
  lastActivity: Date;
  updateActivity: () => void;
}

export interface AppProviderProps {
  children: React.ReactNode;
}

