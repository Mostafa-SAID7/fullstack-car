export interface ApiResponse<T = any> {
  succeeded: boolean;
  data?: T;
  errors?: string[];
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  succeeded: boolean;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiValidationError extends ApiError {
  errors: ValidationError[];
}