import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreWebVitalsService, CoreWebVitalsMetrics, OptimizationRecommendation } from '../../../core/services/core-web-vitals.service';
import { Subscription } from 'rxjs';

/**
 * Core Web Vitals Monitor Component
 * 
 * Real-time monitoring dashboard for Core Web Vitals:
 * - LCP (Largest Contentful Paint) < 2.5s
 * - FID (First Input Delay) < 100ms
 * - CLS (Cumulative Layout Shift) < 0.1
 * 
 * Features:
 * - Live metrics display
 * - Target achievement indicators
 * - Optimization recommendations
 * - Performance trends
 * - Detailed reporting
 */
@Component({
  selector: 'app-core-web-vitals-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="core-web-vitals-monitor p-6 max-w-7xl mx-auto">
      <div class="header mb-8">
        <h2 class="text-3xl font-bold text-center mb-4">
          🚀 Core Web Vitals Monitor
        </h2>
        <p class="text-center text-gray-600 max-w-2xl mx-auto">
          Real-time monitoring of Core Web Vitals performance metrics with automatic optimization.
          Target: LCP &lt; 2.5s, FID &lt; 100ms, CLS &lt; 0.1
        </p>
      </div>

      <!-- Overall Status -->
      <div class="overall-status mb-8">
        <div class="bg-white rounded-lg shadow-lg p-6 border-l-4" 
             [class]="getOverallStatusBorderClass()">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold mb-2">Overall Performance</h3>
              <div class="flex items-center space-x-4">
                <div class="text-3xl font-bold" [class]="getOverallScoreClass()">
                  {{ currentMetrics()?.overall?.score || 0 }}/100
                </div>
                <div class="text-lg" [class]="getOverallRatingClass()">
                  {{ (currentMetrics()?.overall?.rating || 'unknown').replace('-', ' ').toUpperCase() }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-4xl mb-2">
                {{ currentMetrics()?.overall?.allTargetsMet ? '✅' : '⚠️' }}
              </div>
              <div class="text-sm text-gray-600">
                {{ currentMetrics()?.overall?.allTargetsMet ? 'All Targets Met' : 'Needs Optimization' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Core Web Vitals Metrics -->
      <div class="metrics-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- LCP Metric -->
        <div class="metric-card bg-white rounded-lg shadow-lg p-6 border-l-4"
             [class]="getMetricBorderClass('lcp')">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">🎯 LCP</h3>
            <div class="text-2xl">
              {{ currentMetrics()?.lcp?.achieved ? '✅' : '❌' }}
            </div>
          </div>
          
          <div class="metric-value mb-3">
            <div class="text-3xl font-bold" [class]="getMetricValueClass('lcp')">
              {{ formatLCP(currentMetrics()?.lcp?.value || 0) }}
            </div>
            <div class="text-sm text-gray-600">
              Target: {{ formatLCP(currentMetrics()?.lcp?.target || 2500) }}
            </div>
          </div>
          
          <div class="metric-status">
            <div class="text-sm font-medium mb-1" [class]="getMetricRatingClass('lcp')">
              {{ (currentMetrics()?.lcp?.rating || 'unknown').replace('-', ' ').toUpperCase() }}
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full transition-all duration-300"
                   [class]="getProgressBarClass('lcp')"
                   [style.width.%]="getLCPProgress()">
              </div>
            </div>
          </div>
        </div>

        <!-- FID Metric -->
        <div class="metric-card bg-white rounded-lg shadow-lg p-6 border-l-4"
             [class]="getMetricBorderClass('fid')">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">⚡ FID</h3>
            <div class="text-2xl">
              {{ currentMetrics()?.fid?.achieved ? '✅' : '❌' }}
            </div>
          </div>
          
          <div class="metric-value mb-3">
            <div class="text-3xl font-bold" [class]="getMetricValueClass('fid')">
              {{ formatFID(currentMetrics()?.fid?.value || 0) }}
            </div>
            <div class="text-sm text-gray-600">
              Target: {{ formatFID(currentMetrics()?.fid?.target || 100) }}
            </div>
          </div>
          
          <div class="metric-status">
            <div class="text-sm font-medium mb-1" [class]="getMetricRatingClass('fid')">
              {{ (currentMetrics()?.fid?.rating || 'unknown').replace('-', ' ').toUpperCase() }}
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full transition-all duration-300"
                   [class]="getProgressBarClass('fid')"
                   [style.width.%]="getFIDProgress()">
              </div>
            </div>
          </div>
        </div>

        <!-- CLS Metric -->
        <div class="metric-card bg-white rounded-lg shadow-lg p-6 border-l-4"
             [class]="getMetricBorderClass('cls')">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">📐 CLS</h3>
            <div class="text-2xl">
              {{ currentMetrics()?.cls?.achieved ? '✅' : '❌' }}
            </div>
          </div>
          
          <div class="metric-value mb-3">
            <div class="text-3xl font-bold" [class]="getMetricValueClass('cls')">
              {{ formatCLS(currentMetrics()?.cls?.value || 0) }}
            </div>
            <div class="text-sm text-gray-600">
              Target: {{ formatCLS(currentMetrics()?.cls?.target || 0.1) }}
            </div>
          </div>
          
          <div class="metric-status">
            <div class="text-sm font-medium mb-1" [class]="getMetricRatingClass('cls')">
              {{ (currentMetrics()?.cls?.rating || 'unknown').replace('-', ' ').toUpperCase() }}
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full transition-all duration-300"
                   [class]="getProgressBarClass('cls')"
                   [style.width.%]="getCLSProgress()">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Optimization Status -->
      <div class="optimization-status mb-8">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-semibold mb-4">🔧 Optimization Status</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium mb-3">Applied Optimizations</h4>
              <div class="space-y-2">
                @for (optimization of appliedOptimizations(); track optimization) {
                  <div class="flex items-center text-sm">
                    <span class="text-green-500 mr-2">✅</span>
                    <span>{{ optimization }}</span>
                  </div>
                }
                @empty {
                  <div class="text-gray-500 text-sm">No optimizations applied yet</div>
                }
              </div>
            </div>
            
            <div>
              <h4 class="font-medium mb-3">Optimization Controls</h4>
              <div class="space-y-3">
                <button 
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  (click)="generateReport()">
                  📊 Generate Report
                </button>
                <button 
                  class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  (click)="resetMetrics()">
                  🔄 Reset Metrics
                </button>
                <button 
                  class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  (click)="exportData()">
                  📤 Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      @if (recommendations().length > 0) {
        <div class="recommendations mb-8">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold mb-4">💡 Optimization Recommendations</h3>
            
            <div class="space-y-4">
              @for (rec of recommendations(); track rec.title) {
                <div class="recommendation-card border rounded-lg p-4"
                     [class]="getRecommendationBorderClass(rec.priority)">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center mb-2">
                        <span class="text-lg mr-2">{{ getRecommendationIcon(rec.priority) }}</span>
                        <h4 class="font-semibold">{{ rec.title }}</h4>
                        <span class="ml-2 px-2 py-1 text-xs rounded-full"
                              [class]="getRecommendationBadgeClass(rec.priority)">
                          {{ rec.priority.toUpperCase() }}
                        </span>
                      </div>
                      <p class="text-gray-600 text-sm mb-2">{{ rec.description }}</p>
                      <div class="flex items-center text-sm text-gray-500">
                        <span class="mr-4">🎯 {{ rec.action }}</span>
                        <span class="mr-4">📈 Impact: {{ rec.impact }}%</span>
                        <span>⏱️ Est. Improvement: {{ rec.estimatedImprovement }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      {{ rec.implemented ? '✅' : '⏳' }}
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Performance Trends -->
      @if (hasPerformanceData()) {
        <div class="performance-trends">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold mb-4">📈 Performance Trends</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="trend-card text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">
                  {{ getTrendValue('lcp') }}
                </div>
                <div class="text-sm text-blue-800">LCP Trend</div>
                <div class="text-xs text-gray-600 mt-1">
                  {{ getTrendDirection('lcp') }}
                </div>
              </div>
              
              <div class="trend-card text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">
                  {{ getTrendValue('fid') }}
                </div>
                <div class="text-sm text-green-800">FID Trend</div>
                <div class="text-xs text-gray-600 mt-1">
                  {{ getTrendDirection('fid') }}
                </div>
              </div>
              
              <div class="trend-card text-center p-4 bg-purple-50 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">
                  {{ getTrendValue('cls') }}
                </div>
                <div class="text-sm text-purple-800">CLS Trend</div>
                <div class="text-xs text-gray-600 mt-1">
                  {{ getTrendDirection('cls') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Debug Information -->
      @if (showDebugInfo()) {
        <div class="debug-info mt-8">
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">🔍 Debug Information</h3>
            <pre class="text-xs bg-white p-4 rounded border overflow-auto">{{ getDebugInfo() }}</pre>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .core-web-vitals-monitor {
      font-family: system-ui, -apple-system, sans-serif;
    }

    .metric-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .recommendation-card {
      transition: all 0.2s ease;
    }

    .recommendation-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    /* Metric value colors */
    .metric-good { color: #10b981; }
    .metric-needs-improvement { color: #f59e0b; }
    .metric-poor { color: #ef4444; }

    /* Border colors */
    .border-good { border-left-color: #10b981; }
    .border-needs-improvement { border-left-color: #f59e0b; }
    .border-poor { border-left-color: #ef4444; }

    /* Progress bar colors */
    .progress-good { background-color: #10b981; }
    .progress-needs-improvement { background-color: #f59e0b; }
    .progress-poor { background-color: #ef4444; }

    /* Recommendation priority colors */
    .rec-critical { border-left: 4px solid #ef4444; }
    .rec-high { border-left: 4px solid #f59e0b; }
    .rec-medium { border-left: 4px solid #3b82f6; }
    .rec-low { border-left: 4px solid #6b7280; }

    .badge-critical { background-color: #fee2e2; color: #991b1b; }
    .badge-high { background-color: #fef3c7; color: #92400e; }
    .badge-medium { background-color: #dbeafe; color: #1e40af; }
    .badge-low { background-color: #f3f4f6; color: #374151; }
  `]
})
export class CoreWebVitalsMonitorComponent implements OnInit, OnDestroy {
  private coreWebVitalsService = inject(CoreWebVitalsService);
  private subscription?: Subscription;

  // Signals for reactive state
  private _currentMetrics = signal<CoreWebVitalsMetrics | null>(null);
  private _recommendations = signal<OptimizationRecommendation[]>([]);
  private _appliedOptimizations = signal<string[]>([]);
  private _showDebugInfo = signal<boolean>(false);

  // Computed signals
  readonly currentMetrics = this._currentMetrics.asReadonly();
  readonly recommendations = this._recommendations.asReadonly();
  readonly appliedOptimizations = this._appliedOptimizations.asReadonly();
  readonly showDebugInfo = this._showDebugInfo.asReadonly();

  ngOnInit(): void {
    // Subscribe to metrics updates
    this.subscription = this.coreWebVitalsService.getMetricsObservable().subscribe(metrics => {
      this._currentMetrics.set(metrics);

      if (metrics) {
        this._recommendations.set(this.coreWebVitalsService.getRecommendations());
      }
    });

    // Get applied optimizations
    this._appliedOptimizations.set(this.coreWebVitalsService.appliedOptimizations());

    // Enable debug info in development
    this._showDebugInfo.set(window.location.hostname === 'localhost');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // Formatting methods
  formatLCP(value: number): string {
    return `${(value / 1000).toFixed(2)}s`;
  }

  formatFID(value: number): string {
    return `${value.toFixed(0)}ms`;
  }

  formatCLS(value: number): string {
    return value.toFixed(4);
  }

  // Progress calculation methods
  getLCPProgress(): number {
    const metrics = this.currentMetrics();
    if (!metrics) return 0;

    const maxValue = 5000; // 5 seconds max for visualization
    const progress = Math.min((metrics.lcp.value / maxValue) * 100, 100);
    return 100 - progress; // Invert so good performance shows high progress
  }

  getFIDProgress(): number {
    const metrics = this.currentMetrics();
    if (!metrics) return 0;

    const maxValue = 500; // 500ms max for visualization
    const progress = Math.min((metrics.fid.value / maxValue) * 100, 100);
    return 100 - progress; // Invert so good performance shows high progress
  }

  getCLSProgress(): number {
    const metrics = this.currentMetrics();
    if (!metrics) return 0;

    const maxValue = 0.5; // 0.5 max for visualization
    const progress = Math.min((metrics.cls.value / maxValue) * 100, 100);
    return 100 - progress; // Invert so good performance shows high progress
  }

  // Styling methods
  getOverallStatusBorderClass(): string {
    const metrics = this.currentMetrics();
    if (!metrics) return 'border-gray-300';

    return `border-${metrics.overall.rating === 'good' ? 'green' :
      metrics.overall.rating === 'needs-improvement' ? 'yellow' : 'red'}-500`;
  }

  getOverallScoreClass(): string {
    const metrics = this.currentMetrics();
    if (!metrics) return 'text-gray-500';

    return `metric-${metrics.overall.rating}`;
  }

  getOverallRatingClass(): string {
    const metrics = this.currentMetrics();
    if (!metrics) return 'text-gray-500';

    return `metric-${metrics.overall.rating}`;
  }

  getMetricBorderClass(metric: 'lcp' | 'fid' | 'cls'): string {
    const metrics = this.currentMetrics();
    if (!metrics) return 'border-gray-300';

    const rating = metrics[metric].rating;
    return `border-${rating}`;
  }

  getMetricValueClass(metric: 'lcp' | 'fid' | 'cls'): string {
    const metrics = this.currentMetrics();
    if (!metrics) return 'text-gray-500';

    const rating = metrics[metric].rating;
    return `metric-${rating}`;
  }

  getMetricRatingClass(metric: 'lcp' | 'fid' | 'cls'): string {
    const metrics = this.currentMetrics();
    if (!metrics) return 'text-gray-500';

    const rating = metrics[metric].rating;
    return `metric-${rating}`;
  }

  getProgressBarClass(metric: 'lcp' | 'fid' | 'cls'): string {
    const metrics = this.currentMetrics();
    if (!metrics) return 'bg-gray-300';

    const rating = metrics[metric].rating;
    return `progress-${rating}`;
  }

  getRecommendationBorderClass(priority: string): string {
    return `rec-${priority}`;
  }

  getRecommendationBadgeClass(priority: string): string {
    return `badge-${priority}`;
  }

  getRecommendationIcon(priority: string): string {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '💡';
      case 'low': return 'ℹ️';
      default: return '📝';
    }
  }

  // Action methods
  generateReport(): void {
    const report = this.coreWebVitalsService.generateReport();
    if (report) {
      console.log('📊 Performance Report Generated:', report);
      alert('Performance report generated! Check the console for details.');
    }
  }

  resetMetrics(): void {
    this.coreWebVitalsService.resetMetrics();
    console.log('🔄 Metrics reset');
  }

  exportData(): void {
    const data = this.coreWebVitalsService.exportPerformanceData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `core-web-vitals-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Trend methods
  hasPerformanceData(): boolean {
    return this.currentMetrics() !== null;
  }

  getTrendValue(metric: 'lcp' | 'fid' | 'cls'): string {
    // Placeholder for trend calculation
    return 'N/A';
  }

  getTrendDirection(metric: 'lcp' | 'fid' | 'cls'): string {
    // Placeholder for trend direction
    return 'Monitoring...';
  }

  // Debug methods
  getDebugInfo(): string {
    const metrics = this.currentMetrics();
    const data = {
      timestamp: new Date().toISOString(),
      metrics,
      recommendations: this.recommendations(),
      appliedOptimizations: this.appliedOptimizations(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    return JSON.stringify(data, null, 2);
  }
}