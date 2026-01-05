/**
 * UI-related types and interfaces
 */

export interface ListViewConfig {
    showPagination?: boolean;
    itemsPerPage?: number;
    gridCols?: number;
    gap?: string;
}

export interface PaginationConfig {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

