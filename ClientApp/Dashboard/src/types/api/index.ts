// API Types

export interface Result<T = unknown> {
  succeeded: boolean;
  data?: T;
  errors: string[];
  message?: string;
}

export interface PaginatedResult<T = unknown> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Result utility class
export class ApiResultClass<T = unknown> {
  public succeeded: boolean;
  public data?: T;
  public errors: string[];
  public message?: string;

  constructor(succeeded: boolean, data?: T, errors: string[] = [], message?: string) {
    this.succeeded = succeeded;
    this.data = data;
    this.errors = errors;
    this.message = message;
  }

  static success<T>(data: T, message?: string): ApiResultClass<T> {
    return new ApiResultClass<T>(true, data, [], message);
  }

  static failure<T>(errors: string | string[], message?: string): ApiResultClass<T> {
    const errorArray = Array.isArray(errors) ? errors : [errors];
    return new ApiResultClass<T>(false, undefined, errorArray, message);
  }
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  signal?: AbortSignal;
  redirectOnError?: boolean; // Whether to redirect to error pages on HTTP errors (default: true)
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

export interface RequestInterceptor {
  onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
  onResponse?: (response: Response) => Response | Promise<Response>;
  onError?: (error: ApiError) => ApiError | Promise<ApiError>;
}

export class ApiError extends Error {
  public status: number;
  public statusCode: number; // Alias for status
  public code?: string;
  public details?: unknown;

  constructor(message: string, status: number = 500, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusCode = status; // Set alias
    this.code = code;
    this.details = details;
  }

  static fromResponse(response: Response): ApiError {
    const message = (response as any).data?.message || response.statusText || 'An error occurred';
    const status = response.status || 500;
    const code = (response as any).data?.code;
    const details = (response as any).data?.errors || (response as any).data?.details;

    return new ApiError(message, status, code, details);
  }

  static networkError(message = 'Network error occurred'): ApiError {
    return new ApiError(message, 0, 'NETWORK_ERROR');
  }

  static timeoutError(message = 'Request timeout'): ApiError {
    return new ApiError(message, 0, 'TIMEOUT_ERROR');
  }

  static validationError(message = 'Validation failed', details?: unknown): ApiError {
    return new ApiError(message, 422, 'VALIDATION_ERROR', details);
  }

  static unauthorizedError(message = 'Unauthorized'): ApiError {
    return new ApiError(message, 401, 'UNAUTHORIZED');
  }

  static forbiddenError(message = 'Forbidden'): ApiError {
    return new ApiError(message, 403, 'FORBIDDEN');
  }

  static notFoundError(message = 'Not found'): ApiError {
    return new ApiError(message, 404, 'NOT_FOUND');
  }

  static serverError(message = 'Internal server error'): ApiError {
    return new ApiError(message, 500, 'SERVER_ERROR');
  }

  isNetworkError(): boolean {
    return this.code === 'NETWORK_ERROR';
  }

  isTimeoutError(): boolean {
    return this.code === 'TIMEOUT_ERROR';
  }

  isValidationError(): boolean {
    return this.code === 'VALIDATION_ERROR' || this.status === 422;
  }

  isUnauthorizedError(): boolean {
    return this.status === 401;
  }

  isForbiddenError(): boolean {
    return this.status === 403;
  }

  isNotFoundError(): boolean {
    return this.status === 404;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

export interface ApiResult<T = unknown> {
  succeeded: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  statusCode?: number;
}

export interface PaginatedApiResult<T = unknown> extends ApiResult<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadConfig extends RequestConfig {
  onProgress?: (progress: UploadProgress) => void;
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml'
} as const;