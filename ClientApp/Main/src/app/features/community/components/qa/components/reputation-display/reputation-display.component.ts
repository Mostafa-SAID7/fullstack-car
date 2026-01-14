import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Types
import { UserReputation } from '../../models/qa-api.types';

@Component({
  selector: 'app-reputation-display',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="flex items-center gap-3" [class.gap-2]="compact" [class.flex-col]="vertical && !compact">
      <!-- Reputation Score (reusing existing design tokens) -->
      <div class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800 transition-colors"
           [class.px-3]="!compact"
           [class.py-1.5]="!compact"
           [title]="getReputationTooltip()">
        <i class="fas fa-star text-sm" [class.text-base]="!compact"></i>
        <span class="text-sm font-bold" [class.text-base]="!compact">{{ formatReputation(reputation) }}</span>
      </div>

      <!-- Badges (if not compact) -->
      <div *ngIf="!compact && displayBadges.length > 0" class="flex gap-1 flex-wrap" [class.justify-center]="vertical">
        <span 
          *ngFor="let badge of displayBadges" 
          class="px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"
          [class]="getBadgeClasses(badge)"
          [title]="getBadgeTooltip(badge)">
          <i class="fas" [class]="getBadgeIcon(badge)"></i>
          {{ badge }}
        </span>
      </div>

      <!-- Reputation Level Indicator -->
      <div *ngIf="!compact && showLevelProgress" class="flex flex-col gap-1 min-w-20" [class.items-center]="vertical">
        <div class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" [class.w-20]="!vertical" [class.w-full]="vertical">
          <div 
            class="h-full transition-all duration-300 rounded-full"
            [style.width.%]="getLevelProgress()"
            [class]="getLevelProgressClasses()">
          </div>
        </div>
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{{ getReputationLevel() }}</span>
      </div>

      <!-- Detailed Stats (if expanded) -->
      <div *ngIf="showDetailedStats && !compact" class="flex gap-4 text-xs text-gray-600 dark:text-gray-400" [class.flex-col]="vertical" [class.items-center]="vertical">
        <div class="flex items-center gap-1" title="Questions asked">
          <i class="fas fa-question-circle"></i>
          <span class="font-medium">{{ userReputation?.questionsAsked || 0 }}</span>
        </div>
        <div class="flex items-center gap-1" title="Answers given">
          <i class="fas fa-comment"></i>
          <span class="font-medium">{{ userReputation?.answersGiven || 0 }}</span>
        </div>
        <div class="flex items-center gap-1" title="Accepted answers">
          <i class="fas fa-check-circle text-green-500"></i>
          <span class="font-medium">{{ userReputation?.acceptedAnswers || 0 }}</span>
        </div>
      </div>

      <!-- Expertise Areas (if available and not compact) -->
      <div *ngIf="!compact && expertiseAreas.length > 0" class="flex flex-wrap gap-1" [class.justify-center]="vertical">
        <span 
          *ngFor="let area of displayExpertiseAreas" 
          class="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
          [title]="'Expert in ' + area">
          {{ area }}
        </span>
        <span 
          *ngIf="expertiseAreas.length > maxExpertiseDisplay"
          class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium"
          [title]="'And ' + (expertiseAreas.length - maxExpertiseDisplay) + ' more areas'">
          +{{ expertiseAreas.length - maxExpertiseDisplay }}
        </span>
      </div>
    </div>
  `,
  styles: []
})
export class ReputationDisplayComponent implements OnInit {
  @Input() reputation = 0;
  @Input() badges: string[] = [];
  @Input() expertiseAreas: string[] = [];
  @Input() userReputation?: UserReputation; // Full user reputation object
  @Input() compact = false;
  @Input() vertical = false;
  @Input() showLevelProgress = true;
  @Input() showDetailedStats = false;
  @Input() maxBadgeDisplay = 3;
  @Input() maxExpertiseDisplay = 2;

  displayBadges: string[] = [];
  displayExpertiseAreas: string[] = [];

  ngOnInit(): void {
    this.updateDisplayArrays();
  }

  private updateDisplayArrays(): void {
    // Use badges from userReputation if available, otherwise use input
    const allBadges = this.userReputation?.badgesEarned || this.badges;
    this.displayBadges = allBadges.slice(0, this.maxBadgeDisplay);

    // Use expertise areas from userReputation if available, otherwise use input
    const allExpertiseAreas = this.userReputation?.expertiseAreas || this.expertiseAreas;
    this.displayExpertiseAreas = allExpertiseAreas.slice(0, this.maxExpertiseDisplay);
  }

  formatReputation(reputation: number): string {
    if (reputation >= 1000000) {
      return (reputation / 1000000).toFixed(1) + 'M';
    } else if (reputation >= 1000) {
      return (reputation / 1000).toFixed(1) + 'k';
    }
    return reputation.toString();
  }

  getReputationTooltip(): string {
    return `Reputation: ${this.reputation.toLocaleString()} points`;
  }

  getReputationLevel(): string {
    if (this.reputation >= 10000) return 'Master';
    if (this.reputation >= 5000) return 'Expert';
    if (this.reputation >= 2000) return 'Advanced';
    if (this.reputation >= 500) return 'Intermediate';
    return 'Beginner';
  }

  getLevelClass(): string {
    const level = this.getReputationLevel().toLowerCase();
    return level;
  }

  getLevelProgress(): number {
    const level = this.getReputationLevel();
    
    switch (level) {
      case 'Beginner':
        return Math.min((this.reputation / 500) * 100, 100);
      case 'Intermediate':
        return Math.min(((this.reputation - 500) / 1500) * 100, 100);
      case 'Advanced':
        return Math.min(((this.reputation - 2000) / 3000) * 100, 100);
      case 'Expert':
        return Math.min(((this.reputation - 5000) / 5000) * 100, 100);
      case 'Master':
        return 100;
      default:
        return 0;
    }
  }

  getBadgeClass(badge: string): string {
    // Determine badge tier based on name
    if (badge.includes('Gold') || badge.includes('Master') || badge.includes('Legend')) {
      return 'gold';
    } else if (badge.includes('Silver') || badge.includes('Expert') || badge.includes('Veteran')) {
      return 'silver';
    } else if (badge.includes('Expert') || badge.includes('Specialist')) {
      return 'expert';
    }
    return 'bronze';
  }

  getBadgeIcon(badge: string): string {
    // Return appropriate icon based on badge type
    if (badge.includes('Answer')) return 'fa-question-circle';
    if (badge.includes('Question')) return 'fa-help-circle';
    if (badge.includes('Vote')) return 'fa-thumbs-up';
    if (badge.includes('Expert')) return 'fa-graduation-cap';
    if (badge.includes('Helpful')) return 'fa-heart';
    if (badge.includes('Popular')) return 'fa-trending-up';
    return 'fa-trophy';
  }

  getBadgeTooltip(badge: string): string {
    // Provide descriptive tooltips for badges
    const tooltips: { [key: string]: string } = {
      'Great Answer': 'Answer scored 25 or more',
      'Good Answer': 'Answer scored 10 or more',
      'Helpful': 'Received 10 helpful votes',
      'Expert': 'Recognized expert in category',
      'Popular Question': 'Question viewed 1000+ times',
      'Notable Question': 'Question viewed 2500+ times',
      'Famous Question': 'Question viewed 10000+ times'
    };
    
    return tooltips[badge] || `Badge: ${badge}`;
  }

  getBadgeClasses(badge: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1';
    const tierClass = this.getBadgeClass(badge);
    
    switch (tierClass) {
      case 'gold':
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300`;
      case 'silver':
        return `${baseClasses} bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300`;
      case 'expert':
        return `${baseClasses} bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300`;
      default: // bronze
        return `${baseClasses} bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300`;
    }
  }

  getLevelProgressClasses(): string {
    const level = this.getReputationLevel().toLowerCase();
    
    switch (level) {
      case 'master':
        return 'bg-yellow-500';
      case 'expert':
        return 'bg-purple-500';
      case 'advanced':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-blue-500';
      default: // beginner
        return 'bg-gray-500';
    }
  }
}