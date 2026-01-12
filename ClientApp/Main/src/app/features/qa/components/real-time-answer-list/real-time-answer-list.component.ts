import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { QASignalRService } from '../../services/qa-signalr.service';
import { RealTimeVoteDisplayComponent } from '../real-time-vote-display/real-time-vote-display.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from '../../../../shared/components/error-display/error-display.component';
import { ToastService } from '../../../../core/services/toast.service';
import { Answer as SharedAnswer } from '../../../../shared/types/qa-api.types';

export interface TypingUser {
  userName: string;
  userAvatar?: string;
  content: string;
  voteScore: number;
  isAccepted: boolean;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TypingUser {
  userId: string;
  userName: string;
  startedAt: Date;
}

// Extended Answer interface for real-time features
export interface RealTimeAnswer extends Omit<SharedAnswer, 'createdAt' | 'updatedAt' | 'acceptedAt' | 'userVote'> {
  userAvatar?: string;
  createdAt: Date;
  updatedAt?: Date;
  acceptedAt?: Date;
  userVote?: 'Up' | 'Down' | null;
}

@Component({
  selector: 'app-real-time-answer-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    RealTimeVoteDisplayComponent,
    LoadingSpinnerComponent,
    ErrorDisplayComponent
  ],
  template: `
    <div class="answer-list">
      <!-- Loading State -->
      <app-loading-spinner 
        *ngIf="loading" 
        text="Loading answers..."
        size="md">
      </app-loading-spinner>

      <!-- Error State -->
      <app-error-display
        *ngIf="error && !loading"
        [message]="error"
        type="generic"
        [showRetry]="true"
        (retry)="onRetry()">
      </app-error-display>

      <!-- Answers List -->
      <div class="answers-container" *ngIf="!loading && !error">
        <!-- No Answers State -->
        <div class="no-answers" *ngIf="answers.length === 0">
          <div class="text-center py-8 text-gray-500">
            <mat-icon class="text-4xl mb-2">question_answer</mat-icon>
            <p class="text-lg font-medium">No answers yet</p>
            <p class="text-sm">Be the first to answer this question!</p>
          </div>
        </div>

        <!-- Answer Items -->
        <div class="answer-item" 
             *ngFor="let answer of sortedAnswers; trackBy: trackByAnswerId"
             [class.accepted]="answer.isAccepted"
             [class.new-answer]="isNewAnswer(answer.id)">
          
          <!-- Answer Header -->
          <div class="answer-header">
            <div class="flex items-center space-x-3">
              <!-- User Avatar -->
              <div class="user-avatar">
                <img 
                  *ngIf="answer.userAvatar" 
                  [src]="answer.userAvatar" 
                  [alt]="answer.userName"
                  class="w-8 h-8 rounded-full">
                <div 
                  *ngIf="!answer.userAvatar"
                  class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {{ getInitials(answer.userName) }}
                </div>
              </div>

              <!-- User Info -->
              <div class="user-info">
                <div class="font-medium text-gray-900">{{ answer.userName }}</div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(answer.createdAt) }}
                  <span *ngIf="answer.updatedAt && answer.updatedAt > answer.createdAt">
                    • edited {{ formatDate(answer.updatedAt) }}
                  </span>
                </div>
              </div>

              <!-- Accepted Badge -->
              <div class="accepted-badge" *ngIf="answer.isAccepted">
                <mat-icon class="text-green-600">check_circle</mat-icon>
                <span class="text-sm font-medium text-green-600">Accepted</span>
              </div>
            </div>

            <!-- Answer Actions -->
            <div class="answer-actions">
              <button 
                class="action-button"
                *ngIf="canAcceptAnswer(answer)"
                (click)="onAcceptAnswer(answer)"
                [disabled]="acceptingAnswer === answer.id"
                title="Accept this answer">
                <mat-icon>check</mat-icon>
              </button>

              <button 
                class="action-button"
                (click)="onShareAnswer(answer)"
                title="Share this answer">
                <mat-icon>share</mat-icon>
              </button>

              <button 
                class="action-button"
                *ngIf="canEditAnswer(answer)"
                (click)="onEditAnswer(answer)"
                title="Edit answer">
                <mat-icon>edit</mat-icon>
              </button>
            </div>
          </div>

          <!-- Answer Content -->
          <div class="answer-content">
            <div class="flex space-x-4">
              <!-- Vote Display -->
              <app-real-time-vote-display
                [contentId]="answer.id"
                contentType="Answer"
                [initialVoteScore]="answer.voteScore"
                [initialUserVote]="answer.userVote || null">
              </app-real-time-vote-display>

              <!-- Answer Text -->
              <div class="answer-text flex-1">
                <div class="prose prose-sm max-w-none" [innerHTML]="formatAnswerContent(answer.content)">
                </div>
              </div>
            </div>
          </div>

          <!-- New Answer Indicator -->
          <div class="new-answer-indicator" *ngIf="isNewAnswer(answer.id)">
            <div class="flex items-center space-x-2 text-blue-600 text-sm font-medium">
              <mat-icon class="text-base">fiber_new</mat-icon>
              <span>New answer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .answer-list {
      @apply space-y-4;
    }

    .answers-container {
      @apply space-y-6;
    }

    .answer-item {
      @apply bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300;
    }

    .answer-item:hover {
      @apply shadow-sm border-gray-300;
    }

    .answer-item.accepted {
      @apply border-green-200 bg-green-50/30;
    }

    .answer-item.new-answer {
      @apply border-blue-200 bg-blue-50/30;
      animation: newAnswerPulse 2s ease-out;
    }

    .answer-header {
      @apply flex items-center justify-between mb-4;
    }

    .user-info {
      @apply flex-1;
    }

    .accepted-badge {
      @apply flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full;
    }

    .answer-actions {
      @apply flex items-center space-x-2;
    }

    .action-button {
      @apply p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .action-button:hover:not(:disabled) {
      @apply bg-gray-100;
    }

    .answer-content {
      @apply mb-4;
    }

    .answer-text {
      @apply text-gray-900 leading-relaxed;
    }

    .new-answer-indicator {
      @apply border-t border-blue-200 pt-3 mt-4;
    }

    .no-answers {
      @apply bg-gray-50 rounded-lg;
    }

    @keyframes newAnswerPulse {
      0% {
        background-color: rgba(59, 130, 246, 0.1);
        border-color: rgba(59, 130, 246, 0.3);
      }
      50% {
        background-color: rgba(59, 130, 246, 0.2);
        border-color: rgba(59, 130, 246, 0.5);
      }
      100% {
        background-color: rgba(59, 130, 246, 0.05);
        border-color: rgba(59, 130, 246, 0.2);
      }
    }

    mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .prose {
      @apply text-gray-900;
    }

    .prose code {
      @apply bg-gray-100 px-1 py-0.5 rounded text-sm;
    }

    .prose pre {
      @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto;
    }
  `]
})
export class RealTimeAnswerListComponent implements OnInit, OnDestroy {
  @Input() questionId!: string;
  @Input() questionAuthorId?: string;
  @Input() currentUserId?: string;
  @Input() initialAnswers: RealTimeAnswer[] = [];

