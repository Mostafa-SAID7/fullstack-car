export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  succeeded: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface SortOptions {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface PaginationOptions {
  pageNumber: number;
  pageSize: number;
}

export interface SearchOptions {
  query?: string;
  filters?: { [key: string]: any };
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditableEntity extends BaseEntity {
  createdBy: string;
  updatedBy?: string;
}