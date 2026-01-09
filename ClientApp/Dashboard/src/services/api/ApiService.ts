import { httpClient, HttpClient } from './HttpClient';
import type { ApiResult } from '../../types/api';
import type { RequestConfig } from '../../types/api';

export abstract class ApiService {
  protected client: HttpClient;

  constructor(client?: HttpClient) {
    this.client = client || httpClient;
  }

  protected async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.client.get<T>(endpoint, config);
  }

  protected async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.client.post<T>(endpoint, data, config);
  }

  protected async postWithProgress<T>(
    endpoint: string, 
    data: FormData, 
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void,
    config?: RequestConfig
  ): Promise<ApiResult<T>> {
    return this.client.uploadWithProgress<T>(endpoint, data, onProgress, config);
  }

  protected async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.client.put<T>(endpoint, data, config);
  }

  protected async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.client.patch<T>(endpoint, data, config);
  }

  protected async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResult<T>> {
    return this.client.delete<T>(endpoint, config);
  }

  // Utility methods for common operations
  protected buildQueryString(params: Record<string, any>): string {
    return this.client.buildQueryString(params);
  }

  protected handleApiError(error: any): never {
    if (this.client.isNetworkError(error)) {
      throw new Error('Network connection failed. Please check your internet connection.');
    }
    
    if (this.client.isTimeoutError(error)) {
      throw new Error('Request timed out. Please try again.');
    }

    throw error;
  }

  protected async withErrorHandling<T>(operation: () => Promise<ApiResult<T>>): Promise<T> {
    try {
      const result = await operation();
      if (result.succeeded && result.data !== undefined) {
        return result.data;
      }
      throw new Error(result.message || result.errors?.[0] || 'Operation failed');
    } catch (error) {
      this.handleApiError(error);
    }
  }
}