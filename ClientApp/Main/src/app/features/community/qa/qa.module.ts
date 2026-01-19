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

// Pages
import { QuestionListComponent } from './pages/question-list/question-list.component';
import { QuestionDetailComponent } from './pages/question-detail/question-detail.component';
import { QuestionFormComponent } from './pages/question-form/question-form.component';

// Components
import { AnswerAcceptanceComponent } from './components/answer-acceptance/answer-acceptance.component';
import { AnswerFormComponent } from './components/answer-form/answer-form.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import { ConnectionStatusComponent } from './components/connection-status/connection-status.component';
import { DuplicateSuggestionsComponent } from './components/duplicate-suggestions/duplicate-suggestions.component';
import { QuestionBookmarkComponent } from './components/question-bookmark/question-bookmark.component';
import { QuestionFollowComponent } from './components/question-follow/question-follow.component';
import { QuestionSearchComponent } from './components/question-search/question-search.component';
import { QuestionShareComponent } from './components/question-share/question-share.component';
import { RealTimeAnswerListComponent } from './components/real-time-answer-list/real-time-answer-list.component';
import { RealTimeVoteDisplayComponent } from './components/real-time-vote-display/real-time-vote-display.component';
import { ReputationDisplayComponent } from './components/reputation-display/reputation-display.component';
import { SimilarQuestionsComponent } from './components/similar-questions/similar-questions.component';
import { TagCloudComponent } from './components/tag-cloud/tag-cloud.component';
import { TypingIndicatorComponent } from './components/typing-indicator/typing-indicator.component';

// Services
import { QaService } from './services/qa.service';
import { QaAnswerService } from './services/qa-answer.service';
import { QaBookmarkService } from './services/qa-bookmark.service';
import { QaCategoryService } from './services/qa-category.service';
import { QaExpertNotificationService } from './services/qa-expert-notification.service';
import { QaFollowService } from './services/qa-follow.service';
import { QaQuestionService } from './services/qa-question.service';
import { QaReputationService } from './services/qa-reputation.service';
import { QaSearchService } from './services/qa-search.service';
import { QaSignalrService } from './services/qa-signalr.service';
import { QaStateService } from './services/qa-state.service';
import { QaTagService } from './services/qa-tag.service';
import { QaVotingService } from './services/qa-voting.service';

// Routing
import { QaRoutingModule } from './qa-routing.module';

@NgModule({
  declarations: [
    // Pages
    QuestionListComponent,
    QuestionDetailComponent,
    QuestionFormComponent,
    
    // Components
    AnswerAcceptanceComponent,
    AnswerFormComponent,
    CategoryFilterComponent,
    ConnectionStatusComponent,
    DuplicateSuggestionsComponent,
    QuestionBookmarkComponent,
    QuestionFollowComponent,
    QuestionSearchComponent,
    QuestionShareComponent,
    RealTimeAnswerListComponent,
    RealTimeVoteDisplayComponent,
    ReputationDisplayComponent,
    SimilarQuestionsComponent,
    TagCloudComponent,
    TypingIndicatorComponent
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
    QaService,
    QaAnswerService,
    QaBookmarkService,
    QaCategoryService,
    QaExpertNotificationService,
    QaFollowService,
    QaQuestionService,
    QaReputationService,
    QaSearchService,
    QaSignalrService,
    QaStateService,
    QaTagService,
    QaVotingService
  ],
  exports: [
    // Export components that might be used in other modules
    QuestionSearchComponent,
    CategoryFilterComponent,
    TagCloudComponent,
    ReputationDisplayComponent
  ]
})
export class QaModule { }