import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { QASignalRService } from '../../services/qa-signalr.service';
import { TypingIndicatorComponent as SharedTypingIndicatorComponent } from '../../../../../../shared/components/typing-indicator/typing-indicator.component';

import { TypingUser } from '../../models/qa-ui.types';

@Component({
    selector: 'app-qa-typing-indicator', // Changed selector to avoid conflict/ambiguity if needed, or keep generic? app-typing-indicator is the shared one.
    standalone: true,
    imports: [CommonModule, SharedTypingIndicatorComponent],
    template: `
    <div class="typing-indicator" *ngIf="typingUsers.length > 0">
      <app-typing-indicator [message]="getTypingMessage()"></app-typing-indicator>
    </div>
  `
})
export class TypingIndicatorComponent implements OnInit, OnDestroy {
    @Input() questionId!: string;

    typingUsers: TypingUser[] = [];
    private destroy$ = new Subject<void>();

    constructor(private qaSignalRService: QASignalRService) { }

    ngOnInit(): void {
        this.setupTypingIndicators();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupTypingIndicators(): void {
        this.qaSignalRService.userTypingAnswer$
            .pipe(takeUntil(this.destroy$))
            .subscribe(event => {
                if (event.questionId === this.questionId) {
                    this.addTypingUser(event.userId, event.userName);
                }
            });

        this.qaSignalRService.userStoppedTypingAnswer$
            .pipe(takeUntil(this.destroy$))
            .subscribe(event => {
                if (event.questionId === this.questionId) {
                    this.removeTypingUser(event.userId);
                }
            });
    }

    private addTypingUser(userId: string, userName: string): void {
        const existingUser = this.typingUsers.find(u => u.userId === userId);
        if (!existingUser) {
            this.typingUsers.push({
                userId,
                userName,
                isTyping: true
            });
        }
    }

    private removeTypingUser(userId: string): void {
        this.typingUsers = this.typingUsers.filter(u => u.userId !== userId);
    }

    getTypingMessage(): string {
        const count = this.typingUsers.length;
        if (count === 0) return '';

        if (count === 1) {
            return `${this.typingUsers[0].userName} is typing an answer...`;
        } else if (count === 2) {
            return `${this.typingUsers[0].userName} and ${this.typingUsers[1].userName} are typing answers...`;
        } else {
            return `${this.typingUsers[0].userName} and ${count - 1} others are typing answers...`;
        }
    }
}
