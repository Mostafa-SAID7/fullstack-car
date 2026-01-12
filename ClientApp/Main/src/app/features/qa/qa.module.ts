import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

// Shared Components
import { SharedModule } from '../../shared/shared.module';

// QA Components
import { QASearchComponent } from './components/qa-search/qa-search.component';
import { QACategoryFilterComponent } from './components/qa-category-filter/qa-category-filter.component';
import { QATagCloudComponent } from './components/qa-tag-cloud/qa-tag-cloud.component';
import { SimilarQuestionsComponent } from './components/similar-questions/similar-questions.component';

// Real-time QA Components
import { RealTimeAnswerListComponent } from './components/real-time-answer-list/real-time-answer-list.component';
import { TypingIndicatorComponent } from './components/typing-indicator/typing-indicator.component';
import { ConnectionStatusComponent } from './components/connection-status/connection-status.component';
import { RealTimeVoteDisplayComponent } from './components/real-time-vote-display/real-time-vote-display.component';
import { AnswerComposerComponent } from './components/answer-composer/answer-composer.component';
import { QAPageComponent } from './components/qa-page/qa-page.component';

// QA Services
import { QASearchService } from '../community/services/qa-search.service';
import { QASignalRService } from './services/qa-signalr.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    SharedModule,
    // Standalone components are imported directly where needed
    QASearchComponent,
    QACategoryFilterComponent,
    QATagCloudComponent,
    SimilarQuestionsComponent,
    // Real-time components
    RealTimeAnswerListComponent,
    TypingIndicatorComponent,
    ConnectionStatusComponent,
    RealTimeVoteDisplayComponent,
    AnswerComposerComponent,
    QAPageComponent
  ],
  providers: [
    QASearchService,
    QASignalRService
  ],
  exports: [
    QASearchComponent,
    QACategoryFilterComponent,
    QATagCloudComponent,
    SimilarQuestionsComponent,
    // Real-time components
    RealTimeAnswerListComponent,
    TypingIndicatorComponent,
    ConnectionStatusComponent,
    RealTimeVoteDisplayComponent,
    AnswerComposerComponent,
    QAPageComponent
  ]
})
export class QAModule { }