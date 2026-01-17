import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { routes } from './app-routing.module';
import { authInterceptor, errorInterceptor } from './core/interceptors/http.interceptors';
import { CustomTranslationLoader } from './core/services/translation-loader.service';
import { TranslationService } from './core/services/translation.service';
import { CustomMissingTranslationHandler } from './core/services/custom-missing-translation-handler';
import { CustomPreloadingStrategy } from './core/services/lazy-loading.service';
import { FeatureRegistry } from './core/services/dynamic-import.service';
import { CoreWebVitalsService } from './core/services/core-web-vitals.service';

/**
 * Enhanced Translation Loader Factory
 * Creates a custom translation loader for the application
 */
export function createTranslateLoader(http: HttpClient) {
  return new CustomTranslationLoader();
}

/**
 * Translation Initialization Factory
 * Initializes translations on app startup
 */
export function initializeTranslations(translationService: TranslationService) {
  return () => {
    console.log('Initializing translations...');
    return translationService.initializeTranslations().then(() => {
      console.log('Translation initialization completed');
    }).catch(error => {
      console.error('Translation initialization failed:', error);
      // Don't block app startup on translation failure
    });
  };
}

/**
 * Core Web Vitals Initialization Factory
 * Initializes Core Web Vitals monitoring and optimization
 */
export function initializeCoreWebVitals(coreWebVitalsService: CoreWebVitalsService) {
  return () => {
    console.log('Initializing Core Web Vitals monitoring...');
    // Service automatically starts monitoring in constructor
    const metrics = coreWebVitalsService.getCurrentMetrics();
    console.log('Core Web Vitals monitoring initialized:', metrics ? 'Active' : 'Pending');
    return Promise.resolve();
  };
}
/**
 * Feature Registry Initialization Factory
 * Initializes the feature registry and preloads critical features
 */
export function initializeFeatureRegistry(featureRegistry: FeatureRegistry) {
  return () => {
    console.log('Initializing feature registry...');
    return featureRegistry.preloadCriticalFeatures().then(() => {
      console.log('Critical features preloaded successfully');
    }).catch(error => {
      console.warn('Failed to preload some critical features:', error);
      // Don't block app startup on preload failure
    });
  };
}

/**
 * Angular 19 Application Configuration
 * 
 * This configuration uses modern Angular 19 features:
 * - Standalone components architecture
 * - Functional interceptors
 * - Component input binding from route params
 * - View transitions for smooth navigation
 * - Fetch API for HTTP requests
 * - Custom preloading strategy for intelligent lazy loading
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Router with modern Angular 19 features and custom preloading
    provideRouter(
      routes,
      withComponentInputBinding(), // Automatically bind route params to component inputs
      withViewTransitions(), // Enable smooth view transitions
      withPreloading(CustomPreloadingStrategy) // Use custom intelligent preloading
    ),
    
    // HTTP Client with functional interceptors and Fetch API
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]),
      withFetch() // Use Fetch API instead of XMLHttpRequest
    ),
    
    // Animations
    provideAnimations(),
    
    // Lazy Loading and Dynamic Import Services
    CustomPreloadingStrategy,
    FeatureRegistry,
    CoreWebVitalsService,
    
    // Translation Module
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        },
        defaultLanguage: 'en-US',
        useDefaultLang: true,
        isolate: false,
        extend: true,
        missingTranslationHandler: {
          provide: MissingTranslationHandler,
          useClass: CustomMissingTranslationHandler
        }
      })
    ),
    
    // Initialize translations on app startup
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslations,
      deps: [TranslationService],
      multi: true
    },
    
    // Initialize feature registry and preload critical features
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFeatureRegistry,
      deps: [FeatureRegistry],
      multi: true
    },
    
    // Initialize Core Web Vitals monitoring and optimization
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCoreWebVitals,
      deps: [CoreWebVitalsService],
      multi: true
    }
  ]
};
