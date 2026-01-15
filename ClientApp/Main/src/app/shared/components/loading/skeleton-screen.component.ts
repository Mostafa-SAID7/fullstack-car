import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass" role="status" aria-label="Loading content">
      <div *ngIf="type === 'text'" class="space-y-3">
        <div *ngFor="let line of lines" class="skeleton-line" [style.width.%]="line"></div>
      </div>
      
      <div *ngIf="type === 'card'" class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="p-4 space-y-3">
          <div class="skeleton-line w-3/4"></div>
          <div class="skeleton-line w-full"></div>
          <div class="skeleton-line w-5/6"></div>
        </div>
      </div>
      
      <div *ngIf="type === 'list'" class="space-y-4">
        <div *ngFor="let item of [1,2,3,4,5]" class="flex items-center space-x-4">
          <div class="skeleton-avatar"></div>
          <div class="flex-1 space-y-2">
            <div class="skeleton-line w-1/4"></div>
            <div class="skeleton-line w-full"></div>
          </div>
        </div>
      </div>
      
      <div *ngIf="type === 'circle'" class="skeleton-circle" [style.width.px]="size" [style.height.px]="size"></div>
      
      <div *ngIf="type === 'rectangle'" class="skeleton-rectangle" [style.width.px]="width" [style.height.px]="height"></div>
    </div>
  `,
  styles: [`
    .skeleton-line {
      height: 1rem;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s ease-in-out infinite;
      border-radius: 0.25rem;
    }
    
    .skeleton-card {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .skeleton-image {
      width: 100%;
      height: 12rem;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s ease-in-out infinite;
    }
    
    .skeleton-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s ease-in-out infinite;
    }
    
    .skeleton-circle {
      border-radius: 50%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s ease-in-out infinite;
    }
    
    .skeleton-rectangle {
      border-radius: 0.25rem;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s ease-in-out infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonScreenComponent {
  @Input() type: 'text' | 'card' | 'list' | 'circle' | 'rectangle' = 'text';
  @Input() lines: number[] = [100, 90, 95];
  @Input() size: number = 48;
  @Input() width: number = 200;
  @Input() height: number = 100;
  @Input() containerClass: string = '';
}
