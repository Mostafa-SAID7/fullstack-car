import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth Routes (No Layout)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  // All other routes use the main layout
  {
    path: '',
    loadComponent: () => import('./layout/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      // Public Main Page (No Auth Required)
      {
        path: '',
        loadComponent: () => import('./features/community/components/community-feed/community-feed.component').then(m => m.CommunityFeedComponent)
      },
      // Protected App Routes
      {
        path: 'app',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/community/components/community-feed/community-feed.component').then(m => m.CommunityFeedComponent)
          },
          {
            path: 'community',
            loadChildren: () => import('./features/community/community.module').then(m => m.CommunityModule)
          },
          {
            path: 'media',
            loadChildren: () => import('./features/media/media.module').then(m => m.MediaModule)
          },
          {
            path: 'marketplace',
            loadChildren: () => import('./features/marketplace/marketplace.module').then(m => m.MarketplaceModule)
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          }
        ]
      }
    ]
  },
  // Redirect unknown routes to main page
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }