import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    // All components are standalone, no declarations needed
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MarketplaceRoutingModule,
    SharedModule
  ]
})
export class MarketplaceModule { }