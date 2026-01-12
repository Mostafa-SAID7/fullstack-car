import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, combineLatest } from 'rxjs';

// Shared Components (reusing existing UI)
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from '../../../../../shared/components/error-display/error-display.component';
import { FormButtonComponent } from '../../../../../shared/components/form-button/form-button.component';
import { ListViewComponent } from '../../../../../shared/components/list-view/list-view.component';

// QA Components (enhanced with shared UI)
import { AnswerListComponent } from '../answer-list/answer-list.component';
import { AnswerFormComponent } from '../answer-form/answer-form.component';
import { VotingComponent } from '../voting/voting.component';
import { ReputationDisplayComponent } from '../reputation-display/reputation-display.component';
import { QANotificationsComponent } from '../qa-notifications/qa-notifications.component';

// Services
import { QAService } from '../../../services/qa.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastService } from '../../../../../core/services/toast.service';

// Types
import { QuestionDetail, Answer, CreateAnswerRequest, UserReputation } from '../../../../../shared/types/qa-api.types';
import { Answer as LegacyAnswer } from '../../../../../core/models/qa.model';

@Component({
  selector: 'app-qa-integration',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ErrorDisplayComponent,
    FormButtonComponent,
    ListViewComponent,
    AnswerListComponent,
    AnswerFormComponent,
    VotingComponent,
    ReputationDisplayComponent,
    QANotificationsComponent
  ],
  template: `
    <div class="max-w-6xl mx-auto p-6 space-y-8">
      
      <!-- QA Header with Notifications -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-foreground uppercase tracking-widest">Question & Answers</h1>
          <p class="text-muted-foreground font-bold text-sm uppercase tracking-widest">Community knowledge sharing</p>
        </div>
        
        <!-- QA Notifications (reusing existing notification system) -->
        <div class="flex items-center gap-4">
          <app-reputation-display
            *ngIf="userReputation"
            [userReputation]="userReputation"
            [compact]="true">
          </app-reputation-display>
          
          <app-qa-notifications
            (notificationClicked)="onNotificationClicked($event)"
            (allNotificationsViewed)="onAllNotificationsViewed()">
          </app-qa-notifications>
        </div>
      </div>

      <!-- Question Display (if viewing a specific question) -->
      <div *ngIf="currentQuestion" class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        
        <!-- Question Header -->
        <div class="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
          
          <!-- Question Voting -->
          <div class="flex lg:flex-col items-center lg:items-start">
            <app-voting
              [contentId]="currentQuestion.id"
              contentType="Question"
              [voteScore]="currentQuestion.voteScore"
              [upvotesCount]="currentQuestion.upvotesCount"
              [downvotesCount]="currentQuestion.downvotesCount"
              [userVote]="currentQuestion.userVote"
              [showBreakdown]="true"
              (voted)="onQuestionVoted($event)">
            </app-voting>
          </div>

          <!-- Question Content -->
          <div class="flex-1 space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-foreground mb-4">{{ currentQuestion.title }}</h2>
              <div class="prose prose-lg max-w-none text-foreground" [innerHTML]="currentQuestion.content"></div>
            </div>

            <!-- Question Meta -->
            <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <i class="fas fa-eye"></i>
                <span>{{ currentQuestion.viewCount }} views</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-comment"></i>
                <span>{{ currentQuestion.answerCount }} answers</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-clock"></i>
                <span>Asked {{ formatDate(currentQuestion.createdAt) }}</span>
              </div>
            </div>

            <!-- Question Tags -->
            <div *ngIf="currentQuestion.tags.length > 0" class="flex flex-wrap gap-2">
              <span 
                *ngFor="let tag of currentQuestion.tags"
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {{ tag }}
              </span>
            </div>

            <!-- Question Author -->
            <div class="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-primary"></i>
              </div>
              <div>
                <div class="font-bold text-foreground">{{ currentQuestion.userName }}</div>
                <app-reputation-display 
                  [reputation]="currentQuestion.userReputation"
                  [compact]="true">
                </app-reputation-display>
              </div>
              <div class="text-sm text-muted-foreground">
                asked {{ formatDate(currentQuestion.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Answers Section -->
      <div *ngIf="currentQuestion">
        <app-answer-list
          [answers]="answers"
          [questionId]="currentQuestion.id"
          [acceptedAnswerId]="currentQuestion.acceptedAnswerId"
          [canAcceptAnswer]="canAcceptAnswer"
          [loading]="answersLoading"
          [error]="answersError"
          (answerVoted)="onAnswerVoted($event)"
          (answerAccepted)="onAnswerAccepted($event)"
          (answerEdited)="onAnswerEdited($event)"
          (answerShared)="onAnswerShared($event)"
          (answerReported)="onAnswerReported($event)"
          (startAnswering)="showAnswerForm = true"
          (retry)="loadAnswers()">
        </app-answer-list>
      </div>

      <!-- Answer Form -->
      <div *ngIf="currentQuestion && showAnswerForm">
        <app-answer-form
          [questionId]="currentQuestion.id"
          (answerSubmitted)="onAnswerSubmitted($event)"
          (cancelled)="showAnswerForm = false"
          (draftSaved)="onAnswerDraftSaved($event)">
        </app-answer-form>
      </div>

      <!-- Add Answer Button (if not showing form) -->
      <div *ngIf="currentQuestion && !showAnswerForm" class="text-center">
        <app-form-button
          variant="primary"
          size="lg"
          (clicked)="showAnswerForm = true">
          <i class="fas fa-edit mr-2"></i>
          Write an Answer
        </app-form-button>
      </div>

      <!-- Loading State (reusing LoadingSpinnerComponent) -->
      <app-loading-spinner
        *ngIf="loading"
        [fullScreen]="true"
        size="lg"
        text="Loading question and answers...">
      </app-loading-spinner>

      <!-- Error State (reusing ErrorDisplayComponent) -->
      <app-error-display
        *ngIf="error && !loading"
        type="server"
        [title]="'Failed to Load Question'"
        [message]="error"
        [showRetry]="true"
        [showHome]="true"
        size="lg"
        (retry)="loadQuestion()"
        (goHome)="goToQAHome()">
      </app-error-display>
    </div>
  `,
  styles: [`
    .prose {
      color: inherit;
    }
    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
      color: inherit;
    }
    .prose code {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-size: 0.875em;
    }
    .prose pre {
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 0.5rem;
      padding: 1rem;
    }
  `]
})
export class QAIntegrationComponent implements OnInit, OnDestroy {
  @Input() questionId?: string;
  @Input() autoLoadQuestion = true;

