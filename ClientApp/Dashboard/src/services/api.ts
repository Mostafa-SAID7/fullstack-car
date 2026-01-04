import { REQUEST_TIMEOUTS, RETRY_CONFIG } from '../constants/api';
import type { ApiResult } from '../types/auth';
export type { ApiResult };

const API_BASE_URL = 'http://localhost:5100/api';

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

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export interface RequestInterceptor {
  onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
  onResponse?: <T>(response: ApiResult<T>) => ApiResult<T> | Promise<ApiResult<T>>;
  onError?: (error: ApiError) => ApiError | Promise<ApiError>;
}

export class ApiClient {
  private baseUrl: string;
  private interceptors: RequestInterceptor[] = [];
  private defaultTimeout: number = REQUEST_TIMEOUTS.DEFAULT;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  addInterceptor(interceptor: RequestInterceptor): void {
    this.interceptors.push(interceptor);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retries = RETRY_CONFIG.MAX_RETRIES,
      retryDelay = RETRY_CONFIG.RETRY_DELAY,
      headers = {},
      signal,
      ...fetchOptions
    } = options;

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    // Apply request interceptors
    let config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...fetchOptions,
    };

    const token = localStorage.getItem('token');
    if (token && !config.headers?.['Authorization' as keyof typeof config.headers]) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        config = await interceptor.onRequest(config);
      }
    }

    // Abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const requestSignal = signal || controller.signal;

    let lastError: any;

    for (let attempt = 0; attempt <= (retries || 0); attempt++) {
      try {
        const response = await fetch(url, {
          ...config,
          signal: requestSignal,
          credentials: 'include'
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
              const newToken = localStorage.getItem('token');
              (config.headers as any).Authorization = `Bearer ${newToken}`;
              const retryResponse = await fetch(url, { ...config, signal: requestSignal });
              if (retryResponse.ok) return await retryResponse.json();
            }
            this.handleAuthError();
            throw new ApiError('Authentication failed', 401);
          }

          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || `HTTP error! status: ${response.status}`,
            response.status,
            errorData
          );
        }

        const data = await response.json();

        let result: ApiResult<T> = {
          succeeded: true,
          data
        };

        // Apply response interceptors
        for (const interceptor of this.interceptors) {
          if (interceptor.onResponse) {
            result = await interceptor.onResponse(result);
          }
        }

        return result.data as T;

      } catch (error: any) {
        lastError = error;
        clearTimeout(timeoutId);

        // Apply error interceptors
        for (const interceptor of this.interceptors) {
          if (interceptor.onError && error instanceof ApiError) {
            lastError = await interceptor.onError(error);
          }
        }

        // Don't retry on certain errors
        if (
          error instanceof ApiError &&
          (error.statusCode === 401 || error.statusCode === 403 || error.statusCode === 404)
        ) {
          break;
        }

        if (error.name === 'AbortError') break;

        // Wait before retry
        if (attempt < (retries || 0)) {
          await new Promise(resolve =>
            setTimeout(resolve, retryDelay * Math.pow(RETRY_CONFIG.BACKOFF_MULTIPLIER, attempt))
          );
        }
      }
    }

    console.error('API request failed:', lastError);
    throw lastError;
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token || !refreshToken) return false;

      const response = await fetch(`${this.baseUrl}/v1/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('tokenExpiry', data.expiresAt);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  }

  private handleAuthError(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...config });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...config
    });
  }

  async delete<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
      ...config
    });
  }

  async upload<T>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type
      timeout: REQUEST_TIMEOUTS.UPLOAD,
      ...config
    });
  }
}

export const apiClient = new ApiClient();