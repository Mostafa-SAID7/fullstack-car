import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group } from '../../../../core/models/group.model';

/**
 * Group Card Component
 * 
 * Displays a group in card format with actions
 */
@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group-card bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <!-- Cover Image -->
      @if (group().coverImage) {
        <div class="relative h-32 bg-gray-200 dark:bg-gray-700">
          <img 
            [src]="group().coverImage" 
            [alt]="group().name"
            class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      } @else {
        <div class="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <i class="fa-solid fa-users text-4xl text-primary/40"></i>
        </div>
      }

      <!-- Content -->
      <div class="p-4">
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <!-- Avatar -->
            @if (group().avatar) {
              <img 
                [src]="group().avatar" 
                [alt]="group().name"
                class="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 -mt-6 relative z-10">
            } @else {
              <div class="w-12 h-12 rounded-full bg-primary/20 border-2 border-white dark:border-gray-800 -mt-6 relative z-10 flex items-center justify-center">
                <span class="text-lg font-medium text-primary">
                  {{ group().name.charAt(0).toUpperCase() }}
                </span>
              </div>
            }

            <!-- Name and Type -->
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {{ group().name }}
              </h3>
              <div class="flex items-center space-x-2">
                <span [class]="getTypeClasses()" class="text-xs px-2 py-1 rounded-full font-medium">
                  {{ getTypeLabel() }}
                </span>
                @if (group().category) {
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ group().category }}
                  </span>
                }
              </div>
            </div>
          </div>

          <!-- More Options -->
          <button
            (click)="onMoreClick()"
            class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>

        <!-- Description -->
        @if (group().description) {
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {{ group().description }}
          </p>
        }

        <!-- Tags -->
        @if (group().tags.length > 0) {
          <div class="flex flex-wrap gap-1 mb-3">
            @for (tag of group().tags.slice(0, 3); track tag) {
              <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                #{{ tag }}
              </span>
            }
            @if (group().tags.length > 3) {
              <span class="text-xs text-gray-500 dark:text-gray-400">
                +{{ group().tags.length - 3 }} more
              </span>
            }
          </div>
        }

        <!-- Stats -->
        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-1">
              <i class="fa-solid fa-users"></i>
              <span>{{ formatNumber(group().memberCount) }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <i class="fa-solid fa-comment"></i>
              <span>{{ formatNumber(group().postCount) }}</span>
            </div>
          </div>
          <div class="text-xs">
            {{ formatDate(group().updatedAt) }}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-2">
          @if (showJoinButton()) {
            <button
              (click)="onJoinClick()"
              class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              <i class="fa-solid fa-plus mr-2"></i>
              Join Group
            </button>
          }

          @if (showManageButton()) {
            <button
              (click)="onManageClick()"
              class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
              <i class="fa-solid fa-cog mr-2"></i>
              Manage
            </button>
          }

          <!-- Share Button -->
          <button
            (click)="onShareClick()"
            class="px-3 py-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Share group">
            <i class="fa-solid fa-share"></i>
          </button>
        </div>
      </div>

      <!-- Activity Indicator -->
      @if (isActive()) {
        <div class="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
      }
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class GroupCardComponent {
  // Input properties
  group = input.required<Group>();
  showJoinButton = input<boolean>(true);
  showManageButton = input<boolean>(false);

  // Output events
  joinClick = output<Group>();
  manageClick = output<Group>();
  shareClick = output<Group>();
  moreClick = output<Group>();

  // Computed properties
  readonly isActive = computed(() => {
    const lastActivity = new Date(this.group().updatedAt);
    const now = new Date();
    const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    return diffHours < 24; // Active if updated within 24 hours
  });

  getTypeClasses(): string {
    const type = this.group().type;
    switch (type) {
      case 'public':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'private':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'secret':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getTypeLabel(): string {
    const type = this.group().type;
    switch (type) {
      case 'public':
        return 'Public';
      case 'private':
        return 'Private';
      case 'secret':
        return 'Secret';
      default:
        return 'Unknown';
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  // Event handlers
  onJoinClick(): void {
    this.joinClick.emit(this.group());
  }

  onManageClick(): void {
    this.manageClick.emit(this.group());
  }

  onShareClick(): void {
    this.shareClick.emit(this.group());
  }

  onMoreClick(): void {
    this.moreClick.emit(this.group());
  }
}