import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth Routes (No Layout)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  // Simple test login route
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
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
        path: 'debug-routing',
        loadComponent: () => import('./debug-routing.component').then(m => m.DebugRoutingComponent)
      },
      {
        path: 'debug-auth',
        loadComponent: () => import('./debug-auth.component').then(m => m.DebugAuthComponent)
      },
      {
        path: '404',
        loadComponent: () => import('./shared/components/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
      },
      {
        path: '500',
        loadComponent: () => import('./shared/components/errors/server-error/server-error.component').then(m => m.ServerErrorComponent)
      },
      {
        path: 'dashboard',
        redirectTo: 'community',
        pathMatch: 'full'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'community'
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }