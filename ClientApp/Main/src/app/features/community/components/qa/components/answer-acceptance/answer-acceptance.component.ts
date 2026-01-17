import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { UserRole } from '@core/models/auth.model';

export interface AnswerAcceptanceEvent {
  answerId: string;
  questionId: string;
  isAccepted: boolean;
}

@Component({
  selector: 'app-answer-acceptance',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  template: `
    <div class="flex items-center justify-center">
      <button
        (click)="toggleAcceptance()"
        [disabled]="isProcessing"
        [class.opacity-50]="isProcessing"
        [class.bg-green-100]="isAccepted"
        [class.bg-gray-100]="!isAccepted"
        class="group relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 dark:bg-gray-800"
        [title]="getTooltipText()">

        <!-- Loading Spinner -->
        <div *ngIf="isProcessing" class="absolute inset-0 flex items-center justify-center">
          <div class="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Checkmark Icon -->
        <i *ngIf="!isProcessing"
           class="fas fa-check-circle text-xl transition-colors duration-300"
           [class.text-green-600]="isAccepted"
           [class.group-hover:text-green-700]="!isAccepted"
           [class.dark:text-green-400]="isAccepted"
           [class.dark:group-hover:text-green-300]="!isAccepted">
        </i>

        <!-- Acceptance Badge -->
        <div *ngIf="isAccepted"
             class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse">
        </div>
      </button>
    </div>
  `,
  styles: []
})
export class AnswerAcceptanceComponent implements OnInit, OnDestroy {
  @Input() answerId!: string;
  @Input() questionId!: string;
  @Input() isAccepted = false;
  @Input() canAccept = false; // Whether current user can accept this answer
  @Input() questionAuthorId?: string;

  @Output() acceptanceChanged = new EventEmitter<AnswerAcceptanceEvent>();

  isProcessing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    // Check if current user can accept answers for this question
    this.checkAcceptancePermissions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAcceptancePermissions(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser && this.questionAuthorId) {
      this.canAccept = currentUser.id === this.questionAuthorId ||
        currentUser.roles?.includes(UserRole.Admin) ||
        currentUser.roles?.includes(UserRole.Moderator);
    }
  }

  async toggleAcceptance(): Promise<void> {
    if (!this.canAccept || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const newAcceptanceState = !this.isAccepted;

      // Emit the change event
      this.acceptanceChanged.emit({
        answerId: this.answerId,
        questionId: this.questionId,
        isAccepted: newAcceptanceState
      });

      // Update local state optimistically
      this.isAccepted = newAcceptanceState;

      // Show success message
      const messageKey = newAcceptanceState ? 'qa.answerAccepted' : 'qa.answerUnaccepted';
      this.toastService.success(messageKey);

    } catch (error) {
      console.error('Error toggling answer acceptance:', error);
      this.toastService.error('qa.acceptanceError');
    } finally {
      this.isProcessing = false;
    }
  }

  getTooltipText(): string {
    if (!this.canAccept) {
      return 'qa.cannotAcceptAnswer';
    }

    if (this.isAccepted) {
      return 'qa.unacceptAnswer';
    }

    return 'qa.acceptAnswer';
  }
}
