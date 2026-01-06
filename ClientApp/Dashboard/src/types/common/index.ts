// Common Types

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterOption extends SelectOption {
  count?: number;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}

export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted' | 'running' | 'completed' | 'failed' | 'paused';

export interface StatusInfo {
  status: Status;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: Coordinates;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AuditInfo {
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  version: number;
}

export interface SearchCriteria {
  query?: string;
  filters?: Record<string, any>;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event types
export interface BaseEvent {
  id: string;
  type: string;
  timestamp: string;
  source: string;
}

export interface UserEvent extends BaseEvent {
  userId: string;
  sessionId?: string;
}

export interface SystemEvent extends BaseEvent {
  severity: 'info' | 'warning' | 'error' | 'critical';
  component: string;
}

// Tab Configuration
export interface TabConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}