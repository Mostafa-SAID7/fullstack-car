import { Injectable, inject } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, retry, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TranslationPerformanceService } from './translation-performance.service';

export interface BatchTranslationRequest {
  culture: string;
  features: string[];
}

export interface CachedTranslation {
  data: Record<string, any>;
  timestamp: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomTranslationLoader implements TranslateLoader {
  private http = inject(HttpClient);
  private performanceService = inject(TranslationPerformanceService);
  
  // Cache for translations with 1 hour expiry
  private translationCache = new Map<string, CachedTranslation>();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  
  // Observable cache for ongoing requests to prevent duplicate API calls
  private loadingCache = new Map<string, Observable<any>>();
  
  private readonly communityFeatures = [
    'posts', 'groups', 'qa', 'reviews', 'social', 
    'maps', 'news', 'guides', 'common'
  ];

  getTranslation(lang: string): Observable<any> {
    const requestId = `${lang}-${Date.now()}`;
    this.performanceService.recordLoadStart(lang, requestId);

    // Check memory cache first
    const cached = this.getCachedTranslation(lang);
    if (cached) {
      this.performanceService.recordCacheHit(lang, requestId);
      console.log(`Using cached translations for ${lang}`);
      return of(cached.data);
    }

    // Check if we're already loading this language
    const existingRequest = this.loadingCache.get(lang);
    if (existingRequest) {
      console.log(`Reusing existing request for ${lang}`);
      return existingRequest;
    }

    // Create new request with enhanced error handling and caching
    const request$ = this.loadTranslationsFromAPI(lang).pipe(
      retry({
        count: 2,
        delay: (error, retryCount) => {
          console.log(`Retrying translation load for ${lang}, attempt ${retryCount}`);
          return timer(1000 * retryCount); // Progressive delay: 1s, 2s
        }
      }),
      tap(translations => {
        // Cache successful response
        this.cacheTranslation(lang, translations);
        this.performanceService.recordCacheMiss(lang, requestId);
        console.log(`Cached ${Object.keys(translations).length} translations for ${lang}`);
      }),
      catchError(error => {
        this.performanceService.recordError(lang, requestId, error);
        console.error(`Failed to load translations for ${lang} after retries:`, error);
        
        // Try fallback to base language (e.g., 'ar' for 'ar-EG')
        const baseLang = lang.split('-')[0];
        if (baseLang !== lang && this.isLanguageSupported(baseLang)) {
          console.log(`Trying fallback to base language ${baseLang} for ${lang}`);
          return this.getTranslation(baseLang);
        }
        
        // Fallback to English if the requested language fails
        if (lang !== 'en-US') {
          console.log(`Falling back to en-US for ${lang}`);
          return this.getTranslation('en-US');
        }
        
        // If even English fails, return empty object
        console.error('Failed to load English translations, returning empty object');
        return of({});
      }),
      shareReplay(1), // Share the result with multiple subscribers
      tap(() => {
        // Remove from loading cache when complete
        this.loadingCache.delete(lang);
      })
    );

    // Cache the observable to prevent duplicate requests
    this.loadingCache.set(lang, request$);
    
    return request$;
  }

  private loadTranslationsFromAPI(lang: string): Observable<Record<string, any>> {
    const request: BatchTranslationRequest = {
      culture: lang,
      features: this.communityFeatures
    };

    const url = `${environment.apiUrl}/v7/localization/translations/batch`;
    
    return this.http.post<Record<string, Record<string, string>>>(url, request).pipe(
      map(response => {
        // Flatten the nested structure for ngx-translate
        const flattened: Record<string, any> = {};
        
        if (response && typeof response === 'object') {
          Object.entries(response).forEach(([feature, translations]) => {
            if (translations && typeof translations === 'object') {
              Object.entries(translations).forEach(([key, value]) => {
                flattened[key] = value;
              });
            }
          });
        }
        
        console.log(`Loaded ${Object.keys(flattened).length} translations for ${lang} from API`);
        return flattened;
      })
    );
  }

  private getCachedTranslation(lang: string): CachedTranslation | null {
    const cached = this.translationCache.get(lang);
    
    if (cached && Date.now() < cached.expiresAt) {
      return cached;
    }
    
    // Remove expired cache entry
    if (cached) {
      this.translationCache.delete(lang);
    }
    
    return null;
  }

  private cacheTranslation(lang: string, data: Record<string, any>): void {
    const now = Date.now();
    const cached: CachedTranslation = {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    };
    
    this.translationCache.set(lang, cached);
  }

  private isLanguageSupported(lang: string): boolean {
    const supportedLanguages = ['en', 'ar'];
    return supportedLanguages.includes(lang);
  }

  /**
   * Clear cache for a specific language or all languages
   */
  clearCache(lang?: string): void {
    if (lang) {
      this.translationCache.delete(lang);
      this.loadingCache.delete(lang);
      console.log(`Cleared cache for ${lang}`);
    } else {
      this.translationCache.clear();
      this.loadingCache.clear();
      console.log('Cleared all translation cache');
    }
  }

  /**
   * Preload translations for multiple languages
   */
  preloadTranslations(languages: string[]): Observable<void> {
    const preloadRequests = languages.map(lang => 
      this.getTranslation(lang).pipe(
        catchError(error => {
          console.warn(`Failed to preload translations for ${lang}:`, error);
          return of({});
        })
      )
    );

    return new Observable(observer => {
      Promise.all(preloadRequests.map(req => req.toPromise())).then(() => {
        console.log(`Preloaded translations for languages: ${languages.join(', ')}`);
        this.performanceService.logPerformanceSummary();
        observer.next();
        observer.complete();
      }).catch(error => {
        console.error('Error during translation preloading:', error);
        observer.error(error);
      });
    });
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; languages: string[] } {
    return {
      size: this.translationCache.size,
      languages: Array.from(this.translationCache.keys())
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return this.performanceService.getMetrics();
  }

  /**
   * Log performance summary
   */
  logPerformanceSummary(): void {
    this.performanceService.logPerformanceSummary();
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new CustomTranslationLoader();
}