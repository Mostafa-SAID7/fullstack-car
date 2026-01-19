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

// Components
import { GroupsPageComponent } from './pages/groups-page/groups-page.component';
import { GroupDetailPageComponent } from './pages/group-detail-page/group-detail-page.component';
import { GroupCreatePageComponent } from './pages/group-create-page/group-create-page.component';
import { GroupEditPageComponent } from './pages/group-edit-page/group-edit-page.component';
import { GroupMembersPageComponent } from './pages/group-members-page/group-members-page.component';
import { GroupEventsPageComponent } from './pages/group-events-page/group-events-page.component';
import { GroupDiscussionsPageComponent } from './pages/group-discussions-page/group-discussions-page.component';

import { GroupCardComponent } from './components/group-card/group-card.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { CreateGroupModalComponent } from './components/create-group-modal/create-group-modal.component';
import { GroupHeaderComponent } from './components/group-header/group-header.component';
import { GroupSidebarComponent } from './components/group-sidebar/group-sidebar.component';
import { GroupPostsComponent } from './components/group-posts/group-posts.component';
import { GroupMembersComponent } from './components/group-members/group-members.component';
import { GroupEventsComponent } from './components/group-events/group-events.component';
import { GroupDiscussionsComponent } from './components/group-discussions/group-discussions.component';
import { GroupSettingsComponent } from './components/group-settings/group-settings.component';
import { GroupInvitationComponent } from './components/group-invitation/group-invitation.component';
import { GroupRolesComponent } from './components/group-roles/group-roles.component';
import { GroupSearchComponent } from './components/group-search/group-search.component';
import { GroupStatsComponent } from './components/group-stats/group-stats.component';
import { GroupJoinRequestsComponent } from './components/group-join-requests/group-join-requests.component';
import { GroupReportsComponent } from './components/group-reports/group-reports.component';

// Services
import { GroupService } from '../../../core/services/group.service';

// Routing
import { GroupsRoutingModule } from './groups-routing.module';

@NgModule({
  declarations: [
    // Pages
    GroupsPageComponent,
    GroupDetailPageComponent,
    GroupCreatePageComponent,
    GroupEditPageComponent,
    GroupMembersPageComponent,
    GroupEventsPageComponent,
    GroupDiscussionsPageComponent,
    
    // Components
    GroupCardComponent,
    GroupListComponent,
    CreateGroupModalComponent,
    GroupHeaderComponent,
    GroupSidebarComponent,
    GroupPostsComponent,
    GroupMembersComponent,
    GroupEventsComponent,
    GroupDiscussionsComponent,
    GroupSettingsComponent,
    GroupInvitationComponent,
    GroupRolesComponent,
    GroupSearchComponent,
    GroupStatsComponent,
    GroupJoinRequestsComponent,
    GroupReportsComponent
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
    
    // Routing
    GroupsRoutingModule
  ],
  providers: [
    GroupService
  ],
  exports: [
    GroupCardComponent,
    GroupListComponent,
    GroupSearchComponent
  ]
})
export class GroupsModule { }