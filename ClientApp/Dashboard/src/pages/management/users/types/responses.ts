// API Response Types
import type { User } from './user';
import type { UserActivity, SecurityLog } from './activity';
import type { UserReport } from './report';

export interface UserDetailResponse extends User {
  recentActivity: UserActivity[];
  securityLogs: SecurityLog[];
  reports: UserReport[];
}

export interface UserListResponse {
  users: User[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}