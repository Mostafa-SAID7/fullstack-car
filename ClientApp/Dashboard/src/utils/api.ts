// API Utilities

import { HTTP_STATUS_CODES, REQUEST_TIMEOUTS, RETRY_CONFIG } from '../constants/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  statusCode?: number;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  public statusCode?: number;
  public response?: any;

  constructor(
    message: string,
    statusCode?: number,
    response?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(baseURL: string = '', defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
    this.defaultTimeout = REQUEST_TIMEOUTS.DEFAULT;
  }

  protected async makeRequest<T>(
    url: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = RETRY_CONFIG.MAX_RETRIES,
      retryDelay = RETRY_CONFIG.RETRY_DELAY,
      headers = {},
      signal,
      ...fetchOptions
    } = options;

    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Use provided signal or create new one
    const requestSignal = signal || controller.signal;

    let lastError: Error = new Error('Unknown error');

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(fullUrl, {
          ...fetchOptions,
          headers: requestHeaders,
          signal: requestSignal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData
          );
        }

        const contentType = response.headers.get('content-type');
        let data: T;

        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = (await response.text()) as unknown as T;
        }

        return {
          success: true,
          data,
          statusCode: response.status
        };

      } catch (error) {
        lastError = error as Error;
        clearTimeout(timeoutId);

        // Don't retry on certain errors
        if (
          error instanceof ApiError &&
          (error.statusCode === HTTP_STATUS_CODES.UNAUTHORIZED ||
           error.statusCode === HTTP_STATUS_CODES.FORBIDDEN ||
           error.statusCode === HTTP_STATUS_CODES.NOT_FOUND)
        ) {
          break;
        }

        // Don't retry if aborted
        if (error instanceof Error && error.name === 'AbortError') {
          break;
        }

        // Wait before retry
        if (attempt < retries) {
          await new Promise(resolve => 
            setTimeout(resolve, retryDelay * Math.pow(RETRY_CONFIG.BACKOFF_MULTIPLIER, attempt))
          );
        }
      }
    }

    return {
      success: false,
      message: lastError.message,
      errors: [lastError.message]
    };
  }

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'GET', ...config });
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config
    });
  }

  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config
    });
  }

  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...config
    });
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'DELETE', ...config });
  }

  // File upload helper
  async uploadFile<T>(
    url: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, string>,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.makeRequest<T>(url, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
      timeout: REQUEST_TIMEOUTS.UPLOAD,
      ...config
    });
  }

  // Download helper
  async downloadFile(
    url: string,
    filename?: string,
    config?: RequestConfig
  ): Promise<void> {
    const response = await this.makeRequest<Blob>(url, {
      ...config,
      timeout: REQUEST_TIMEOUTS.DOWNLOAD
    });

    if (response.success && response.data) {
      const blob = response.data;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }
  }

  // Set authorization header
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authorization header
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  // Update base URL
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  // Update default headers
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }
}

// Request interceptors
export interface RequestInterceptor {
  onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
  onResponse?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
  onError?: (error: ApiError) => ApiError | Promise<ApiError>;
}

export class InterceptedApiClient extends ApiClient {
  private interceptors: RequestInterceptor[] = [];

  addInterceptor(interceptor: RequestInterceptor): void {
    this.interceptors.push(interceptor);
  }

  removeInterceptor(interceptor: RequestInterceptor): void {
    const index = this.interceptors.indexOf(interceptor);
    if (index > -1) {
      this.interceptors.splice(index, 1);
    }
  }

  // Override makeRequest to apply interceptors
  async makeRequest<T>(
    url: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    // Apply request interceptors
    let processedOptions: RequestInit & RequestConfig = options;
    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        processedOptions = await interceptor.onRequest(processedOptions) as RequestInit & RequestConfig;
      }
    }

    try {
      let response = await super.makeRequest<T>(url, processedOptions);

      // Apply response interceptors
      for (const interceptor of this.interceptors) {
        if (interceptor.onResponse) {
          response = await interceptor.onResponse(response);
        }
      }

      return response;
    } catch (error) {
      let processedError = error as ApiError;

      // Apply error interceptors
      for (const interceptor of this.interceptors) {
        if (interceptor.onError) {
          processedError = await interceptor.onError(processedError);
        }
      }

      throw processedError;
    }
  }
}

// Utility functions
export const createQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
};

export const parseErrorResponse = (error: any): string[] => {
  if (error instanceof ApiError) {
    return error.response?.errors || [error.message];
  }
  
  if (typeof error === 'string') {
    return [error];
  }
  
  if (error?.message) {
    return [error.message];
  }
  
  return ['An unexpected error occurred'];
};