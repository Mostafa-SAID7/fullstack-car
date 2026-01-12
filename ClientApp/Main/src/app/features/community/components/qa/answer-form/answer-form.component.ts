import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Shared Components (reusing existing UI)
import { FormInputComponent } from '../../../../../shared/components/form-input/form-input.component';
import { FormButtonComponent } from '../../../../../shared/components/form-button/form-button.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from '../../../../../shared/components/error-display/error-display.component';

// QA Types
import { CreateAnswerRequest } from '../../../../../shared/types/qa-api.types';

@Component({
  selector: 'app-answer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    FormButtonComponent,
    LoadingSpinnerComponent,
    ErrorDisplayComponent
  ],
  template: `
    <div class="bg-secondary/20 dark:bg-white/5 rounded-3xl p-6">
      <!-- Form Header -->
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <i class="fas fa-edit text-primary"></i>
        </div>
        <div>
          <h3 class="text-lg font-black text-foreground uppercase tracking-widest">Your Answer</h3>
          <p class="text-xs text-muted-foreground font-bold uppercase tracking-widest">Share your knowledge and help the community</p>
        </div>
      </div>

      <!-- Answer Form -->
      <form [formGroup]="answerForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Rich Text Content Area -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
            Answer Content
            <span class="text-red-500">*</span>
          </label>
          
          <!-- Rich Text Editor Toolbar -->
          <div class="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-t-lg border border-gray-300 dark:border-gray-600">
            <button type="button" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm" title="Bold">
              <i class="fas fa-bold"></i>
            </button>
            <button type="button" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm" title="Italic">
              <i class="fas fa-italic"></i>
            </button>
            <button type="button" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm" title="Code">
              <i class="fas fa-code"></i>
            </button>
            <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
            <button type="button" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm" title="Link">
              <i class="fas fa-link"></i>
            </button>
            <button type="button" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm" title="Image">
              <i class="fas fa-image"></i>
            </button>
            <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
            <button type="button" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm" title="Bulleted List">
              <i class="fas fa-list-ul"></i>
            </button>
            <button type="button" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm" title="Numbered List">
              <i class="fas fa-list-ol"></i>
            </button>
          </div>

          <!-- Content Textarea -->
          <textarea
            formControlName="content"
            class="w-full min-h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-b-lg bg-white dark:bg-gray-900 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            placeholder="Write your answer here... You can use Markdown formatting.

Example:
**Bold text**
*Italic text*
\`inline code\`

\`\`\`javascript
// Code block
function example() {
  return 'Hello World';
}
\`\`\`

- Bulleted list item
- Another item

1. Numbered list item
2. Another item

[Link text](https://example.com)"
            [class.border-red-500]="answerForm.get('content')?.invalid && answerForm.get('content')?.touched"
            (input)="onContentChange($event)">
          </textarea>

          <!-- Character Count and Validation -->
          <div class="flex justify-between items-center text-xs">
            <div class="text-muted-foreground">
              <span [class.text-red-500]="contentLength < minContentLength || contentLength > maxContentLength">
                {{ contentLength }}
              </span>
              <span class="text-muted-foreground"> / {{ maxContentLength }} characters</span>
              <span *ngIf="contentLength < minContentLength" class="text-red-500 ml-2">
                (minimum {{ minContentLength }} characters required)
              </span>
            </div>
            <div class="text-muted-foreground">
              Markdown supported
            </div>
          </div>

          <!-- Content Error -->
          <div *ngIf="answerForm.get('content')?.invalid && answerForm.get('content')?.touched" class="text-sm text-red-600">
            <span *ngIf="answerForm.get('content')?.errors?.['required']">Answer content is required</span>
            <span *ngIf="answerForm.get('content')?.errors?.['minlength']">Answer must be at least {{ minContentLength }} characters</span>
            <span *ngIf="answerForm.get('content')?.errors?.['maxlength']">Answer cannot exceed {{ maxContentLength }} characters</span>
          </div>
        </div>

        <!-- Preview Section (if enabled) -->
        <div *ngIf="showPreview" class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-900 dark:text-gray-100">Preview</label>
            <button type="button" (click)="togglePreview()" class="text-xs text-blue-600 hover:text-blue-800">
              Hide Preview
            </button>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <div class="prose prose-sm max-w-none text-foreground" [innerHTML]="previewContent"></div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/50">
          <div class="flex gap-3 flex-1">
            <!-- Submit Button (reusing FormButtonComponent) -->
            <app-form-button
              variant="primary"
              size="md"
              type="submit"
              [loading]="isSubmitting"
              [disabled]="answerForm.invalid || isSubmitting"
              class="flex-1 sm:flex-none">
              <span *ngIf="!isSubmitting">Post Your Answer</span>
              <span *ngIf="isSubmitting">Posting...</span>
            </app-form-button>

            <!-- Preview Toggle Button -->
            <app-form-button
              variant="outline"
              size="md"
              type="button"
              (clicked)="togglePreview()">
              {{ showPreview ? 'Hide' : 'Show' }} Preview
            </app-form-button>
          </div>

          <!-- Secondary Actions -->
          <div class="flex gap-2">
            <app-form-button
              variant="ghost"
              size="md"
              type="button"
              (clicked)="onCancel()">
              Cancel
            </app-form-button>

            <app-form-button
              variant="ghost"
              size="md"
              type="button"
              (clicked)="saveDraft()"
              [disabled]="answerForm.get('content')?.value?.length < 10">
              Save Draft
            </app-form-button>
          </div>
        </div>

        <!-- Form Guidelines -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 class="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <i class="fas fa-lightbulb"></i>
            Tips for a Great Answer
          </h4>
          <ul class="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Be specific and provide detailed explanations</li>
            <li>• Include code examples when relevant</li>
            <li>• Reference reliable sources when possible</li>
            <li>• Use proper formatting to improve readability</li>
            <li>• Stay focused on answering the question asked</li>
          </ul>
        </div>
      </form>

      <!-- Error Display (reusing ErrorDisplayComponent) -->
      <app-error-display
        *ngIf="error"
        type="validation"
        [title]="'Submission Error'"
        [message]="error"
        [showRetry]="true"
        [showHome]="false"
        size="sm"
        (retry)="onSubmit()">
      </app-error-display>

      <!-- Loading Overlay (reusing LoadingSpinnerComponent) -->
      <app-loading-spinner
        *ngIf="isSubmitting"
        [overlay]="true"
        size="md"
        text="Posting your answer...">
      </app-loading-spinner>
    </div>
  `,
  styles: [`
    .prose {
      color: inherit;
    }
    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
      color: inherit;
    }
    .prose code {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-size: 0.875em;
    }
    .prose pre {
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 0.5rem;
      padding: 1rem;
    }
  `]
})
export class AnswerFormComponent implements OnInit, OnDestroy {
  @Input() questionId!: string;
  @Input() placeholder = 'Write your answer here...';
  @Input() minContentLength = 30;
  @Input() maxContentLength = 30000;

