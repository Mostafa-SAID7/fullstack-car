// User Filters Types
export interface UserFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  role?: string;
  joinedAfter?: string;
  joinedBefore?: string;
  isVerified?: boolean;
  sortBy?: string;
  sortDirection?: string;
}