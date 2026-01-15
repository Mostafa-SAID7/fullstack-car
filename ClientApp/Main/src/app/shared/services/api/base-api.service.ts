import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { CacheService } from '../cache/cache.service';

export interface ApiRequestOptions {
  cache?: boolean;
  cacheTTL?: number;
  params?: HttpParams;
  retryCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly authService = inject(AuthService);
  protected readonly cacheService = inject(CacheService);
  protected readonly baseUrl = environment.apiUrl;

  protected get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const cacheKey = `${endpoint}${options?.params?.toString() || ''}`;
    
    // Check cache first
    if (options?.cache) {
      const cached = this.cacheService.get<T>(cacheKey);
      if (cached) {
        return of(cached);
      }
    }
    
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      params: options?.params,
      headers: this.getHeaders()
    }).pipe(
      retry(options?.retryCount || 0),
      tap(data => {
        if (options?.cache) {
          this.cacheService.set(cacheKey, data, options.cacheTTL);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  protected post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(),
      params: options?.params
    }).pipe(
      retry(options?.retryCount || 0),
      tap(() => this.invalidateRelatedCache(endpoint)),
      catchError(error => this.handleError(error))
    );
  }

  protected put<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(),
      params: options?.params
    }).pipe(
      retry(options?.retryCount || 0),
      tap(() => this.invalidateRelatedCache(endpoint)),
      catchError(error => this.handleError(error))
    );
  }

  protected delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params: options?.params
    }).pipe(
      retry(options?.retryCount || 0),
      tap(() => this.invalidateRelatedCache(endpoint)),
      catchError(error => this.handleError(error))
    );
  }

  protected patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(),
      params: options?.params
    }).pipe(
      retry(options?.retryCount || 0),
      tap(() => this.invalidateRelatedCache(endpoint)),
      catchError(error => this.handleError(error))
    );
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.token;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (error.status >= 500) {
        errorMessage = 'A server error occurred. Please try again later.';
      } else {
        errorMessage = error.error?.message || error.message || errorMessage;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  private invalidateRelatedCache(endpoint: string): void {
    // Extract feature from endpoint (e.g., 'posts' from '/api/v7/community/posts')
    const parts = endpoint.split('/');
    const featureIndex = parts.findIndex(part => part === 'community') + 1;
    
    if (featureIndex > 0 && featureIndex < parts.length) {
      const feature = parts[featureIndex];
      this.cacheService.invalidatePattern(`*${feature}*`);
    }
  }
}
