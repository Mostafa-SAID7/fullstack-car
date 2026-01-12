import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap, catchError, combineLatest } from 'rxjs';
import { of } from 'rxjs';

// Core Services
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

// QA Services and Types
import { QASignalRService } from '../../services/qa-signalr.service';
import { QuestionDetail, Question, Answer } from '../../../../shared/types/qa-api.types';

// Shared Components
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from '../../../../shared/components/error-display/error-display.component';

// QA Components
import { QASearchComponent } from '../qa-search/qa-search.component';
import { QACategoryFilterComponent } from '../qa-category-filter/qa-category-filter.component';
import { QATagCloudComponent } from '../qa-tag-cloud/qa-tag-cloud.component';
import { SimilarQuestionsComponent } from '../similar-questions/similar-questions.component';

// Real-time QA Components
import { RealTimeAnswerListComponent } from '../real-time-answer-list/real-time-answer-list.component';
import { TypingIndicatorComponent } from '../typing-indicator/typing-indicator.component';
import { ConnectionStatusComponent } from '../connection-status/connection-status.component';
import { RealTimeVoteDisplayComponent } from '../real-time-vote-display/real-time-vote-display.component';
import { AnswerComposerComponent } from '../answer-composer/answer-composer.component';

@Component({
  selector: 'app-qa-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ErrorDisplayComponent,
    QASearchComponent,
    QACategoryFilterComponent,
    QATagCloudComponent,
    SimilarQuestionsComponent,
    RealTimeAnswerListComponent,
    TypingIndicatorComponent,
    ConnectionStatusComponent,
    RealTimeVoteDisplayComponent,
    AnswerComposerComponent
  ],
  template: `
    <div class="qa-page min-h-screen bg-gray-50">
      
      <!-- Header with consistent navigation -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            
            <!-- Navigation Breadcrumb -->
            <nav class="flex items-center space-x-4">
              <button 
                routerLink="/community"
                class="text-gray-500 hover:text-gray-700 transition-colors">
                <i class="fas fa-home"></i>
              </button>
              <i class="fas fa-chevron-right text-gray-300 text-sm"></i>
              <button 
                routerLink="/community/qa"
                class="text-gray-500 hover:text-gray-700 transition-colors font-medium">
                Q&A
              </button>
              <i *ngIf="currentQuestion" class="fas fa-chevron-right text-gray-300 text-sm"></i>
              <span *ngIf="currentQuestion" class="text-gray-900 font-medium truncate max-w-md">
                {{ currentQuestion.title }}
              </span>
            </nav>

            <!-- Connection Status -->
            <app-connection-status></app-connection-status>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            
            <!-- Search -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Search Questions</h3>
              <app-qa-search>
              </app-qa-search>
            </div>

            <!-- Category Filter -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <app-qa-category-filter
                [selectedCategory]="selectedCategory || ''"
                (categoryChange)="onCategorySelected($event)">
              </app-qa-category-filter>
            </div>

            <!-- Popular Tags -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <app-qa-tag-cloud
                [selectedTags]="selectedTags"
                (tagsChange)="onTagsChanged($event)">
              </app-qa-tag-cloud>
            </div>

            <!-- Similar Questions (when viewing a question) -->
            <div *ngIf="currentQuestion?.similarQuestions?.length" class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Similar Questions</h3>
              <app-similar-questions
                [searchTerm]="currentQuestion?.title || ''"
                [category]="currentQuestion?.category || ''"
                [tags]="currentQuestion?.tags || []">
              </app-similar-questions>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="lg:col-span-3">
            
            <!-- Loading State -->
            <div *ngIf="loading" class="bg-white rounded-lg shadow p-8">
              <app-loading-spinner 
                text="Loading Q&A content..."
                size="lg">
              </app-loading-spinner>
            </div>

            <!-- Error State -->
            <div *ngIf="error && !loading" class="bg-white rounded-lg shadow p-8">
              <app-error-display
                [message]="error"
                type="generic"
                [showRetry]="true"
                (retry)="onRetry()">
              </app-error-display>
            </div>

            <!-- Question Detail View -->
            <div *ngIf="currentQuestion && !loading && !error" class="space-y-6">
              
              <!-- Question Header -->
              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ currentQuestion.title }}</h1>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Asked {{ formatDate(currentQuestion.createdAt) }}</span>
                      <span>{{ currentQuestion.viewCount }} views</span>
                      <span *ngIf="currentQuestion.updatedAt">
                        Modified {{ formatDate(currentQuestion.updatedAt) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Question Actions -->
                  <div class="flex items-center space-x-2">
                    <button 
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      (click)="shareQuestion()">
                      <i class="fas fa-share mr-2"></i>
                      Share
                    </button>
                    <button 
                      *ngIf="canEditQuestion()"
                      class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                      (click)="editQuestion()">
                      <i class="fas fa-edit mr-2"></i>
                      Edit
                    </button>
                  </div>
                </div>

                <!-- Question Status Badges -->
                <div class="flex items-center space-x-2 mb-4" *ngIf="currentQuestion.isClosed || currentQuestion.acceptedAnswerId">
                  <span *ngIf="currentQuestion.isClosed" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <i class="fas fa-lock mr-1"></i>
                    Closed
                  </span>
                  <span *ngIf="currentQuestion.acceptedAnswerId" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i class="fas fa-check-circle mr-1"></i>
                    Answered
                  </span>
                </div>
              </div>

              <!-- Question Content -->
              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex space-x-6">
                  
                  <!-- Voting -->
                  <div class="flex-shrink-0">
                    <app-real-time-vote-display
                      [contentId]="currentQuestion.id"
                      contentType="Question"
                      [initialVoteScore]="currentQuestion.voteScore"
                      [initialUserVote]="currentQuestion.userVote || null">
                    </app-real-time-vote-display>
                  </div>

                  <!-- Question Body -->
                  <div class="flex-1 space-y-4">
                    <div class="prose max-w-none" [innerHTML]="currentQuestion.content"></div>
                    
                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2" *ngIf="currentQuestion.tags?.length">
                      <span *ngFor="let tag of currentQuestion.tags" 
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                            (click)="onTagSelected(tag)">
                        {{ tag }}
                      </span>
                    </div>

                    <!-- Category -->
                    <div>
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors"
                            (click)="onCategorySelected(currentQuestion.category)">
                        <i class="fas fa-folder mr-2"></i>
                        {{ currentQuestion.category }}
                      </span>
                    </div>

                    <!-- Author Info -->
                    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <i class="fas fa-user text-white text-sm"></i>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ currentQuestion.userName }}</div>
                          <div class="text-xs text-gray-500">{{ currentQuestion.userReputation }} reputation</div>
                        </div>
                      </div>
                      <div class="text-xs text-gray-500">
                        asked {{ formatDate(currentQuestion.createdAt) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Answers Section -->
              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-semibold text-gray-900">
                    {{ currentQuestion.answerCount }} 
                    {{ currentQuestion.answerCount === 1 ? 'Answer' : 'Answers' }}
                  </h2>
                  
                  <button 
                    *ngIf="!currentQuestion.isClosed && currentUserId"
                    (click)="toggleAnswerForm()"
                    class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                    <i class="fas" [ngClass]="showAnswerForm ? 'fa-times' : 'fa-plus'"></i>
                    {{ showAnswerForm ? 'Cancel' : 'Write Answer' }}
                  </button>
                </div>

                <!-- Answer Form -->
                <div *ngIf="showAnswerForm" class="mb-8">
                  <app-answer-composer
                    [questionId]="currentQuestion.id"
                    (answerSubmitted)="onAnswerSubmitted($event)"
                    (cancelled)="onAnswerCancelled()">
                  </app-answer-composer>
                </div>

                <!-- Typing Indicators -->
                <app-typing-indicator 
                  [questionId]="currentQuestion.id"
                  class="mb-6">
                </app-typing-indicator>

                <!-- Real-time Answers -->
                <app-real-time-answer-list
                  [questionId]="currentQuestion.id"
                  [questionAuthorId]="currentQuestion.userId"
                  [currentUserId]="currentUserId || undefined"
                  [initialAnswers]="convertAnswersForRealTime(currentQuestion.answers || [])"
                  (answerAccepted)="onAnswerAccepted()"
                  (answerShared)="onAnswerShared($event)"
                  (answerEdit)="onAnswerEdit($event)"
                  (retryLoad)="onRetry()">
                </app-real-time-answer-list>
              </div>
            </div>

            <!-- Questions List View (when not viewing a specific question) -->
            <div *ngIf="!currentQuestion && !loading && !error" class="bg-white rounded-lg shadow p-6">
              <div class="text-center py-12">
                <i class="fas fa-question-circle text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Welcome to Q&A</h3>
                <p class="text-gray-500 mb-6">Search for questions, browse categories, or ask a new question.</p>
                <button 
                  routerLink="/community/qa/ask"
                  class="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                  <i class="fas fa-plus mr-2"></i>
                  Ask a Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qa-page {
      min-height: 100vh;
    }

    .prose {
      color: inherit;
    }

    .prose code {
      background-color: #f3f4f6;
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }

    .prose pre {
      background-color: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
    }
  `]
})
export class QAPageComponent implements OnInit, OnDestroy {
  currentQuestion: QuestionDetail | null = null;
  currentUserId: string | null = null;
  loading = false;
  error: string | null = null;
  showAnswerForm = false;

