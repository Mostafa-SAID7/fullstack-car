import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth header if token exists
    const token = this.authService.token;
    if (token) {
      request = this.addTokenHeader(request, token);
    }

    // Add request tracking headers
    request = this.addTrackingHeaders(request);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token) {
          return this.handle401Error(request, next);
        }
        
        // Handle other specific errors
        if (error.status === 403) {
          this.router.navigate(['/errors/forbidden']);
        } else if (error.status >= 500) {
          // Dispatch server error event
          window.dispatchEvent(new CustomEvent('http:serverError', {
            detail: { error, request }
          }));
        }
        
        return throwError(() => error);
      }),
      finalize(() => {
        // Log request completion
        console.log(`[Auth Interceptor] Completed ${request.method} ${request.url}`);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private addTrackingHeaders(request: HttpRequest<any>): HttpRequest<any> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    return request.clone({
      headers: request.headers
        .set('X-Request-ID', requestId)
        .set('X-Request-Timestamp', timestamp)
        .set('X-Client-Version', '1.0.0')
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        console.log('[Auth Interceptor] Attempting token refresh...');
        
        return this.authService.refreshToken().pipe(
          switchMap((response) => {
            this.isRefreshing = false;
            if (response.succeeded && response.data) {
              console.log('[Auth Interceptor] Token refresh successful');
              this.refreshTokenSubject.next(response.data.token);
              return next.handle(this.addTokenHeader(request, response.data.token));
            } else {
              console.error('[Auth Interceptor] Token refresh failed:', response);
              throw new Error('Token refresh failed');
            }
          }),
          catchError((error) => {
            console.error('[Auth Interceptor] Token refresh error:', error);
            this.isRefreshing = false;
            this.handleAuthFailure();
            return throwError(() => error);
          })
        );
      } else {
        console.log('[Auth Interceptor] No refresh token available');
        this.isRefreshing = false;
        this.handleAuthFailure();
        return throwError(() => new Error('No refresh token'));
      }
    }

    // If already refreshing, wait for the new token
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => {
        console.log('[Auth Interceptor] Using refreshed token for retry');
        return next.handle(this.addTokenHeader(request, token));
      })
    );
  }

  private handleAuthFailure(): void {
    console.log('[Auth Interceptor] Handling auth failure - clearing tokens and redirecting');
    
    // Clear auth data
    this.authService.logout().subscribe({
      next: () => console.log('[Auth Interceptor] Logout successful'),
      error: (error) => console.error('[Auth Interceptor] Logout error:', error)
    });
    
    // Dispatch auth failure event
    window.dispatchEvent(new CustomEvent('auth:failure'));
    
    // Navigate to login
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}