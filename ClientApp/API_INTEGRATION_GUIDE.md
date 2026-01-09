# API Integration Guide

This document provides a comprehensive guide to the API integration implementation for both React Dashboard and Angular Main applications.

## Overview

The API integration provides a robust, type-safe, and feature-rich HTTP client layer with the following capabilities:

- **Error Handling**: Comprehensive error handling with retry logic
- **Request/Response Interceptors**: Configurable interceptors for authentication, logging, and more
- **Type Safety**: Full TypeScript support with strongly typed responses
- **File Upload**: Support for regular and chunked file uploads with progress tracking
- **Caching**: Built-in caching strategies for improved performance
- **Authentication**: JWT token management with automatic refresh
- **Retry Logic**: Configurable retry mechanisms for failed requests

## Architecture

### React Dashboard (TypeScript)

```
src/
├── config/api/
│   ├── base.ts              # Base API configuration
│   ├── http.ts              # HTTP status codes
│   └── interceptors.ts      # Interceptor configurations
├── services/
│   ├── api/
│   │   ├── HttpClient.ts    # Core HTTP client
│   │   ├── ApiService.ts    # Base API service class
│   │   ├── InterceptorService.ts # Interceptor management
│   │   └── index.ts         # API exports
│   └── media/
│       ├── VideoService.ts  # Video-specific API calls
│       ├── PodcastService.ts # Podcast-specific API calls
│       ├── MediaService.ts  # Combined media operations
│       ├── types.ts         # Media type definitions
│       └── index.ts         # Media exports
├── types/api/
│   └── index.ts             # API type definitions
└── utils/
    └── errorNavigation.ts   # Error navigation utilities
```

### Angular Main (TypeScript)

```
src/app/core/
├── services/
│   ├── http-client.service.ts # Core HTTP client service
│   ├── media-api.service.ts   # Media API service
│   └── api.module.ts          # API module configuration
├── interceptors/
│   ├── auth.interceptor.ts    # Authentication interceptor
│   └── http-error.interceptor.ts # Error handling interceptor
├── models/
│   └── media.model.ts         # Media type definitions
└── types/
    └── api.types.ts           # API type definitions
```

## Features

### 1. HTTP Client Services

#### React Dashboard - HttpClient

```typescript
import { httpClient } from '@/services/api';

// Basic requests
const result = await httpClient.get<User[]>('/users');
const user = await httpClient.post<User>('/users', userData);

// With configuration
const result = await httpClient.get<User[]>('/users', {
  timeout: 10000,
  retries: 3,
  headers: { 'Custom-Header': 'value' }
});

// File upload with progress
await httpClient.uploadWithProgress('/upload', formData, (progress) => {
  console.log(`Upload progress: ${progress.percentage}%`);
});
```

#### Angular Main - HttpClientService

```typescript
import { HttpClientService } from '@/core/services/http-client.service';

constructor(private httpClient: HttpClientService) {}

// Basic requests
this.httpClient.get<User[]>('/users').subscribe(response => {
  if (response.succeeded) {
    console.log(response.data);
  }
});

// File upload with progress
this.httpClient.uploadWithProgress('/upload', formData).subscribe(event => {
  if (event.progress) {
    console.log(`Upload progress: ${event.progress.percentage}%`);
  }
  if (event.response) {
    console.log('Upload complete:', event.response.data);
  }
});
```

### 2. Error Handling and Retry Logic

#### Automatic Retry Configuration

```typescript
// React Dashboard
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffFactor: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  nonRetryableStatusCodes: [400, 401, 403, 404, 422]
};

// Angular Main
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffFactor: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  nonRetryableStatusCodes: [400, 401, 403, 404, 422]
};
```

#### Error Types

