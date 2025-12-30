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

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(),
        provideHttpClient(),
        provideRouter(routes)
    ]
}).catch(err => console.error(err));
