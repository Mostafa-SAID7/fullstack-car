import { API_BASE_URL, API_ENDPOINTS } from '../config';

export interface BatchTranslationRequest {
  culture: string;
  features: string[];
}

export interface SupportedCulture {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

export interface TranslationCacheInfo {
  size: number;
  keys: string[];
  lastUpdated: Date;
}

export class TranslationService {
  private static instance: TranslationService;
  private cache = new Map<string, { data: Record<string, string>; timestamp: number }>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  /**
   * Get translations for a specific culture and feature
   */
  async getTranslations(culture: string, feature: string): Promise<Record<string, string>> {
    const cacheKey = `${culture}:${feature}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.LOCALIZATION.TRANSLATIONS}/${culture}/${feature}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404 && culture !== 'en-US') {
          // Fallback to English
          return this.getTranslations('en-US', feature);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('Failed to load translations:', error);
      
      // Return fallback translations for critical features
      if (feature === 'common') {
        return this.getFallbackCommonTranslations();
      }
      
      throw error;
    }
  }

  /**
   * Get batch translations for multiple features
   */
  async getBatchTranslations(request: BatchTranslationRequest): Promise<Record<string, Record<string, string>>> {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.LOCALIZATION.BATCH_TRANSLATIONS}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache individual feature translations
      Object.entries(data).forEach(([feature, translations]) => {
        const cacheKey = `${request.culture}:${feature}`;
        this.cache.set(cacheKey, { 
          data: translations as Record<string, string>, 
          timestamp: Date.now() 
        });
      });
      
      return data;
    } catch (error) {
      console.error('Failed to load batch translations:', error);
      
      // Fallback: try to load individual features
      const fallbackData: Record<string, Record<string, string>> = {};
      for (const feature of request.features) {
        try {
          fallbackData[feature] = await this.getTranslations(request.culture, feature);
        } catch (featureError) {
          console.warn(`Failed to load fallback for feature ${feature}:`, featureError);
          fallbackData[feature] = {};
        }
      }
      
      return fallbackData;
    }
  }

  /**
   * Get supported cultures
   */
  async getSupportedCultures(): Promise<SupportedCulture[]> {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.LOCALIZATION.SUPPORTED_CULTURES}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.map((culture: any) => ({
        code: culture.name || culture.code,
        name: culture.displayName || culture.name,
        nativeName: culture.nativeName || culture.name,
        isRTL: culture.name?.startsWith('ar-') || false
      }));
    } catch (error) {
      console.error('Failed to load supported cultures:', error);
      
      // Return default supported cultures
      return [
        { code: 'en-US', name: 'English (United States)', nativeName: 'English', isRTL: false },
        { code: 'ar-EG', name: 'Arabic (Egypt)', nativeName: 'العربية (مصر)', isRTL: true },
        { code: 'ar-AE', name: 'Arabic (UAE)', nativeName: 'العربية (الإمارات)', isRTL: true },
        { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', nativeName: 'العربية (السعودية)', isRTL: true }
      ];
    }
  }

  /**
   * Invalidate translation cache
   */
  async invalidateCache(culture?: string, feature?: string): Promise<void> {
    if (culture && feature) {
      // Invalidate specific cache entry
      this.cache.delete(`${culture}:${feature}`);
    } else if (culture) {
      // Invalidate all entries for a culture
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(`${culture}:`));
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      // Clear entire cache
      this.cache.clear();
    }

    // Also call backend cache invalidation if available
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.LOCALIZATION.CACHE_INVALIDATION}`;
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ culture, feature })
      });
    } catch (error) {
      console.warn('Failed to invalidate backend cache:', error);
    }
  }

  /**
   * Get cache information
   */
  getCacheInfo(): TranslationCacheInfo {
    const keys = Array.from(this.cache.keys());
    const size = keys.reduce((total, key) => {
      const entry = this.cache.get(key);
      return total + (entry ? JSON.stringify(entry.data).length : 0);
    }, 0);

    const timestamps = Array.from(this.cache.values()).map(entry => entry.timestamp);
    const lastUpdated = timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date();

    return {
      size,
      keys,
      lastUpdated
    };
  }

  /**
   * Preload translations for better performance
   */
  async preloadTranslations(cultures: string[], features: string[]): Promise<void> {
    const promises: Promise<any>[] = [];

    for (const culture of cultures) {
      for (const feature of features) {
        promises.push(
          this.getTranslations(culture, feature).catch(error => {
            console.warn(`Failed to preload ${culture}:${feature}`, error);
          })
        );
      }
    }

    await Promise.allSettled(promises);
  }

  /**
   * Fallback translations for critical UI elements
   */
  private getFallbackCommonTranslations(): Record<string, string> {
    return {
      // Navigation
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      users: 'Users',
      content: 'Content',
      ai_agent: 'AI Agent',
      system: 'System',
      settings: 'Settings',
      
      // Common actions
      welcome: 'Welcome',
      login: 'Login',
      logout: 'Logout',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      
      // Auth
      email: 'Email',
      password: 'Password',
      remember_me: 'Remember me',
      forgot_password: 'Forgot password?',
      sign_in: 'Sign In',
      sign_up: 'Sign Up',
      
      // Errors
      error_occurred: 'An error occurred',
      try_again: 'Try again',
      page_not_found: 'Page not found',
      loading: 'Loading...',
      no_data: 'No data available',
      
      // Status messages
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };
  }
}

export const translationService = TranslationService.getInstance();