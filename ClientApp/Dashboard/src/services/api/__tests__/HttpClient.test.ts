import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { HttpClient } from '../HttpClient';
import { ApiError } from '../../../types/api';

// Mock fetch globally
(globalThis as any).fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('HttpClient', () => {
  let httpClient: HttpClient;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    httpClient = new HttpClient({
      baseURL: 'https://api.test.com',
      timeout: 5000,
      retries: 2
    });
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' })
      } as Response);

      const result = await httpClient.get('/test');

      expect(result.succeeded).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should handle GET request errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Resource not found'
      } as Response);

      const result = await httpClient.get('/nonexistent');

      expect(result.succeeded).toBe(false);
      expect(result.errors).toContain('HTTP 404: Not Found');
      expect(result.statusCode).toBe(404);
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const requestData = { name: 'New Item' };
      const responseData = { id: 1, ...requestData };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => responseData,
        headers: new Headers({ 'content-type': 'application/json' })
      } as Response);

      const result = await httpClient.post('/items', requestData);

      expect(result.succeeded).toBe(true);
      expect(result.data).toEqual(responseData);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/items',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData)
        })
      );
    });

    it('should handle validation errors', async () => {
      const validationErrors = {
        errors: {
          name: ['Name is required'],
          email: ['Invalid email format']
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        json: async () => validationErrors
      } as Response);

      const result = await httpClient.post('/items', {});

      expect(result.succeeded).toBe(false);
      expect(result.errors).toContain('Name is required');
      expect(result.errors).toContain('Invalid email format');
      expect(result.statusCode).toBe(422);
    });
  });

  describe('Authentication', () => {
    it('should add auth token to requests', async () => {
      const token = 'test-token';
      httpClient.setAuthToken(token);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers({ 'content-type': 'application/json' })
      } as Response);

      await httpClient.get('/protected');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/protected',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`
          })
        })
      );
    });

    it('should clear auth token', () => {
      httpClient.setAuthToken('test-token');
      expect(httpClient.getAuthToken()).toBe('test-token');

      httpClient.clearAuthToken();
      expect(httpClient.getAuthToken()).toBeUndefined();
    });
  });

  describe('Retry logic', () => {
    it('should retry on server errors', async () => {
      // First two calls fail, third succeeds
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: async () => 'Server error'
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: async () => 'Server error'
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
          headers: new Headers({ 'content-type': 'application/json' })
        } as Response);

      const result = await httpClient.get('/retry-test');

      expect(result.succeeded).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should not retry on client errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Bad request'
      } as Response);

      const result = await httpClient.get('/bad-request');

      expect(result.succeeded).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Upload with progress', () => {
    it('should handle file upload with progress tracking', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', file);

      const progressCallback = jest.fn();

      // Mock XMLHttpRequest
      const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
        addEventListener: jest.fn(),
        upload: {
          addEventListener: jest.fn()
        },
        status: 200,
        statusText: 'OK',
        responseText: JSON.stringify({ fileId: 'test-id' }),
        getResponseHeader: jest.fn().mockReturnValue('application/json'),
        timeout: 0
      };

      // Mock XMLHttpRequest constructor
      (globalThis as any).XMLHttpRequest = jest.fn(() => mockXHR);

      // Simulate successful upload
      setTimeout(() => {
        // Simulate progress event
        const progressEvent = { lengthComputable: true, loaded: 50, total: 100 };
        const progressCall = (mockXHR.upload.addEventListener as jest.Mock).mock.calls
          .find((call: any[]) => call[0] === 'progress');
        if (progressCall) (progressCall[1] as Function)(progressEvent);

        // Simulate load event
        const loadCall = (mockXHR.addEventListener as jest.Mock).mock.calls
          .find((call: any[]) => call[0] === 'load');
        if (loadCall) (loadCall[1] as Function)();
      }, 0);

      const result = await httpClient.uploadWithProgress('/upload', formData, progressCallback);

      expect(result.succeeded).toBe(true);
      expect(progressCallback).toHaveBeenCalledWith({
        loaded: 50,
        total: 100,
        percentage: 50
      });
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Network error'));

      const result = await httpClient.get('/network-error');

      expect(result.succeeded).toBe(false);
      expect(result.errors).toContain('Network error occurred');
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => {
          setTimeout(() => reject(new DOMException('Aborted', 'AbortError')), 100);
        })
      );

      const result = await httpClient.get('/timeout-test', { timeout: 50 });

      expect(result.succeeded).toBe(false);
      expect(result.errors).toContain('Request timeout');
    });
  });

  describe('Utility methods', () => {
    it('should build query string correctly', () => {
      const params = {
        search: 'test query',
        page: 1,
        tags: ['tag1', 'tag2'],
        active: true,
        empty: null,
        undefined: undefined
      };

      const queryString = httpClient.buildQueryString(params);

      expect(queryString).toContain('search=test+query');
      expect(queryString).toContain('page=1');
      expect(queryString).toContain('tags=tag1');
      expect(queryString).toContain('tags=tag2');
      expect(queryString).toContain('active=true');
      expect(queryString).not.toContain('empty');
      expect(queryString).not.toContain('undefined');
    });

    it('should identify error types correctly', () => {
      const networkError = new ApiError('Network error', 0, 'NETWORK_ERROR');
      const timeoutError = new ApiError('Timeout', 0, 'TIMEOUT_ERROR');
      const serverError = new ApiError('Server error', 500);

      expect(httpClient.isNetworkError(networkError)).toBe(true);
      expect(httpClient.isTimeoutError(timeoutError)).toBe(true);
      expect(httpClient.isRetryableError(serverError)).toBe(true);
      expect(httpClient.isRetryableError(new ApiError('Bad request', 400))).toBe(false);
    });
  });
});