import { apiClient } from './index';
import type { ApiResult } from './index';
import type { RequestConfig } from '../../types/api';

export abstract class ApiService {
  protected async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResult<T>> {
    return apiClient.get<T>(endpoint, config);
  }

  protected async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return apiClient.post<T>(endpoint, data, config);
  }

  protected async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return apiClient.put<T>(endpoint, data, config);
  }

  protected async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> {
    return apiClient.patch<T>(endpoint, data, config);
  }

  protected async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResult<T>> {
    return apiClient.delete<T>(endpoint, config);
  }
}