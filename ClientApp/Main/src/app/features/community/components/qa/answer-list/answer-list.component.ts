import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Shared Components (reusing existing UI)
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from '../../../../../shared/components/error-display/error-display.component';
import { FormButtonComponent } from '../../../../../shared/components/form-button/form-button.component';

// QA Types
import { Answer } from '../../../../../shared/types/qa-api.types';

// QA Components
import { VotingComponent } from '../voting/voting.component';
import { ReputationDisplayComponent } from '../reputation-display/reputation-display.component';

@Component({
  selector: 'app-answer-list',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ErrorDisplayComponent,
    FormButtonComponent,
    VotingComponent,
    ReputationDisplayComponent
  ],
  template: `
    <!-- Loading State (reusing LoadingSpinnerComponent) -->
    <app-loading-spinner
      *ngIf="loading"
      [overlay]="true"
      size="md"
      text="Loading answers...">
    </app-loading-spinner>

    <!-- Error State (reusing ErrorDisplayComponent) -->
    <app-error-display
      *ngIf="error && !loading"
      type="server"
      [title]="'Failed to Load Answers'"
      [message]="error"
      [showRetry]="true"
      [showHome]="false"
      size="md"
      (retry)="onRetry()">
    </app-error-display>

    <!-- Answers List -->
    <div *ngIf="!loading && !error" class="space-y-6">
      <!-- Answers Header -->
      <div *ngIf="answers.length > 0" class="flex items-center justify-between">
        <h3 class="text-lg font-black text-foreground uppercase tracking-widest">
          {{ answers.length }} {{ answers.length === 1 ? 'Answer' : 'Answers' }}
        </h3>
        <div class="flex gap-2">
          <app-form-button
            variant="ghost"
            size="sm"
            (clicked)="sortBy('votes')">
            <i class="fas fa-sort-amount-down mr-2"></i>
            Sort by Votes
          </app-form-button>
          <app-form-button
            variant="ghost"
            size="sm"
            (clicked)="sortBy('date')">
            <i class="fas fa-clock mr-2"></i>
            Sort by Date
          </app-form-button>
        </div>
      </div>

      <!-- Individual Answers -->
      <div *ngFor="let answer of sortedAnswers; trackBy: trackByAnswerId" class="bg-secondary/20 dark:bg-white/5 rounded-3xl p-6">
        
        <!-- Answer Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div class="flex items-center gap-4">
            <div *ngIf="answer.isAccepted" class="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <i class="fas fa-check-circle"></i>
              <span>Accepted Answer</span>
            </div>
            <span class="text-muted-foreground font-bold text-sm">#{{ getAnswerNumber(answer) }}</span>
          </div>
          
          <div class="flex items-center gap-4 text-xs text-muted-foreground font-bold">
            <span class="flex items-center gap-1">
              <i class="fas fa-clock"></i>
              {{ formatDate(answer.createdAt) }}
            </span>
            <span *ngIf="answer.isEdited" class="flex items-center gap-1">
              <i class="fas fa-edit"></i>
              Edited
            </span>
          </div>
        </div>

        <!-- Answer Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
          
          <!-- Voting Sidebar -->
          <div class="flex lg:flex-col items-center lg:items-start">
            <app-voting
              [contentId]="answer.id"
              contentType="Answer"
              [voteScore]="answer.voteScore"
              [upvotesCount]="answer.upvotesCount"
              [downvotesCount]="answer.downvotesCount"
              [userVote]="answer.userVote"
              (voted)="onAnswerVoted(answer.id)">
            </app-voting>
          </div>

          <!-- Answer Body -->
          <div class="space-y-6">
            <!-- Answer Content -->
            <div class="prose prose-lg max-w-none text-foreground" [innerHTML]="answer.content"></div>

            <!-- Answer Footer -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-border/50">
              
              <!-- Author Info -->
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-primary text-sm"></i>
                </div>
                <div>
                  <div class="font-bold text-foreground">{{ answer.userName }}</div>
                  <app-reputation-display 
                    [reputation]="answer.userReputation"
                    [compact]="true">
                  </app-reputation-display>
                </div>
                <div class="text-xs text-muted-foreground font-bold">
                  answered {{ formatDate(answer.createdAt) }}
                </div>
              </div>

              <!-- Answer Actions (reusing FormButtonComponent) -->
              <div class="flex gap-2">
                <app-form-button
                  *ngIf="!answer.isAccepted && canAcceptAnswer"
                  variant="success"
                  size="sm"
                  (clicked)="acceptAnswer(answer.id)">
                  <i class="fas fa-check-circle mr-2"></i>
                  Accept Answer
                </app-form-button>
                
                <app-form-button
                  variant="ghost"
                  size="sm"
                  (clicked)="editAnswer(answer.id)">
                  <i class="fas fa-edit mr-2"></i>
                  Edit
                </app-form-button>
                
                <app-form-button
                  variant="ghost"
                  size="sm"
                  (clicked)="shareAnswer(answer.id)">
                  <i class="fas fa-share mr-2"></i>
                  Share
                </app-form-button>

                <app-form-button
                  variant="ghost"
                  size="sm"
                  (clicked)="reportAnswer(answer.id)">
                  <i class="fas fa-flag mr-2"></i>
                  Report
                </app-form-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Answers State (reusing existing empty state pattern) -->
      <div *ngIf="answers.length === 0" class="py-24 text-center">
        <div class="w-20 h-20 bg-secondary/30 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <i class="fas fa-question-circle text-3xl text-muted-foreground/30"></i>
        </div>
        <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-2">No answers yet</h3>
        <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-6">Be the first to answer this question!</p>
        
        <app-form-button
          variant="primary"
          size="md"
          (clicked)="onStartAnswering()">
          <i class="fas fa-edit mr-2"></i>
          Write an Answer
        </app-form-button>
      </div>
    </div>
  `,
  styles: []
})
export class AnswerListComponent {
  @Input() answers: Answer[] = [];
  @Input() questionId!: string;
  @Input() acceptedAnswerId?: string;
  @Input() canAcceptAnswer = false; // Should be true if current user is question author
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() answerVoted = new EventEmitter<string>();
  @Output() answerAccepted = new EventEmitter<string>();
  @Output() answerEdited = new EventEmitter<string>();
  @Output() answerShared = new EventEmitter<string>();
  @Output() answerReported = new EventEmitter<string>();
  @Output() startAnswering = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  private sortOrder: 'votes' | 'date' = 'votes';

