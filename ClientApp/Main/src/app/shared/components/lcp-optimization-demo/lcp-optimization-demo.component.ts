import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LCPOptimizationService } from '../../../core/services/lcp-optimization.service';
import { RenderBlockingOptimizerService } from '../../../core/services/render-blocking-optimizer.service';
import { ResourcePreloadingService } from '../../../core/services/resource-preloading.service';

/**
 * LCP Optimization Demo Component
 * 
 * Demonstrates Largest Contentful Paint optimization techniques:
 * - Critical resource preloading
 * - Render-blocking resource optimization
 * - Resource prioritization
 * - Performance monitoring
 */
@Component({
  selector: 'app-lcp-optimization-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lcp-optimization-demo p-6 max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-center">⚡ LCP Optimization Demo</h2>
      
      <!-- LCP Metrics Overview -->
      <div class="lcp-metrics-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">📊 LCP Performance Metrics</h3>
        
        <div class="metrics-grid grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="metric-card bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold" [class]="getLCPRatingClass(currentLCP()?.rating)">
              {{ currentLCP()?.value ? (currentLCP()!.value / 1000).toFixed(2) + 's' : 'N/A' }}
            </div>
            <div class="text-sm text-gray-600 mt-2">Current LCP</div>
            @if (currentLCP()?.rating) {
              <div class="text-xs mt-1 px-2 py-1 rounded-full inline-block"
                   [class]="getLCPBadgeClass(currentLCP()!.rating)">
                {{ currentLCP()!.rating.replace('-', ' ').toUpperCase() }}
              </div>
            }
          </div>
          
          <div class="metric-card bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-green-600">
              {{ (averageLCP() / 1000).toFixed(2) }}s
            </div>
            <div class="text-sm text-green-800 mt-2">Average LCP</div>
          </div>
          
          <div class="metric-card bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-purple-600">{{ lcpImprovement().improvement }}%</div>
            <div class="text-sm text-purple-800 mt-2">Improvement</div>
            <div class="text-xs mt-1 px-2 py-1 rounded-full inline-block"
                 [class]="getTrendClass(lcpImprovement().trend)">
              {{ lcpImprovement().trend.toUpperCase() }}
            </div>
          </div>
          
          <div class="metric-card bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-orange-600">{{ renderBlockingCount() }}</div>
            <div class="text-sm text-orange-800 mt-2">Blocking Resources</div>
          </div>
        </div>

        <!-- LCP Element Information -->
        @if (currentLCP()?.element) {
          <div class="lcp-element-info bg-white border border-gray-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold mb-4">🎯 LCP Element Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="font-medium">Element Type:</span>
                <span class="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">
                  {{ currentLCP()!.element!.tagName.toLowerCase() }}
                </span>
              </div>
              <div>
                <span class="font-medium">Load Time:</span>
                <span class="ml-2">{{ (currentLCP()!.value / 1000).toFixed(2) }}s</span>
              </div>
              @if (currentLCP()?.url) {
                <div class="md:col-span-2">
                  <span class="font-medium">Resource URL:</span>
                  <span class="ml-2 text-sm text-blue-600 break-all">{{ currentLCP()!.url }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Critical Resources -->
      <div class="critical-resources-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">🚀 Critical Resource Management</h3>
        
        <div class="resources-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Preloaded Resources -->
          <div class="preloaded-resources bg-white border border-gray-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold mb-4">📥 Preloaded Resources</h4>
            @if (preloadedResources().length > 0) {
              <div class="space-y-3">
                @for (resource of preloadedResources(); track resource.href) {
                  <div class="resource-item flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div class="flex-1">
                      <div class="font-medium text-sm">{{ getResourceName(resource.href) }}</div>
                      <div class="text-xs text-gray-600">{{ resource.as }} • {{ resource.fetchpriority || 'auto' }}</div>
                    </div>
                    <div class="resource-type px-2 py-1 text-xs rounded"
                         [class]="getResourceTypeClass(resource.as)">
                      {{ resource.as.toUpperCase() }}
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center text-gray-500 py-8">
                No resources preloaded yet
              </div>
            }
          </div>

          <!-- Render Blocking Resources -->
          <div class="blocking-resources bg-white border border-gray-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold mb-4">🚫 Render Blocking Resources</h4>
            @if (renderBlockingResources().length > 0) {
              <div class="space-y-3">
                @for (resource of renderBlockingResources(); track resource.url) {
                  <div class="resource-item flex items-center justify-between p-3 rounded"
                       [class]="resource.blocking ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'">
                    <div class="flex-1">
                      <div class="font-medium text-sm">{{ getResourceName(resource.url) }}</div>
                      <div class="text-xs" [class]="resource.blocking ? 'text-red-600' : 'text-green-600'">
                        {{ resource.type }} • {{ resource.blocking ? 'Blocking' : 'Non-blocking' }}
                      </div>
                    </div>
                    <div class="status-indicator w-3 h-3 rounded-full"
                         [class]="resource.blocking ? 'bg-red-500' : 'bg-green-500'">
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center text-gray-500 py-8">
                No render blocking resources detected
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Optimization Strategies -->
      <div class="optimization-strategies-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">💡 Optimization Strategies</h3>
        
        <div class="strategies-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
          @for (strategy of optimizationStrategies(); track strategy.name) {
            <div class="strategy-card bg-white border border-gray-200 rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold">{{ strategy.name }}</h4>
                <span class="impact-badge px-2 py-1 text-xs rounded-full"
                      [class]="getImpactClass(strategy.impact)">
                  {{ strategy.impact.toUpperCase() }}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 mb-4">{{ strategy.description }}</p>
              
              <div class="implementation-steps">
                <div class="text-sm font-medium text-gray-700 mb-2">Implementation:</div>
                <ul class="text-xs text-gray-600 space-y-1">
                  @for (step of strategy.implementation; track step) {
                    <li class="flex items-start">
                      <span class="text-blue-500 mr-2">•</span>
                      <span>{{ step }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Preloading Statistics -->
      <div class="preloading-stats-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">📈 Preloading Performance</h3>
        
        <div class="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="stat-card bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div class="text-2xl font-bold text-blue-600">{{ preloadStats().totalPreloaded }}</div>
            <div class="text-sm text-blue-800 mt-2">Resources Preloaded</div>
          </div>
          
          <div class="stat-card bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div class="text-2xl font-bold text-green-600">{{ preloadStats().cacheHitRate.toFixed(1) }}%</div>
            <div class="text-sm text-green-800 mt-2">Cache Hit Rate</div>
          </div>
          
          <div class="stat-card bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <div class="text-2xl font-bold text-purple-600">{{ preloadStats().averageLoadTime.toFixed(0) }}ms</div>
            <div class="text-sm text-purple-800 mt-2">Avg Load Time</div>
          </div>
          
          <div class="stat-card bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <div class="text-2xl font-bold text-orange-600">{{ preconnectedDomains().length }}</div>
            <div class="text-sm text-orange-800 mt-2">Preconnected Domains</div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="recommendations-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">🎯 Optimization Recommendations</h3>
        
        <div class="recommendations-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- LCP Recommendations -->
          <div class="recommendations-card bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-800 mb-4">LCP Optimization</h4>
            <ul class="space-y-2">
              @for (recommendation of lcpRecommendations(); track recommendation) {
                <li class="flex items-start text-sm text-blue-700">
                  <span class="text-blue-500 mr-2">•</span>
                  <span>{{ recommendation }}</span>
                </li>
              }
            </ul>
          </div>

          <!-- Preloading Recommendations -->
          <div class="recommendations-card bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-800 mb-4">Resource Preloading</h4>
            <ul class="space-y-2">
              @for (recommendation of preloadingRecommendations(); track recommendation) {
                <li class="flex items-start text-sm text-green-700">
                  <span class="text-green-500 mr-2">•</span>
                  <span>{{ recommendation }}</span>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <h3 class="text-2xl font-semibold mb-6">🛠️ Optimization Actions</h3>
        
        <div class="actions-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            (click)="optimizeCriticalPath()"
            class="action-btn bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            🚀 Optimize Critical Path
          </button>
          
          <button 
            (click)="preloadCriticalResources()"
            class="action-btn bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            📥 Preload Resources
          </button>
          
          <button 
            (click)="optimizeFonts()"
            class="action-btn bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            🔤 Optimize Fonts
          </button>
          
          <button 
            (click)="clearMetrics()"
            class="action-btn bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            🗑️ Clear Metrics
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lcp-optimization-demo {
      font-family: system-ui, -apple-system, sans-serif;
    }
    
    .metric-card, .stat-card {
      transition: transform 0.2s ease-in-out;
    }
    
    .metric-card:hover, .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .strategy-card {
      transition: all 0.2s ease-in-out;
    }
    
    .strategy-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }
    
    .action-btn {
      transition: all 0.2s ease-in-out;
      font-weight: 500;
    }
    
    .action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .resource-item {
      transition: all 0.2s ease-in-out;
    }
    
    .resource-item:hover {
      transform: scale(1.02);
    }
    
    .lcp-good { color: #10b981; }
    .lcp-needs-improvement { color: #f59e0b; }
    .lcp-poor { color: #ef4444; }
    
    .badge-good { background-color: #d1fae5; color: #065f46; }
    .badge-needs-improvement { background-color: #fef3c7; color: #92400e; }
    .badge-poor { background-color: #fee2e2; color: #991b1b; }
    
    .trend-improving { background-color: #d1fae5; color: #065f46; }
    .trend-stable { background-color: #e5e7eb; color: #374151; }
    .trend-degrading { background-color: #fee2e2; color: #991b1b; }
    
    .impact-high { background-color: #fee2e2; color: #991b1b; }
    .impact-medium { background-color: #fef3c7; color: #92400e; }
    .impact-low { background-color: #d1fae5; color: #065f46; }
    
    .resource-image { background-color: #dbeafe; color: #1e40af; }
    .resource-style { background-color: #dcfce7; color: #166534; }
    .resource-script { background-color: #fef3c7; color: #92400e; }
    .resource-font { background-color: #e0e7ff; color: #3730a3; }
    .resource-fetch { background-color: #f3e8ff; color: #6b21a8; }
  `]
})
export class LCPOptimizationDemoComponent implements OnInit, OnDestroy {
  private lcpService = inject(LCPOptimizationService);
  private renderBlockingService = inject(RenderBlockingOptimizerService);
  private preloadingService = inject(ResourcePreloadingService);

  // Computed values from services
  readonly currentLCP = computed(() => this.lcpService.currentLCP());
  readonly averageLCP = computed(() => this.lcpService.averageLCP());
  readonly lcpRecommendations = computed(() => this.lcpService.getLCPRecommendations());
  readonly lcpImprovement = computed(() => this.lcpService.trackLCPImprovement());
  
  readonly renderBlockingResources = computed(() => this.renderBlockingService.renderBlockingResources());
  readonly renderBlockingCount = computed(() => this.renderBlockingService.blockingResourceCount());
  readonly optimizationStrategies = computed(() => this.renderBlockingService.optimizationStrategies());
  
  readonly preloadedResources = computed(() => this.preloadingService.preloadedResources());
  readonly preconnectedDomains = computed(() => this.preloadingService.preconnectedDomains());
  readonly preloadStats = computed(() => this.preloadingService.preloadStats());
  readonly preloadingRecommendations = computed(() => this.preloadingService.getPreloadingRecommendations());

  ngOnInit(): void {
    this.initializeDemoData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Optimize critical rendering path
   */
  optimizeCriticalPath(): void {
    this.lcpService.optimizeCriticalRenderingPath();
    console.log('✅ Critical rendering path optimized');
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources(): void {
    const criticalImages = [
      '/assets/images/hero-banner.webp',
      '/assets/images/logo.svg'
    ];
    
    const criticalFonts = [
      '/assets/fonts/inter-var.woff2',
      '/assets/fonts/inter-bold.woff2'
    ];
    
    const criticalCSS = [
      '/assets/css/critical.css'
    ];

    this.preloadingService.preloadCriticalImages(criticalImages);
    this.preloadingService.preloadCriticalFonts(criticalFonts);
    this.preloadingService.preloadCriticalCSS(criticalCSS);
    
    console.log('✅ Critical resources preloaded');
  }

  /**
   * Optimize font loading
   */
  optimizeFonts(): void {
    this.renderBlockingService.optimizeFontLoading();
    console.log('✅ Font loading optimized');
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.lcpService.clearMetrics();
    this.preloadingService.clearPreloadingData();
    console.log('✅ Metrics cleared');
  }

  /**
   * Get CSS class for LCP rating
   */
  getLCPRatingClass(rating?: string): string {
    switch (rating) {
      case 'good': return 'lcp-good';
      case 'needs-improvement': return 'lcp-needs-improvement';
      case 'poor': return 'lcp-poor';
      default: return 'text-gray-600';
    }
  }

  /**
   * Get CSS class for LCP badge
   */
  getLCPBadgeClass(rating: string): string {
    switch (rating) {
      case 'good': return 'badge-good';
      case 'needs-improvement': return 'badge-needs-improvement';
      case 'poor': return 'badge-poor';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  /**
   * Get CSS class for trend indicator
   */
  getTrendClass(trend: string): string {
    switch (trend) {
      case 'improving': return 'trend-improving';
      case 'stable': return 'trend-stable';
      case 'degrading': return 'trend-degrading';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  /**
   * Get CSS class for impact level
   */
  getImpactClass(impact: string): string {
    switch (impact) {
      case 'high': return 'impact-high';
      case 'medium': return 'impact-medium';
      case 'low': return 'impact-low';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  /**
   * Get CSS class for resource type
   */
  getResourceTypeClass(type: string): string {
    switch (type) {
      case 'image': return 'resource-image';
      case 'style': return 'resource-style';
      case 'script': return 'resource-script';
      case 'font': return 'resource-font';
      case 'fetch': return 'resource-fetch';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  /**
   * Extract resource name from URL
   */
  getResourceName(url: string): string {
    try {
      const urlObj = new URL(url, window.location.origin);
      const pathname = urlObj.pathname;
      return pathname.split('/').pop() || pathname;
    } catch {
      return url.split('/').pop() || url;
    }
  }

  /**
   * Initialize demo data
   */
  private initializeDemoData(): void {
    // Add some sample critical resources
    this.lcpService.addCriticalResource({
      url: '/assets/images/hero-banner.webp',
      type: 'image',
      priority: 'critical',
      preload: true,
      prefetch: false
    });

    this.lcpService.addCriticalResource({
      url: '/assets/fonts/inter-var.woff2',
      type: 'font',
      priority: 'critical',
      preload: true,
      prefetch: false
    });

    // Add sample render-blocking resources
    this.renderBlockingService.registerRenderBlockingResource({
      url: '/assets/css/main.css',
      type: 'css',
      blocking: true,
      critical: true,
      size: 45000
    });

    this.renderBlockingService.registerRenderBlockingResource({
      url: '/assets/js/vendor.js',
      type: 'js',
      blocking: true,
      critical: false,
      size: 120000
    });

    // Simulate some LCP measurements
    setTimeout(() => {
      // Simulate LCP measurements over time
      const measurements = [2800, 2650, 2400, 2200, 2100];
      measurements.forEach((value, index) => {
        setTimeout(() => {
          // This would normally be captured by the PerformanceObserver
          console.log(`Simulated LCP: ${value}ms`);
        }, index * 1000);
      });
    }, 1000);
  }
}