// API Request/Response Interceptors

import type { RequestInterceptor } from '../../types/api';
import { ApiError } from '../../types/api';
import { REQUEST_INTERCEPTORS, RESPONSE_INTERCEPTORS } from '../../config/api/interceptors';

// Authentication Interceptor
export const authInterceptor: RequestInterceptor = {
  onRequest: async (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },

  onError: async (error) => {
    if (error.statusCode === 401) {
      // Clear invalid token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      
      // Dispatch auth error event for context to handle
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return error;
  }
};

// Logging Interceptor
export const loggingInterceptor: RequestInterceptor = {
  onRequest: async (config) => {
    if (REQUEST_INTERCEPTORS.LOGGING) {
      console.group(`🚀 API Request: ${config.method} ${(config as any).url || 'Unknown URL'}`);
      console.log('Config:', config);
      console.groupEnd();
    }
    return config;
  },

  onResponse: async (response) => {
    if (RESPONSE_INTERCEPTORS.LOGGING) {
      console.group(`✅ API Response: ${response.status} ${response.statusText}`);
      console.log('Response:', response);
      console.groupEnd();
    }
    return response as any;
  },

  onError: async (error) => {
    if (RESPONSE_INTERCEPTORS.LOGGING) {
      console.group(`❌ API Error: ${error.statusCode || 'Unknown'} ${error.message}`);
      console.error('Error:', error);
      console.groupEnd();
    }
    return error;
  }
};

// Request ID Interceptor
export const requestIdInterceptor: RequestInterceptor = {
  onRequest: async (config) => {
    if (REQUEST_INTERCEPTORS.REQUEST_ID && config.headers) {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      (config.headers as any)['X-Request-ID'] = requestId;
    }
    return config;
  }
};

// Cache Control Interceptor
export const cacheControlInterceptor: RequestInterceptor = {
  onRequest: async (config) => {
    if (REQUEST_INTERCEPTORS.CACHE_CONTROL && config.headers) {
      // Add cache control headers for GET requests
      if (config.method === 'GET') {
        (config.headers as any)['Cache-Control'] = 'no-cache';
      }
    }
    return config;
  }
};

// Error Notification Interceptor
export const errorNotificationInterceptor: RequestInterceptor = {
  onError: async (error) => {
    if (RESPONSE_INTERCEPTORS.NOTIFICATION_ERRORS) {
      // Dispatch error event for notification system
      const errorEvent = new CustomEvent('api:error', {
        detail: {
          message: error.message,
          statusCode: error.statusCode,
          code: error.code,
          details: error.details
        }
      });
      window.dispatchEvent(errorEvent);
    }
    return error;
  }
};

// Response Transformation Interceptor
export const responseTransformationInterceptor: RequestInterceptor = {
  onResponse: async (response) => {
    if (RESPONSE_INTERCEPTORS.RESPONSE_TRANSFORMATION) {
      // Add response timestamp
      (response as any)._timestamp = new Date().toISOString();
      
      // Add response size if available
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        (response as any)._size = parseInt(contentLength, 10);
      }
    }
    return response as any;
  }
};

// Rate Limiting Interceptor
export const rateLimitingInterceptor: RequestInterceptor = {
  onError: async (error) => {
    if (error.statusCode === 429) {
      // Handle rate limiting
      const retryAfter = (error.details as any)?.retryAfter || 60; // Default to 60 seconds
      
      // Dispatch rate limit event
      window.dispatchEvent(new CustomEvent('api:rateLimit', {
        detail: { retryAfter }
      }));
      
      // Modify error message
      error.message = `Rate limit exceeded. Please try again in ${retryAfter} seconds.`;
    }
    return error;
  }
};

// Token Refresh Interceptor
export const tokenRefreshInterceptor: RequestInterceptor = {
  onError: async (error) => {
    if (error.statusCode === 401 && RESPONSE_INTERCEPTORS.AUTO_REFRESH_TOKEN) {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          // Attempt to refresh token
          const response = await fetch('/api/v1/auth/refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.succeeded && data.data?.token) {
              // Update stored tokens
              localStorage.setItem('auth_token', data.data.token);
              if (data.data.refreshToken) {
                localStorage.setItem('refresh_token', data.data.refreshToken);
              }
              
              // Dispatch token refresh event
              window.dispatchEvent(new CustomEvent('auth:tokenRefreshed', {
                detail: { token: data.data.token }
              }));
              
              // Don't throw the original 401 error, let the request retry
              return new ApiError('Token refreshed, retry request', 200, 'TOKEN_REFRESHED');
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      // If refresh failed or no refresh token, clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    return error;
  }
};

// Network Status Interceptor
export const networkStatusInterceptor: RequestInterceptor = {
  onError: async (error) => {
    if (error.code === 'NETWORK_ERROR') {
      // Check if we're offline
      if (!navigator.onLine) {
        error.message = 'You appear to be offline. Please check your internet connection.';
        
        // Dispatch offline event
        window.dispatchEvent(new CustomEvent('network:offline'));
      } else {
        error.message = 'Network error occurred. Please try again.';
        
        // Dispatch network error event
        window.dispatchEvent(new CustomEvent('network:error'));
      }
    }
    return error;
  }
};

// Default Interceptors Collection
export const defaultInterceptors: RequestInterceptor[] = [
  authInterceptor,
  requestIdInterceptor,
  cacheControlInterceptor,
  loggingInterceptor,
  responseTransformationInterceptor,
  tokenRefreshInterceptor,
  rateLimitingInterceptor,
  errorNotificationInterceptor,
  networkStatusInterceptor
];

// Interceptor Factory
export class InterceptorFactory {
  static createAuthInterceptor(tokenKey = 'auth_token'): RequestInterceptor {
    return {
      onRequest: async (config) => {
        const token = localStorage.getItem(tokenKey);
        if (token && config.headers) {
          (config.headers as any)['Authorization'] = `Bearer ${token}`;
        }
        return config;
      }
    };
  }

  static createLoggingInterceptor(enabled = true): RequestInterceptor {
    return {
      onRequest: async (config) => {
        if (enabled) {
          console.log('API Request:', config);
        }
        return config;
      },
      onResponse: async (response) => {
        if (enabled) {
          console.log('API Response:', response);
        }
        return response as any;
      },
      onError: async (error) => {
        if (enabled) {
          console.error('API Error:', error);
        }
        return error;
      }
    };
  }

  static createRetryInterceptor(_maxRetries = 3, _delay = 1000): RequestInterceptor {
    return {
      onError: async (error) => {
        // This would be handled by the HttpClient's retry logic
        // This is just for custom retry behavior
        if (error.code === 'CUSTOM_RETRY') {
          // Custom retry logic here
        }
        return error;
      }
    };
  }

  static createTimeoutInterceptor(timeout = 30000): RequestInterceptor {
    return {
      onRequest: async (config) => {
        // Set timeout if not already set
        if (!config.signal) {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), timeout);
          config.signal = controller.signal;
        }
        return config;
      }
    };
  }
}

// Utility function to apply interceptors to HttpClient
export function applyDefaultInterceptors(client: any): void {
  defaultInterceptors.forEach(interceptor => {
    client.addInterceptor(interceptor);
  });
}