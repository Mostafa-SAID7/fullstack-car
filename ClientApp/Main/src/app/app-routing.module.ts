import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth Routes (No Layout)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  // Simple login route
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  // Main application routes with layout
  {
    path: '',
    loadComponent: () => import('./layout/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      // Home/Discovery page - using existing community feed for now
      {
        path: '',
        loadComponent: () => import('./features/community/components/community-feed/community-feed.component').then(m => m.CommunityFeedComponent)
      },
      // Media streaming routes
      {
        path: 'media',
        loadChildren: () => import('./features/media/media.module').then(m => m.MediaModule),
        canActivate: [AuthGuard]
      },
      // Community features (existing)
      {
        path: 'community',
        loadChildren: () => import('./features/community/community.module').then(m => m.CommunityModule)
      },
      // Marketplace features (existing)
      {
        path: 'marketplace',
        loadChildren: () => import('./features/marketplace/marketplace.module').then(m => m.MarketplaceModule)
      },
      // Debug routes (development only)
      {
        path: 'debug-routing',
        loadComponent: () => import('./debug-routing.component').then(m => m.DebugRoutingComponent)
      },
      {
        path: 'debug-auth',
        loadComponent: () => import('./debug-auth.component').then(m => m.DebugAuthComponent)
      },
      // Error pages
      {
        path: '404',
        loadComponent: () => import('./shared/components/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
      },
      {
        path: '500',
        loadComponent: () => import('./shared/components/errors/server-error/server-error.component').then(m => m.ServerErrorComponent)
      },
      // Redirects
      {
        path: 'dashboard',
        redirectTo: 'media',
        pathMatch: 'full'
      }
    ]
  },
  // Redirect unknown routes to 404
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Set to true for debugging
    preloadingStrategy: undefined, // Lazy load on demand
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64] // Offset for fixed header
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }