import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, timeout, retry, retryWhen, delay, take, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T = any> {
  succeeded: boolean;
  data?: T;
  errors?: string[];
  message?: string;
  statusCode?: number;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: { [key: string]: string };
  params?: { [key: string]: any };
  reportProgress?: boolean;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private readonly baseUrl = environment.apiUrl;
  private readonly defaultTimeout = 30000; // 30 seconds
  private readonly defaultRetries = 3;

  constructor(private http: HttpClient) {}

  // GET request
  get<T>(endpoint: string, config?: RequestConfig): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const options = this.buildRequestOptions(config);

    return this.http.get<T>(url, options).pipe(
      timeout(config?.timeout || this.defaultTimeout),
      retry(config?.retries || this.defaultRetries),
      map(data => this.createSuccessResponse<T>(data)),
      catchError(error => this.handleError(error))
    );
  }

  // POST request
  post<T>(endpoint: string, data?: any, config?: RequestConfig): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const options = this.buildRequestOptions(config);

    return this.http.post<T>(url, data, options).pipe(
      timeout(config?.timeout || this.defaultTimeout),
      retry(config?.retries || this.defaultRetries),
      map(response => this.createSuccessResponse<T>(response)),
      catchError(error => this.handleError(error))
    );
  }

  // PUT request
  put<T>(endpoint: string, data?: any, config?: RequestConfig): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const options = this.buildRequestOptions(config);

    return this.http.put<T>(url, data, options).pipe(
      timeout(config?.timeout || this.defaultTimeout),
      retry(config?.retries || this.defaultRetries),
      map(response => this.createSuccessResponse<T>(response)),
      catchError(error => this.handleError(error))
    );
  }

  // PATCH request
  patch<T>(endpoint: string, data?: any, config?: RequestConfig): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const options = this.buildRequestOptions(config);

    return this.http.patch<T>(url, data, options).pipe(
      timeout(config?.timeout || this.defaultTimeout),
      retry(config?.retries || this.defaultRetries),
      map(response => this.createSuccessResponse<T>(response)),
      catchError(error => this.handleError(error))
    );
  }

  // DELETE request
  delete<T>(endpoint: string, config?: RequestConfig): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const options = this.buildRequestOptions(config);

    return this.http.delete<T>(url, options).pipe(
      timeout(config?.timeout || this.defaultTimeout),
      retry(config?.retries || this.defaultRetries),
      map(response => this.createSuccessResponse<T>(response)),
      catchError(error => this.handleError(error))
    );
  }

  // Upload with progress tracking
  uploadWithProgress<T>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig
  ): Observable<{ progress?: UploadProgress; response?: ApiResponse<T> }> {
    const url = this.buildUrl(endpoint);
    const options = {
      ...this.buildRequestOptions(config),
      reportProgress: true,
      observe: 'events' as const
    };

    return this.http.post<T>(url, formData, options).pipe(
      timeout(config?.timeout || 300000), // 5 minutes for uploads
      map((event: HttpEvent<T>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              const progress: UploadProgress = {
                loaded: event.loaded,
                total: event.total,
                percentage: Math.round((event.loaded / event.total) * 100)
              };
              return { progress };
            }
            return {};
          case HttpEventType.Response:
            return { response: this.createSuccessResponse<T>(event.body) };
          default:
            return {};
        }
      }),
      catchError(error => throwError(() => this.createErrorResponse(error)))
    );
  }

  // Download with progress tracking
  downloadWithProgress(
    endpoint: string,
    config?: RequestConfig
  ): Observable<{ progress?: UploadProgress; blob?: Blob }> {
    const url = this.buildUrl(endpoint);
    const options = {
      ...this.buildRequestOptions(config),
      reportProgress: true,
      observe: 'events' as const,
      responseType: 'blob' as const
    };

    return this.http.get<Blob>(url, options).pipe(
      map((event: HttpEvent<Blob>) => {
        switch (event.type) {
          case HttpEventType.DownloadProgress:
            if (event.total) {
              const progress: UploadProgress = {
                loaded: event.loaded,
                total: event.total,
                percentage: Math.round((event.loaded / event.total) * 100)
              };
              return { progress };
            }
            return {};
          case HttpEventType.Response:
            return { blob: event.body || undefined };
          default:
            return {};
        }
      }),
      timeout(config?.timeout || 120000), // 2 minutes for downloads
      catchError(error => throwError(() => this.createErrorResponse(error)))
    );
  }

  // Chunked upload for large files
  uploadChunked<T>(
    endpoint: string,
    file: File,
    chunkSize: number = 5 * 1024 * 1024, // 5MB chunks
    config?: RequestConfig
  ): Observable<{ progress?: UploadProgress; response?: ApiResponse<T> }> {
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadId = this.generateUploadId();
    let uploadedBytes = 0;

    const progressSubject = new BehaviorSubject<{ progress?: UploadProgress; response?: ApiResponse<T> }>({});

    const uploadChunk = (chunkNumber: number): Observable<any> => {
      const start = (chunkNumber - 1) * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('uploadId', uploadId);
      formData.append('chunkNumber', chunkNumber.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileName', file.name);

      return this.post(`${endpoint}/chunked`, formData, config).pipe(
        map(response => {
          uploadedBytes += chunk.size;
          const progress: UploadProgress = {
            loaded: uploadedBytes,
            total: file.size,
            percentage: Math.round((uploadedBytes / file.size) * 100)
          };

          progressSubject.next({ progress });

          if (chunkNumber === totalChunks && response.succeeded) {
            progressSubject.next({ response: response as ApiResponse<T> });
            progressSubject.complete();
          }

          return response;
        })
      );
    };

    // Upload chunks sequentially
    let currentChunk = 1;
    const uploadNext = (): Observable<any> => {
      if (currentChunk <= totalChunks) {
        return uploadChunk(currentChunk++).pipe(
          switchMap(() => uploadNext())
        );
      }
      return new Observable(subscriber => subscriber.complete());
    };

    uploadNext().subscribe();

    return progressSubject.asObservable();
  }

  // Utility methods
  buildQueryString(params: { [key: string]: any }): string {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    return searchParams.toString();
  }

  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }

  private buildRequestOptions(config?: RequestConfig): any {
    let headers = new HttpHeaders();
    let params = new HttpParams();

    // Add custom headers
    if (config?.headers) {
      Object.keys(config.headers).forEach(key => {
        headers = headers.set(key, config.headers![key]);
      });
    }

    // Add query parameters
    if (config?.params) {
      Object.keys(config.params).forEach(key => {
        const value = config.params![key];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params = params.append(key, v.toString()));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return {
      headers,
      params,
      reportProgress: config?.reportProgress || false
    };
  }

  private createSuccessResponse<T>(data: any): ApiResponse<T> {
    return {
      succeeded: true,
      data: data,
      statusCode: 200
    };
  }

  private createErrorResponse(error: any): ApiResponse<any> {
    let message = 'An error occurred';
    let errors: string[] = [];
    let statusCode = 500;

    if (error instanceof HttpErrorResponse) {
      statusCode = error.status;
      message = error.message;

      if (error.error) {
        if (typeof error.error === 'string') {
          try {
            const parsedError = JSON.parse(error.error);
            if (parsedError.message) {
              message = parsedError.message;
            }
            if (parsedError.errors) {
              errors = Array.isArray(parsedError.errors) 
                ? parsedError.errors 
                : Object.values(parsedError.errors).flat() as string[];
            }
          } catch (e) {
            errors = [error.error];
          }
        } else if (error.error.message) {
          message = error.error.message;
        } else if (error.error.errors) {
          errors = Array.isArray(error.error.errors) 
            ? error.error.errors 
            : Object.values(error.error.errors).flat() as string[];
        }
      }
    } else {
      message = error.message || 'Unknown error';
    }

    return {
      succeeded: false,
      message,
      errors: errors.length > 0 ? errors : [message],
      statusCode
    };
  }

  private handleError(error: any): Observable<ApiResponse<any>> {
    const errorResponse = this.createErrorResponse(error);
    return throwError(() => errorResponse);
  }

  private generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}