import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarRecommendation } from '../../models/ai-agent.models';

export interface ComparisonAction {
  type: 'remove' | 'select' | 'clear';
  recommendation?: CarRecommendation;
}

@Component({
  selector: 'app-recommendation-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendation-comparison.component.html',
  styleUrls: ['./recommendation-comparison.component.scss']
})
export class RecommendationComparisonComponent {
  @Input() recommendations: CarRecommendation[] = [];
  @Input() maxComparisons: number = 3;
  
  @Output() actionClick = new EventEmitter<ComparisonAction>();

  onRemove(recommendation: CarRecommendation): void {
    this.actionClick.emit({
      type: 'remove',
      recommendation
    });
  }

  onSelect(recommendation: CarRecommendation): void {
    this.actionClick.emit({
      type: 'select',
      recommendation
    });
  }

  onClearAll(): void {
    this.actionClick.emit({
      type: 'clear'
    });
  }

  getConfidenceColor(score: number): string {
    if (score >= 0.8) return '#198754';
    if (score >= 0.6) return '#ffc107';
    return '#dc3545';
  }

  getConfidenceLabel(score: number): string {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Good';
    return 'Fair';
  }

  getBestMatch(): CarRecommendation | null {
    if (this.recommendations.length === 0) return null;
    return this.recommendations.reduce((best, current) => 
      current.confidenceScore > best.confidenceScore ? current : best
    );
  }

  isBestMatch(recommendation: CarRecommendation): boolean {
    const best = this.getBestMatch();
    return best?.confidenceScore === recommendation.confidenceScore;
  }

  canAddMore(): boolean {
    return this.recommendations.length < this.maxComparisons;
  }

  getEmptySlots(): number[] {
    const emptyCount = this.maxComparisons - this.recommendations.length;
    return Array(emptyCount).fill(0).map((_, i) => i);
  }
}
