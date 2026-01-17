import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Functional Auth Interceptor
 * 
 * Modern Angular 19 functional interceptor that adds authentication token to requests
 * Uses inject() function for dependency injection
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('[Auth Interceptor] Adding token to request:', authReq.url);
    return next(authReq);
  }

  console.log('[Auth Interceptor] No token found for request:', req.url);
  return next(req);
};

/**
 * Functional Error Interceptor
 * 
 * Modern Angular 19 functional interceptor that handles HTTP errors
 * Implements retry logic and automatic navigation on auth errors
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse) => {
        // Only retry on server errors (5xx) or network errors (0)
        if (error.status >= 500 || error.status === 0) {
          console.log(`[Error Interceptor] Retrying request to ${req.url} after error:`, error.status);
          return throwError(() => error);
        }
        // Don't retry client errors (4xx)
        throw error;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error(`[Error Interceptor] HTTP Error ${req.method} ${req.url}:`, error);

      // Handle specific error cases
      if (error.status === 401) {
        console.log('[Error Interceptor] Unauthorized - clearing auth and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        console.log('[Error Interceptor] Forbidden - redirecting to error page');
        router.navigate(['/errors/forbidden']);
      }

      return throwError(() => error);
    })
  );
};
