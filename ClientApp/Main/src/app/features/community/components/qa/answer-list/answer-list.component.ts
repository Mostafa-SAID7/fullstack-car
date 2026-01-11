import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    VotingComponent,
    ReputationDisplayComponent
  ],
  template: `
    <div class="space-y-6">
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

              <!-- Answer Actions -->
              <div class="flex gap-2">
                <button 
                  *ngIf="!answer.isAccepted && canAcceptAnswer"
                  (click)="acceptAnswer(answer.id)"
                  class="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-green-200 dark:hover:bg-green-900/30 transition-all flex items-center gap-2">
                  <i class="fas fa-check-circle"></i>
                  <span>Accept Answer</span>
                </button>
                
                <button class="px-4 py-2 bg-secondary/50 dark:bg-white/5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-all flex items-center gap-2">
                  <i class="fas fa-edit"></i>
                  <span>Edit</span>
                </button>
                
                <button class="px-4 py-2 bg-secondary/50 dark:bg-white/5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-all flex items-center gap-2">
                  <i class="fas fa-share"></i>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Answers State -->
      <div *ngIf="answers.length === 0" class="py-24 text-center">
        <div class="w-20 h-20 bg-secondary/30 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <i class="fas fa-question-answer text-3xl text-muted-foreground/30"></i>
        </div>
        <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-2">No answers yet</h3>
        <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest">Be the first to answer this question!</p>
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

  @Output() answerVoted = new EventEmitter<string>();
  @Output() answerAccepted = new EventEmitter<string>();

  get sortedAnswers(): Answer[] {
    return [...this.answers].sort((a, b) => {
      // Accepted answer first
      if (a.isAccepted && !b.isAccepted) return -1;
      if (!a.isAccepted && b.isAccepted) return 1;
      
      // Then by vote score
      if (a.voteScore !== b.voteScore) return b.voteScore - a.voteScore;
      
      // Finally by creation date
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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
}