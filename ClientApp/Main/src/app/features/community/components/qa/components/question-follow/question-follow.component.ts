import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';

export interface FollowEvent {
  questionId: string;
  isFollowing: boolean;
}

@Component({
  selector: 'app-question-follow',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  template: `
    <button
      (click)="toggleFollow()"
      [disabled]="isProcessing"
      [class.bg-blue-100]="isFollowing"
      [class.text-blue-700]="isFollowing"
      [class.bg-secondary]="!isFollowing"
      [class.text-muted-foreground]="!isFollowing"
      class="group relative px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 dark:bg-gray-800"
      [title]="getTooltipText()">

      <!-- Loading Spinner -->
      <div *ngIf="isProcessing" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>

      <!-- Follow Icon -->
      <i *ngIf="!isProcessing"
         class="fas text-sm"
         [class.fa-bell]="isFollowing"
         [class.fa-bell-o]="!isFollowing">
      </i>

      <!-- Follow Text -->
      <span *ngIf="!isProcessing" class="hidden sm:inline">
        {{ isFollowing ? ('qa.unfollowQuestion' | translate) : ('qa.followQuestion' | translate) }}
      </span>

      <!-- Follow Count (if applicable) -->
      <span *ngIf="followCount > 0 && showCount" class="text-xs opacity-70">
        ({{ followCount }})
      </span>
    </button>
  `,
  styles: []
})
export class QuestionFollowComponent implements OnInit, OnDestroy {
  @Input() questionId!: string;
  @Input() isFollowing = false;
  @Input() followCount = 0;
  @Input() showCount = true;
  @Input() compact = false; // Compact mode for smaller buttons

  @Output() followChanged = new EventEmitter<FollowEvent>();

  isProcessing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    // Component initialization if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async toggleFollow(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    // Check if user is authenticated
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      this.toastService.error('auth.loginRequired');
      return;
    }

    this.isProcessing = true;

    try {
      const newFollowState = !this.isFollowing;

      // Emit the change event
      this.followChanged.emit({
        questionId: this.questionId,
        isFollowing: newFollowState
      });

      // Update local state optimistically
      this.isFollowing = newFollowState;
      this.followCount += newFollowState ? 1 : -1;

      // Show success message
      const messageKey = newFollowState ? 'qa.questionFollowed' : 'qa.questionUnfollowed';
      this.toastService.success(messageKey);

    } catch (error) {
      console.error('Error toggling follow:', error);
      this.toastService.error('qa.followError');
    } finally {
      this.isProcessing = false;
    }
  }

  getTooltipText(): string {
    const action = this.isFollowing ? 'qa.unfollowQuestion' : 'qa.followQuestion';
    if (this.followCount > 0 && this.showCount) {
      return `${action} (${this.followCount} followers)`;
    }
    return action;
  }
}