  @Output() answerAccepted = new EventEmitter<RealTimeAnswer>();
  @Output() answerShared = new EventEmitter<RealTimeAnswer>();
  @Output() answerEdit = new EventEmitter<RealTimeAnswer>();
  @Output() retryLoad = new EventEmitter<void>();

  answers: RealTimeAnswer[] = [];
  loading = false;
  error: string | null = null;
  acceptingAnswer: string | null = null;
  newAnswerIds = new Set<string>();

  private destroy$ = new Subject<void>();

  constructor(
    private qaSignalRService: QASignalRService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.answers = [...this.initialAnswers];
    this.setupRealTimeUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupRealTimeUpdates(): void {
    // Listen for new answers
    this.qaSignalRService.answerCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(answer => {
        if (answer.questionId === this.questionId) {
          this.addNewAnswer(answer);
        }
      });

    // Listen for answer updates
    this.qaSignalRService.answerUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(answer => {
        if (answer.questionId === this.questionId) {
          this.updateAnswer(answer);
        }
      });

    // Listen for answer deletions
    this.qaSignalRService.answerDeleted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.questionId === this.questionId) {
          this.removeAnswer(event.answerId);
        }
      });

    // Listen for answer acceptance
    this.qaSignalRService.answerAccepted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.questionId === this.questionId) {
          this.markAnswerAccepted(event.answerId);
        }
      });
  }

  private addNewAnswer(answer: SharedAnswer): void {
    // Convert to RealTimeAnswer format
    const realTimeAnswer: RealTimeAnswer = {
      ...answer,
      createdAt: new Date(answer.createdAt),
      updatedAt: answer.updatedAt ? new Date(answer.updatedAt) : undefined,
      acceptedAt: answer.acceptedAt ? new Date(answer.acceptedAt) : undefined,
      userVote: answer.userVote || null
    };

    // Check if answer already exists
    const existingIndex = this.answers.findIndex(a => a.id === realTimeAnswer.id);
    if (existingIndex === -1) {
      this.answers.push(realTimeAnswer);
      this.newAnswerIds.add(realTimeAnswer.id);
      
      // Remove new indicator after 5 seconds
      setTimeout(() => {
        this.newAnswerIds.delete(realTimeAnswer.id);
      }, 5000);

      this.toastService.success('New answer posted!', 'Answer Added');
    }
  }

  private updateAnswer(updatedAnswer: SharedAnswer): void {
    // Convert to RealTimeAnswer format
    const realTimeAnswer: RealTimeAnswer = {
      ...updatedAnswer,
      createdAt: new Date(updatedAnswer.createdAt),
      updatedAt: updatedAnswer.updatedAt ? new Date(updatedAnswer.updatedAt) : undefined,
      acceptedAt: updatedAnswer.acceptedAt ? new Date(updatedAnswer.acceptedAt) : undefined,
      userVote: updatedAnswer.userVote || null
    };

    const index = this.answers.findIndex(a => a.id === realTimeAnswer.id);
    if (index !== -1) {
      this.answers[index] = { ...this.answers[index], ...realTimeAnswer };
    }
  }

  private removeAnswer(answerId: string): void {
    this.answers = this.answers.filter(a => a.id !== answerId);
    this.newAnswerIds.delete(answerId);
  }

  private markAnswerAccepted(answerId: string): void {
    // First, unmark all other answers as accepted
    this.answers = this.answers.map(a => ({ ...a, isAccepted: false }));
    
    // Then mark the specified answer as accepted
    const index = this.answers.findIndex(a => a.id === answerId);
    if (index !== -1) {
      this.answers[index] = { 
        ...this.answers[index], 
        isAccepted: true, 
        acceptedAt: new Date()
      };
      
      this.toastService.success('Answer accepted!', 'Success');
    }
  }

  get sortedAnswers(): RealTimeAnswer[] {
    return [...this.answers].sort((a, b) => {
      // Accepted answers first
      if (a.isAccepted && !b.isAccepted) return -1;
      if (!a.isAccepted && b.isAccepted) return 1;
      
      // Then by vote score (descending)
      if (a.voteScore !== b.voteScore) {
        return b.voteScore - a.voteScore;
      }
      
      // Finally by creation date (ascending - oldest first)
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  trackByAnswerId(index: number, answer: RealTimeAnswer): string {
    return answer.id;
  }

  isNewAnswer(answerId: string): boolean {
    return this.newAnswerIds.has(answerId);
  }

  canAcceptAnswer(answer: RealTimeAnswer): boolean {
    return this.questionAuthorId === this.currentUserId && 
           !answer.isAccepted && 
           answer.userId !== this.currentUserId;
  }

  canEditAnswer(answer: RealTimeAnswer): boolean {
    return answer.userId === this.currentUserId;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(date: Date): string {
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

  formatAnswerContent(content: string): string {
    // Basic HTML formatting - in a real app, use a proper markdown/HTML sanitizer
    return content
      .replace(/\n/g, '<br>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```([^```]+)```/g, '<pre><code>$1</code></pre>');
  }

  async onAcceptAnswer(answer: RealTimeAnswer): Promise<void> {
    if (this.acceptingAnswer) return;

    this.acceptingAnswer = answer.id;
    try {
      // TODO: Call actual API to accept answer
      // await this.answerService.acceptAnswer(answer.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.answerAccepted.emit(answer);
    } catch (error) {
      console.error('Error accepting answer:', error);
      this.toastService.error('Failed to accept answer. Please try again.', 'Error');
    } finally {
      this.acceptingAnswer = null;
    }
  }

  onShareAnswer(answer: RealTimeAnswer): void {
    this.answerShared.emit(answer);
  }

  onEditAnswer(answer: RealTimeAnswer): void {
    this.answerEdit.emit(answer);
  }

  onRetry(): void {
    this.retryLoad.emit();
  }
}