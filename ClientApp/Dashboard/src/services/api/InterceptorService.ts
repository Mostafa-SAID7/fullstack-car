import type { RequestInterceptor } from '../../types/api';
import { ApiError } from '../../types/api';
import { REQUEST_INTERCEPTORS, RESPONSE_INTERCEPTORS } from '../../config/api/interceptors';

export class InterceptorService {
  private static instance: InterceptorService;
  private interceptors: RequestInterceptor[] = [];

  private constructor() {
    this.setupDefaultInterceptors();
  }

  static getInstance(): InterceptorService {
    if (!InterceptorService.instance) {
      InterceptorService.instance = new InterceptorService();
    }
    return InterceptorService.instance;
  }

  addInterceptor(interceptor: RequestInterceptor): void {
    this.interceptors.push(interceptor);
  }

  removeInterceptor(interceptor: RequestInterceptor): void {
    const index = this.interceptors.indexOf(interceptor);
    if (index > -1) {
      this.interceptors.splice(index, 1);
    }
  }

  getInterceptors(): RequestInterceptor[] {
    return [...this.interceptors];
  }

  clearInterceptors(): void {
    this.interceptors = [];
    this.setupDefaultInterceptors();
  }

  private setupDefaultInterceptors(): void {
    // Authentication Interceptor
    this.addInterceptor({
      onRequest: async (config: RequestInit) => {
        const token = localStorage.getItem('auth_token');
        if (token && REQUEST_INTERCEPTORS.AUTH) {
          const headers = new Headers(config.headers);
          headers.set('Authorization', `Bearer ${token}`);
          return { ...config, headers };
        }
        return config;
      },
      onResponse: async (response: Response) => {
        // Handle token refresh if needed
        if (response.status === 401 && RESPONSE_INTERCEPTORS.AUTO_REFRESH_TOKEN) {
          await this.handleTokenRefresh();
        }
        return response as any;
      },
      onError: async (error: ApiError) => {
        if (error.isUnauthorizedError() && RESPONSE_INTERCEPTORS.AUTO_REFRESH_TOKEN) {
          await this.handleTokenRefresh();
        }
        return error;
      }
    });

    // Request ID Interceptor
    if (REQUEST_INTERCEPTORS.REQUEST_ID) {
      this.addInterceptor({
        onRequest: async (config: RequestInit) => {
          const headers = new Headers(config.headers);
          headers.set('X-Request-ID', this.generateRequestId());
          headers.set('X-Request-Timestamp', new Date().toISOString());
          return { ...config, headers };
        }
      });
    }

    // Logging Interceptor
    if (REQUEST_INTERCEPTORS.LOGGING) {
      this.addInterceptor({
        onRequest: async (config: RequestInit) => {
          console.log('[API Request]', {
            method: config.method,
            url: (config as any).url,
            headers: Object.fromEntries(new Headers(config.headers).entries()),
            body: config.body
          });
          return config;
        },
        onResponse: async (response: Response) => {
          console.log('[API Response]', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            url: response.url
          });
          return response as any;
        },
        onError: async (error: ApiError) => {
          console.error('[API Error]', {
            message: error.message,
            status: error.status,
            code: error.code,
            details: error.details
          });
          return error;
        }
      });
    }

    // Rate Limiting Interceptor
    if (REQUEST_INTERCEPTORS.RATE_LIMITING) {
      this.addInterceptor({
        onError: async (error: ApiError) => {
          if (error.status === 429) {
            const retryAfter = (error.details as any)?.retryAfter || 60;
            console.warn(`[Rate Limited] Retry after ${retryAfter} seconds`);
            
            // Dispatch rate limit event
            window.dispatchEvent(new CustomEvent('api:rateLimited', {
              detail: { retryAfter, error }
            }));
          }
          return error;
        }
      });
    }

    // Cache Control Interceptor
    if (REQUEST_INTERCEPTORS.CACHE_CONTROL) {
      this.addInterceptor({
        onRequest: async (config: RequestInit) => {
          const headers = new Headers(config.headers);
          
          // Add cache control headers based on request type
          if (config.method === 'GET') {
            headers.set('Cache-Control', 'max-age=300'); // 5 minutes for GET requests
          } else {
            headers.set('Cache-Control', 'no-cache');
          }
          
          return { ...config, headers };
        }
      });
    }

    // Error Notification Interceptor
    if (RESPONSE_INTERCEPTORS.NOTIFICATION_ERRORS) {
      this.addInterceptor({
        onError: async (error: ApiError) => {
          // Only show notifications for certain error types
          if (error.isServerError() || error.isNetworkError()) {
            window.dispatchEvent(new CustomEvent('api:error', {
              detail: {
                message: error.message,
                type: 'error',
                duration: 5000
              }
            }));
          }
          return error;
        }
      });
    }

    // Response Transformation Interceptor
    if (RESPONSE_INTERCEPTORS.RESPONSE_TRANSFORMATION) {
      this.addInterceptor({
        onResponse: async (response: Response) => {
          // Add custom response headers or transformations
          const customHeaders = new Headers(response.headers);
          customHeaders.set('X-Processed-At', new Date().toISOString());
          
          // Create a new response with custom headers
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: customHeaders
          });
        }
      });
    }
  }

  private async handleTokenRefresh(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        this.redirectToLogin();
        return;
      }

      const response = await fetch('/api/v7.0/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.succeeded && data.data) {
          localStorage.setItem('auth_token', data.data.token);
          localStorage.setItem('refresh_token', data.data.refreshToken);
          
          // Dispatch token refreshed event
          window.dispatchEvent(new CustomEvent('auth:tokenRefreshed', {
            detail: data.data
          }));
        } else {
          this.redirectToLogin();
        }
      } else {
        this.redirectToLogin();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.redirectToLogin();
    }
  }

  private redirectToLogin(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    
    // Dispatch auth failure event
    window.dispatchEvent(new CustomEvent('auth:failure'));
    
    // Redirect to login page
    window.location.href = '/auth/login';
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const interceptorService = InterceptorService.getInstance();