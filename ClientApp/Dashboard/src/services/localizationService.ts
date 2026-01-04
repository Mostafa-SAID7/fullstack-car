import { apiClient } from './api';

export interface TranslationDto {
  id: string;
  key: string;
  value: string;
  language: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TranslationStatsDto {
  totalTranslations: number;
  totalLanguages: number;
  totalCategories: number;
  activeTranslations: number;
  inactiveTranslations: number;
  translationsByLanguage: Record<string, number>;
  translationsByCategory: Record<string, number>;
  lastUpdated: string;
}

export interface CreateTranslationRequest {
  key: string;
  value: string;
  language: string;
  category: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateTranslationRequest {
  id: string;
  key: string;
  value: string;
  language: string;
  category: string;
  description?: string;
  isActive?: boolean;
}

export interface GetTranslationsRequest {
  language?: string;
  category?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface BulkImportRequest {
  language: string;
  translations: Array<{
    key: string;
    value: string;
    category: string;
    description?: string;
  }>;
  overwriteExisting?: boolean;
}

export interface BulkImportResult {
  totalProcessed: number;
  successfulImports: number;
  failedImports: number;
  errors: string[];
  importedTranslations: TranslationDto[];
}

export interface ExportRequest {
  language?: string;
  categories?: string[];
  format?: 'json' | 'csv' | 'xlsx';
  includeInactive?: boolean;
}

export interface ApiResponse<T> {
  succeeded: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

class LocalizationService {
  // Get supported languages
  async getSupportedLanguages(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.get<string[]>('/shared/localization/languages');
      return {
        succeeded: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to get supported languages:', error);
      return {
        succeeded: false,
        message: 'Failed to load supported languages'
      };
    }
  }

  // Get language resources
  async getLanguageResources(language: string): Promise<ApiResponse<Record<string, any>>> {
    try {
      const response = await apiClient.get<Record<string, any>>(`/shared/localization/resources/${language}`);
      return {
        succeeded: true,
        data: response
      };
    } catch (error) {
      console.error(`Failed to get resources for ${language}:`, error);
      return {
        succeeded: false,
        message: `Failed to load resources for ${language}`
      };
    }
  }

  // Get translations with pagination and filtering
  async getTranslations(params?: GetTranslationsRequest): Promise<ApiResponse<PagedResult<TranslationDto>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.language) queryParams.append('language', params.language);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);

      const url = `/shared/localization/translations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<PagedResult<TranslationDto>>(url);

      return {
        succeeded: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to get translations:', error);
      return {
        succeeded: false,
        message: 'Failed to load translations'
      };
    }
  }

  // Get translation statistics
  async getTranslationStats(): Promise<ApiResponse<TranslationStatsDto>> {
    try {
      const response = await apiClient.get<TranslationStatsDto>('/shared/localization/stats');
      return {
        succeeded: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to get translation stats:', error);
      return {
        succeeded: false,
        message: 'Failed to load translation statistics'
      };
    }
  }

  // Create new translation
  async createTranslation(translation: CreateTranslationRequest): Promise<ApiResponse<TranslationDto>> {
    try {
      const response = await apiClient.post<TranslationDto>('/shared/localization/translations', translation);
      return {
        succeeded: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to create translation:', error);
      return {
        succeeded: false,
        message: 'Failed to create translation'
      };
    }
  }

  // Update existing translation
  async updateTranslation(translation: UpdateTranslationRequest): Promise<ApiResponse<TranslationDto>> {
    try {
      const response = await apiClient.put<TranslationDto>(`/shared/localization/translations/${translation.id}`, translation);
      return {
        succeeded: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to update translation:', error);
      return {
        succeeded: false,
        message: 'Failed to update translation'
      };
    }
  }

  // Delete translation
  async deleteTranslation(id: string): Promise<ApiResponse<boolean>> {
    try {
      await apiClient.delete(`/shared/localization/translations/${id}`);
      return {
        succeeded: true,
        data: true
      };
    } catch (error) {
      console.error('Failed to delete translation:', error);
      return {
        succeeded: false,
        message: 'Failed to delete translation'
      };
    }
  }

  // Bulk import translations
  async bulkImportTranslations(request: BulkImportRequest): Promise<ApiResponse<BulkImportResult>> {
    try {
      const response = await apiClient.post<BulkImportResult>('/shared/localization/bulk-import', request);
      return {
        succeeded: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to bulk import translations:', error);
      return {
        succeeded: false,
        message: 'Failed to import translations'
      };
    }
  }

  // Export translations
  async exportTranslations(request: ExportRequest): Promise<Blob> {
    try {
      const response = await apiClient.post('/shared/localization/export', request);
      return response as Blob;
    } catch (error) {
      console.error('Failed to export translations:', error);
      throw new Error('Failed to export translations');
    }
  }

  // Get translation by key
  async getTranslation(language: string, key: string): Promise<ApiResponse<string>> {
    try {
      const response = await apiClient.get<string>(`/shared/localization/translate/${language}/${key}`);
      return {
        succeeded: true,
        data: response
      };
    } catch (error) {
      console.error(`Failed to get translation for ${key} in ${language}:`, error);
      return {
        succeeded: false,
        message: `Failed to get translation for ${key}`
      };
    }
  }

  // Validate translations for a language
  async validateTranslations(language: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/shared/localization/validate', { language });
      return {
        succeeded: true,
        data: response
      };
    } catch (error) {
      console.error(`Failed to validate translations for ${language}:`, error);
      return {
        succeeded: false,
        message: `Failed to validate translations for ${language}`
      };
    }
  }
}

export const localizationService = new LocalizationService();