```typescript
// React Dashboard
import { ApiError } from '@/types/api';

try {
  const result = await httpClient.get('/api/data');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.isNetworkError()) {
      // Handle network error
    } else if (error.isValidationError()) {
      // Handle validation error
    } else if (error.isServerError()) {
      // Handle server error
    }
  }
}

// Angular Main
this.httpClient.get('/api/data').subscribe({
  next: (response) => {
    // Handle success
  },
  error: (error) => {
    if (error.statusCode === 500) {
      // Handle server error
    } else if (error.statusCode === 422) {
      // Handle validation error
    }
  }
});
```

### 3. Request/Response Interceptors

#### React Dashboard - Interceptor Service

```typescript
import { interceptorService } from '@/services/api';

// Add custom interceptor
interceptorService.addInterceptor({
  onRequest: async (config) => {
    // Modify request
    config.headers.set('X-Custom-Header', 'value');
    return config;
  },
  onResponse: async (response) => {
    // Process response
    console.log('Response received:', response.status);
    return response;
  },
  onError: async (error) => {
    // Handle error
    console.error('Request failed:', error.message);
    return error;
  }
});
```

#### Angular Main - HTTP Interceptors

```typescript
// Authentication Interceptor
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token;
    if (token) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    }
    return next.handle(request);
  }
}

// Error Interceptor
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retryWhen(errors => 
        errors.pipe(
          concatMap((error, attempt) => {
            if (this.shouldRetry(error, attempt)) {
              return timer(this.calculateRetryDelay(attempt));
            }
            return throwError(() => error);
          })
        )
      ),
      catchError(error => this.handleError(error))
    );
  }
}
```

### 4. Type-Safe API Service Layer

#### React Dashboard - Media Services

```typescript
import { videoService, podcastService, mediaService } from '@/services/media';

// Video operations
const videos = await videoService.getVideos({ search: 'tutorial' });
const video = await videoService.getVideo('video-id');
await videoService.uploadVideo(file, metadata, (progress) => {
  console.log(`Upload: ${progress.percentage}%`);
});

// Podcast operations
const podcasts = await podcastService.getPodcasts({ isPublic: true });
await podcastService.subscribeToPodcast('podcast-id');

// Combined operations
const trendingContent = await mediaService.getTrendingContent();
const searchResults = await mediaService.searchAllMedia('query');
```

#### Angular Main - Media API Service

```typescript
import { MediaApiService } from '@/core/services/media-api.service';

constructor(private mediaApi: MediaApiService) {}

// Video operations
this.mediaApi.getVideos({ search: 'tutorial' }).subscribe(videos => {
  console.log('Videos:', videos);
});

this.mediaApi.getTrendingVideos(10, 7).subscribe(trending => {
  console.log('Trending videos:', trending);
});

// Podcast operations
this.mediaApi.getPodcasts({ isPublic: true }).subscribe(podcasts => {
  console.log('Public podcasts:', podcasts);
});

this.mediaApi.subscribeToPodcast('podcast-id').subscribe(() => {
  console.log('Subscribed successfully');
});
```

## Configuration

### React Dashboard Configuration

```typescript
// config/api/base.ts
export const API_CONFIG: ApiConfig = {
  baseURL: ENV.API_BASE_URL,
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  retryBackoffFactor: 2,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
};

// config/api/interceptors.ts
export const REQUEST_INTERCEPTORS = {
  AUTH: true,
  LOGGING: ENV.DEBUG,
  TIMEOUT: API_CONFIG.timeout,
  RETRIES: API_CONFIG.retries,
  RATE_LIMITING: true,
  REQUEST_ID: true,
  CACHE_CONTROL: true
};
```

### Angular Main Configuration

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://api.example.com/api/v7.0'
};

// core/services/api.module.ts
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ]
})
export class ApiModule { }
```

## Usage Examples

### File Upload with Progress

#### React Dashboard

```typescript
import { videoService } from '@/services/media';

