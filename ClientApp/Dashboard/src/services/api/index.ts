// API Services - Main Export
export { HttpClient, httpClient } from './HttpClient';
export { ApiService } from './ApiService';
export { InterceptorService, interceptorService } from './InterceptorService';

// Export httpClient as apiClient for backward compatibility
export { httpClient as apiClient } from './HttpClient';

// Re-export types for convenience
export type { 
  ApiResult, 
  RequestConfig, 
  RequestInterceptor, 
  ApiError,
  UploadProgress 
} from '../../types/api';