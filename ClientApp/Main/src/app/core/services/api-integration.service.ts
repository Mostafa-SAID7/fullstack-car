import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, timer, EMPTY } from 'rxjs';
import { retry, retryWhen, mergeMap, finalize, catchError, tap, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { CacheService } from './cache.service';
import { OfflineService } from './offline.service';

export interface ApiRequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheType?: 'api' | 'static' | 'images' | 'media';
  offline?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface RequestMetrics {
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status?: number;
  cached?: boolean;
  retries?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiIntegrationService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private cacheService = inject(CacheService);
  private offlineService = inject(OfflineService);

  // Base configuration
  private readonly baseUrl = environment.apiUrl;
  private readonly defaultTimeout = 30000; // 30 seconds
  private readonly defaultRetries = 3;

  // Request tracking
  private _activeRequests = signal<Map<string, RequestMetrics>>(new Map());
  private _requestHistory = signal<RequestMetrics[]>([]);

  // Rate limiting
  private requestQueue: Array<() => void> = [];
  private isProcessingQueue = false;
  private readonly maxConcurrentRequests = 10;
  private readonly rateLimitDelay = 100; // ms between requests

  /**
   * Make API request with comprehensive error handling and retry logic
   */
  request<T>(config: ApiRequestConfig): Observable<ApiResponse<T>> {
    const requestId = this.generateRequestId();
    const fullUrl = this.buildUrl(config.url);
    
    // Start tracking request
    const metrics: RequestMetrics = {
      url: fullUrl,
      method: config.method,
      startTime: Date.now()
    };
    
    this._activeRequests.update(requests => {
      const newMap = new Map(requests);
      newMap.set(requestId, metrics);
      return newMap;
    });

    // Check if offline and handle accordingly
    if (!navigator.onLine && config.offline !== false) {
      return this.handleOfflineRequest(config, requestId, metrics);
    }

    // Check cache first for GET requests
    if (config.method === 'GET' && config.cache !== false) {
      return this.handleCachedRequest(config, requestId, metrics);
    }

    return this.executeRequest<T>(config, requestId, metrics);
  }

  /**
   * Execute the actual HTTP request
   */
  private executeRequest<T>(
    config: ApiRequestConfig, 
    requestId: string, 
    metrics: RequestMetrics
  ): Observable<ApiResponse<T>> {
    const headers = this.buildHeaders(config.headers);
    const params = this.buildParams(config.params);
    const timeoutMs = config.timeout || this.defaultTimeout;
    const maxRetries = config.retries ?? this.defaultRetries;

    let httpRequest: Observable<any>;

    switch (config.method) {
      case 'GET':
        httpRequest = this.http.get(config.url, { headers, params });
        break;
      case 'POST':
        httpRequest = this.http.post(config.url, config.body, { headers, params });
        break;
      case 'PUT':
        httpRequest = this.http.put(config.url, config.body, { headers, params });
        break;
      case 'DELETE':
        httpRequest = this.http.delete(config.url, { headers, params });
        break;
      case 'PATCH':
        httpRequest = this.http.patch(config.url, config.body, { headers, params });
        break;
      default:
        return throwError(() => new Error(`Unsupported HTTP method: ${config.method}`));
    }

    return httpRequest.pipe(
      timeout(timeoutMs),
      retryWhen(errors => this.createRetryStrategy(errors, maxRetries, metrics)),
      tap(response => {
        // Cache successful GET responses
        if (config.method === 'GET' && config.cache !== false && response) {
          this.cacheResponse(config, response);
        }
      }),
      catchError(error => this.handleRequestError(error, config, metrics)),
      finalize(() => this.finalizeRequest(requestId, metrics))
    );
  }

  /**
   * Handle cached requests
   */
  private handleCachedRequest<T>(
    config: ApiRequestConfig, 
    requestId: string, 
    metrics: RequestMetrics
  ): Observable<ApiResponse<T>> {
    return new Observable(observer => {
      this.cacheService.fetchWithCache(config.url, config.cacheType || 'api')
        .then(response => {
          if (response) {
            metrics.cached = true;
            metrics.endTime = Date.now();
            metrics.duration = metrics.endTime - metrics.startTime;
            
            response.json().then(data => {
              observer.next(data);
              observer.complete();
            }).catch(() => {
              // If cached response is corrupted, fall back to network
              this.executeRequest<T>(config, requestId, metrics).subscribe(observer);
            });
          } else {
            // No cache, make network request
            this.executeRequest<T>(config, requestId, metrics).subscribe(observer);
          }
        })
        .catch(() => {
          // Cache error, fall back to network
          this.executeRequest<T>(config, requestId, metrics).subscribe(observer);
        })
        .finally(() => {
          this.finalizeRequest(requestId, metrics);
        });
    });
  }

  /**
   * Handle offline requests
   */
  private handleOfflineRequest<T>(
    config: ApiRequestConfig, 
    requestId: string, 
    metrics: RequestMetrics
  ): Observable<ApiResponse<T>> {
    // For GET requests, try to get from offline storage
    if (config.method === 'GET') {
      const offlineData = this.offlineService.getOfflineContent('api', config.url);
      if (offlineData) {
        metrics.cached = true;
        this.finalizeRequest(requestId, metrics);
        return new Observable(observer => {
          observer.next(offlineData);
          observer.complete();
        });
      }
    }

    // For other methods, queue for later sync
    if (config.method !== 'GET') {
      this.offlineService.addPendingAction({
        type: this.mapMethodToActionType(config.method),
        data: {
          url: config.url,
          method: config.method,
          body: config.body,
          headers: config.headers,
          params: config.params
        },
        maxRetries: config.retries || this.defaultRetries
      });

      this.finalizeRequest(requestId, metrics);
      
      return new Observable(observer => {
        observer.next({
          data: null as T,
          success: true,
          message: 'Request queued for when connection is restored'
        });
        observer.complete();
      });
    }

    // No offline data available
    this.finalizeRequest(requestId, metrics);
    return throwError(() => new Error('No internet connection and no offline data available'));
  }

  /**
   * Create retry strategy with exponential backoff
   */
  private createRetryStrategy(
    errors: Observable<any>, 
    maxRetries: number, 
    metrics: RequestMetrics
  ): Observable<any> {
    return errors.pipe(
      mergeMap((error, index) => {
        const retryAttempt = index + 1;
        metrics.retries = retryAttempt;

        // Don't retry certain errors
        if (error instanceof HttpErrorResponse) {
          if ([400, 401, 403, 404, 422].includes(error.status)) {
            return throwError(() => error);
          }
        }

        // Max retries reached
        if (retryAttempt > maxRetries) {
          return throwError(() => error);
        }

        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delay = Math.min(1000 * Math.pow(2, retryAttempt - 1), 10000);
        
        console.warn(`Request retry ${retryAttempt}/${maxRetries} after ${delay}ms:`, {
          url: metrics.url,
          error: error.message
        });

        return timer(delay);
      })
    );
  }

  /**
   * Handle request errors
   */
  private handleRequestError(
    error: any, 
    config: ApiRequestConfig, 
    metrics: RequestMetrics
  ): Observable<never> {
    metrics.error = error.message;
    
    if (error instanceof HttpErrorResponse) {
      metrics.status = error.status;
      const appError = this.errorHandler.handleHttpError(error, `API ${config.method} ${config.url}`);
      return throwError(() => appError);
    }

    const appError = this.errorHandler.handleAppError(
      error,
      'network',
      'high',
      { url: config.url, method: config.method }
    );
    
    return throwError(() => appError);
  }

  /**
   * Cache successful response
   */
  private async cacheResponse(config: ApiRequestConfig, response: any): Promise<void> {
    try {
      const responseToCache = new Response(JSON.stringify(response), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      });

      await this.cacheService.cacheRequest(
        config.url, 
        responseToCache, 
        config.cacheType || 'api'
      );
    } catch (error) {
      console.warn('Failed to cache response:', error);
    }
  }

  /**
   * Finalize request tracking
   */
  private finalizeRequest(requestId: string, metrics: RequestMetrics): void {
    metrics.endTime = Date.now();
    metrics.duration = metrics.endTime - metrics.startTime;

    // Remove from active requests
    this._activeRequests.update(requests => {
      const newMap = new Map(requests);
      newMap.delete(requestId);
      return newMap;
    });

    // Add to history
    this._requestHistory.update(history => [metrics, ...history.slice(0, 99)]);
  }

  /**
   * Build full URL
   */
  private buildUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return `${this.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  }

  /**
   * Build HTTP headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Add custom headers
    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers = headers.set(key, value);
      });
    }

    return headers;
  }

  /**
   * Build HTTP params
   */
  private buildParams(customParams?: Record<string, any>): HttpParams {
    let params = new HttpParams();

    if (customParams) {
      Object.entries(customParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.set(key, String(value));
        }
      });
    }

    return params;
  }

  /**
   * Map HTTP method to offline action type
   */
  private mapMethodToActionType(method: string): string {
    switch (method) {
      case 'POST': return 'post';
      case 'PUT': return 'update_profile';
      case 'PATCH': return 'update_profile';
      case 'DELETE': return 'delete';
      default: return 'unknown';
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Convenience methods for common HTTP operations

  get<T>(url: string, options?: Partial<ApiRequestConfig>): Observable<ApiResponse<T>> {
    return this.request<T>({ ...options, url, method: 'GET' });
  }

  post<T>(url: string, body: any, options?: Partial<ApiRequestConfig>): Observable<ApiResponse<T>> {
    return this.request<T>({ ...options, url, method: 'POST', body });
  }

  put<T>(url: string, body: any, options?: Partial<ApiRequestConfig>): Observable<ApiResponse<T>> {
    return this.request<T>({ ...options, url, method: 'PUT', body });
  }

  patch<T>(url: string, body: any, options?: Partial<ApiRequestConfig>): Observable<ApiResponse<T>> {
    return this.request<T>({ ...options, url, method: 'PATCH', body });
  }

  delete<T>(url: string, options?: Partial<ApiRequestConfig>): Observable<ApiResponse<T>> {
    return this.request<T>({ ...options, url, method: 'DELETE' });
  }

  /**
   * Get request metrics and statistics
   */
  getRequestMetrics(): {
    active: number;
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    cacheHitRate: number;
  } {
    const history = this._requestHistory();
    const totalRequests = history.length;
    
    if (totalRequests === 0) {
      return {
        active: this._activeRequests().size,
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0,
        cacheHitRate: 0
      };
    }

    const totalResponseTime = history.reduce((sum, req) => sum + (req.duration || 0), 0);
    const errorCount = history.filter(req => req.error).length;
    const cacheHits = history.filter(req => req.cached).length;

    return {
      active: this._activeRequests().size,
      totalRequests,
      averageResponseTime: totalResponseTime / totalRequests,
      errorRate: (errorCount / totalRequests) * 100,
      cacheHitRate: (cacheHits / totalRequests) * 100
    };
  }

  /**
   * Clear request history
   */
  clearRequestHistory(): void {
    this._requestHistory.set([]);
  }
}