const handleVideoUpload = async (file: File) => {
  const metadata = {
    title: 'My Video',
    description: 'Video description',
    quality: 'HD',
    tags: ['tutorial', 'demo'],
    isPublic: true,
    allowComments: true
  };

  try {
    const result = await videoService.uploadVideo(file, metadata, (progress) => {
      setUploadProgress(progress.percentage);
    });
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

#### Angular Main

```typescript
import { MediaApiService } from '@/core/services/media-api.service';

handleVideoUpload(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', 'My Video');
  formData.append('description', 'Video description');

  this.mediaApi.uploadWithProgress('/videos/upload', formData).subscribe({
    next: (event) => {
      if (event.progress) {
        this.uploadProgress = event.progress.percentage;
      }
      if (event.response) {
        console.log('Upload complete:', event.response.data);
      }
    },
    error: (error) => {
      console.error('Upload failed:', error);
    }
  });
}
```

### Error Handling

#### React Dashboard

```typescript
import { httpClient } from '@/services/api';
import { ApiError } from '@/types/api';

const fetchUserData = async () => {
  try {
    const result = await httpClient.get<User>('/users/me');
    if (result.succeeded) {
      setUser(result.data);
    } else {
      throw new Error(result.message || 'Failed to fetch user data');
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.isUnauthorizedError()) {
        // Redirect to login
        navigate('/login');
      } else if (error.isNetworkError()) {
        showNotification('Network error. Please check your connection.');
      } else {
        showNotification(error.message);
      }
    }
  }
};
```

#### Angular Main

```typescript
import { MediaApiService } from '@/core/services/media-api.service';

fetchUserData() {
  this.mediaApi.get<User>('/users/me').subscribe({
    next: (response) => {
      if (response.succeeded) {
        this.user = response.data;
      }
    },
    error: (error) => {
      if (error.statusCode === 401) {
        this.router.navigate(['/login']);
      } else if (error.statusCode === 0) {
        this.showNotification('Network error. Please check your connection.');
      } else {
        this.showNotification(error.message);
      }
    }
  });
}
```

## Testing

### React Dashboard Tests

```typescript
// services/api/__tests__/HttpClient.test.ts
import { HttpClient } from '../HttpClient';

describe('HttpClient', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({
      baseURL: 'https://api.test.com',
      timeout: 5000,
      retries: 2
    });
  });

  it('should make successful GET request', async () => {
    const mockData = { id: 1, name: 'Test' };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData
    });

    const result = await httpClient.get('/test');
    expect(result.succeeded).toBe(true);
    expect(result.data).toEqual(mockData);
  });
});
```

### Angular Main Tests

```typescript
// core/services/__tests__/http-client.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientService } from '../http-client.service';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientService]
    });
    service = TestBed.inject(HttpClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should make successful GET request', () => {
    const mockData = { id: 1, name: 'Test' };

    service.get('/test').subscribe(response => {
      expect(response.succeeded).toBe(true);
      expect(response.data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/test');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

## Best Practices

1. **Always use type-safe API calls** with proper TypeScript interfaces
2. **Handle errors gracefully** with appropriate user feedback
3. **Implement proper loading states** during API calls
4. **Use interceptors** for cross-cutting concerns like authentication
5. **Configure appropriate timeouts** for different types of requests
6. **Implement retry logic** for transient failures
7. **Cache responses** where appropriate to improve performance
8. **Use progress tracking** for file uploads
9. **Validate responses** before using the data
10. **Log API calls** in development for debugging

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend API has proper CORS configuration
2. **Authentication Failures**: Check token expiration and refresh logic
3. **Network Timeouts**: Adjust timeout configurations for slow networks
4. **File Upload Failures**: Verify file size limits and supported formats
5. **Type Errors**: Ensure API response types match the defined interfaces

### Debugging

1. Enable logging in development mode
2. Use browser developer tools to inspect network requests
3. Check console for error messages and stack traces
4. Verify API endpoint URLs and request payloads
5. Test with different network conditions

## Conclusion

This API integration provides a robust foundation for both React and Angular applications with comprehensive error handling, retry logic, interceptors, and type safety. The modular architecture allows for easy extension and customization based on specific application needs.