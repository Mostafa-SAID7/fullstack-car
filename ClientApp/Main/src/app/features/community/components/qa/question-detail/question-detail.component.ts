import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// QA Types and Services
import { QAQuestionService } from '../../../services/qa-question.service';
import { QuestionDetail, Answer } from '../../../../../shared/types/qa-api.types';
import { QASignalRService } from '../../../../qa/services/qa-signalr.service';
import { AuthService } from '../../../../../core/services/auth.service';

// QA Components
import { VotingComponent } from '../voting/voting.component';
import { AnswerListComponent } from '../answer-list/answer-list.component';
import { ReputationDisplayComponent } from '../reputation-display/reputation-display.component';

// Real-time QA Components
import { RealTimeAnswerListComponent } from '../../../../qa/components/real-time-answer-list/real-time-answer-list.component';
import { TypingIndicatorComponent } from '../../../../qa/components/typing-indicator/typing-indicator.component';
import { ConnectionStatusComponent } from '../../../../qa/components/connection-status/connection-status.component';
import { RealTimeVoteDisplayComponent } from '../../../../qa/components/real-time-vote-display/real-time-vote-display.component';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    VotingComponent,
    AnswerListComponent,
    ReputationDisplayComponent,
    // Real-time components
    RealTimeAnswerListComponent,
    TypingIndicatorComponent,
    ConnectionStatusComponent,
    RealTimeVoteDisplayComponent
  ],
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  questionId: string = '';
  question: QuestionDetail | null = null;
  loading = false;
  error: string | null = null;
  showAnswerForm = false;
  currentUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qaQuestionService: QAQuestionService,
    private qaSignalRService: QASignalRService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current user ID for real-time features
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUserId = user?.id || null;
    });

    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          this.questionId = params['id'];
          this.loading = true;
          this.error = null;

          // Join the question room for real-time updates
          this.joinQuestionRoom();

          return this.qaQuestionService.getQuestionDetail(this.questionId)
            .pipe(
              catchError(error => {
                this.error = error.message || 'Failed to load question';
                this.loading = false;
                return of(null);
              })
            );
        })
      )
      .subscribe(response => {
        if (response?.succeeded && response.data) {
          this.question = response.data;
          // Track view
          this.qaQuestionService.viewQuestion(this.questionId).subscribe();
        }
        this.loading = false;
      });

    // Setup real-time question updates
    this.setupRealTimeUpdates();
  }

  // Convert shared Answer type to component-compatible format
  convertAnswersForRealTime(answers: Answer[]): any[] {
    return answers.map(answer => ({
      ...answer,
      createdAt: new Date(answer.createdAt),
      updatedAt: answer.updatedAt ? new Date(answer.updatedAt) : undefined,
      acceptedAt: answer.acceptedAt ? new Date(answer.acceptedAt) : undefined,
      userVote: answer.userVote || null
    }));
  }

  ngOnDestroy(): void {
    // Leave the question room when component is destroyed
    if (this.questionId) {
      this.leaveQuestionRoom();
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async joinQuestionRoom(): Promise<void> {
    if (this.questionId && this.qaSignalRService.isConnected) {
      try {
        await this.qaSignalRService.joinQuestion(this.questionId);
        console.log('Joined question room:', this.questionId);
      } catch (error) {
        console.error('Failed to join question room:', error);
      }
    }
  }

  private async leaveQuestionRoom(): Promise<void> {
    if (this.questionId && this.qaSignalRService.isConnected) {
      try {
        await this.qaSignalRService.leaveQuestion(this.questionId);
        console.log('Left question room:', this.questionId);
      } catch (error) {
        console.error('Failed to leave question room:', error);
      }
    }
  }

  private setupRealTimeUpdates(): void {
    // Listen for question updates
    this.qaSignalRService.questionUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(updatedQuestion => {
        if (updatedQuestion.id === this.questionId && this.question) {
          this.question = { ...this.question, ...updatedQuestion };
        }
      });

    // Listen for question closure
    this.qaSignalRService.questionClosed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.questionId === this.questionId && this.question) {
          this.question = { 
            ...this.question, 
            isClosed: true, 
            closedReason: event.reason 
          };
        }
      });

    // Listen for view count updates
    this.qaSignalRService.questionViewed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.questionId === this.questionId && this.question) {
          this.question = { 
            ...this.question, 
            viewCount: event.viewCount 
          };
        }
      });

    // Listen for vote updates on the question
    this.qaSignalRService.voteCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.contentId === this.questionId && event.contentType === 'Question' && this.question) {
          this.question = { 
            ...this.question, 
            voteScore: event.voteScore 
          };
        }
      });

    this.qaSignalRService.voteChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.contentId === this.questionId && event.contentType === 'Question' && this.question) {
          this.question = { 
            ...this.question, 
            voteScore: event.voteScore 
          };
        }
      });

    this.qaSignalRService.voteRemoved$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.contentId === this.questionId && event.contentType === 'Question' && this.question) {
          this.question = { 
            ...this.question, 
            voteScore: event.voteScore 
          };
        }
      });
  }

  private loadQuestion() {
    this.loading = true;
    this.error = null;

    return this.qaQuestionService.getQuestionDetail(this.questionId)
      .pipe(
        catchError(error => {
          this.error = error.message || 'Failed to load question';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response?.succeeded && response.data) {
          this.question = response.data;
          // Track view
          this.qaQuestionService.viewQuestion(this.questionId).subscribe();
        }
        this.loading = false;
      });
  }

  // Event handlers
  onRetry(): void {
    this.loadQuestion();
  }

  onQuestionVoted(): void {
    // Refresh question to get updated vote counts
    this.loadQuestion();
  }

  onAnswerSubmitted(): void {
    // Refresh question to show new answer
    this.showAnswerForm = false;
    this.loadQuestion();
  }

  onAnswerVoted(): void {
    // Refresh question to get updated answer vote counts
    this.loadQuestion();
  }

  onAnswerAccepted(): void {
    // Refresh question to show accepted answer
    this.loadQuestion();
  }

  toggleAnswerForm(): void {
    this.showAnswerForm = !this.showAnswerForm;
  }

  editQuestion(): void {
    this.router.navigate(['/community/qa', this.questionId, 'edit']);
  }

  closeQuestion(): void {
    // TODO: Implement close question functionality
    console.log('Close question:', this.questionId);
  }

  shareQuestion(): void {
    if (navigator.share) {
      navigator.share({
        title: this.question?.title,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  }

  onAnswerShared(answer: any): void {
    if (navigator.share) {
      navigator.share({
        title: `Answer to: ${this.question?.title}`,
        url: `${window.location.href}#answer-${answer.id}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.href}#answer-${answer.id}`);
    }
  }

  onAnswerEdit(answer: any): void {
    // TODO: Implement answer editing functionality
    console.log('Edit answer:', answer.id);
  }

  navigateToSimilarQuestion(questionId: string): void {
    this.router.navigate(['/community/qa', questionId]);
  }

  navigateToCategory(category: string): void {
    this.router.navigate(['/community/qa'], { queryParams: { category } });
  }

  navigateToTag(tag: string): void {
    this.router.navigate(['/community/qa'], { queryParams: { tags: tag } });
  }
}