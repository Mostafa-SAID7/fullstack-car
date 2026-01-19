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
import { MatMenuModule } from '@angular/material/menu';

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Pages
import { PostListComponent } from './pages/post-list/post-list.component';

// Services
import { PostService } from './services/post.service';

@NgModule({
  declarations: [
    // Pages
    PostListComponent
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
    MatMenuModule,
    
    // Shared
    SharedModule,
    
    // Routing
    PostsRoutingModule
  ],
  providers: [
    PostService
  ],
  exports: [
    PostListComponent
  ]
})
export class PostsModule { }

// Import routing module
import { PostsRoutingModule } from './posts-routing.module';