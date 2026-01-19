import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Pages
import { MapsExplorerComponent } from './pages/maps-explorer/maps-explorer.component';

// Components
import { LocationCardComponent } from './components/location-card/location-card.component';

// Routing
import { MapsRoutingModule } from './maps-routing.module';

@NgModule({
  declarations: [
    // All components are standalone, so no components should be declared here
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    
    // Angular Material
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    
    // Shared
    SharedModule,
    
    // Standalone components
    MapsExplorerComponent,
    LocationCardComponent,
    
    // Routing
    MapsRoutingModule
  ],
  providers: [
  ],
  exports: [
    MapsExplorerComponent
  ]
})
export class MapsModule { }