  get sortedAnswers(): Answer[] {
    return [...this.answers].sort((a, b) => {
      // Accepted answer first
      if (a.isAccepted && !b.isAccepted) return -1;
      if (!a.isAccepted && b.isAccepted) return 1;
      
      // Then by sort order preference
      if (this.sortOrder === 'votes') {
        // Sort by vote score
        if (a.voteScore !== b.voteScore) return b.voteScore - a.voteScore;
        // Then by creation date
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        // Sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }

  trackByAnswerId(_: number, answer: Answer): string {
    return answer.id;
  }

  getAnswerNumber(answer: Answer): number {
    return this.sortedAnswers.indexOf(answer) + 1;
  }

  isLastAnswer(answer: Answer): boolean {
    return this.sortedAnswers.indexOf(answer) === this.sortedAnswers.length - 1;
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

  onAnswerVoted(answerId: string): void {
    this.answerVoted.emit(answerId);
  }

  acceptAnswer(answerId: string): void {
    this.answerAccepted.emit(answerId);
  }

  sortBy(order: 'votes' | 'date'): void {
    this.sortOrder = order;
  }

  editAnswer(answerId: string): void {
    this.answerEdited.emit(answerId);
  }

  shareAnswer(answerId: string): void {
    this.answerShared.emit(answerId);
  }

  reportAnswer(answerId: string): void {
    this.answerReported.emit(answerId);
  }

  onStartAnswering(): void {
    this.startAnswering.emit();
  }

  onRetry(): void {
    this.retry.emit();
  }
}