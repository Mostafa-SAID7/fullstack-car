import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { ThemeConfig } from '../themes';

export interface ThemePreference {
  themeId: string;
  layout: any;
  customizations?: {
    colors?: Partial<ThemeConfig['colors']>;
    layout?: Partial<ThemeConfig['layout']>;
    typography?: Partial<ThemeConfig['typography']>;
  };
}

export interface ThemeStats {
  totalThemes: number;
  activeTheme: string;
  customThemes: number;
  lastModified: string;
}

class ThemeService {
  // Get user's theme preferences
  async getUserThemePreferences(): Promise<ThemePreference> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.THEME.PREFERENCES);
      return response as ThemePreference;
    } catch (error: any) {
      // Return default if no preferences exist
      return {
        themeId: 'modern',
        layout: {}
      };
    }
  }

  // Save user's theme preferences
  async saveUserThemePreferences(preferences: ThemePreference): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.THEME.PREFERENCES, preferences);
    } catch (error: any) {
      throw new Error('Failed to save theme preferences');
    }
  }

  // Get available themes
  async getAvailableThemes(): Promise<ThemeConfig[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.THEME.THEMES);
      return response as ThemeConfig[];
    } catch (error: any) {
      // Return empty array if endpoint doesn't exist yet
      return [];
    }
  }

  // Create custom theme
  async createCustomTheme(theme: ThemeConfig): Promise<ThemeConfig> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.THEME.CUSTOM, theme);
      return response as ThemeConfig;
    } catch (error: any) {
      throw new Error('Failed to create custom theme');
    }
  }

  // Update custom theme
  async updateCustomTheme(themeId: string, theme: Partial<ThemeConfig>): Promise<void> {
    try {
      await apiClient.put(`${API_ENDPOINTS.THEME.CUSTOM}/${themeId}`, theme);
    } catch (error: any) {
      throw new Error('Failed to update custom theme');
    }
  }

  // Delete custom theme
  async deleteCustomTheme(themeId: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.THEME.CUSTOM}/${themeId}`);
    } catch (error: any) {
      throw new Error('Failed to delete custom theme');
    }
  }

  // Get theme statistics
  async getThemeStats(): Promise<ThemeStats> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.THEME.STATS);
      return response as ThemeStats;
    } catch (error: any) {
      // Return default stats
      return {
        totalThemes: 6,
        activeTheme: 'modern',
        customThemes: 0,
        lastModified: new Date().toISOString()
      };
    }
  }

  // Export theme
  async exportTheme(themeId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.THEME.EXPORT}/${themeId}`, {
        responseType: 'blob'
      } as any);
      return response as Blob;
    } catch (error: any) {
      throw new Error('Failed to export theme');
    }
  }

  // Import theme
  async importTheme(themeData: any): Promise<ThemeConfig> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.THEME.IMPORT, themeData);
      return response as ThemeConfig;
    } catch (error: any) {
      throw new Error('Failed to import theme');
    }
  }

  // Reset to default theme
  async resetToDefault(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.THEME.RESET);
    } catch (error: any) {
      // If endpoint doesn't exist, just proceed with local reset
      console.warn('Reset endpoint not available, performing local reset only');
    }
  }
}

export const themeService = new ThemeService();
