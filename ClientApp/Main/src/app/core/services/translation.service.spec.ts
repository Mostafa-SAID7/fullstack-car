import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService, SupportedLanguage } from './translation.service';
import { CustomTranslationLoader } from './translation-loader.service';
import { TranslationPerformanceService } from './translation-performance.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        TranslationService,
        CustomTranslationLoader,
        TranslationPerformanceService
      ]
    });
    
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
    translateService = TestBed.inject(TranslateService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have supported languages defined', () => {
    expect(service.supportedLanguages).toBeDefined();
    expect(service.supportedLanguages.length).toBe(4);
    
    const expectedLanguages = ['en-US', 'ar-EG', 'ar-AE', 'ar-SA'];
    const actualLanguages = service.supportedLanguages.map(lang => lang.code);
    
    expectedLanguages.forEach(lang => {
      expect(actualLanguages).toContain(lang);
    });
  });

  it('should identify RTL languages correctly', () => {
    const arabicLanguages = service.supportedLanguages.filter(lang => lang.isRTL);
    const nonRTLLanguages = service.supportedLanguages.filter(lang => !lang.isRTL);
    
    expect(arabicLanguages.length).toBe(3); // ar-EG, ar-AE, ar-SA
    expect(nonRTLLanguages.length).toBe(1); // en-US
    
    arabicLanguages.forEach(lang => {
      expect(lang.code.startsWith('ar-')).toBeTruthy();
    });
  });

  it('should get current language info', () => {
    const currentLang = service.getCurrentLanguage();
    expect(currentLang).toBeDefined();
    expect(currentLang.code).toBeDefined();
    expect(currentLang.name).toBeDefined();
    expect(currentLang.flag).toBeDefined();
    expect(typeof currentLang.isRTL).toBe('boolean');
  });

  it('should detect browser language with confidence scoring', () => {
    const detectionInfo = service.getLanguageDetectionInfo();
    expect(detectionInfo).toBeDefined();
    expect(detectionInfo.detectedLanguage).toBeDefined();
    expect(detectionInfo.confidence).toBeGreaterThanOrEqual(0);
    expect(detectionInfo.confidence).toBeLessThanOrEqual(1);
    expect(['browser', 'stored', 'default']).toContain(detectionInfo.source);
  });

  it('should provide cache statistics', () => {
    const stats = service.getCacheStats();
    expect(stats).toBeDefined();
    expect(typeof stats.size).toBe('number');
    expect(Array.isArray(stats.languages)).toBeTruthy();
  });

  it('should handle language change requests', async () => {
    const testLanguage = 'ar-EG';
    
    // Mock the HTTP request that will be made during language change
    const mockTranslations = {
      'posts': { 'title': 'المنشورات', 'create': 'إنشاء منشور' },
      'common': { 'save': 'حفظ', 'cancel': 'إلغاء' }
    };

    // Start the language change (don't await yet)
    const changePromise = service.changeLanguage(testLanguage);

    // Expect and respond to the HTTP request
    const req = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch') &&
      request.method === 'POST'
    );
    
    expect(req.request.body.culture).toBe(testLanguage);
    req.flush(mockTranslations);

    // Now await the completion
    await changePromise;

    // Verify the language was changed
    expect(service.getCurrentLanguage().code).toBe(testLanguage);
    expect(service.isCurrentLanguageRTL()).toBeTruthy();
  });

  it('should handle API errors gracefully', async () => {
    const testLanguage = 'ar-SA';
    
    // Start the language change
    const changePromise = service.changeLanguage(testLanguage);

    // Simulate API error
    const req = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch')
    );
    req.error(new ErrorEvent('Network error'));

    // The service should fallback to English
    const fallbackReq = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch')
    );
    expect(fallbackReq.request.body.culture).toBe('en-US');
    fallbackReq.flush({ 'common': { 'error': 'Error' } });

    await changePromise;

    // Should have fallen back to English
    expect(service.getCurrentLanguage().code).toBe('en-US');
  });

  it('should update document attributes when language changes', async () => {
    const testLanguage = 'ar-EG';
    
    const changePromise = service.changeLanguage(testLanguage);

    const req = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch')
    );
    req.flush({ 'common': { 'test': 'اختبار' } });

    await changePromise;

    // Check document attributes
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe(testLanguage);
    expect(document.documentElement.classList.contains('rtl')).toBeTruthy();
  });

  // ===== ENHANCED COMPREHENSIVE TRANSLATION SERVICE TESTS =====

  it('should track feature translation status', () => {
    const featureStatus = service.getFeatureStatus();
    expect(featureStatus).toBeDefined();
    expect(Array.isArray(featureStatus)).toBeTruthy();
    
    // Should have status for all community features
    const expectedFeatures = ['posts', 'groups', 'qa', 'reviews', 'social', 'maps', 'news', 'guides', 'common'];
    expectedFeatures.forEach(feature => {
      const status = featureStatus.find(s => s.feature === feature);
      expect(status).toBeDefined();
      expect(status?.culture).toBeDefined();
      expect(typeof status?.loaded).toBe('boolean');
      expect(typeof status?.loading).toBe('boolean');
    });
  });

  it('should load single feature translations', async () => {
    const culture = 'en-US';
    const feature = 'posts';
    const mockTranslations = { 'posts.title': 'Posts', 'posts.create': 'Create Post' };

    const loadPromise = service.loadSingleFeatureTranslations(culture, feature);

    const req = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch') &&
      request.method === 'POST'
    );
    
    expect(req.request.body.culture).toBe(culture);
    expect(req.request.body.features).toContain(feature);
    req.flush({ [feature]: mockTranslations });

    const result = await loadPromise;
    expect(result).toBeDefined();
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  it('should check if feature is loaded', async () => {
    const culture = 'en-US';
    const feature = 'posts';
    
    // Initially should not be loaded
    expect(service.isFeatureLoaded(feature, culture)).toBeFalsy();

    // Load the feature
    const loadPromise = service.loadSingleFeatureTranslations(culture, feature);
    const req = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch')
    );
    req.flush({ [feature]: { 'posts.title': 'Posts' } });
    await loadPromise;

    // Now should be loaded
    expect(service.isFeatureLoaded(feature, culture)).toBeTruthy();
  });

  it('should provide translation statistics', () => {
    const stats = service.getTranslationStats();
    expect(stats).toBeDefined();
    expect(stats.currentLanguage).toBeDefined();
    expect(typeof stats.isRTL).toBe('boolean');
    expect(typeof stats.featuresLoaded).toBe('number');
    expect(typeof stats.featuresLoading).toBe('number');
    expect(typeof stats.featuresWithErrors).toBe('number');
    expect(typeof stats.realTimeEnabled).toBe('boolean');
    expect(stats.cacheStats).toBeDefined();
  });

  it('should manage real-time translation updates configuration', () => {
    // Initially should be disabled
    expect(service.getRealTimeConfig().enabled).toBeFalsy();

    // Enable real-time updates
    service.enableRealTimeUpdates({
      pollInterval: 10000,
      features: ['posts', 'groups']
    });

    const config = service.getRealTimeConfig();
    expect(config.enabled).toBeTruthy();
    expect(config.pollInterval).toBe(10000);
    expect(config.features).toContain('posts');
    expect(config.features).toContain('groups');

    // Disable real-time updates
    service.disableRealTimeUpdates();
    expect(service.getRealTimeConfig().enabled).toBeFalsy();
  });

  it('should update real-time configuration', () => {
    service.enableRealTimeUpdates();
    
    const newConfig = {
      pollInterval: 15000,
      features: ['qa', 'reviews']
    };

    service.updateRealTimeConfig(newConfig);
    
    const config = service.getRealTimeConfig();
    expect(config.enabled).toBeTruthy(); // Should remain enabled
    expect(config.pollInterval).toBe(15000);
    expect(config.features).toEqual(['qa', 'reviews']);
  });

  it('should emit translation updates', (done) => {
    let updateReceived = false;

    service.translationUpdates$.subscribe(update => {
      expect(update).toBeDefined();
      expect(update.culture).toBeDefined();
      expect(update.feature).toBeDefined();
      expect(update.key).toBeDefined();
      expect(update.timestamp).toBeInstanceOf(Date);
      updateReceived = true;
      done();
    });

    // Trigger a reload to generate an update event
    const reloadPromise = service.reloadFeatureTranslations(['posts']);
    
    const req = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch')
    );
    req.flush({ 'posts': { 'posts.title': 'Posts' } });

    reloadPromise.then(() => {
      if (!updateReceived) {
        done.fail('Translation update was not emitted');
      }
    });
  });

  it('should handle feature loading errors gracefully', async () => {
    const culture = 'ar-EG';
    const feature = 'posts';

    const loadPromise = service.loadSingleFeatureTranslations(culture, feature);

    const req = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch')
    );
    req.error(new ErrorEvent('Network error'));

    // Should fallback to English
    const fallbackReq = httpMock.expectOne(request => 
      request.url.includes('/v7/localization/translations/batch')
    );
    expect(fallbackReq.request.body.culture).toBe('en-US');
    fallbackReq.flush({ [feature]: { 'posts.title': 'Posts' } });

    const result = await loadPromise;
    expect(result).toBeDefined();

    // Check that error was recorded in feature status
    const featureStatus = service.getFeatureStatus(feature);
    const errorStatus = featureStatus.find(s => s.culture === culture);
    expect(errorStatus?.error).toBeDefined();
  });
});