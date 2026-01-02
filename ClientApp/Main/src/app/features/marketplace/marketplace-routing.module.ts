import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/marketplace-dashboard/marketplace-dashboard.component').then(m => m.MarketplaceDashboardComponent),
    children: [
      { path: '', redirectTo: 'services', pathMatch: 'full' },
      { 
        path: 'services', 
        loadComponent: () => import('./components/service-list/service-list.component').then(m => m.ServiceListComponent)
      },
      { 
        path: 'services/create', 
        loadComponent: () => import('./components/service-form/service-form.component').then(m => m.ServiceFormComponent)
      },
      { 
        path: 'services/:id', 
        loadComponent: () => import('./components/service-detail/service-detail.component').then(m => m.ServiceDetailComponent)
      },
      { 
        path: 'services/:id/edit', 
        loadComponent: () => import('./components/service-form/service-form.component').then(m => m.ServiceFormComponent)
      },
      { 
        path: 'providers', 
        loadComponent: () => import('./components/service-provider-list/service-provider-list.component').then(m => m.ServiceProviderListComponent)
      },
      { 
        path: 'providers/create', 
        loadComponent: () => import('./components/service-provider-form/service-provider-form.component').then(m => m.ServiceProviderFormComponent)
      },
      { 
        path: 'providers/:id', 
        loadComponent: () => import('./components/service-provider-detail/service-provider-detail.component').then(m => m.ServiceProviderDetailComponent)
      },
      { 
        path: 'providers/:id/edit', 
        loadComponent: () => import('./components/service-provider-form/service-provider-form.component').then(m => m.ServiceProviderFormComponent)
      },
      { 
        path: 'bookings', 
        loadComponent: () => import('./components/booking-list/booking-list.component').then(m => m.BookingListComponent)
      },
      { 
        path: 'bookings/create', 
        loadComponent: () => import('./components/create-booking/create-booking.component').then(m => m.CreateBookingComponent)
      },
      { 
        path: 'bookings/:id', 
        loadComponent: () => import('./components/booking-detail/booking-detail.component').then(m => m.BookingDetailComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }