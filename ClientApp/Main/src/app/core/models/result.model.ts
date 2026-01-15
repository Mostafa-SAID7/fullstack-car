export interface Result<T> {
    succeeded: boolean;
    data: T | null;
    errors: string[];
}

export interface PaginatedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
