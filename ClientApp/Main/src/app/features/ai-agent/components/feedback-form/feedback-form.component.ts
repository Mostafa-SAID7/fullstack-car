import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackType, SubmitFeedbackRequest } from '../../models/ai-agent.models';

export interface FeedbackFormData {
  messageId: string;
  conversationId: string;
  type: FeedbackType;
  rating?: number;
  comment?: string;
  correction?: string;
  query?: string;
}

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {
  @Input() messageId!: string;
  @Input() conversationId!: string;
  @Input() feedbackType!: FeedbackType;
  @Input() originalMessage?: string;
  
  @Output() submitFeedback = new EventEmitter<FeedbackFormData>();
  @Output() cancel = new EventEmitter<void>();

  FeedbackType = FeedbackType;

  // Form fields
  rating: number = 5;
  comment: string = '';
  correction: string = '';
  query: string = '';

  // UI state
  submitting: boolean = false;
  submitted: boolean = false;
  error: string = '';

  // Rating options
  ratingOptions = [
    { value: 5, label: 'Excellent', icon: 'fa-star', color: '#198754' },
    { value: 4, label: 'Good', icon: 'fa-star', color: '#20c997' },
    { value: 3, label: 'Average', icon: 'fa-star-half-alt', color: '#ffc107' },
    { value: 2, label: 'Poor', icon: 'fa-star-half-alt', color: '#fd7e14' },
    { value: 1, label: 'Very Poor', icon: 'fa-star', color: '#dc3545' }
  ];

  ngOnInit(): void {
    // Pre-fill correction with original message if available
    if (this.feedbackType === FeedbackType.CORRECTION && this.originalMessage) {
      this.query = this.originalMessage;
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.submitting = true;
    this.error = '';

    const formData: FeedbackFormData = {
      messageId: this.messageId,
      conversationId: this.conversationId,
      type: this.feedbackType
    };

    // Add type-specific data
    if (this.feedbackType === FeedbackType.POSITIVE) {
      formData.rating = this.rating;
      if (this.comment.trim()) {
        formData.comment = this.comment.trim();
      }
    } else if (this.feedbackType === FeedbackType.NEGATIVE) {
      if (this.comment.trim()) {
        formData.comment = this.comment.trim();
      }
    } else if (this.feedbackType === FeedbackType.CORRECTION) {
      formData.correction = this.correction.trim();
      formData.query = this.query.trim();
    }

    this.submitFeedback.emit(formData);
  }

  validateForm(): boolean {
    this.error = '';

    if (this.feedbackType === FeedbackType.CORRECTION) {
      if (!this.correction.trim()) {
        this.error = 'Please provide a correction';
        return false;
      }
      if (!this.query.trim()) {
        this.error = 'Please provide the original query';
        return false;
      }
    }

    return true;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  selectRating(value: number): void {
    this.rating = value;
  }

  getRatingOption(value: number) {
    return this.ratingOptions.find(opt => opt.value === value) || this.ratingOptions[2];
  }

  getFormTitle(): string {
    switch (this.feedbackType) {
      case FeedbackType.POSITIVE:
        return 'Great! Tell us more';
      case FeedbackType.NEGATIVE:
        return 'Help us improve';
      case FeedbackType.CORRECTION:
        return 'Suggest a correction';
      default:
        return 'Provide feedback';
    }
  }

  getFormDescription(): string {
    switch (this.feedbackType) {
      case FeedbackType.POSITIVE:
        return 'What did you like about this response?';
      case FeedbackType.NEGATIVE:
        return 'What could be improved?';
      case FeedbackType.CORRECTION:
        return 'Help us learn by providing the correct information';
      default:
        return '';
    }
  }

  getSubmitButtonText(): string {
    if (this.submitting) {
      return 'Submitting...';
    }
    return 'Submit Feedback';
  }
}
