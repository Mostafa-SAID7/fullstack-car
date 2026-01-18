import { API_ENDPOINTS } from '../../config/api';
import { apiClient } from '../api';
import type { ApiResult } from '../../types/api';

// Localization Service and Types
export interface TranslationDto {
    id: string;
    key: string;
    value: string;
    language: string;
    category: string;
    description?: string;
    isActive: boolean;
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
    activeTranslations: number;
    totalLanguages: number;
    totalCategories: number;
}

export interface CultureMetrics {
    culture: string;
    requests: number;
    hits: number;
    misses: number;
    hitRate: number;
    averageLoadTime: string;
}

export interface FeatureMetrics {
    feature: string;
    requests: number;
    hits: number;
    misses: number;
    hitRate: number;
    averageLoadTime: string;
}

export interface TranslationCacheMetrics {
    startTime: string;
    lastUpdated: string;
    totalRequests: number;
    memoryCacheHits: number;
    distributedCacheHits: number;
    cacheMisses: number;
    memoryCacheHitRate: number;
    distributedCacheHitRate: number;
    overallCacheHitRate: number;
    averageLoadTime: string;
    cultureMetrics: Record<string, CultureMetrics>;
    featureMetrics: Record<string, FeatureMetrics>;
}

export interface ValidateTranslationResult {
    language: string;
    totalKeys: number;
    translatedKeys: number;
    missingKeys: string[];
    completionPercentage: number;
}

export interface TranslationValidationResult {
    startTime: string;
    endTime: string;
    duration: string;
    success: boolean;
    errorMessage?: string;
    summary: {
        totalFeatures: number;
        totalCultures: number;
        overallCompletionPercentage: number;
        totalIssues: number;
        hasCriticalIssues: boolean;
        hasWarnings: boolean;
    };
    report: any; // Simplified for now, can be robust type
}

export interface TranslationUpdateDto {
    key: string;
    value: string;
    culture: string;
    feature: string;
    timestamp: string;
}

export const localizationService = {
    getTranslations: async (params?: any): Promise<ApiResult<PagedResult<TranslationDto>>> => {
        // Points to V7 [HttpGet("translations")] with query params
        const query = apiClient.buildQueryString(params || {});
        return await apiClient.get<PagedResult<TranslationDto>>(`${API_ENDPOINTS.LOCALIZATION.TRANSLATIONS}?${query}`);
    },
    // ... stats ...
    getSupportedCultures: async (): Promise<ApiResult<string[]>> => {
        return await apiClient.get<string[]>(API_ENDPOINTS.LOCALIZATION.SUPPORTED_CULTURES);
    },
    getTranslationUpdates: async (culture: string, since: string, features: string[] = []): Promise<ApiResult<TranslationUpdateDto[]>> => {
        return await apiClient.post<TranslationUpdateDto[]>(API_ENDPOINTS.LOCALIZATION.UPDATES.replace('{culture}', culture), {
            since,
            features
        });
    },
    getTranslationStats: async (): Promise<ApiResult<TranslationStatsDto>> => {
        // v7 doesn't have a direct /stats endpoint for general counts yet, 
        // we'll keep using the v4 one or implement a bridge.
        return await apiClient.get<TranslationStatsDto>(`${API_ENDPOINTS.CONTENT.LOCALIZATION}/stats`);
    },
    getCacheMetrics: async (): Promise<ApiResult<TranslationCacheMetrics>> => {
        return await apiClient.get<TranslationCacheMetrics>(API_ENDPOINTS.LOCALIZATION.CACHE_METRICS);
    },
    createTranslation: async (data: any): Promise<ApiResult<TranslationDto>> => {
        return await apiClient.post<TranslationDto>(API_ENDPOINTS.LOCALIZATION.TRANSLATIONS, data);
    },
    updateTranslation: async (data: any): Promise<ApiResult<TranslationDto>> => {
        return await apiClient.put<TranslationDto>(`${API_ENDPOINTS.LOCALIZATION.TRANSLATIONS}/${data.id}`, data);
    },
    deleteTranslation: async (id: string): Promise<ApiResult<boolean>> => {
        return await apiClient.delete<boolean>(`${API_ENDPOINTS.LOCALIZATION.TRANSLATIONS}/${id}`);
    },
    importTranslations: async (data: any): Promise<ApiResult<any>> => {
        return await apiClient.post<any>(`${API_ENDPOINTS.CONTENT.LOCALIZATION}/bulk-import`, data);
    },
    exportTranslations: async (data: any): Promise<ApiResult<any>> => {
        return await apiClient.post<any>(`${API_ENDPOINTS.CONTENT.LOCALIZATION}/export`, data);
    },
    invalidateCache: async (params: { culture?: string; feature?: string }): Promise<ApiResult<boolean>> => {
        const query = apiClient.buildQueryString(params);
        return await apiClient.delete<boolean>(`${API_ENDPOINTS.LOCALIZATION.CACHE}?${query}`);
    },
    warmCache: async (data: { culture: string; features: string[] }): Promise<ApiResult<any>> => {
        return await apiClient.post<any>(API_ENDPOINTS.LOCALIZATION.CACHE_WARM, data);
    },
    getResourceFiles: async (): Promise<ApiResult<ResourceFileDto[]>> => {
        return await apiClient.get<ResourceFileDto[]>(API_ENDPOINTS.LOCALIZATION.RESOURCE_FILES);
    },
    validateTranslations: async (language: string): Promise<ApiResult<TranslationValidationResult>> => {
        // Call V7 validate endpoint
        return await apiClient.post<TranslationValidationResult>(`${API_ENDPOINTS.CONTENT.LOCALIZATION}/validate`, {
            culture: language,
            // default params
        });
    }
};

export interface ResourceFileDto {
    fileName: string;
    feature: string;
    culture: string;
    path: string;
    size: number;
    lastModified: string;
    exists: boolean;
    keyCount: number;
}
