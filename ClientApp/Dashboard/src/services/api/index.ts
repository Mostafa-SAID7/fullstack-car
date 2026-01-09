import { REQUEST_TIMEOUTS, RETRY_CONFIG } from '../../config/api';
import { ApiError } from '../../types/api';
import { navigateToError } from '../../utils/errorNavigation';
import type { RequestConfig, RequestInterceptor } from '../../types/api';

// Export types and class from centralized definitions
export type { RequestConfig, RequestInterceptor };
export { ApiError };

export interface ApiResult<T = any> {
  succeeded: boolean;
  data?: T;
  errors?: string[];
  message?: string;
  statusCode?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5101/api';

class ApiClient {
  private baseUrl: string;
  private interceptors: RequestInterceptor[] = [];
  private authToken?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.authToken = localStorage.getItem('auth_token') || undefined;
  }

  // Interceptor Management
  addInterceptor(interceptor: RequestInterceptor): void {
    this.interceptors.push(interceptor);
  }

  removeInterceptor(interceptor: RequestInterceptor): void {
    const index = this.interceptors.indexOf(interceptor);
    if (index > -1) {
      this.interceptors.splice(index, 1);
    }
  }

  // Authentication
  setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken(): void {
    this.authToken = undefined;
    localStorage.removeItem('auth_token');
  }

  // HTTP Methods
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  async postWithProgress<T = any>(
    endpoint: string, 
    data?: any, 
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<ApiResult<T>> {
    return this.requestWithProgress<T>('POST', endpoint, data, onProgress, config);
  }

  async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }

