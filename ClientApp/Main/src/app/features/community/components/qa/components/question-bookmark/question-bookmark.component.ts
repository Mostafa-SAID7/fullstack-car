import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';

export interface BookmarkEvent {
  questionId: string;
  isBookmarked: boolean;
}

@Component({
  selector: 'app-question-bookmark',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  template: `
    <button
      (click)="toggleBookmark()"
      [disabled]="isProcessing"
      [class.bg-yellow-100]="isBookmarked"
      [class.bg-gray-100]="!isBookmarked"
      class="group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 dark:bg-gray-800"
      [title]="getTooltipText()">

      <!-- Loading Spinner -->
      <div *ngIf="isProcessing" class="absolute inset-0 flex items-center justify-center">
        <div class="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Bookmark Icon -->
      <i *ngIf="!isProcessing"
         class="fas text-xl transition-all duration-300"
         [class.fa-bookmark]="isBookmarked"
         [class.fa-bookmark-o]="!isBookmarked"
         [class.text-yellow-600]="isBookmarked"
         [class.group-hover:text-yellow-700]="!isBookmarked"
         [class.dark:text-yellow-400]="isBookmarked"
         [class.dark:group-hover:text-yellow-300]="!isBookmarked">
      </i>

      <!-- Bookmark Badge -->
      <div *ngIf="isBookmarked"
           class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-800">
        <i class="fas fa-check text-white text-xs leading-none"></i>
      </div>
    </button>
  `,
  styles: []
})
export class QuestionBookmarkComponent implements OnInit, OnDestroy {
  @Input() questionId!: string;
  @Input() isBookmarked = false;
  @Input() bookmarkCount = 0;

  @Output() bookmarkChanged = new EventEmitter<BookmarkEvent>();

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

  async toggleBookmark(): Promise<void> {
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
      const newBookmarkState = !this.isBookmarked;

      // Emit the change event
      this.bookmarkChanged.emit({
        questionId: this.questionId,
        isBookmarked: newBookmarkState
      });

      // Update local state optimistically
      this.isBookmarked = newBookmarkState;
      this.bookmarkCount += newBookmarkState ? 1 : -1;

      // Show success message
      const messageKey = newBookmarkState ? 'qa.questionBookmarked' : 'qa.questionUnbookmarked';
      this.toastService.success(messageKey);

    } catch (error) {
      console.error('Error toggling bookmark:', error);
      this.toastService.error('qa.bookmarkError');
    } finally {
      this.isProcessing = false;
    }
  }

  getTooltipText(): string {
    const action = this.isBookmarked ? 'qa.removeBookmark' : 'qa.addBookmark';
    if (this.bookmarkCount > 0) {
      return `${action} (${this.bookmarkCount})`;
    }
    return action;
  }
}
