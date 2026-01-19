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

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Services
import { ReviewService } from './services/review.service';

// Routing
import { ReviewsRoutingModule } from './reviews-routing.module';

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
    MatChipsModule,
    
    // Shared
    SharedModule,
    
    // Routing
    ReviewsRoutingModule
  ],
  providers: [
    ReviewService
  ]
})
export class ReviewsModule { }