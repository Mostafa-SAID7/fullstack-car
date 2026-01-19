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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Services - using correct class names
import { QAService } from './services/qa.service';
import { QAAnswerService } from './services/qa-answer.service';
import { QABookmarkService } from './services/qa-bookmark.service';
import { QACategoryService } from './services/qa-category.service';
import { QAExpertNotificationService } from './services/qa-expert-notification.service';
import { QAFollowService } from './services/qa-follow.service';
import { QAQuestionService } from './services/qa-question.service';
import { QAReputationService } from './services/qa-reputation.service';
import { QASearchService } from './services/qa-search.service';
import { QASignalRService } from './services/qa-signalr.service';
import { QAStateService } from './services/qa-state.service';
import { QATagService } from './services/qa-tag.service';
import { QAVotingService } from './services/qa-voting.service';

// Routing
import { QaRoutingModule } from './qa-routing.module';

@NgModule({
  declarations: [
    // All QA components are standalone, so no components should be declared here
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
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatPaginatorModule,
    
    // Shared
    SharedModule,
    
    // Routing
    QaRoutingModule
  ],
  providers: [
    QAService,
    QAAnswerService,
    QABookmarkService,
    QACategoryService,
    QAExpertNotificationService,
    QAFollowService,
    QAQuestionService,
    QAReputationService,
    QASearchService,
    QASignalRService,
    QAStateService,
    QATagService,
    QAVotingService
  ],
  exports: [
    // No exports needed since all components are standalone
  ]
})
export class QaModule { }