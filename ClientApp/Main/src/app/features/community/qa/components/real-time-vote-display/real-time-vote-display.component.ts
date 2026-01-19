import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { QASignalRService } from '../../services/qa-signalr.service';
import { QAVotingService } from '../../services/qa-voting.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
    selector: 'app-real-time-vote-display',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
    <div class="flex flex-col items-center gap-1">
      <button 
        (click)="onVote('Up')" 
        [disabled]="isVoting"
        [class.text-primary]="userVote === 'Up'"
        [class.text-muted-foreground]="userVote !== 'Up'"
        class="p-1 hover:text-primary transition-colors disabled:opacity-50">
        <i class="fas fa-caret-up text-3xl"></i>
      </button>

      <div 
        class="text-lg font-bold min-w-[2ch] text-center transition-all duration-300"
        [class.scale-110]="scoreChanged"
        [class.text-primary]="userVote !== null">
        {{ voteScore }}
      </div>

      <button 
        (click)="onVote('Down')" 
        [disabled]="isVoting"
        [class.text-red-500]="userVote === 'Down'"
        [class.text-muted-foreground]="userVote !== 'Down'"
        class="p-1 hover:text-red-500 transition-colors disabled:opacity-50">
        <i class="fas fa-caret-down text-3xl"></i>
      </button>
    </div>
  `
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

    constructor(
        private qaSignalRService: QASignalRService,
        private votingService: QAVotingService,
        private toastService: ToastService
    ) { }

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
        this.qaSignalRService.voteCreated$
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
        const previousVote = this.userVote;
        const previousScore = this.voteScore;

        try {
            if (this.userVote === voteType) {
                this.userVote = null;
                this.voteScore += voteType === 'Up' ? -1 : 1;
            } else {
                const scoreChange = this.calculateScoreChange(previousVote, voteType);
                this.userVote = voteType;
                this.voteScore += scoreChange;
            }

            this.animateScoreChange();
            const newVoteType = this.userVote;

            this.votingService.vote(this.contentId, this.contentType, newVoteType).subscribe({
                next: (response) => {
                    if (!response.succeeded) {
                        throw new Error(response.message || 'Vote failed');
                    }
                },
                error: (error) => {
                    console.error('Error voting:', error);
                    this.userVote = previousVote;
                    this.voteScore = previousScore;
                    this.toastService.error('Failed to submit vote. Please try again.');
                }
            });

        } catch (error) {
            console.error('Error voting:', error);
            this.userVote = previousVote;
            this.voteScore = previousScore;
            this.toastService.error('Failed to submit vote.');
        } finally {
            this.isVoting = false;
        }
    }

    private calculateScoreChange(previousVote: 'Up' | 'Down' | null, newVote: 'Up' | 'Down'): number {
        if (previousVote === null) {
            return newVote === 'Up' ? 1 : -1;
        } else if (previousVote === newVote) {
            return newVote === 'Up' ? -1 : 1;
        } else {
            return newVote === 'Up' ? 2 : -2;
        }
    }
}
