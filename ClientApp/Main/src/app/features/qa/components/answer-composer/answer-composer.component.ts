import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { QASignalRService } from '../../services/qa-signalr.service';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ToastService } from '../../../../core/services/toast.service';

export interface AnswerSubmission {
  questionId: string;
  content: string;
}

@Component({
  selector: 'app-answer-composer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    FormInputComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="answer-composer">
      <form [formGroup]="answerForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Rich Text Editor Area -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Your Answer
          </label>
          
          <div class="relative">
            <textarea
              #contentTextarea
              formControlName="content"
              class="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Write your answer here... You can use Markdown formatting."
              (input)="onContentChange()"
              (focus)="onFocusChange(true)"
              (blur)="onFocusChange(false)">
            </textarea>
            
            <!-- Character Count -->
            <div class="absolute bottom-2 right-2 text-xs text-gray-500">
              {{ contentLength }} characters
            </div>
          </div>
          
          <!-- Validation Error -->
          <div *ngIf="answerForm.get('content')?.invalid && answerForm.get('content')?.touched" 
               class="mt-2 text-sm text-red-600">
            <div *ngIf="answerForm.get('content')?.errors?.['required']">
              Answer content is required
            </div>
            <div *ngIf="answerForm.get('content')?.errors?.['minlength']">
              Answer must be at least 10 characters long
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Preview Toggle -->
            <button
              type="button"
              (click)="togglePreview()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {{ showPreview ? 'Edit' : 'Preview' }}
            </button>
            
            <!-- Draft Status -->
            <div *ngIf="isDraft" class="text-sm text-gray-500 flex items-center space-x-1">
              <mat-icon>save</mat-icon>
              <span>Draft saved</span>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Cancel Button -->
            <button
              type="button"
              (click)="onCancel()"
              [disabled]="isSubmitting"
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="answerForm.invalid || isSubmitting"
              class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
              
              <app-loading-spinner 
                *ngIf="isSubmitting" 
                size="sm">
              </app-loading-spinner>
              
              <span>{{ isSubmitting ? 'Posting...' : 'Post Answer' }}</span>
            </button>
          </div>
        </div>
      </form>

      <!-- Preview Mode -->
      <div *ngIf="showPreview" class="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Preview:</h4>
        <div class="prose prose-sm max-w-none" [innerHTML]="previewContent">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .answer-composer {
      @apply bg-white rounded-lg border border-gray-200 p-6;
    }

    .form-group label {
      @apply block text-sm font-medium text-gray-700 mb-2;
    }

    textarea {
      @apply w-full p-4 border border-gray-300 rounded-lg resize-y;
      @apply focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
      @apply transition-colors;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .prose code {
      @apply bg-gray-100 px-1 py-0.5 rounded text-sm;
    }

    .prose pre {
      @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto;
    }
  `]
})
export class AnswerComposerComponent implements OnInit, OnDestroy {
  @Input() questionId!: string;
  @Input() placeholder: string = 'Write your answer here...';
  @Input() minLength: number = 10;
  @Input() maxLength: number = 10000;

  @Output() answerSubmitted = new EventEmitter<AnswerSubmission>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('contentTextarea') contentTextarea!: ElementRef<HTMLTextAreaElement>;

  answerForm: FormGroup;
  isSubmitting = false;
  showPreview = false;
  isDraft = false;
  contentLength = 0;
  previewContent = '';

  private destroy$ = new Subject<void>();
  private typingTimer: any;
  private isTyping = false;
  private readonly TYPING_TIMEOUT = 3000; // 3 seconds

  constructor(
    private fb: FormBuilder,
    private qaSignalRService: QASignalRService,
    private toastService: ToastService
  ) {
    this.answerForm = this.fb.group({
      content: ['', [
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength)
      ]]
    });
  }

  ngOnInit(): void {
    this.setupFormSubscriptions();
    this.loadDraft();
  }

  ngOnDestroy(): void {
    this.stopTypingIndicator();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFormSubscriptions(): void {
    // Monitor content changes for character count and typing indicators
    this.answerForm.get('content')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(content => {
        this.contentLength = content?.length || 0;
        this.saveDraft();
        this.updatePreview();
      });
  }

  onContentChange(): void {
    const content = this.answerForm.get('content')?.value || '';
    this.contentLength = content.length;

    // Handle typing indicators
    if (content.trim().length > 0) {
      this.startTypingIndicator();
    } else {
      this.stopTypingIndicator();
    }
  }

  onFocusChange(focused: boolean): void {
    if (focused) {
      // User started typing
      const content = this.answerForm.get('content')?.value || '';
      if (content.trim().length > 0) {
        this.startTypingIndicator();
      }
    } else {
      // User stopped typing (lost focus)
      this.stopTypingIndicator();
    }
  }

  private async startTypingIndicator(): Promise<void> {
    if (!this.isTyping && this.qaSignalRService.isConnected) {
      try {
        await this.qaSignalRService.startTypingAnswer(this.questionId);
        this.isTyping = true;
        console.log('Started typing indicator for question:', this.questionId);
      } catch (error) {
        console.error('Failed to start typing indicator:', error);
      }
    }

    // Reset the typing timeout
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    this.typingTimer = setTimeout(() => {
      this.stopTypingIndicator();
    }, this.TYPING_TIMEOUT);
  }

  private async stopTypingIndicator(): Promise<void> {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }

    if (this.isTyping && this.qaSignalRService.isConnected) {
      try {
        await this.qaSignalRService.stopTypingAnswer(this.questionId);
        this.isTyping = false;
        console.log('Stopped typing indicator for question:', this.questionId);
      } catch (error) {
        console.error('Failed to stop typing indicator:', error);
      }
    }
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
    if (this.showPreview) {
      this.updatePreview();
    }
  }

  private updatePreview(): void {
    const content = this.answerForm.get('content')?.value || '';
    // Basic markdown-like formatting for preview
    this.previewContent = this.formatContent(content);
  }

  private formatContent(content: string): string {
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```([^```]+)```/g, '<pre><code>$1</code></pre>');
  }

  private saveDraft(): void {
    const content = this.answerForm.get('content')?.value || '';
    if (content.trim().length > 0) {
      localStorage.setItem(`qa-answer-draft-${this.questionId}`, content);
      this.isDraft = true;
      
      // Clear draft status after a delay
      setTimeout(() => {
        this.isDraft = false;
      }, 2000);
    }
  }

  private loadDraft(): void {
    const draft = localStorage.getItem(`qa-answer-draft-${this.questionId}`);
    if (draft) {
      this.answerForm.patchValue({ content: draft });
      this.contentLength = draft.length;
    }
  }

  private clearDraft(): void {
    localStorage.removeItem(`qa-answer-draft-${this.questionId}`);
    this.isDraft = false;
  }

  async onSubmit(): Promise<void> {
    if (this.answerForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    
    // Stop typing indicator before submitting
    await this.stopTypingIndicator();

    try {
      const content = this.answerForm.get('content')?.value?.trim();
      
      if (!content) {
        this.toastService.error('Answer content cannot be empty', 'Validation Error');
        return;
      }

      const submission: AnswerSubmission = {
        questionId: this.questionId,
        content: content
      };

      this.answerSubmitted.emit(submission);
      
      // Clear form and draft on successful submission
      this.answerForm.reset();
      this.clearDraft();
      this.contentLength = 0;
      this.showPreview = false;
      
      this.toastService.success('Answer posted successfully!', 'Success');

    } catch (error) {
      console.error('Error submitting answer:', error);
      this.toastService.error('Failed to post answer. Please try again.', 'Error');
    } finally {
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    // Stop typing indicator
    this.stopTypingIndicator();
    
    // Ask for confirmation if there's content
    const content = this.answerForm.get('content')?.value?.trim();
    if (content && content.length > 0) {
      if (confirm('Are you sure you want to cancel? Your draft will be saved.')) {
        this.cancelled.emit();
      }
    } else {
      this.cancelled.emit();
    }
  }

  // Public methods for parent component integration
  public focus(): void {
    if (this.contentTextarea) {
      this.contentTextarea.nativeElement.focus();
    }
  }

  public clear(): void {
    this.answerForm.reset();
    this.clearDraft();
    this.contentLength = 0;
    this.showPreview = false;
    this.stopTypingIndicator();
  }

  public setContent(content: string): void {
    this.answerForm.patchValue({ content });
    this.contentLength = content.length;
  }

  public getContent(): string {
    return this.answerForm.get('content')?.value || '';
  }
}