  @Output() questionLoaded = new EventEmitter<QuestionDetail>();
  @Output() answerCreated = new EventEmitter<LegacyAnswer>();
  @Output() voteChanged = new EventEmitter<{ contentId: string; contentType: 'Question' | 'Answer'; voteType: 'Up' | 'Down' | null }>();

  // State
  currentQuestion: QuestionDetail | null = null;
  answers: Answer[] = [];
  userReputation: UserReputation | null = null;
  showAnswerForm = false;

  // Loading states
  loading = false;
  answersLoading = false;
  error: string | null = null;
  answersError: string | null = null;

  // Permissions
  canAcceptAnswer = false;

  private destroy$ = new Subject<void>();

  constructor(
    private qaService: QAService,
    private notificationService: NotificationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.setupSubscriptions();
    this.loadUserReputation();
    
    if (this.questionId && this.autoLoadQuestion) {
      this.loadQuestion();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    // Subscribe to QA service state
    this.qaService.currentQuestion$
      .pipe(takeUntil(this.destroy$))
      .subscribe(question => {
        this.currentQuestion = question;
        if (question) {
          this.questionLoaded.emit(question);
          this.checkAcceptPermissions();
        }
      });

    this.qaService.answers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(answers => {
        this.answers = answers;
      });

    this.qaService.userReputation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(reputation => {
        this.userReputation = reputation;
      });

    this.qaService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.qaService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.error = error;
      });
  }

  private loadUserReputation(): void {
    this.qaService.getUserReputation().subscribe({
      next: (reputation) => {
        this.userReputation = reputation;
      },
      error: (error) => {
        console.warn('Failed to load user reputation:', error);
      }
    });
  }

  private checkAcceptPermissions(): void {
    // User can accept answers if they are the question author
    // This would typically check against the current user ID
    this.canAcceptAnswer = false; // Simplified for demo
  }

  loadQuestion(): void {
    if (!this.questionId) return;

    this.qaService.getQuestion(this.questionId).subscribe({
      next: (response) => {
        if (response.succeeded && response.data) {
          // Question is loaded via service subscription
          this.loadAnswers();
        } else {
          this.error = response.errors?.[0] || 'Failed to load question';
        }
      },
      error: (error) => {
        this.error = 'Failed to load question';
        console.error('Error loading question:', error);
      }
    });
  }

  loadAnswers(): void {
    if (!this.questionId) return;

    this.answersLoading = true;
    this.answersError = null;

    // Answers are loaded via the question detail call
    // In a real implementation, you might have a separate answers endpoint
    setTimeout(() => {
      this.answersLoading = false;
    }, 1000);
  }

  onQuestionVoted(event: { contentId: string; voteType: 'Up' | 'Down' | null }): void {
    if (!this.currentQuestion) return;

    const isUpvote = event.voteType === 'Up';
    
    this.qaService.voteQuestion(this.currentQuestion.id, isUpvote).subscribe({
      next: (response) => {
        if (response.succeeded) {
          this.voteChanged.emit({
            contentId: event.contentId,
            contentType: 'Question',
            voteType: event.voteType
          });
          this.toastService.success('Vote recorded successfully');
        } else {
          this.toastService.error(response.errors?.[0] || 'Failed to record vote');
        }
      },
      error: (error) => {
        this.toastService.error('Failed to record vote');
        console.error('Error voting on question:', error);
      }
    });
  }

  onAnswerVoted(answerId: string): void {
    const answer = this.answers.find(a => a.id === answerId);
    if (!answer) return;

    // The voting is handled by the VotingComponent
    // This is just for additional processing if needed
    this.voteChanged.emit({
      contentId: answerId,
      contentType: 'Answer',
      voteType: answer.userVote || null
    });
  }

  onAnswerAccepted(answerId: string): void {
    if (!this.currentQuestion) return;

    this.qaService.acceptAnswer(this.currentQuestion.id, answerId).subscribe({
      next: (response) => {
        if (response.succeeded) {
          this.toastService.success('Answer accepted successfully');
          // Update UI to reflect accepted answer
          this.answers = this.answers.map(a => ({
            ...a,
            isAccepted: a.id === answerId
          }));
        } else {
          this.toastService.error(response.errors?.[0] || 'Failed to accept answer');
        }
      },
      error: (error) => {
        this.toastService.error('Failed to accept answer');
        console.error('Error accepting answer:', error);
      }
    });
  }

  onAnswerSubmitted(request: CreateAnswerRequest): void {
    this.qaService.answerQuestion(request).subscribe({
      next: (response) => {
        if (response.succeeded && response.data) {
          this.answerCreated.emit(response.data);
          this.showAnswerForm = false;
          this.toastService.success('Answer posted successfully');
          
          // Scroll to the new answer
          setTimeout(() => {
            const answerElement = document.getElementById(`answer-${response.data!.id}`);
            if (answerElement) {
              answerElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        } else {
          this.toastService.error(response.errors?.[0] || 'Failed to post answer');
        }
      },
      error: (error) => {
        this.toastService.error('Failed to post answer');
        console.error('Error posting answer:', error);
      }
    });
  }

  onAnswerEdited(answerId: string): void {
    // Navigate to edit answer page or show edit form
    console.log('Edit answer:', answerId);
    this.toastService.info('Answer editing not implemented yet');
  }

  onAnswerShared(answerId: string): void {
    // Copy answer link to clipboard
    const answerUrl = `${window.location.origin}/qa/questions/${this.currentQuestion?.id}#answer-${answerId}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(answerUrl).then(() => {
        this.toastService.success('Answer link copied to clipboard');
      });
    } else {
      // Fallback for older browsers
      this.toastService.info(`Answer link: ${answerUrl}`);
    }
  }

  onAnswerReported(answerId: string): void {
    // Show report dialog or navigate to report page
    console.log('Report answer:', answerId);
    this.toastService.info('Answer reporting not implemented yet');
  }

  onAnswerDraftSaved(content: string): void {
    // Save draft to local storage or backend
    if (this.questionId) {
      localStorage.setItem(`qa_answer_draft_${this.questionId}`, content);
      this.toastService.success('Draft saved');
    }
  }

  onNotificationClicked(notification: any): void {
    // Handle QA notification click
    console.log('QA notification clicked:', notification);
  }

  onAllNotificationsViewed(): void {
    // Navigate to full notifications page
    console.log('View all QA notifications');
  }

  goToQAHome(): void {
    // Navigate to QA home page
    window.location.href = '/qa';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  }
}