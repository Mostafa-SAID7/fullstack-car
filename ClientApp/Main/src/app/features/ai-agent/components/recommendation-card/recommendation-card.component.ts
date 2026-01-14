import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarRecommendation } from '../../models/ai-agent.models';

export interface RecommendationAction {
  type: 'view' | 'save' | 'share' | 'compare';
  recommendation: CarRecommendation;
}

@Component({
  selector: 'app-recommendation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.scss']
})
export class RecommendationCardComponent {
  @Input() recommendation!: CarRecommendation;
  @Input() saved: boolean = false;
  @Input() selected: boolean = false;
  @Input() compact: boolean = false;
  
  @Output() actionClick = new EventEmitter<RecommendationAction>();

  onView(): void {
    this.actionClick.emit({
      type: 'view',
      recommendation: this.recommendation
    });
  }

  onSave(): void {
    this.actionClick.emit({
      type: 'save',
      recommendation: this.recommendation
    });
  }

  onShare(): void {
    this.actionClick.emit({
      type: 'share',
      recommendation: this.recommendation
    });
  }

  onCompare(): void {
    this.actionClick.emit({
      type: 'compare',
      recommendation: this.recommendation
    });
  }

  getConfidenceColor(): string {
    const confidence = this.recommendation.confidenceScore;
    if (confidence >= 0.8) return '#198754'; // Green
    if (confidence >= 0.6) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  }

  getConfidenceLabel(): string {
    const confidence = this.recommendation.confidenceScore;
    if (confidence >= 0.8) return 'High Match';
    if (confidence >= 0.6) return 'Good Match';
    return 'Fair Match';
  }

  formatPrice(priceRange?: string): string {
    if (!priceRange) return 'Price not available';
    return priceRange;
  }
}
