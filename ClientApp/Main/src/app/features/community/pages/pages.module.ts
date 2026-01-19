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
import { PageListComponent } from './components/page-list/page-list.component';

// Routing
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  declarations: [
    // Pages
    PageListComponent
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
    
    // Routing
    PagesRoutingModule
  ],
  providers: [
  ],
  exports: [
    PageListComponent
  ]
})
export class PagesModule { }