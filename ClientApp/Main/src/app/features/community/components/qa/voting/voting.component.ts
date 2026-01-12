import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

// Shared Components (reusing existing UI)
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';

// Services
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="flex flex-col items-center gap-2 p-2 relative">
      <!-- Loading Overlay -->
      <app-loading-spinner
        *ngIf="isVoting"
        [overlay]="true"
        size="sm"
        variant="spinner">
      </app-loading-spinner>

      <!-- Upvote Button -->
      <button 
        class="w-12 h-12 rounded-full border-2 border-transparent transition-all duration-200 flex items-center justify-center hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
        [class.text-green-500]="userVote === 'Up'"
        [class.bg-green-100]="userVote === 'Up'"
        [class.border-green-500]="userVote === 'Up'"
        [class.text-gray-500]="userVote !== 'Up'"
        [disabled]="isVoting || disabled"
        (click)="vote('Up')"
        [title]="getUpvoteTooltip()">
        <i class="fas fa-chevron-up text-2xl"></i>
      </button>

      <!-- Vote Score -->
      <div class="text-xl font-bold text-center min-w-8 px-2 py-1 rounded-lg transition-colors duration-200"
           [class.text-green-500]="voteScore > 0"
           [class.text-red-500]="voteScore < 0"
           [class.text-gray-700]="voteScore === 0">
        {{ formatVoteScore(voteScore) }}
      </div>

      <!-- Downvote Button -->
      <button 
        class="w-12 h-12 rounded-full border-2 border-transparent transition-all duration-200 flex items-center justify-center hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
        [class.text-red-500]="userVote === 'Down'"
        [class.bg-red-100]="userVote === 'Down'"
        [class.border-red-500]="userVote === 'Down'"
        [class.text-gray-500]="userVote !== 'Down'"
        [disabled]="isVoting || disabled"
        (click)="vote('Down')"
        [title]="getDownvoteTooltip()">
        <i class="fas fa-chevron-down text-2xl"></i>
      </button>

      <!-- Vote Breakdown -->
      <div *ngIf="showBreakdown" class="mt-2 p-2 bg-gray-100 rounded-lg border text-xs min-w-16">
        <div class="flex items-center justify-between gap-2 text-green-600 mb-1">
          <i class="fas fa-thumbs-up"></i>
          <span class="font-bold">{{ upvotesCount }}</span>
        </div>
        <div class="flex items-center justify-between gap-2 text-red-600">
          <i class="fas fa-thumbs-down"></i>
          <span class="font-bold">{{ downvotesCount }}</span>
        </div>
      </div>

      <!-- Vote Status -->
      <div *ngIf="showStatus && userVote" class="mt-1 text-xs font-medium text-center">
        <span *ngIf="userVote === 'Up'" class="text-green-600">
          <i class="fas fa-check-circle mr-1"></i>
          Upvoted
        </span>
        <span *ngIf="userVote === 'Down'" class="text-red-600">
          <i class="fas fa-check-circle mr-1"></i>
          Downvoted
        </span>
      </div>
    </div>
  `,
  styles: []
})
export class VotingComponent implements OnInit, OnDestroy {
  @Input() contentId!: string;
  @Input() contentType: 'Question' | 'Answer' = 'Question';
  @Input() voteScore = 0;
  @Input() upvotesCount = 0;
  @Input() downvotesCount = 0;
  @Input() userVote?: 'Up' | 'Down';
  @Input() showBreakdown = false;
  @Input() showStatus = true;
  @Input() disabled = false;

  @Output() voted = new EventEmitter<{ contentId: string; voteType: 'Up' | 'Down' | null }>();

  isVoting = false;
  lastVoteType: 'Up' | 'Down' | null = null;
  recentVoteChange = false;

  private destroy$ = new Subject<void>();

  constructor(
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Clear recent vote change indicator after a delay
    setTimeout(() => {
      this.recentVoteChange = false;
    }, 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  vote(voteType: 'Up' | 'Down'): void {
    if (this.isVoting || this.disabled) return;

    this.isVoting = true;
    this.lastVoteType = voteType;

    // If user clicks the same vote type, remove the vote
    const newVoteType = this.userVote === voteType ? null : voteType;

    // Optimistic update
    this.updateVoteOptimistically(newVoteType);

    // Show feedback
    this.showVoteFeedback(newVoteType);

    // Emit the vote event
    this.voted.emit({ contentId: this.contentId, voteType: newVoteType });

    // Reset voting state after a short delay
    setTimeout(() => {
      this.isVoting = false;
      this.lastVoteType = null;
    }, 500);
  }

  private showVoteFeedback(voteType: 'Up' | 'Down' | null): void {
    let message = '';
    
    if (voteType === 'Up') {
      message = `Upvoted this ${this.contentType.toLowerCase()}`;
    } else if (voteType === 'Down') {
      message = `Downvoted this ${this.contentType.toLowerCase()}`;
    } else {
      message = `Removed vote from this ${this.contentType.toLowerCase()}`;
    }

    // Show toast notification (reusing existing notification system)
    this.toastService.success(message);
    this.recentVoteChange = true;

    // Clear the indicator after a delay
    setTimeout(() => {
      this.recentVoteChange = false;
    }, 3000);
  }

  formatVoteScore(score: number): string {
    if (Math.abs(score) >= 1000) {
      return (score / 1000).toFixed(1) + 'k';
    }
    return score.toString();
  }

  getUpvoteTooltip(): string {
    const baseText = `This ${this.contentType.toLowerCase()} is useful`;
    if (this.userVote === 'Up') {
      return `${baseText} (click to remove upvote)`;
    }
    return baseText;
  }

  getDownvoteTooltip(): string {
    const baseText = `This ${this.contentType.toLowerCase()} is not useful`;
    if (this.userVote === 'Down') {
      return `${baseText} (click to remove downvote)`;
    }
    return baseText;
  }

  getScoreTooltip(): string {
    if (this.showBreakdown) {
      return `${this.upvotesCount} upvotes, ${this.downvotesCount} downvotes`;
    }
    return `Score: ${this.voteScore}`;
  }

  private updateVoteOptimistically(newVoteType: 'Up' | 'Down' | null): void {
    const oldVoteType = this.userVote;

    // Calculate score change
    let scoreChange = 0;
    let upvoteChange = 0;
    let downvoteChange = 0;

    // Remove old vote effect
    if (oldVoteType === 'Up') {
      scoreChange -= 1;
      upvoteChange -= 1;
    } else if (oldVoteType === 'Down') {
      scoreChange += 1;
      downvoteChange -= 1;
    }

    // Add new vote effect
    if (newVoteType === 'Up') {
      scoreChange += 1;
      upvoteChange += 1;
    } else if (newVoteType === 'Down') {
      scoreChange -= 1;
      downvoteChange += 1;
    }

    // Apply changes
    this.voteScore += scoreChange;
    this.upvotesCount += upvoteChange;
    this.downvotesCount += downvoteChange;
    this.userVote = newVoteType || undefined;
  }
}