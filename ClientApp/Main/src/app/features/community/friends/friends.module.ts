import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Components
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { FriendCardComponent } from './components/friend-card/friend-card.component';
import { FriendRequestsComponent } from './components/friend-requests/friend-requests.component';

// Services
import { FriendService } from '../services/friend.service';

// Routing
import { FriendsRoutingModule } from './friends-routing.module';

@NgModule({
  declarations: [
    FriendListComponent,
    FriendCardComponent,
    FriendRequestsComponent
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
    MatListModule,
    MatDividerModule,
    MatBadgeModule,
    MatMenuModule,
    
    // Shared
    SharedModule,
    
    // Routing
    FriendsRoutingModule
  ],
  providers: [
    FriendService
  ],
  exports: [
    FriendListComponent,
    FriendCardComponent
  ]
})
export class FriendsModule { }