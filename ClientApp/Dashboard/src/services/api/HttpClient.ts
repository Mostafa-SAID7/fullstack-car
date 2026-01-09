// Enhanced HTTP Client with Error Handling and Retry Logic

import { API_CONFIG, REQUEST_TIMEOUTS, RETRY_CONFIG } from '../../config/api/base';
import { REQUEST_INTERCEPTORS, RESPONSE_INTERCEPTORS, RETRY_INTERCEPTOR_CONFIG } from '../../config/api/interceptors';
import { ApiError, type RequestConfig, type RequestInterceptor, type ApiResult } from '../../types/api';
import { navigateToError } from '../../utils/errorNavigation';

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  interceptors?: RequestInterceptor[];
}

export interface UploadProgressCallback {
  (progress: { loaded: number; total: number; percentage: number }): void;
}

export class HttpClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultRetryDelay: number;
  private defaultHeaders: Record<string, string>;
  private interceptors: RequestInterceptor[] = [];
  private authToken?: string;
  private requestIdCounter = 0;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || API_CONFIG.baseURL;
    this.defaultTimeout = config.timeout || API_CONFIG.timeout;
    this.defaultRetries = config.retries || API_CONFIG.retries;
    this.defaultRetryDelay = config.retryDelay || API_CONFIG.retryDelay;
    this.defaultHeaders = { ...API_CONFIG.headers, ...config.headers };
    
    if (config.interceptors) {
      this.interceptors = [...config.interceptors];
    }

    // Load stored auth token
    this.authToken = localStorage.getItem('auth_token') || undefined;

    // Set up default interceptors
    this.setupDefaultInterceptors();
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

  clearInterceptors(): void {
    this.interceptors = [];
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

  getAuthToken(): string | undefined {
    return this.authToken;
  }

  // HTTP Methods
  async get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  async delete<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  // Upload with Progress
  async uploadWithProgress<T = unknown>(
    url: string,
    data: FormData,
    onProgress?: UploadProgressCallback,
    config?: RequestConfig
  ): Promise<ApiResult<T>> {
    const fullUrl = this.buildUrl(url);
    const requestId = this.generateRequestId();

    if (REQUEST_INTERCEPTORS.LOGGING) {
      console.log(`[HttpClient] Upload ${fullUrl} (ID: ${requestId})`);
    }

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      if (onProgress && xhr.upload) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            onProgress(progress);
          }
        });
      }

      // Set up response handling
      xhr.addEventListener('load', async () => {
        try {
          const result = await this.processXhrResponse<T>(xhr, requestId);
          resolve(result);
        } catch (error) {
          resolve(this.createErrorResult(error as Error));
        }
      });

      xhr.addEventListener('error', () => {
        const error = new ApiError('Network error occurred', 0, 'NETWORK_ERROR');
        resolve(this.createErrorResult(error));
      });

      xhr.addEventListener('timeout', () => {
        const error = new ApiError('Request timeout', 0, 'TIMEOUT_ERROR');
        resolve(this.createErrorResult(error));
      });

      // Set up request
      xhr.open('POST', fullUrl);

      // Add headers
      this.addRequestHeaders(xhr, config?.headers);

      // Set timeout
      xhr.timeout = config?.timeout || REQUEST_TIMEOUTS.UPLOAD;

      // Send request
      xhr.send(data);
    });
  }

  // Core Request Method with Retry Logic
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResult<T>> {
    const fullUrl = this.buildUrl(url);
    const requestId = this.generateRequestId();

    if (REQUEST_INTERCEPTORS.LOGGING) {
      console.log(`[HttpClient] ${method} ${fullUrl} (ID: ${requestId})`, data);
    }

    const maxRetries = config?.retries ?? this.defaultRetries;
    let lastError: Error = new Error('Request failed');

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.executeRequest<T>(method, fullUrl, data, config, requestId, attempt);
        
        if (REQUEST_INTERCEPTORS.LOGGING) {
          console.log(`[HttpClient] Success ${method} ${fullUrl} (ID: ${requestId})`, result);
        }

        return result;
      } catch (error) {
        lastError = error as Error;

        if (REQUEST_INTERCEPTORS.LOGGING) {
          console.log(`[HttpClient] Error ${method} ${fullUrl} (ID: ${requestId}, Attempt: ${attempt + 1})`, error);
        }

        // Check if we should retry
        if (attempt < maxRetries && this.shouldRetry(error as ApiError)) {
          const delay = this.calculateRetryDelay(attempt, config?.retryDelay);
          await this.sleep(delay);
          continue;
        }

        // No more retries, handle the error
        break;
      }
    }

    // All retries failed
    return this.handleFinalError(lastError, requestId);
  }

  private async executeRequest<T>(
    method: string,
    url: string,
    data?: any,
    config?: RequestConfig,
    requestId?: string,
    _attempt?: number
  ): Promise<ApiResult<T>> {
    let requestConfig: RequestInit = {
      method,
      headers: { ...this.defaultHeaders, ...config?.headers },
      signal: config?.signal
    };

    // Add authentication header
    if (this.authToken) {
      (requestConfig.headers as any)['Authorization'] = `Bearer ${this.authToken}`;
    }

    // Add request ID for tracking
    if (requestId) {
      (requestConfig.headers as any)['X-Request-ID'] = requestId;
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

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      config?.timeout ?? this.defaultTimeout
    );

    if (config?.signal) {
      config.signal.addEventListener('abort', () => controller.abort());
    }

    requestConfig.signal = controller.signal;

    try {
      const response = await fetch(url, requestConfig);
      clearTimeout(timeoutId);

      // Apply response interceptors
      let processedResponse = response;
      for (const interceptor of this.interceptors) {
        if (interceptor.onResponse) {
          processedResponse = await interceptor.onResponse(processedResponse);
        }
      }

      return await this.processResponse<T>(processedResponse, requestId);
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.processError(error as Error);
    }
  }

  private async processResponse<T>(response: Response, _requestId?: string): Promise<ApiResult<T>> {
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      let details: any = errorText;
      
      try {
        details = JSON.parse(errorText);
      } catch (e) {
        // Keep as text if not JSON
      }

      const apiError = new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        undefined,
        details
      );

      // Handle critical HTTP errors by redirecting to error pages
      // Only redirect for authentication errors, not general API failures
      if (RESPONSE_INTERCEPTORS.ERROR_HANDLING && response.status === 401) {
        this.handleHttpError(response.status);
      }

      throw apiError;
    }

    const contentType = response.headers.get('content-type');
    let responseData: any;

    if (contentType?.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return {
      succeeded: true,
      data: responseData,
      statusCode: response.status
    };
  }

  private async processXhrResponse<T>(xhr: XMLHttpRequest, _requestId?: string): Promise<ApiResult<T>> {
    if (xhr.status >= 200 && xhr.status < 300) {
      const contentType = xhr.getResponseHeader('content-type');
      let responseData: any;

      if (contentType?.includes('application/json')) {
        responseData = JSON.parse(xhr.responseText);
      } else {
        responseData = xhr.responseText;
      }

      return {
        succeeded: true,
        data: responseData,
        statusCode: xhr.status
      };
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

      throw apiError;
    }
  }

  private processError(error: Error): ApiError {
    if (error.name === 'AbortError') {
      return new ApiError('Request timeout', 0, 'TIMEOUT_ERROR');
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new ApiError('Network error occurred', 0, 'NETWORK_ERROR');
    }

    if (error instanceof ApiError) {
      return error;
    }

    return new ApiError(error.message, 500, 'UNKNOWN_ERROR');
  }

  private shouldRetry(error: ApiError): boolean {
    // Don't retry on client errors (4xx) except for specific cases
    if (RETRY_INTERCEPTOR_CONFIG.NON_RETRYABLE_STATUS_CODES.includes(error.statusCode as any)) {
      return false;
    }

    // Retry on server errors (5xx) and specific client errors
    if (RETRY_INTERCEPTOR_CONFIG.RETRYABLE_STATUS_CODES.includes(error.statusCode as any)) {
      return true;
    }

    // Retry on network and timeout errors
    if (error.code === 'NETWORK_ERROR' && RETRY_INTERCEPTOR_CONFIG.RETRY_ON_NETWORK_ERROR) {
      return true;
    }

    if (error.code === 'TIMEOUT_ERROR' && RETRY_INTERCEPTOR_CONFIG.RETRY_ON_TIMEOUT) {
      return true;
    }

    return false;
  }

  private calculateRetryDelay(attempt: number, customDelay?: number): number {
    const baseDelay = customDelay ?? this.defaultRetryDelay;
    return baseDelay * Math.pow(RETRY_CONFIG.BACKOFF_FACTOR, attempt);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleHttpError(status: number): void {
    if (status >= 500) {
      // Server errors - redirect to 500 page for critical issues
      navigateToError.serverError();
    } else if (status === 403) {
      // Forbidden - redirect to 403 page
      navigateToError.forbidden();
    } else if (status === 401) {
      // Unauthorized - clear auth and redirect to login
      this.clearAuthToken();
      // Note: Don't redirect here, let the auth context handle it
    }
  }

  private handleFinalError<T>(error: Error, _requestId?: string): ApiResult<T> {
    const apiError = error instanceof ApiError ? error : new ApiError(error.message);

    // Apply error interceptors
    for (const interceptor of this.interceptors) {
      if (interceptor.onError) {
        interceptor.onError(apiError);
      }
    }

    // Extract errors from details if available
    let errors: string[] = [apiError.message];
    if (apiError.details) {
      if (Array.isArray(apiError.details)) {
        errors = apiError.details.map(e => String(e));
      } else if (typeof apiError.details === 'object' && apiError.details !== null && 'errors' in apiError.details) {
        // Handle ASP.NET Core Validation errors (ValidationProblemDetails)
        const valErrors = (apiError.details as any).errors;
        errors = Object.values(valErrors).flat().map(e => String(e));
      } else if (typeof apiError.details === 'string' && apiError.details) {
        errors = [apiError.details];
      } else if (typeof apiError.details === 'object' && apiError.details !== null && 'message' in apiError.details) {
        errors = [(apiError.details as any).message];
      }
    }

    return {
      succeeded: false,
      errors: errors,
      message: errors[0] || 'Request failed after retries',
      statusCode: apiError.statusCode
    };
  }

  private createErrorResult<T>(error: Error): ApiResult<T> {
    const apiError = error instanceof ApiError ? error : new ApiError(error.message);
    return this.handleFinalError<T>(apiError);
  }

  private buildUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return `${this.baseURL}${url.startsWith('/') ? url : '/' + url}`;
  }

  private addRequestHeaders(xhr: XMLHttpRequest, customHeaders?: Record<string, string>): void {
    // Add default headers
    Object.entries(this.defaultHeaders).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    // Add auth header
    if (this.authToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${this.authToken}`);
    }

    // Add custom headers
    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${++this.requestIdCounter}`;
  }

  private setupDefaultInterceptors(): void {
    // Add logging interceptor if enabled
    if (REQUEST_INTERCEPTORS.LOGGING) {
      this.addInterceptor({
        onRequest: async (config) => {
          console.log('[HttpClient] Request:', config);
          return config;
        },
        onResponse: async (response) => {
          console.log('[HttpClient] Response:', response);
          return response as any;
        },
        onError: async (error) => {
          console.error('[HttpClient] Error:', error);
          return error;
        }
      });
    }
  }

  // Utility Methods
  buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    return searchParams.toString();
  }

  isNetworkError(error: any): boolean {
    return error?.code === 'NETWORK_ERROR';
  }

  isTimeoutError(error: any): boolean {
    return error?.code === 'TIMEOUT_ERROR';
  }

  isRetryableError(error: any): boolean {
    return this.shouldRetry(error);
  }
}

// Export singleton instance
export const httpClient = new HttpClient();