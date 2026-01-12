import { Injectable, inject } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface BatchTranslationRequest {
  culture: string;
  features: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomTranslationLoader implements TranslateLoader {
  private http = inject(HttpClient);
  
  private readonly communityFeatures = [
    'posts', 'groups', 'qa', 'reviews', 'social', 
    'maps', 'news', 'guides', 'common'
  ];

  getTranslation(lang: string): Observable<any> {
    // Use the new v7 batch API to load all community features at once
    const request: BatchTranslationRequest = {
      culture: lang,
      features: this.communityFeatures
    };

    const url = `${environment.apiUrl}/api/v7/localization/translations/batch`;
    
    return this.http.post<Record<string, Record<string, string>>>(url, request).pipe(
      map(response => {
        // Flatten the nested structure for ngx-translate
        const flattened: Record<string, any> = {};
        
        Object.entries(response).forEach(([feature, translations]) => {
          Object.entries(translations).forEach(([key, value]) => {
            flattened[key] = value;
          });
        });
        
        console.log(`Loaded ${Object.keys(flattened).length} translations for ${lang}`);
        return flattened;
      }),
      catchError(error => {
        console.error(`Failed to load translations for ${lang}:`, error);
        
        // Fallback to English if the requested language fails
        if (lang !== 'en-US') {
          console.log(`Falling back to en-US for ${lang}`);
          return this.getTranslation('en-US');
        }
        
        // If even English fails, return empty object
        console.error('Failed to load English translations, returning empty object');
        return of({});
      })
    );
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new CustomTranslationLoader();
}