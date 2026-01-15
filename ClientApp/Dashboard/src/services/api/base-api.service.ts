import { API_CONFIG } from '../../config/api/base';
import { authService } from '../auth';
import { cacheService } from '../cache/cache.service';

export interface ApiRequestOptions {
  cache?: boolean;
  cacheTTL?: number;
  params?: Record<string, string | number | boolean>;
  retryCount?: number;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class BaseApiService {
  protected readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.baseURL;
  }

  protected async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const cacheKey = url;
    
    // Check cache first
    if (options?.cache) {
      const cached = cacheService.get<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    const response = await this.fetchWithRetry<T>(url, {
      method: 'GET',
      headers: this.getHeaders(options?.headers)
    }, options?.retryCount);
    
    // Cache successful response
    if (options?.cache) {
      cacheService.set(cacheKey, response, options.cacheTTL);
    }
    
    return response;
  }

  protected async post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    
    const response = await this.fetchWithRetry<T>(url, {
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body)
    }, options?.retryCount);
    
    this.invalidateRelatedCache(endpoint);
    return response;
  }

  protected async put<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    
    const response = await this.fetchWithRetry<T>(url, {
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body)
    }, options?.retryCount);
    
    this.invalidateRelatedCache(endpoint);
    return response;
  }

  protected async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    
    const response = await this.fetchWithRetry<T>(url, {
      method: 'DELETE',
      headers: this.getHeaders(options?.headers)
    }, options?.retryCount);
    
    this.invalidateRelatedCache(endpoint);
    return response;
  }

  protected async patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    
    const response = await this.fetchWithRetry<T>(url, {
      method: 'PATCH',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body)
    }, options?.retryCount);
    
    this.invalidateRelatedCache(endpoint);
    return response;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (!params) {
      return url;
    }
    
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    return queryString ? `${url}?${queryString}` : url;
  }

  private getHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    
    const token = authService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retryCount: number = 0
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw await this.handleErrorResponse(response);
        }
        
        // Handle empty responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return {} as T;
        }
        
        return await response.json();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            throw error;
          }
        }
        
        // Wait before retrying
        if (attempt < retryCount) {
          await this.delay(1000 * (attempt + 1));
        }
      }
    }
    
    throw lastError || new Error('Request failed after retries');
  }

  private async handleErrorResponse(response: Response): Promise<Error> {
    let errorMessage = 'An unexpected error occurred';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    
    // Provide user-friendly messages based on status
    if (response.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else if (response.status === 401) {
      errorMessage = 'Unauthorized. Please log in again.';
    } else if (response.status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (response.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (response.status >= 500) {
      errorMessage = 'A server error occurred. Please try again later.';
    }
    
    const error = new Error(errorMessage) as any;
    error.status = response.status;
    error.statusText = response.statusText;
    
    console.error('API Error:', {
      url: response.url,
      status: response.status,
      message: errorMessage
    });
    
    return error;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private invalidateRelatedCache(endpoint: string): void {
    // Extract feature from endpoint (e.g., 'posts' from '/api/v7/community/posts')
    const parts = endpoint.split('/');
    const featureIndex = parts.findIndex(part => part === 'community') + 1;
    
    if (featureIndex > 0 && featureIndex < parts.length) {
      const feature = parts[featureIndex];
      cacheService.invalidatePattern(`*${feature}*`);
    }
  }
}
