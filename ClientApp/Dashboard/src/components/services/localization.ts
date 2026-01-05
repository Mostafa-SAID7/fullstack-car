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

export const localizationService = {
    getTranslations: async (_params?: any): Promise<{ succeeded: boolean; data?: PagedResult<TranslationDto>; message?: string }> => {
        return {
            succeeded: true,
            data: { items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0, hasNextPage: false, hasPreviousPage: false }
        };
    },
    getTranslationStats: async (): Promise<{ succeeded: boolean; data?: TranslationStatsDto; message?: string }> => {
        return {
            succeeded: true,
            data: { totalTranslations: 0, activeTranslations: 0, totalLanguages: 0, totalCategories: 0 }
        };
    },
    createTranslation: async (_data: any): Promise<{ succeeded: boolean; message?: string }> => {
        return { succeeded: true };
    },
    updateTranslation: async (_data: any): Promise<{ succeeded: boolean; message?: string }> => {
        return { succeeded: true };
    },
    deleteTranslation: async (_id: string): Promise<{ succeeded: boolean; message?: string }> => {
        return { succeeded: true };
    },
    importTranslations: async (_file: File): Promise<{ succeeded: boolean; message?: string }> => {
        return { succeeded: true };
    },
    exportTranslations: async (_format: string): Promise<Blob> => {
        return new Blob();
    }
};
