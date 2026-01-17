import { 
  Component, 
  signal, 
  computed, 
  inject,
  OnInit,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CLSOptimizedLayoutComponent } from '../cls-optimized-layout/cls-optimized-layout.component';
import { CLSOptimizedImageComponent } from '../cls-optimized-image/cls-optimized-image.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { CLSOptimizationDirective } from '../../directives/cls-optimization.directive';
import { CLSMonitoringService } from '../../../core/services/cls-monitoring.service';
import { FontOptimizationService } from '../../../core/services/font-optimization.service';

/**
 * CLS Demo Component
 * 
 * Demonstrates all CLS optimization features:
 * - Skeleton loading states
 * - Proper image sizing
 * - Font loading optimization
 * - Layout shift monitoring
 * - Space reservation techniques
 */
@Component({
  selector: 'app-cls-demo',
  standalone: true,
  imports: [
    CommonModule,
    CLSOptimizedLayoutComponent,
    CLSOptimizedImageComponent,
    SkeletonLoaderComponent,
    CLSOptimizationDirective
  ],
  template: `
    <div class="cls-demo-container p-6 space-y-8">
      <div class="demo-header">
        <h1 class="text-3xl font-bold text-foreground mb-2">
          CLS Optimization Demo
        </h1>
        <p class="text-muted-foreground mb-6">
          Demonstrating Cumulative Layout Shift prevention techniques
        </p>
        
        <!-- CLS Metrics Display -->
        <div class="metrics-card bg-card border border-border rounded-lg p-4 mb-6">
          <h2 class="text-lg font-semibold mb-3">Current CLS Metrics</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="metric">
              <div class="text-2xl font-bold" [class]="getScoreClass()">
                {{ clsMetrics().totalCLS.toFixed(4) }}
              </div>
              <div class="text-sm text-muted-foreground">Total CLS</div>
            </div>
            <div class="metric">
              <div class="text-2xl font-bold text-foreground">
                {{ clsMetrics().shiftCount }}
              </div>
              <div class="text-sm text-muted-foreground">Shifts</div>
            </div>
            <div class="metric">
              <div class="text-2xl font-bold text-foreground">
                {{ clsMetrics().largestShift.toFixed(4) }}
              </div>
              <div class="text-sm text-muted-foreground">Largest</div>
            </div>
            <div class="metric">
              <div class="text-2xl font-bold" [class]="getFontStatusClass()">
                {{ fontsLoaded() ? 'Loaded' : 'Loading' }}
              </div>
              <div class="text-sm text-muted-foreground">Fonts</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Demo Controls -->
      <div class="demo-controls bg-card border border-border rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-3">Demo Controls</h3>
        <div class="flex flex-wrap gap-3">
          <button 
            (click)="toggleLoading()"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            {{ isLoading() ? 'Stop Loading' : 'Start Loading' }}
          </button>
          
          <button 
            (click)="simulateLayoutShift()"
            class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors">
            Simulate Layout Shift
          </button>
          
          <button 
            (click)="resetMetrics()"
            class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
            Reset Metrics
          </button>
          
          <button 
            (click)="toggleImageOptimization()"
            class="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors">
            {{ imageOptimizationEnabled() ? 'Disable' : 'Enable' }} Image Optimization
          </button>
        </div>
      </div>

      <!-- Skeleton Loading Demo -->
      <div class="demo-section">
        <h3 class="text-xl font-semibold mb-4">Skeleton Loading States</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Card Skeleton -->
          <div class="demo-card">
            <h4 class="text-lg font-medium mb-3">Card Skeleton</h4>
            @if (isLoading()) {
              <app-skeleton-loader
                [config]="{
                  variant: 'card',
                  animation: 'wave'
                }">
              </app-skeleton-loader>
            } @else {
              <div class="bg-card border border-border rounded-lg overflow-hidden">
                <div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div class="p-4">
                  <h5 class="text-lg font-semibold mb-2">Sample Card</h5>
                  <p class="text-muted-foreground mb-4">
                    This is a sample card that demonstrates how skeleton loading prevents layout shifts.
                  </p>
                  <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                    Action
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- List Skeleton -->
          <div class="demo-card">
            <h4 class="text-lg font-medium mb-3">List Skeleton</h4>
            @if (isLoading()) {
              <app-skeleton-loader
                [config]="{
                  variant: 'list-item',
                  count: 3,
                  animation: 'pulse'
                }">
              </app-skeleton-loader>
            } @else {
              <div class="space-y-4">
                @for (item of sampleListItems(); track item.id) {
                  <div class="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                    <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {{ item.id }}
                    </div>
                    <div class="flex-1">
                      <div class="font-medium">{{ item.title }}</div>
                      <div class="text-sm text-muted-foreground">{{ item.description }}</div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Media Skeleton -->
          <div class="demo-card">
            <h4 class="text-lg font-medium mb-3">Media Skeleton</h4>
            @if (isLoading()) {
              <app-skeleton-loader
                [config]="{
                  variant: 'media-card',
                  aspectRatio: '16/9',
                  animation: 'wave'
                }">
              </app-skeleton-loader>
            } @else {
              <div class="bg-card border border-border rounded-lg p-4">
                <div class="aspect-video bg-gradient-to-r from-green-500 to-blue-500 rounded-md mb-3"></div>
                <h5 class="text-lg font-semibold mb-2">Sample Video</h5>
                <p class="text-muted-foreground text-sm mb-3">
                  A sample video demonstrating media skeleton loading.
                </p>
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <div class="w-6 h-6 bg-muted rounded-full"></div>
                  <span>Channel Name</span>
                  <span>•</span>
                  <span>1.2M views</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Image Optimization Demo -->
      <div class="demo-section">
        <h3 class="text-xl font-semibold mb-4">Image Optimization</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Optimized Image -->
          <div class="demo-card">
            <h4 class="text-lg font-medium mb-3">CLS Optimized Image</h4>
            @if (imageOptimizationEnabled()) {
              <app-cls-optimized-image
                src="https://picsum.photos/400/300"
                alt="Sample optimized image"
                [width]="400"
                [height]="300"
                [config]="{
                  enableLazyLoading: true,
                  enableWebP: true,
                  enableAVIF: true,
                  enableBlurPlaceholder: true,
                  quality: 80,
                  priority: 'medium',
                  sizes: '(max-width: 768px) 100vw, 400px',
                  objectFit: 'cover'
                }"
                [showImageInfo]="true">
              </app-cls-optimized-image>
            } @else {
              <img 
                src="https://picsum.photos/400/300" 
                alt="Sample unoptimized image"
                class="w-full h-auto rounded-md">
            }
          </div>

          <!-- Regular Image (for comparison) -->
          <div class="demo-card">
            <h4 class="text-lg font-medium mb-3">Regular Image (Comparison)</h4>
            <img 
              src="https://picsum.photos/400/300?random=2" 
              alt="Sample regular image"
              class="w-full h-auto rounded-md"
              [style.display]="isLoading() ? 'none' : 'block'">
            @if (isLoading()) {
              <div class="w-full h-48 bg-muted animate-pulse rounded-md"></div>
            }
          </div>
        </div>
      </div>

      <!-- CLS Optimized Layout Demo -->
      <div class="demo-section">
        <h3 class="text-xl font-semibold mb-4">CLS Optimized Layout</h3>
        
        <app-cls-optimized-layout
          [config]="{
            enableSkeletonLoading: true,
            enableImageSizing: true,
            enableFontOptimization: true,
            skeletonDuration: 2000,
            reserveSpace: true,
            minHeight: '300px',
            aspectRatio: '16/9'
          }"
          [isLoading]="isLoading"
          [showMetrics]="true"
          (layoutShift)="onLayoutShift($event)"
          (loadingComplete)="onLoadingComplete()">>
          
          <div class="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg h-full flex items-center justify-center">
            <div class="text-center">
              <h4 class="text-2xl font-bold mb-2">CLS Optimized Content</h4>
              <p class="text-purple-100">
                This content is loaded with proper space reservation and skeleton states
                to prevent Cumulative Layout Shift.
              </p>
            </div>
          </div>
        </app-cls-optimized-layout>
      </div>

      <!-- Directive Demo -->
      <div class="demo-section">
        <h3 class="text-xl font-semibold mb-4">CLS Optimization Directive</h3>
        
        <div 
          clsOptimization
          [clsConfig]="{
            reserveSpace: true,
            minHeight: '200px',
            enableSkeleton: true,
            skeletonDuration: 1500,
            monitorShifts: true,
            preventFontShifts: true,
            enableImageSizing: true
          }"
          [isLoading]="isLoading"
          class="bg-card border border-border rounded-lg p-6">
          
          <h4 class="text-lg font-semibold mb-3">Content with CLS Directive</h4>
          <p class="text-muted-foreground mb-4">
            This content uses the CLS optimization directive to automatically apply
            all optimization techniques.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div class="h-4 bg-muted rounded"></div>
              <div class="h-4 bg-muted rounded w-3/4"></div>
              <div class="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div class="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
          </div>
        </div>
      </div>

      <!-- Best Practices -->
      <div class="demo-section">
        <h3 class="text-xl font-semibold mb-4">CLS Optimization Best Practices</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-card border border-border rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-600 mb-3">✅ Good Practices</h4>
            <ul class="space-y-2 text-sm">
              <li>• Always specify image dimensions</li>
              <li>• Use skeleton loading states</li>
              <li>• Reserve space for dynamic content</li>
              <li>• Optimize font loading with font-display: swap</li>
              <li>• Use aspect-ratio for responsive images</li>
              <li>• Preload critical fonts</li>
              <li>• Monitor CLS scores in development</li>
            </ul>
          </div>
          
          <div class="bg-card border border-border rounded-lg p-6">
            <h4 class="text-lg font-semibold text-red-600 mb-3">❌ Avoid These</h4>
            <ul class="space-y-2 text-sm">
              <li>• Images without dimensions</li>
              <li>• Inserting content above existing content</li>
              <li>• Web fonts without fallbacks</li>
              <li>• Dynamic content without space reservation</li>
              <li>• Animations that change layout</li>
              <li>• Loading content that pushes other content down</li>
              <li>• Ignoring CLS metrics in production</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cls-demo-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .demo-section {
      margin-bottom: 2rem;
    }

    .demo-card {
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .metric {
      text-align: center;
    }

    .score-good {
      color: #10b981;
    }

    .score-needs-improvement {
      color: #f59e0b;
    }

    .score-poor {
      color: #ef4444;
    }

    .font-loaded {
      color: #10b981;
    }

    .font-loading {
      color: #f59e0b;
    }

    /* Demo-specific animations */
    .layout-shift-demo {
      transition: all 0.3s ease-in-out;
    }

    .layout-shift-demo.shifted {
      transform: translateY(20px);
      margin-top: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CLSDemoComponent implements OnInit {
  private clsMonitoring = inject(CLSMonitoringService);
  private fontOptimization = inject(FontOptimizationService);

  // Signals for reactive state
  isLoading = signal<boolean>(false);
  imageOptimizationEnabled = signal<boolean>(true);
  clsMetrics = signal(this.clsMonitoring.getCurrentMetrics());
  fontsLoaded = signal<boolean>(false);

  // Sample data
  sampleListItems = signal([
    { id: 1, title: 'First Item', description: 'Description for the first item' },
    { id: 2, title: 'Second Item', description: 'Description for the second item' },
    { id: 3, title: 'Third Item', description: 'Description for the third item' }
  ]);

  // Computed values
  getScoreClass = computed(() => {
    const score = this.clsMetrics().totalCLS;
    if (score <= 0.1) return 'score-good';
    if (score <= 0.25) return 'score-needs-improvement';
    return 'score-poor';
  });

  getFontStatusClass = computed(() => {
    return this.fontsLoaded() ? 'font-loaded' : 'font-loading';
  });

  ngOnInit(): void {
    // Subscribe to CLS metrics
    this.clsMonitoring.getMetricsObservable().subscribe(metrics => {
      this.clsMetrics.set(metrics);
    });

    // Subscribe to font loading
    this.fontOptimization.getFontLoadingObservable().subscribe(loaded => {
      this.fontsLoaded.set(loaded);
    });

    // Auto-cycle loading state for demo
    this.startLoadingCycle();
  }

  /**
   * Toggle loading state
   */
  toggleLoading(): void {
    this.isLoading.update(loading => !loading);
  }

  /**
   * Simulate a layout shift for demonstration
   */
  simulateLayoutShift(): void {
    // Create a temporary element that causes layout shift
    const element = document.createElement('div');
    element.style.height = '50px';
    element.style.backgroundColor = '#ef4444';
    element.style.margin = '10px 0';
    element.style.borderRadius = '0.375rem';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.color = 'white';
    element.style.fontWeight = 'bold';
    element.textContent = 'Simulated Layout Shift';

    // Insert at the top of the demo container
    const container = document.querySelector('.cls-demo-container');
    if (container && container.firstChild) {
      container.insertBefore(element, container.firstChild);
    }

    // Remove after 3 seconds
    setTimeout(() => {
      element.remove();
    }, 3000);
  }

  /**
   * Reset CLS metrics
   */
  resetMetrics(): void {
    this.clsMonitoring.resetMetrics();
  }

  /**
   * Toggle image optimization
   */
  toggleImageOptimization(): void {
    this.imageOptimizationEnabled.update(enabled => !enabled);
  }

  /**
   * Handle layout shift events
   */
  onLayoutShift(metrics: any): void {
    console.log('Layout shift detected:', metrics);
  }

  /**
   * Handle loading completion
   */
  onLoadingComplete(): void {
    console.log('Loading completed');
  }

  /**
   * Start automatic loading cycle for demo
   */
  private startLoadingCycle(): void {
    setInterval(() => {
      this.isLoading.set(true);
      
      setTimeout(() => {
        this.isLoading.set(false);
      }, 2000);
    }, 8000);
  }
}