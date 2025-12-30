export interface Result<T> {
    succeeded: boolean;
    data: T;
    errors: string[];
}

export interface PaginatedResult<T> {
    items: T[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
