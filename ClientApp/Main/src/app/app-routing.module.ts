import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { CustomPreloadingStrategy } from './core/services/lazy-loading.service';

export const routes: Routes = [
  // Auth Routes (No Layout) - High priority for immediate loading
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    data: { preload: true, priority: 'high' }
  },
  // Simple login route - Critical path
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
    data: { preload: true, priority: 'high' }
  },
  // Main application routes with layout
  {
    path: '',
    loadComponent: () => import('./layout/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    data: { preload: true, priority: 'high' },
    children: [
      // Home/Discovery page - using existing community feed for now
      {
        path: '',
        loadComponent: () => import('./features/community/components/feed/community-feed/community-feed.component').then(m => m.CommunityFeedComponent),
        data: { preload: true, priority: 'high' }
      },
      // Media streaming routes - Medium priority
      {
        path: 'media',
        loadChildren: () => import('./features/media/media.module').then(m => m.MediaModule),
        data: { preload: true, priority: 'medium' }
      },

      // Community features (existing) - Medium priority
      {
        path: 'community',
        loadChildren: () => import('./features/community/community.module').then(m => m.CommunityModule),
        data: { preload: true, priority: 'medium' }
      },
      // Marketplace features (existing) - Low priority
      {
        path: 'marketplace',
        loadChildren: () => import('./features/marketplace/marketplace.module').then(m => m.MarketplaceModule),
        data: { preload: false, priority: 'low' }
      },
      // Debug routes (development only) - No preload
      {
        path: 'debug-routing',
        loadComponent: () => import('./debug-routing.component').then(m => m.DebugRoutingComponent),
        data: { preload: false, priority: 'low' }
      },
      {
        path: 'debug-auth',
        loadComponent: () => import('./debug-auth.component').then(m => m.DebugAuthComponent),
        data: { preload: false, priority: 'low' }
      },
      {
        path: 'rtl-demo',
        loadComponent: () => import('./shared/components/rtl-demo/rtl-demo.component').then(m => m.RtlDemoComponent),
        data: { preload: false, priority: 'low' }
      },
      // Performance optimization demo - Medium priority for development
      {
        path: 'performance-demo',
        loadComponent: () => import('./pages/performance-demo/performance-demo.component').then(m => m.PerformanceDemoComponent),
        data: { preload: true, priority: 'medium' }
      },
      // Core Web Vitals Monitor - High priority for development
      {
        path: 'core-web-vitals',
        loadComponent: () => import('./shared/components/core-web-vitals-monitor/core-web-vitals-monitor.component').then(m => m.CoreWebVitalsMonitorComponent),
        data: { preload: true, priority: 'high' }
      },
      // Error pages - No preload (only load when needed)
      {
        path: '404',
        loadComponent: () => import('./shared/components/errors/not-found/not-found.component').then(m => m.NotFoundComponent),
        data: { preload: false, priority: 'low' }
      },
      {
        path: '500',
        loadComponent: () => import('./shared/components/errors/server-error/server-error.component').then(m => m.ServerErrorComponent),
        data: { preload: false, priority: 'low' }
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
    preloadingStrategy: CustomPreloadingStrategy, // Use custom intelligent preloading
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64], // Offset for fixed header
    // Additional performance optimizations
    onSameUrlNavigation: 'reload',
    paramsInheritanceStrategy: 'emptyOnly',
    urlUpdateStrategy: 'deferred'
  })],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy]
})
export class AppRoutingModule { }