import { 
  Component, 
  Input, 
  signal, 
  computed, 
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 
  | 'text' 
  | 'circular' 
  | 'rectangular' 
  | 'card' 
  | 'list-item' 
  | 'media-card'
  | 'profile'
  | 'button'
  | 'input';

export interface SkeletonConfig {
  variant: SkeletonVariant;
  width?: string;
  height?: string;
  count?: number;
  animation?: 'pulse' | 'wave' | 'none';
  aspectRatio?: string;
  borderRadius?: string;
}

/**
 * Enhanced Skeleton Loader Component
 * 
 * Provides comprehensive skeleton loading states to prevent CLS:
 * - Multiple skeleton variants for different content types
 * - Proper sizing to match actual content dimensions
 * - Smooth animations with reduced motion support
 * - Responsive design with aspect ratio preservation
 * - Accessibility features for screen readers
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="skeleton-wrapper"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="true"
      role="status">
      
      @switch (config.variant) {
        @case ('text') {
          @for (item of items(); track $index) {
            <div 
              class="skeleton-element skeleton-text"
              [class]="skeletonClasses()"
              [style.width]="getItemWidth($index)"
              [style.height]="config.height || '1rem'"
              [style.margin-bottom]="$index < items().length - 1 ? '0.5rem' : '0'">
            </div>
          }
        }
        
        @case ('circular') {
          <div 
            class="skeleton-element skeleton-circular"
            [class]="skeletonClasses()"
            [style.width]="config.width || '3rem'"
            [style.height]="config.height || config.width || '3rem'">
          </div>
        }
        
        @case ('rectangular') {
          <div 
            class="skeleton-element skeleton-rectangular"
            [class]="skeletonClasses()"
            [style.width]="config.width || '100%'"
            [style.height]="config.height || '8rem'"
            [style.aspect-ratio]="config.aspectRatio || 'auto'"
            [style.border-radius]="config.borderRadius || '0.375rem'">
          </div>
        }
        
        @case ('card') {
          <div class="skeleton-card" [class]="skeletonClasses()">
            <!-- Card Image -->
            <div 
              class="skeleton-element skeleton-card-image"
              [style.height]="config.height || '12rem'"
              [style.aspect-ratio]="config.aspectRatio || '16/9'">
            </div>
            
            <!-- Card Content -->
            <div class="skeleton-card-content">
              <!-- Title -->
              <div 
                class="skeleton-element skeleton-text"
                style="width: 75%; height: 1.25rem; margin-bottom: 0.75rem;">
              </div>
              
              <!-- Description lines -->
              <div 
                class="skeleton-element skeleton-text"
                style="width: 100%; height: 1rem; margin-bottom: 0.5rem;">
              </div>
              <div 
                class="skeleton-element skeleton-text"
                style="width: 85%; height: 1rem; margin-bottom: 0.75rem;">
              </div>
              
              <!-- Action area -->
              <div class="skeleton-card-actions">
                <div 
                  class="skeleton-element skeleton-button"
                  style="width: 5rem; height: 2rem;">
                </div>
                <div 
                  class="skeleton-element skeleton-button"
                  style="width: 4rem; height: 2rem;">
                </div>
              </div>
            </div>
          </div>
        }
        
        @case ('list-item') {
          @for (item of items(); track $index) {
            <div class="skeleton-list-item" [class]="skeletonClasses()">
              <!-- Avatar -->
              <div 
                class="skeleton-element skeleton-circular skeleton-avatar"
                style="width: 2.5rem; height: 2.5rem;">
              </div>
              
              <!-- Content -->
              <div class="skeleton-list-content">
                <div 
                  class="skeleton-element skeleton-text"
                  style="width: 60%; height: 1rem; margin-bottom: 0.5rem;">
                </div>
                <div 
                  class="skeleton-element skeleton-text"
                  style="width: 85%; height: 0.875rem;">
                </div>
              </div>
              
              <!-- Action -->
              <div 
                class="skeleton-element skeleton-button"
                style="width: 3rem; height: 1.5rem;">
              </div>
            </div>
          }
        }
        
        @case ('media-card') {
          <div class="skeleton-media-card" [class]="skeletonClasses()">
            <!-- Media thumbnail -->
            <div 
              class="skeleton-element skeleton-media-thumbnail"
              [style.aspect-ratio]="config.aspectRatio || '16/9'">
            </div>
            
            <!-- Media info -->
            <div class="skeleton-media-info">
              <div 
                class="skeleton-element skeleton-text"
                style="width: 90%; height: 1.125rem; margin-bottom: 0.5rem;">
              </div>
              <div 
                class="skeleton-element skeleton-text"
                style="width: 65%; height: 0.875rem; margin-bottom: 0.75rem;">
              </div>
              
              <!-- Media metadata -->
              <div class="skeleton-media-meta">
                <div 
                  class="skeleton-element skeleton-circular"
                  style="width: 1.5rem; height: 1.5rem;">
                </div>
                <div 
                  class="skeleton-element skeleton-text"
                  style="width: 4rem; height: 0.75rem;">
                </div>
                <div 
                  class="skeleton-element skeleton-text"
                  style="width: 3rem; height: 0.75rem;">
                </div>
              </div>
            </div>
          </div>
        }
        
        @case ('profile') {
          <div class="skeleton-profile" [class]="skeletonClasses()">
            <!-- Profile avatar -->
            <div 
              class="skeleton-element skeleton-circular skeleton-profile-avatar"
              style="width: 4rem; height: 4rem;">
            </div>
            
            <!-- Profile info -->
            <div class="skeleton-profile-info">
              <div 
                class="skeleton-element skeleton-text"
                style="width: 8rem; height: 1.25rem; margin-bottom: 0.5rem;">
              </div>
              <div 
                class="skeleton-element skeleton-text"
                style="width: 6rem; height: 1rem; margin-bottom: 0.75rem;">
              </div>
              <div 
                class="skeleton-element skeleton-text"
                style="width: 12rem; height: 0.875rem;">
              </div>
            </div>
          </div>
        }
        
        @case ('button') {
          <div 
            class="skeleton-element skeleton-button"
            [class]="skeletonClasses()"
            [style.width]="config.width || '6rem'"
            [style.height]="config.height || '2.5rem'"
            [style.border-radius]="config.borderRadius || '0.375rem'">
          </div>
        }
        
        @case ('input') {
          <div 
            class="skeleton-element skeleton-input"
            [class]="skeletonClasses()"
            [style.width]="config.width || '100%'"
            [style.height]="config.height || '2.5rem'"
            [style.border-radius]="config.borderRadius || '0.375rem'">
          </div>
        }
      }
      
      <!-- Screen reader text -->
      <span class="sr-only">Loading content...</span>
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      width: 100%;
    }

    .skeleton-element {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      border-radius: 0.25rem;
    }

    /* Animation variants */
    .skeleton-pulse {
      animation: skeletonPulse 1.5s ease-in-out infinite;
    }

    .skeleton-wave {
      animation: skeletonWave 1.5s linear infinite;
    }

    .skeleton-none {
      animation: none;
      background: #f0f0f0;
    }

    @keyframes skeletonPulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    @keyframes skeletonWave {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    /* Skeleton variants */
    .skeleton-text {
      border-radius: 0.25rem;
    }

    .skeleton-circular {
      border-radius: 50%;
    }

    .skeleton-rectangular {
      border-radius: 0.375rem;
    }

    .skeleton-button {
      border-radius: 0.375rem;
    }

    .skeleton-input {
      border-radius: 0.375rem;
      border: 1px solid #e5e7eb;
    }

    /* Card skeleton */
    .skeleton-card {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
      background: white;
    }

    .skeleton-card-image {
      width: 100%;
      border-radius: 0;
    }

    .skeleton-card-content {
      padding: 1rem;
    }

    .skeleton-card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    /* List item skeleton */
    .skeleton-list-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .skeleton-list-item:last-child {
      border-bottom: none;
    }

    .skeleton-list-content {
      flex: 1;
    }

    .skeleton-avatar {
      flex-shrink: 0;
    }

    /* Media card skeleton */
    .skeleton-media-card {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background: white;
    }

    .skeleton-media-thumbnail {
      width: 8rem;
      flex-shrink: 0;
      border-radius: 0.375rem;
    }

    .skeleton-media-info {
      flex: 1;
    }

    .skeleton-media-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Profile skeleton */
    .skeleton-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .skeleton-profile-avatar {
      flex-shrink: 0;
    }

    .skeleton-profile-info {
      flex: 1;
    }

    /* Dark mode support */
    .dark .skeleton-element {
      background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
      background-size: 200% 100%;
    }

    .dark .skeleton-none {
      background: #374151;
    }

    .dark .skeleton-card,
    .dark .skeleton-media-card {
      background: #1f2937;
      border-color: #374151;
    }

    .dark .skeleton-list-item {
      border-color: #374151;
    }

    .dark .skeleton-input {
      border-color: #374151;
    }

    /* High contrast mode */
    .high-contrast .skeleton-element {
      background: linear-gradient(90deg, #000 25%, #333 50%, #000 75%);
      background-size: 200% 100%;
    }

    .high-contrast .skeleton-none {
      background: #000;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .skeleton-pulse,
      .skeleton-wave {
        animation: none;
        background: #f0f0f0;
      }

      .dark .skeleton-pulse,
      .dark .skeleton-wave {
        background: #374151;
      }

      .high-contrast .skeleton-pulse,
      .high-contrast .skeleton-wave {
        background: #000;
      }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .skeleton-media-card {
        flex-direction: column;
      }

      .skeleton-media-thumbnail {
        width: 100%;
      }

      .skeleton-profile {
        flex-direction: column;
        text-align: center;
      }

      .skeleton-card-actions {
        flex-direction: column;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonLoaderComponent {
  @Input() config: SkeletonConfig = {
    variant: 'rectangular',
    animation: 'wave',
    count: 1
  };

  @Input() ariaLabel: string = 'Loading content';

  // Computed values
  readonly items = computed(() => {
    const count = this.config.count || 1;
    return Array(count).fill(0).map((_, i) => i);
  });

  readonly skeletonClasses = computed(() => {
    const classes = ['skeleton-element'];
    
    const animation = this.config.animation || 'wave';
    classes.push(`skeleton-${animation}`);
    
    return classes.join(' ');
  });

  /**
   * Get width for text skeleton items with variation
   */
  getItemWidth(index: number): string {
    if (this.config.variant !== 'text') {
      return this.config.width || '100%';
    }

    // Create natural-looking text line widths
    const widths = ['100%', '85%', '92%', '78%', '95%', '88%'];
    const width = widths[index % widths.length];
    
    return this.config.width || width;
  }
}