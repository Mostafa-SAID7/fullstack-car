import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';

const routes: Routes = [
  // Add your routes here
  { path: '', redirectTo: '/community', pathMatch: 'full' },
  { path: 'community', loadChildren: () => import('./app/features/community/community.module').then(m => m.CommunityModule) },
  // Add more routes as needed
];

import { importProvidersFrom } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './environments/environment';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/v4/shared/localization/resources/${lang}`);
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'en-US'
      })
    )
  ]
}).catch(err => console.error(err));
