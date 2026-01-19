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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Pages
import { NewsListComponent } from './pages/news-list/news-list.component';
import { NewsDetailComponent } from './pages/news-detail/news-detail.component';
import { NewsPreferencesComponent } from './pages/news-preferences/news-preferences.component';

// Components
import { NewsCardComponent } from './components/news-card/news-card.component';

// Services
import { NewsService } from './services/news.service';

// Routing
import { NewsRoutingModule } from './news-routing.module';

@NgModule({
  declarations: [
    // Pages
    NewsListComponent,
    NewsDetailComponent,
    NewsPreferencesComponent,
    
    // Components
    NewsCardComponent
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
    MatSlideToggleModule,
    
    // Shared
    SharedModule,
    
    // Routing
    NewsRoutingModule
  ],
  providers: [
    NewsService
  ],
  exports: [
    NewsCardComponent
  ]
})
export class NewsModule { }