  // Core Request Method with Progress Tracking
  private async requestWithProgress<T>(
    method: string,
    endpoint: string,
    data?: any,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<ApiResult<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    console.log(`[ApiClient] ${method} ${url} (with progress)`, data); // Debug log

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      if (onProgress && xhr.upload) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      // Set up response handling
      xhr.addEventListener('load', async () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const contentType = xhr.getResponseHeader('content-type');
            let responseData: any;

            if (contentType?.includes('application/json')) {
              responseData = JSON.parse(xhr.responseText);
            } else {
              responseData = xhr.responseText;
            }

            resolve({
              succeeded: true,
              data: responseData,
              statusCode: xhr.status
            });
          } else {
            let details: any = xhr.responseText;
            try {
              details = JSON.parse(xhr.responseText);
            } catch (e) {
              // Keep as text if not JSON
            }

            const apiError = new ApiError(
              `HTTP ${xhr.status}: ${xhr.statusText}`,
              xhr.status,
              undefined,
              details
            );

            // Extract errors from details if available
            let errors: string[] = [apiError.message];
            if (apiError.details) {
              if (Array.isArray(apiError.details)) {
                errors = apiError.details.map(e => String(e));
              } else if (typeof apiError.details === 'object' && apiError.details.errors) {
                const valErrors = apiError.details.errors;
                errors = Object.values(valErrors).flat().map(e => String(e));
              } else if (typeof apiError.details === 'string' && apiError.details) {
                errors = [apiError.details];
              } else if (apiError.details.message) {
                errors = [apiError.details.message];
              }
            }

            resolve({
              succeeded: false,
              errors: errors,
              message: errors[0] || 'Request failed',
              statusCode: xhr.status
            });
          }
        } catch (error) {
          reject(error);
        }
      });

      xhr.addEventListener('error', () => {
        resolve({
          succeeded: false,
          errors: ['Network error occurred'],
          message: 'Network error occurred'
        });
      });

      xhr.addEventListener('timeout', () => {
        resolve({
          succeeded: false,
          errors: ['Request timeout'],
          message: 'Request timeout'
        });
      });

      // Set up request
      xhr.open(method, url);

      // Add authentication header
      if (this.authToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.authToken}`);
      }

      // Add custom headers
      if (config?.headers) {
        Object.entries(config.headers).forEach(([key, value]) => {
          if (key !== 'Content-Type' || !(data instanceof FormData)) {
            xhr.setRequestHeader(key, value);
          }
        });
      }

      // Set timeout
      if (config?.timeout) {
        xhr.timeout = config.timeout;
      }

      // Send request
      if (data instanceof FormData) {
        xhr.send(data);
      } else if (data) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    });
  }

  // Core Request Method
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResult<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    console.log(`[ApiClient] ${method} ${url}`, data); // Debug log

    let requestConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      signal: config?.signal
    };

    // Add authentication header
    if (this.authToken) {
      (requestConfig.headers as any)['Authorization'] = `Bearer ${this.authToken}`;
    }

    // Add request body for non-GET requests
    if (data && method !== 'GET') {
      if (data instanceof FormData) {
        // Remove Content-Type for FormData (let browser set it)
        delete (requestConfig.headers as any)['Content-Type'];
        requestConfig.body = data;
      } else {
        requestConfig.body = JSON.stringify(data);
      }
    }

    // Apply request interceptors
    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        requestConfig = await interceptor.onRequest(requestConfig);
      }
    }

    const maxRetries = config?.retries ?? RETRY_CONFIG.MAX_RETRIES;
    let lastError: Error = new Error('Request failed');

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config?.timeout ?? REQUEST_TIMEOUTS.DEFAULT);

        if (config?.signal) {
          config.signal.addEventListener('abort', () => controller.abort());
        }

        requestConfig.signal = controller.signal;

        const response = await fetch(url, requestConfig);
        clearTimeout(timeoutId);

        // Apply response interceptors
        let processedResponse = response;
        for (const interceptor of this.interceptors) {
          if (interceptor.onResponse) {
            processedResponse = await interceptor.onResponse(processedResponse);
          }
        }

        if (!processedResponse.ok) {
          const errorText = await processedResponse.text().catch(() => '');
          console.log(`[ApiClient] Error response:`, errorText); // Debug log
          let details: any = errorText;
          try {
            details = JSON.parse(errorText);
          } catch (e) {
            // Keep as text if not JSON
          }

          const apiError = new ApiError(
            `HTTP ${processedResponse.status}: ${processedResponse.statusText}`,
            processedResponse.status,
            undefined,
            details
          );

          // Handle critical HTTP errors by redirecting to error pages
          if (processedResponse.status >= 500) {
            // Server errors - redirect to 500 page for critical issues
            if (config?.redirectOnError !== false) {
              navigateToError.serverError();
              return { succeeded: false, errors: ['Server error occurred'], statusCode: processedResponse.status };
            }
          } else if (processedResponse.status === 403) {
            // Forbidden - redirect to 403 page
            if (config?.redirectOnError !== false) {
              navigateToError.forbidden();
              return { succeeded: false, errors: ['Access forbidden'], statusCode: processedResponse.status };
            }
          }

          throw apiError;
        }

        const contentType = processedResponse.headers.get('content-type');
        let responseData: any;

        if (contentType?.includes('application/json')) {
          responseData = await processedResponse.json();
        } else {
          responseData = await processedResponse.text();
        }

        return {
          succeeded: true,
          data: responseData,
          statusCode: processedResponse.status
        };

      } catch (error) {
        lastError = error as Error;

        // Apply error interceptors
        for (const interceptor of this.interceptors) {
          if (interceptor.onError) {
            lastError = await interceptor.onError(lastError as ApiError);
          }
        }

        // Don't retry on certain errors
        if (
          error instanceof ApiError &&
          (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404)
        ) {
          break;
        }

        // Wait before retrying
        if (attempt < maxRetries) {
          const delay = (config?.retryDelay ?? RETRY_CONFIG.RETRY_DELAY) * Math.pow(RETRY_CONFIG.BACKOFF_FACTOR, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    const apiError = lastError instanceof ApiError ? lastError : new ApiError(lastError.message);

    // Extract errors from details if available
    let errors: string[] = [apiError.message];
    if (apiError.details) {
      if (Array.isArray(apiError.details)) {
        errors = apiError.details.map(e => String(e));
      } else if (typeof apiError.details === 'object' && apiError.details.errors) {
        // Handle ASP.NET Core Validation errors (ValidationProblemDetails)
        const valErrors = apiError.details.errors;
        errors = Object.values(valErrors).flat().map(e => String(e));
      } else if (typeof apiError.details === 'string' && apiError.details) {
        errors = [apiError.details];
      } else if (apiError.details.message) {
        errors = [apiError.details.message];
      }
    }

    return {
      succeeded: false,
      errors: errors,
      message: errors[0] || 'Request failed after retries',
      statusCode: apiError.statusCode
    };
  }

  // Utility Methods
  buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  }

  isNetworkError(error: any): boolean {
    return error.name === 'TypeError' && error.message.includes('fetch');
  }

  isTimeoutError(error: any): boolean {
    return error.name === 'AbortError';
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export constants
export { API_BASE_URL };
