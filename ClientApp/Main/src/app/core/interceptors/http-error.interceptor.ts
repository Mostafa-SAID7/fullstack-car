import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, retryWhen, concatMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffFactor: number;
  retryableStatusCodes: number[];
  nonRetryableStatusCodes: number[];
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private readonly retryConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    backoffFactor: 2,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    nonRetryableStatusCodes: [400, 401, 403, 404, 422]
  };

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add request ID for tracking
    const requestId = this.generateRequestId();
    const requestWithId = request.clone({
      headers: request.headers.set('X-Request-ID', requestId)
    });

    console.log(`[Angular HTTP] ${request.method} ${request.url} (ID: ${requestId})`);

    return next.handle(requestWithId).pipe(
      retryWhen(errors => 
        errors.pipe(
          concatMap((error: HttpErrorResponse, attempt: number) => {
            if (this.shouldRetry(error, attempt)) {
              const delay = this.calculateRetryDelay(attempt);
              console.log(`[Angular HTTP] Retrying request ${requestId} (attempt ${attempt + 1}) after ${delay}ms`);
              return timer(delay);
            }
            return throwError(() => error);
          })
        )
      ),
      catchError((error: HttpErrorResponse) => {
        console.error(`[Angular HTTP] Error ${request.method} ${request.url} (ID: ${requestId})`, error);
        return this.handleError(error, requestId);
      }),
      finalize(() => {
        console.log(`[Angular HTTP] Completed ${request.method} ${request.url} (ID: ${requestId})`);
      })
    );
  }

  private shouldRetry(error: HttpErrorResponse, attempt: number): boolean {
    // Don't retry if we've exceeded max attempts
    if (attempt >= this.retryConfig.maxRetries) {
      return false;
    }

    // Don't retry on non-retryable status codes
    if (this.retryConfig.nonRetryableStatusCodes.includes(error.status)) {
      return false;
    }

    // Retry on retryable status codes
    if (this.retryConfig.retryableStatusCodes.includes(error.status)) {
      return true;
    }

    // Retry on network errors (status 0)
    if (error.status === 0) {
      return true;
    }

    return false;
  }

  private calculateRetryDelay(attempt: number): number {
    return this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffFactor, attempt);
  }

  private handleError(error: HttpErrorResponse, requestId?: string): Observable<never> {
    let errorMessage = 'An error occurred';
    let userMessage = 'Something went wrong. Please try again.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
      userMessage = 'Network error. Please check your connection.';
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} ${error.statusText}`;
      
      switch (error.status) {
        case 0:
          userMessage = 'Network error. Please check your internet connection.';
          break;
        case 400:
          userMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          userMessage = 'Authentication required. Please log in.';
          // Clear auth data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          this.router.navigate(['/auth/login']);
          break;
        case 403:
          userMessage = 'Access denied. You don\'t have permission for this action.';
          break;
        case 404:
          userMessage = 'The requested resource was not found.';
          break;
        case 408:
          userMessage = 'Request timeout. Please try again.';
          break;
        case 422:
          userMessage = 'Validation failed. Please check your input.';
          break;
        case 429:
          userMessage = 'Too many requests. Please wait and try again.';
          break;
        case 500:
          userMessage = 'Server error. Please try again later.';
          break;
        case 502:
        case 503:
        case 504:
          userMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          userMessage = 'An unexpected error occurred. Please try again.';
      }

      // Extract detailed error message from response
      if (error.error) {
        if (typeof error.error === 'string') {
          try {
            const parsedError = JSON.parse(error.error);
            if (parsedError.message) {
              userMessage = parsedError.message;
            } else if (parsedError.errors) {
              // Handle validation errors
              const validationErrors = Object.values(parsedError.errors).flat();
              userMessage = validationErrors.join(', ');
            }
          } catch (e) {
            // If parsing fails, use the string as is
            userMessage = error.error;
          }
        } else if (error.error.message) {
          userMessage = error.error.message;
        } else if (error.error.errors) {
          // Handle ASP.NET Core validation errors
          const validationErrors = Object.values(error.error.errors).flat();
          userMessage = validationErrors.join(', ');
        }
      }
    }

    // Dispatch error event for global error handling
    window.dispatchEvent(new CustomEvent('http:error', {
      detail: {
        requestId,
        status: error.status,
        message: userMessage,
        originalError: error
      }
    }));

    // Create enhanced error object
    const enhancedError = {
      ...error,
      userMessage,
      requestId,
      timestamp: new Date().toISOString()
    };

    return throwError(() => enhancedError);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}