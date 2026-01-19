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
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Pages
import { EventsListComponent } from './pages/events-list/events-list.component';

// Components
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventFiltersComponent } from './components/event-filters/event-filters.component';

// Services
import { EventsService } from './services/events.service';

// Routing
import { EventsRoutingModule } from './events-routing.module';

@NgModule({
  declarations: [
    // Note: Pages and components are standalone, so they're not declared here
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
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatPaginatorModule,
    MatStepperModule,
    MatRadioModule,
    
    // Shared
    SharedModule,
    
    // Standalone components (imported for use in templates)
    EventsListComponent,
    EventCardComponent,
    EventFiltersComponent,
    
    // Routing
    EventsRoutingModule
  ],
  providers: [
    EventsService
  ],
  exports: [
    // Export components that might be used in other modules
    EventCardComponent,
    EventFiltersComponent
  ]
})
export class EventsModule { }