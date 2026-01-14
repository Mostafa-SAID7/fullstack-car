import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackType } from '../../models/ai-agent.models';

export interface FeedbackEvent {
  messageId: string;
  conversationId: string;
  type: FeedbackType;
}

@Component({
  selector: 'app-feedback-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-buttons.component.html',
  styleUrls: ['./feedback-buttons.component.scss']
})
export class FeedbackButtonsComponent {
  @Input() messageId!: string;
  @Input() conversationId!: string;
  @Input() feedbackGiven?: FeedbackType;
  @Input() compact: boolean = false;
  
  @Output() feedbackClick = new EventEmitter<FeedbackEvent>();
  @Output() correctionClick = new EventEmitter<{ messageId: string; conversationId: string }>();

  FeedbackType = FeedbackType;

  onThumbsUp(): void {
    if (this.feedbackGiven === FeedbackType.POSITIVE) {
      return; // Already given positive feedback
    }
    
    this.feedbackClick.emit({
      messageId: this.messageId,
      conversationId: this.conversationId,
      type: FeedbackType.POSITIVE
    });
  }

  onThumbsDown(): void {
    if (this.feedbackGiven === FeedbackType.NEGATIVE) {
      return; // Already given negative feedback
    }
    
    this.feedbackClick.emit({
      messageId: this.messageId,
      conversationId: this.conversationId,
      type: FeedbackType.NEGATIVE
    });
  }

  onCorrection(): void {
    this.correctionClick.emit({
      messageId: this.messageId,
      conversationId: this.conversationId
    });
  }

  isPositive(): boolean {
    return this.feedbackGiven === FeedbackType.POSITIVE;
  }

  isNegative(): boolean {
    return this.feedbackGiven === FeedbackType.NEGATIVE;
  }

  isCorrection(): boolean {
    return this.feedbackGiven === FeedbackType.CORRECTION;
  }
}
