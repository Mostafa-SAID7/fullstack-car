/**
 * Marketplace Routing Module (Angular)
 * Defines routes for marketplace features
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { ServiceProviderListComponent } from './components/service-provider-list/service-provider-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    component: ProductListComponent,
    data: { title: 'Products' }
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    data: { title: 'Product Details' }
  },
  {
    path: 'services',
    component: ServiceListComponent,
    data: { title: 'Services' }
  },
  {
    path: 'services/:id',
    component: ServiceDetailComponent,
    data: { title: 'Service Details' }
  },
  {
    path: 'providers',
    component: ServiceProviderListComponent,
    data: { title: 'Service Providers' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }
