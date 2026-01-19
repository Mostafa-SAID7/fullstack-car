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

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Components (only import existing ones)
import { GroupsPageComponent } from './pages/groups-page/groups-page.component';
import { GroupCreatePageComponent } from './pages/group-create-page/group-create-page.component';
import { GroupCardComponent } from './components/group-card/group-card.component';
import { CreateGroupModalComponent } from './components/create-group-modal/create-group-modal.component';

// Services
import { GroupService } from '../../../core/services/group.service';

// Routing
import { GroupsRoutingModule } from './groups-routing.module';

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
    
    // Shared
    SharedModule,
    
    // Standalone components
    GroupsPageComponent,
    GroupCreatePageComponent,
    GroupCardComponent,
    CreateGroupModalComponent,
    
    // Routing
    GroupsRoutingModule
  ],
  providers: [
    GroupService
  ],
  exports: [
    GroupCardComponent,
    CreateGroupModalComponent
  ]
})
export class GroupsModule { }