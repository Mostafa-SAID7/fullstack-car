import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { QASignalRService } from '../../services/qa-signalr.service';

export interface TypingUser {
  userId: string;
  userName: string;
  isTyping: boolean;
}

@Component({
  selector: 'app-typing-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="typing-indicator" *ngIf="typingUsers.length > 0">
      <div class="flex items-center space-x-2 text-sm text-gray-500 animate-pulse">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
        <span>
          {{ getTypingMessage() }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .typing-indicator {
      padding: 8px 12px;
      border-radius: 8px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      margin: 8px 0;
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-6px);
      }
    }

    .animate-bounce {
      animation: bounce 1.4s infinite;
    }
  `]
})
export class TypingIndicatorComponent implements OnInit, OnDestroy {
  @Input() questionId!: string;

  typingUsers: TypingUser[] = [];
  private destroy$ = new Subject<void>();

  constructor(private qaSignalRService: QASignalRService) {}

  ngOnInit(): void {
    this.setupTypingIndicators();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupTypingIndicators(): void {
    // Listen for typing start events
    this.qaSignalRService.userTypingAnswer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.questionId === this.questionId) {
          this.addTypingUser(event.userId, event.userName);
        }
      });

    // Listen for typing stop events
    this.qaSignalRService.userStoppedTypingAnswer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.questionId === this.questionId) {
          this.removeTypingUser(event.userId);
        }
      });
  }

  private addTypingUser(userId: string, userName: string): void {
    // Don't show typing indicator for current user
    // (This would need to be checked against current user service)
    
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