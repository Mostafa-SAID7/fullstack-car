import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reputation-display',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="flex items-center gap-3" [class.gap-2]="compact">
      <!-- Reputation Score -->
      <div class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800"
           [title]="getReputationTooltip()">
        <i class="fas fa-star text-sm"></i>
        <span class="text-sm font-bold">{{ formatReputation(reputation) }}</span>
      </div>

      <!-- Badges (if not compact) -->
      <div *ngIf="!compact && badges.length > 0" class="flex gap-1 flex-wrap">
        <span 
          *ngFor="let badge of badges" 
          class="px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
          [class]="getBadgeClasses(badge)"
          [title]="getBadgeTooltip(badge)">
          <i class="fas" [class]="getBadgeIcon(badge)"></i>
          {{ badge }}
        </span>
      </div>

      <!-- Reputation Level Indicator -->
      <div *ngIf="!compact" class="flex flex-col gap-1 min-w-20">
        <div class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-300 rounded-full"
            [style.width.%]="getLevelProgress()"
            [class]="getLevelProgressClasses()">
          </div>
        </div>
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{{ getReputationLevel() }}</span>
      </div>
    </div>
  `,
  styles: []
})
export class ReputationDisplayComponent {
  @Input() reputation = 0;
  @Input() badges: string[] = [];
  @Input() compact = false;

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