import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

// Shared Components (reusing existing UI)
import { FormButtonComponent } from '../../../../../../shared/components/form-button/form-button.component';
import { LoadingSpinnerComponent } from '../../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from '../../../../../../shared/components/error-display/error-display.component';

// QA Types
import { CreateAnswerRequest } from '../../models/qa-api.types';

@Component({
  selector: 'app-answer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FormButtonComponent,
    LoadingSpinnerComponent,
    ErrorDisplayComponent
  ],
  templateUrl: './answer-form.component.html'
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

  constructor(private fb: FormBuilder) { }

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