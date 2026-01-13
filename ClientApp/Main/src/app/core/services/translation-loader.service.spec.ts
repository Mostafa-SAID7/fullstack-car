import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomTranslationLoader } from './translation-loader.service';
import { TranslationPerformanceService } from './translation-performance.service';
import { environment } from '../../../environments/environment';

describe('CustomTranslationLoader', () => {
  let loader: CustomTranslationLoader;
  let httpMock: HttpTestingController;
  let performanceService: TranslationPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomTranslationLoader,
        TranslationPerformanceService
      ]
    });
    
    loader = TestBed.inject(CustomTranslationLoader);
    httpMock = TestBed.inject(HttpTestingController);
    performanceService = TestBed.inject(TranslationPerformanceService);
  });

  afterEach(() => {
    httpMock.verify();
    loader.clearCache(); // Clear cache between tests
  });

  it('should be created', () => {
    expect(loader).toBeTruthy();
  });

  it('should load translations from API', (done) => {
    const testLang = 'en-US';
    const mockResponse = {
      'posts': {
        'title': 'Posts',
        'create': 'Create Post'
      },
      'common': {
        'save': 'Save',
        'cancel': 'Cancel'
      }
    };

    loader.getTranslation(testLang).subscribe(translations => {
      expect(translations).toBeDefined();
      expect(translations['posts.title']).toBe('Posts');
      expect(translations['posts.create']).toBe('Create Post');
      expect(translations['common.save']).toBe('Save');
      expect(translations['common.cancel']).toBe('Cancel');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/v7/localization/translations/batch`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.culture).toBe(testLang);
    expect(req.request.body.features).toContain('posts');
    expect(req.request.body.features).toContain('common');
    
    req.flush(mockResponse);
  });

  it('should cache translations and serve from cache on subsequent requests', (done) => {
    const testLang = 'ar-EG';
    const mockResponse = {
      'posts': { 'title': 'المنشورات' },
      'common': { 'save': 'حفظ' }
    };

    // First request - should hit API
    loader.getTranslation(testLang).subscribe(translations => {
      expect(translations['posts.title']).toBe('المنشورات');
      
      // Second request - should serve from cache
      loader.getTranslation(testLang).subscribe(cachedTranslations => {
        expect(cachedTranslations['posts.title']).toBe('المنشورات');
        expect(cachedTranslations).toEqual(translations);
        done();
      });
    });

    // Only one HTTP request should be made
    const req = httpMock.expectOne(`${environment.apiUrl}/v7/localization/translations/batch`);
    req.flush(mockResponse);
  });

  it('should handle API errors and fallback to English', (done) => {
    const testLang = 'ar-SA';
    const fallbackResponse = {
      'common': { 'error': 'Error' }
    };

    loader.getTranslation(testLang).subscribe(translations => {
      expect(translations['common.error']).toBe('Error');
      done();
    });

    // First request fails
    const req1 = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch') &&
      request.body.culture === testLang
    );
    req1.error(new ErrorEvent('Network error'));

    // Should retry and then fallback to English
    const req2 = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch') &&
      request.body.culture === testLang
    );
    req2.error(new ErrorEvent('Network error'));

    // Fallback to English
    const req3 = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch') &&
      request.body.culture === 'en-US'
    );
    req3.flush(fallbackResponse);
  });

  it('should flatten nested translation objects', (done) => {
    const testLang = 'en-US';
    const mockResponse = {
      'posts': {
        'actions': {
          'create': 'Create',
          'edit': 'Edit',
          'delete': 'Delete'
        },
        'validation': {
          'title': {
            'required': 'Title is required',
            'minLength': 'Title must be at least 3 characters'
          }
        }
      }
    };

    loader.getTranslation(testLang).subscribe(translations => {
      expect(translations['posts.actions.create']).toBe('Create');
      expect(translations['posts.actions.edit']).toBe('Edit');
      expect(translations['posts.actions.delete']).toBe('Delete');
      expect(translations['posts.validation.title.required']).toBe('Title is required');
      expect(translations['posts.validation.title.minLength']).toBe('Title must be at least 3 characters');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/v7/localization/translations/batch`);
    req.flush(mockResponse);
  });

  it('should provide cache statistics', () => {
    const stats = loader.getCacheStats();
    expect(stats).toBeDefined();
    expect(typeof stats.size).toBe('number');
    expect(Array.isArray(stats.languages)).toBeTruthy();
  });

  it('should clear cache correctly', (done) => {
    const testLang = 'en-US';
    const mockResponse = { 'common': { 'test': 'Test' } };

    // Load translations to populate cache
    loader.getTranslation(testLang).subscribe(() => {
      expect(loader.getCacheStats().size).toBeGreaterThan(0);
      
      // Clear cache
      loader.clearCache();
      expect(loader.getCacheStats().size).toBe(0);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/v7/localization/translations/batch`);
    req.flush(mockResponse);
  });

  it('should handle empty or malformed API responses', (done) => {
    const testLang = 'en-US';

    loader.getTranslation(testLang).subscribe(translations => {
      expect(translations).toBeDefined();
      expect(Object.keys(translations).length).toBe(0);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/v7/localization/translations/batch`);
    req.flush(null); // Malformed response
  });
});