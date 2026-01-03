// Local Storage Utilities

import { STORAGE_KEYS } from '../constants/app';

export class StorageManager {
  private static instance: StorageManager;
  
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Generic storage methods
  set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue || null;
    }
  }

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  // Specific storage methods
  setAuthToken(token: string): boolean {
    return this.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  getAuthToken(): string | null {
    return this.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  removeAuthToken(): boolean {
    return this.remove(STORAGE_KEYS.AUTH_TOKEN);
  }

  setRefreshToken(token: string): boolean {
    return this.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setUserPreferences(preferences: Record<string, any>): boolean {
    return this.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  getUserPreferences(): Record<string, any> | null {
    return this.get<Record<string, any>>(STORAGE_KEYS.USER_PREFERENCES);
  }

  setTheme(theme: string): boolean {
    return this.set(STORAGE_KEYS.THEME, theme);
  }

  getTheme(): string | null {
    return this.get<string>(STORAGE_KEYS.THEME);
  }

  setSidebarCollapsed(collapsed: boolean): boolean {
    return this.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed);
  }

  getSidebarCollapsed(): boolean {
    return this.get<boolean>(STORAGE_KEYS.SIDEBAR_COLLAPSED, false) || false;
  }

  // Cache management
  setCache<T>(key: string, data: T, ttl?: number): boolean {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl: ttl || 0
    };
    return this.set(`cache_${key}`, cacheItem);
  }

  getCache<T>(key: string): T | null {
    const cacheItem = this.get<{
      data: T;
      timestamp: number;
      ttl: number;
    }>(`cache_${key}`);

    if (!cacheItem) return null;

    // Check if cache has expired
    if (cacheItem.ttl > 0 && Date.now() - cacheItem.timestamp > cacheItem.ttl) {
      this.remove(`cache_${key}`);
      return null;
    }

    return cacheItem.data;
  }

  clearCache(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  // Storage size management
  getStorageSize(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  getStorageSizeFormatted(): string {
    const size = this.getStorageSize();
    const units = ['B', 'KB', 'MB'];
    let unitIndex = 0;
    let formattedSize = size;

    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024;
      unitIndex++;
    }

    return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
  }

  // Backup and restore
  exportData(): string {
    const data: Record<string, string> = {};
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        data[key] = localStorage[key];
      }
    }
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      for (const key in data) {
        localStorage.setItem(key, data[key]);
      }
      return true;
    } catch (error) {
      console.error('Import data error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storage = StorageManager.getInstance();