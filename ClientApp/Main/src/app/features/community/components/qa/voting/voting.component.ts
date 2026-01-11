import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="flex flex-col items-center gap-2 p-2">
      <!-- Upvote Button -->
      <button 
        class="w-12 h-12 rounded-full border-2 border-transparent transition-all duration-200 flex items-center justify-center hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
        [class.text-green-500]="userVote === 'Up'"
        [class.bg-green-100]="userVote === 'Up'"
        [class.border-green-500]="userVote === 'Up'"
        [class.text-gray-500]="userVote !== 'Up'"
        [class.hover:text-green-500]="userVote !== 'Up' && !isVoting"
        [class.hover:border-green-500]="userVote !== 'Up' && !isVoting"
        [class.hover:bg-green-50]="userVote !== 'Up' && !isVoting"
        [disabled]="isVoting"
        (click)="vote('Up')"
        title="This question/answer is useful">
        <i class="fas fa-chevron-up text-2xl"></i>
      </button>

      <!-- Vote Score -->
      <div class="text-xl font-bold text-center min-w-8"
           [class.text-green-500]="voteScore > 0"
           [class.text-red-500]="voteScore < 0"
           [class.text-gray-700]="voteScore === 0">
        {{ voteScore }}
      </div>

      <!-- Downvote Button -->
      <button 
        class="w-12 h-12 rounded-full border-2 border-transparent transition-all duration-200 flex items-center justify-center hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
        [class.text-red-500]="userVote === 'Down'"
        [class.bg-red-100]="userVote === 'Down'"
        [class.border-red-500]="userVote === 'Down'"
        [class.text-gray-500]="userVote !== 'Down'"
        [class.hover:text-red-500]="userVote !== 'Down' && !isVoting"
        [class.hover:border-red-500]="userVote !== 'Down' && !isVoting"
        [class.hover:bg-red-50]="userVote !== 'Down' && !isVoting"
        [disabled]="isVoting"
        (click)="vote('Down')"
        title="This question/answer is not useful">
        <i class="fas fa-chevron-down text-2xl"></i>
      </button>

      <!-- Vote Breakdown (optional) -->
      <div *ngIf="showBreakdown" class="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border text-xs">
        <div class="flex items-center gap-1 text-green-600 mb-1">
          <i class="fas fa-thumbs-up"></i>
          <span>{{ upvotesCount }}</span>
        </div>
        <div class="flex items-center gap-1 text-red-600">
          <i class="fas fa-thumbs-down"></i>
          <span>{{ downvotesCount }}</span>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class VotingComponent {
  @Input() contentId!: string;
  @Input() contentType: 'Question' | 'Answer' = 'Question';
  @Input() voteScore = 0;
  @Input() upvotesCount = 0;
  @Input() downvotesCount = 0;
  @Input() userVote?: 'Up' | 'Down';
  @Input() showBreakdown = false;

  @Output() voted = new EventEmitter<{ contentId: string; voteType: 'Up' | 'Down' | null }>();

  isVoting = false;

  vote(voteType: 'Up' | 'Down'): void {
    if (this.isVoting) return;

    this.isVoting = true;

    // If user clicks the same vote type, remove the vote
    const newVoteType = this.userVote === voteType ? null : voteType;

    // Optimistic update
    this.updateVoteOptimistically(newVoteType);

    // Emit the vote event
    this.voted.emit({ contentId: this.contentId, voteType: newVoteType });

    // Reset voting state after a short delay
    setTimeout(() => {
      this.isVoting = false;
    }, 500);
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