  // Filter states
  selectedCategory: string | null = null;
  selectedTags: string[] = [];
  searchQuery: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private qaSignalRService: QASignalRService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUserId = user?.id || null;
    });

    // Monitor route changes
    combineLatest([
      this.route.params,
      this.route.queryParams
    ]).pipe(
      takeUntil(this.destroy$),
      switchMap(([params, queryParams]) => {
        // Handle different route scenarios
        const questionId = params['id'];
        this.selectedCategory = queryParams['category'] || null;
        this.selectedTags = queryParams['tags'] ? [].concat(queryParams['tags']) : [];
        this.searchQuery = queryParams['search'] || '';

        if (questionId) {
          return this.loadQuestion(questionId);
        } else {
          this.currentQuestion = null;
          return of(null);
        }
      })
    ).subscribe();

    // Setup real-time updates
    this.setupRealTimeUpdates();
  }

  ngOnDestroy(): void {
    // Leave any joined rooms
    if (this.currentQuestion?.id) {
      this.qaSignalRService.leaveQuestion(this.currentQuestion.id);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadQuestion(questionId: string) {
    this.loading = true;
    this.error = null;

    // Join question room for real-time updates
    this.qaSignalRService.joinQuestion(questionId).catch(error => {
      console.error('Failed to join question room:', error);
    });

    // TODO: Replace with actual service call
    // For now, return a mock observable
    return of(null).pipe(
      catchError(error => {
        this.error = error.message || 'Failed to load question';
        this.loading = false;
        return of(null);
      })
    );
  }

  private setupRealTimeUpdates(): void {
    // Listen for question updates
    this.qaSignalRService.questionUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(updatedQuestion => {
        if (updatedQuestion.id === this.currentQuestion?.id) {
          this.currentQuestion = { ...this.currentQuestion, ...updatedQuestion };
        }
      });

    // Listen for new answers
    this.qaSignalRService.answerCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(answer => {
        if (answer.questionId === this.currentQuestion?.id) {
          // Answer count will be updated by the real-time answer list component
          // We just need to update the question's answer count
          if (this.currentQuestion) {
            this.currentQuestion.answerCount = (this.currentQuestion.answerCount || 0) + 1;
          }
        }
      });

    // Listen for answer acceptance
    this.qaSignalRService.answerAccepted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.questionId === this.currentQuestion?.id) {
          if (this.currentQuestion) {
            this.currentQuestion.acceptedAnswerId = event.answerId;
          }
        }
      });
  }

  // Event Handlers
  onSearchPerformed(query: string): void {
    this.router.navigate(['/community/qa'], { 
      queryParams: { search: query, category: this.selectedCategory, tags: this.selectedTags }
    });
  }

  onCategorySelected(category: string): void {
    this.router.navigate(['/community/qa'], { 
      queryParams: { category, search: this.searchQuery, tags: this.selectedTags }
    });
  }

  onTagSelected(tag: string): void {
    const tags = [...this.selectedTags];
    const index = tags.indexOf(tag);
    
    if (index > -1) {
      tags.splice(index, 1);
    } else {
      tags.push(tag);
    }

    this.router.navigate(['/community/qa'], { 
      queryParams: { tags, category: this.selectedCategory, search: this.searchQuery }
    });
  }

  onTagsChanged(tags: string[]): void {
    this.selectedTags = tags;
    this.router.navigate(['/community/qa'], { 
      queryParams: { tags: this.selectedTags, search: this.searchQuery, category: this.selectedCategory }
    });
  }

  onSimilarQuestionSelected(questionId: string): void {
    this.router.navigate(['/community/qa', questionId]);
  }

  toggleAnswerForm(): void {
    this.showAnswerForm = !this.showAnswerForm;
  }

  onAnswerSubmitted(submission: any): void {
    // TODO: Submit answer via service
    console.log('Answer submitted:', submission);
    this.showAnswerForm = false;
    this.toastService.success('Answer posted successfully!', 'Success');
  }

  onAnswerCancelled(): void {
    this.showAnswerForm = false;
  }

  onAnswerAccepted(): void {
    // The real-time updates will handle the UI changes
    this.toastService.success('Answer accepted!', 'Success');
  }

  onAnswerShared(answer: any): void {
    if (navigator.share) {
      navigator.share({
        title: `Answer to: ${this.currentQuestion?.title}`,
        url: `${window.location.href}#answer-${answer.id}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.href}#answer-${answer.id}`);
      this.toastService.success('Answer link copied to clipboard', 'Shared');
    }
  }

  onAnswerEdit(answer: any): void {
    // TODO: Implement answer editing
    console.log('Edit answer:', answer.id);
  }

  onRetry(): void {
    if (this.currentQuestion?.id) {
      this.loadQuestion(this.currentQuestion.id);
    }
  }

  // Question Actions
  shareQuestion(): void {
    if (navigator.share) {
      navigator.share({
        title: this.currentQuestion?.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      this.toastService.success('Question link copied to clipboard', 'Shared');
    }
  }

  editQuestion(): void {
    if (this.currentQuestion?.id) {
      this.router.navigate(['/community/qa', this.currentQuestion.id, 'edit']);
    }
  }

  canEditQuestion(): boolean {
    return this.currentQuestion?.userId === this.currentUserId;
  }

  // Utility Methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
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
}