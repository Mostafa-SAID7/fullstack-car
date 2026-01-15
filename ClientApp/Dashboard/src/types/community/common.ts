/**
 * Common types and interfaces used across community features
 */

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UserProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  isVerified?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
