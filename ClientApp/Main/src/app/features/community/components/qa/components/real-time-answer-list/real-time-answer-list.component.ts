import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { QASignalRService } from '../../services/qa-signalr.service';
import { RealTimeVoteDisplayComponent } from '../real-time-vote-display/real-time-vote-display.component';
import { LoadingSpinnerComponent } from '../../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from '../../../../../../shared/components/error-display/error-display.component';
import { FormButtonComponent } from '../../../../../../shared/components/form-button/form-button.component';
import { ToastService } from '../../../../../../core/services/toast.service';
import { Answer } from '../../models/qa-api.types';
import { RealTimeAnswer } from '../../models/qa-ui.types';
import { RelativeTimePipe } from '../../../../../../shared/pipes/relative-time.pipe';

@Component({
    selector: 'app-real-time-answer-list',
    standalone: true,
    imports: [
        CommonModule,
        RealTimeVoteDisplayComponent,
        LoadingSpinnerComponent,
        ErrorDisplayComponent,
        FormButtonComponent,
        RelativeTimePipe
    ],
    templateUrl: './real-time-answer-list.component.html'
})
export class RealTimeAnswerListComponent implements OnInit, OnDestroy {
    @Input() questionId!: string;
    @Input() questionAuthorId?: string;
    @Input() currentUserId?: string | null;
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
    ) { }

    ngOnInit(): void {
        this.answers = [...this.initialAnswers];
        this.setupRealTimeUpdates();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupRealTimeUpdates(): void {
        this.qaSignalRService.answerCreated$
            .pipe(takeUntil(this.destroy$))
            .subscribe(answer => {
                if (answer.questionId === this.questionId) {
                    this.addNewAnswer(answer);
                }
            });

        this.qaSignalRService.answerUpdated$
            .pipe(takeUntil(this.destroy$))
            .subscribe(answer => {
                if (answer.questionId === this.questionId) {
                    this.updateAnswer(answer);
                }
            });

        this.qaSignalRService.answerDeleted$
            .pipe(takeUntil(this.destroy$))
            .subscribe(event => {
                if (event.questionId === this.questionId) {
                    this.removeAnswer(event.answerId);
                }
            });

        this.qaSignalRService.answerAccepted$
            .pipe(takeUntil(this.destroy$))
            .subscribe(event => {
                if (event.questionId === this.questionId) {
                    this.markAnswerAccepted(event.answerId);
                }
            });
    }

    private addNewAnswer(answer: any): void {
        const realTimeAnswer: RealTimeAnswer = {
            ...answer,
            createdAt: new Date(answer.createdAt),
            updatedAt: answer.updatedAt ? new Date(answer.updatedAt) : undefined,
            acceptedAt: answer.acceptedAt ? new Date(answer.acceptedAt) : undefined,
            userVote: answer.userVote || null
        };

        const existingIndex = this.answers.findIndex(a => a.id === realTimeAnswer.id);
        if (existingIndex === -1) {
            this.answers.push(realTimeAnswer);
            this.newAnswerIds.add(realTimeAnswer.id);

            setTimeout(() => {
                this.newAnswerIds.delete(realTimeAnswer.id);
            }, 5000);

            this.toastService.success('New answer posted!', 'Answer Added');
        }
    }

    private updateAnswer(updatedAnswer: any): void {
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
        this.answers = this.answers.map(a => ({ ...a, isAccepted: false }));
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
            if (a.isAccepted && !b.isAccepted) return -1;
            if (!a.isAccepted && b.isAccepted) return 1;
            if (a.voteScore !== b.voteScore) return b.voteScore - a.voteScore;
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
        return name ? name.split(' ').map(part => part.charAt(0)).join('').toUpperCase().substring(0, 2) : '??';
    }

    formatAnswerContent(content: string): string {
        // Basic formatting replacement for now
        if (!content) return '';
        return content
            .replace(/\n/g, '<br>')
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
            .replace(/```([^```]+)```/g, '<pre class="bg-gray-900 text-white p-4 rounded-lg my-2 overflow-x-auto"><code>$1</code></pre>');
    }

    onAcceptAnswer(answer: RealTimeAnswer): void {
        if (this.acceptingAnswer) return;
        this.acceptingAnswer = answer.id;
        // Simulate API call delay for UI feedback
        setTimeout(() => {
            this.answerAccepted.emit(answer); // Parent handles API? Or service? Logic in original was commented out.
            this.acceptingAnswer = null;
        }, 500);
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
