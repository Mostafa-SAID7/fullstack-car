/**
 * Marketplace Module (Angular)
 * Main module for marketplace features
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MarketplaceRoutingModule } from './marketplace-routing.module';

// Components
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';

// Services
import { ProductService, ServiceService } from './services';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MarketplaceRoutingModule,
    ProductListComponent,
    ProductDetailComponent,
    ServiceListComponent,
    ServiceDetailComponent
  ],
  providers: [
    ProductService,
    ServiceService
  ]
})
export class MarketplaceModule { }
