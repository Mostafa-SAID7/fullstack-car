import { Routes } from '@angular/router';

export const messagingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/messaging-page/messaging-page.component').then(m => m.MessagingPageComponent),
    title: 'Messages'
  },
  {
    path: 'conversation/:id',
    loadComponent: () => import('./pages/messaging-page/messaging-page.component').then(m => m.MessagingPageComponent),
    title: 'Messages'
  }
];