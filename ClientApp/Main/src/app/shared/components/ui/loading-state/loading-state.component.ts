import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent, SkeletonConfig, SkeletonVariant } from '../skeleton/skeleton-loader.component';

@Component({
    selector: 'app-loading-state',
    standalone: true,
    imports: [CommonModule, SkeletonLoaderComponent],
    template: `
    <div class="loading-state-container" [class]="containerClasses()">
      <app-skeleton-loader 
        [config]="skeletonConfig()"
        [ariaLabel]="'Loading content'">
      </app-skeleton-loader>
    </div>
  `,
    styles: [`
    .loading-state-container {
      width: 100%;
    }
    
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .loading-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `]
})
export class LoadingStateComponent {
    @Input() type: 'grid' | 'list' | 'card' | 'table' = 'grid';
    @Input() count: number = 3;

    readonly containerClasses = computed(() => {
        return {
            'loading-grid': this.type === 'grid' || this.type === 'card',
            'loading-list': this.type === 'list' || this.type === 'table'
        };
    });

    readonly skeletonConfig = computed<SkeletonConfig>(() => {
        let variant: SkeletonVariant = 'rectangular';
        let height = '200px';

        switch (this.type) {
            case 'grid':
            case 'card':
                variant = 'card';
                height = 'auto'; // Let card skeleton handle height
                break;
            case 'list':
                variant = 'list-item';
                height = 'auto';
                break;
            case 'table':
                variant = 'rectangular';
                height = '3rem';
                break;
        }

        return {
            variant,
            count: this.count,
            height,
            animation: 'wave'
        };
    });
}
