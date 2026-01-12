import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { QASignalRService } from '../../services/qa-signalr.service';

@Component({
  selector: 'app-real-time-vote-display',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="vote-display flex flex-col items-center space-y-1">
      <!-- Upvote Button -->
      <button 
        class="vote-button upvote"
        [class.voted]="userVote === 'Up'"
        [disabled]="isVoting"
        (click)="onVote('Up')"
        [attr.aria-label]="'Upvote this ' + contentType.toLowerCase()">
        <mat-icon>keyboard_arrow_up</mat-icon>
      </button>

      <!-- Vote Score with Animation -->
      <div class="vote-score" [class.score-changed]="scoreChanged">
        {{ voteScore }}
      </div>

      <!-- Downvote Button -->
      <button 
        class="vote-button downvote"
        [class.voted]="userVote === 'Down'"
        [disabled]="isVoting"
        (click)="onVote('Down')"
        [attr.aria-label]="'Downvote this ' + contentType.toLowerCase()">
        <mat-icon>keyboard_arrow_down</mat-icon>
      </button>

      <!-- Loading Indicator -->
      <div class="loading-indicator" *ngIf="isVoting">
        <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  `,
  styles: [`
    .vote-display {
      min-width: 40px;
      user-select: none;
    }

    .vote-button {
      @apply w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .vote-button:hover:not(:disabled) {
      @apply border-gray-400 shadow-sm;
    }

    .vote-button.upvote.voted {
      @apply border-green-500 bg-green-50 text-green-600;
    }

    .vote-button.downvote.voted {
      @apply border-red-500 bg-red-50 text-red-600;
    }

    .vote-score {
      @apply text-lg font-semibold text-gray-700 min-w-[2rem] text-center transition-all duration-300;
    }

    .vote-score.score-changed {
      @apply scale-110 text-blue-600;
      animation: scoreChange 0.6s ease-out;
    }

    .loading-indicator {
      @apply flex justify-center mt-1;
    }

    @keyframes scoreChange {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
        color: #3b82f6;
      }
      100% {
        transform: scale(1);
      }
    }

    mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class RealTimeVoteDisplayComponent implements OnInit, OnDestroy {
  @Input() contentId!: string;
  @Input() contentType!: 'Question' | 'Answer';
  @Input() initialVoteScore: number = 0;
  @Input() initialUserVote: 'Up' | 'Down' | null = null;

  voteScore: number = 0;
  userVote: 'Up' | 'Down' | null = null;
  isVoting = false;
  scoreChanged = false;

  private destroy$ = new Subject<void>();

  constructor(private qaSignalRService: QASignalRService) {}

  ngOnInit(): void {
    this.voteScore = this.initialVoteScore;
    this.userVote = this.initialUserVote;
    this.setupRealTimeUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupRealTimeUpdates(): void {
    // Listen for real-time vote updates
    this.qaSignalRService.voteCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.contentId === this.contentId && event.contentType === this.contentType) {
          this.updateVoteScore(event.voteScore);
        }
      });

    this.qaSignalRService.voteChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.contentId === this.contentId && event.contentType === this.contentType) {
          this.updateVoteScore(event.voteScore);
        }
      });

    this.qaSignalRService.voteRemoved$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.contentId === this.contentId && event.contentType === this.contentType) {
          this.updateVoteScore(event.voteScore);
        }
      });
  }

  private updateVoteScore(newScore: number): void {
    if (newScore !== this.voteScore) {
      this.voteScore = newScore;
      this.animateScoreChange();
    }
  }

  private animateScoreChange(): void {
    this.scoreChanged = true;
    setTimeout(() => {
      this.scoreChanged = false;
    }, 600);
  }

  async onVote(voteType: 'Up' | 'Down'): Promise<void> {
    if (this.isVoting) return;

    this.isVoting = true;

    try {
      // Optimistic update
      const previousVote = this.userVote;
      const previousScore = this.voteScore;

      if (this.userVote === voteType) {
        // Remove vote if clicking same vote
        this.userVote = null;
        this.voteScore += voteType === 'Up' ? -1 : 1;
      } else {
        // Change vote or add new vote
        const scoreChange = this.calculateScoreChange(previousVote, voteType);
        this.userVote = voteType;
        this.voteScore += scoreChange;
      }

      this.animateScoreChange();

      // TODO: Call actual voting service here
      // await this.votingService.vote(this.contentId, this.contentType, voteType);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      // Revert optimistic update on error
      console.error('Error voting:', error);
      // TODO: Show error message using toast service
    } finally {
      this.isVoting = false;
    }
  }

  private calculateScoreChange(previousVote: 'Up' | 'Down' | null, newVote: 'Up' | 'Down'): number {
    if (previousVote === null) {
      // New vote
      return newVote === 'Up' ? 1 : -1;
    } else if (previousVote === newVote) {
      // Remove existing vote
      return newVote === 'Up' ? -1 : 1;
    } else {
      // Change vote (e.g., from Up to Down or vice versa)
      return newVote === 'Up' ? 2 : -2;
    }
  }
}