import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// QA Types and Services
import { QAQuestionService } from '../../../services/qa-question.service';
import { QuestionDetail } from '../../../../../shared/types/qa-api.types';

// QA Components
import { VotingComponent } from '../voting/voting.component';
import { AnswerListComponent } from '../answer-list/answer-list.component';
import { ReputationDisplayComponent } from '../reputation-display/reputation-display.component';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    VotingComponent,
    AnswerListComponent,
    ReputationDisplayComponent
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qaQuestionService: QAQuestionService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          this.questionId = params['id'];
          this.loading = true;
          this.error = null;

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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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