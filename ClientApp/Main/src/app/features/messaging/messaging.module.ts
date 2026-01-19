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
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

// Shared modules
import { SharedModule } from '../../shared/shared.module';

// Pages
import { MessagingPageComponent } from './pages/messaging-page/messaging-page.component';

// Components
import { MessageInterfaceComponent } from './components/message-interface/message-interface.component';

// Services
import { MessagingService } from '../../core/services/messaging.service';

// Routing
import { MessagingRoutingModule } from './messaging-routing.module';

@NgModule({
  declarations: [
    MessageInterfaceComponent
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
    MatListModule,
    MatDividerModule,
    MatBadgeModule,
    
    // Shared
    SharedModule,
    
    // Standalone components
    MessagingPageComponent,
    
    // Routing
    MessagingRoutingModule
  ],
  providers: [
    MessagingService
  ],
  exports: [
    MessageInterfaceComponent
  ]
})
export class MessagingModule { }