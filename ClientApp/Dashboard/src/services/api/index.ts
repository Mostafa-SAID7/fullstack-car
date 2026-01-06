import { REQUEST_TIMEOUTS, RETRY_CONFIG } from '../../config/api';
import { ApiError } from '../../types/api';
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

const API_BASE_URL = 'http://localhost:5100/api';

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

  async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }

  // Core Request Method
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResult<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

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
          throw new ApiError(
            `HTTP ${processedResponse.status}: ${processedResponse.statusText}`,
            processedResponse.status,
            undefined,
            errorText || undefined
          );
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
    return {
      succeeded: false,
      errors: [apiError.message],
      message: 'Request failed after retries',
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
