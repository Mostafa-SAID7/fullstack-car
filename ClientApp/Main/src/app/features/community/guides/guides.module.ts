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
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Pages
import { GuidesListComponent } from './pages/guides-list/guides-list.component';

// Services
import { GuideService } from './services/guide.service';

// Routing
import { GuidesRoutingModule } from './guides-routing.module';

@NgModule({
  declarations: [
    // Pages
    GuidesListComponent
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
    MatChipsModule,
    MatBadgeModule,
    
    // Shared
    SharedModule,
    
    // Routing
    GuidesRoutingModule
  ],
  providers: [
    GuideService
  ],
  exports: [
    GuidesListComponent
  ]
})
export class GuidesModule { }