  @Output() answerSubmitted = new EventEmitter<CreateAnswerRequest>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() draftSaved = new EventEmitter<string>();

  answerForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  showPreview = false;
  previewContent = '';
  contentLength = 0;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.answerForm = this.fb.group({
      content: ['', [
        Validators.required,
        Validators.minLength(this.minContentLength),
        Validators.maxLength(this.maxContentLength)
      ]]
    });

    // Watch for content changes
    this.answerForm.get('content')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.contentLength = value?.length || 0;
        if (this.showPreview) {
          this.updatePreview(value);
        }
      });
  }

  private setupFormValidation(): void {
    // Additional custom validation can be added here
    this.answerForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Clear error when form becomes valid
        if (this.answerForm.valid && this.error) {
          this.error = null;
        }
      });
  }

  onContentChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.contentLength = target.value.length;
    
    if (this.showPreview) {
      this.updatePreview(target.value);
    }
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
    if (this.showPreview) {
      const content = this.answerForm.get('content')?.value || '';
      this.updatePreview(content);
    }
  }

  private updatePreview(content: string): void {
    // Simple markdown-to-HTML conversion (in a real app, use a proper markdown library)
    this.previewContent = this.convertMarkdownToHtml(content);
  }

  private convertMarkdownToHtml(markdown: string): string {
    if (!markdown) return '';

    let html = markdown
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br>');

    // Code blocks (simplified)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

    // Lists (simplified)
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    return html;
  }

  onSubmit(): void {
    if (this.answerForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const request: CreateAnswerRequest = {
      questionId: this.questionId,
      content: this.answerForm.get('content')?.value.trim()
    };

    // Emit the answer submission event
    this.answerSubmitted.emit(request);

    // Reset form after successful submission (this would typically be handled by parent component)
    setTimeout(() => {
      this.isSubmitting = false;
      // Don't reset form here - let parent component handle success/error
    }, 1000);
  }

  onCancel(): void {
    if (this.answerForm.dirty) {
      const confirmCancel = confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmCancel) {
        return;
      }
    }
    
    this.answerForm.reset();
    this.error = null;
    this.cancelled.emit();
  }

  saveDraft(): void {
    const content = this.answerForm.get('content')?.value?.trim();
    if (content && content.length >= 10) {
      this.draftSaved.emit(content);
      // Show success message (could use toast service)
      console.log('Draft saved successfully');
    }
  }

  // Public methods for parent component to control the form
  setError(error: string): void {
    this.error = error;
    this.isSubmitting = false;
  }

  clearError(): void {
    this.error = null;
  }

  resetForm(): void {
    this.answerForm.reset();
    this.error = null;
    this.isSubmitting = false;
    this.showPreview = false;
    this.previewContent = '';
    this.contentLength = 0;
  }

  setSubmitting(submitting: boolean): void {
    this.isSubmitting = submitting;
  }
}