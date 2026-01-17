import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CLSDemoComponent } from '../../shared/components/cls-demo/cls-demo.component';
import { FIDDemoComponent } from '../../shared/components/fid-demo/fid-demo.component';

/**
 * Performance Demo Page
 * 
 * Showcases all Core Web Vitals optimization features:
 * - CLS (Cumulative Layout Shift) optimization
 * - FID (First Input Delay) optimization
 * - Performance monitoring and metrics
 * - Interactive demonstrations
 */
@Component({
  selector: 'app-performance-demo',
  standalone: true,
  imports: [
    CommonModule,
    CLSDemoComponent,
    FIDDemoComponent
  ],
  template: `
    <div class="performance-demo-page">
      <!-- Page Header -->
      <div class="page-header bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div class="container mx-auto px-6">
          <h1 class="text-4xl font-bold mb-4">Core Web Vitals Optimization Demo</h1>
          <p class="text-xl opacity-90 max-w-3xl">
            Experience and test our comprehensive performance optimization techniques for 
            Cumulative Layout Shift (CLS) and First Input Delay (FID).
          </p>
          
          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div class="stat-card bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div class="text-2xl font-bold">< 0.1</div>
              <div class="text-sm opacity-80">Target CLS Score</div>
            </div>
            <div class="stat-card bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div class="text-2xl font-bold">< 100ms</div>
              <div class="text-sm opacity-80">Target FID Score</div>
            </div>
            <div class="stat-card bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div class="text-2xl font-bold">90+</div>
              <div class="text-sm opacity-80">Lighthouse Score</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="demo-navigation bg-background border-b border-border sticky top-0 z-10">
        <div class="container mx-auto px-6">
          <div class="flex space-x-8">
            <button 
              (click)="activeTab = 'cls'"
              [class]="getTabClasses('cls')"
              class="py-4 px-2 border-b-2 font-medium text-sm transition-colors">
              CLS Optimization
            </button>
            <button 
              (click)="activeTab = 'fid'"
              [class]="getTabClasses('fid')"
              class="py-4 px-2 border-b-2 font-medium text-sm transition-colors">
              FID Optimization
            </button>
            <button 
              (click)="activeTab = 'overview'"
              [class]="getTabClasses('overview')"
              class="py-4 px-2 border-b-2 font-medium text-sm transition-colors">
              Overview
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- CLS Demo Tab -->
        @if (activeTab === 'cls') {
          <div class="tab-panel">
            <app-cls-demo></app-cls-demo>
          </div>
        }

        <!-- FID Demo Tab -->
        @if (activeTab === 'fid') {
          <div class="tab-panel">
            <app-fid-demo></app-fid-demo>
          </div>
        }

        <!-- Overview Tab -->
        @if (activeTab === 'overview') {
          <div class="tab-panel">
            <div class="overview-content p-6 max-w-6xl mx-auto">
              
              <!-- Introduction -->
              <div class="intro-section mb-12">
                <h2 class="text-3xl font-bold text-foreground mb-6">Performance Optimization Overview</h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div class="content-block">
                    <h3 class="text-xl font-semibold mb-4">What are Core Web Vitals?</h3>
                    <p class="text-muted-foreground mb-4">
                      Core Web Vitals are a set of real-world, user-centered metrics that quantify key aspects 
                      of the user experience. They measure loading performance, interactivity, and visual stability.
                    </p>
                    <ul class="space-y-2 text-sm">
                      <li class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span><strong>LCP (Largest Contentful Paint):</strong> Loading performance</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span><strong>FID (First Input Delay):</strong> Interactivity</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span><strong>CLS (Cumulative Layout Shift):</strong> Visual stability</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div class="content-block">
                    <h3 class="text-xl font-semibold mb-4">Why Optimize Performance?</h3>
                    <div class="space-y-4 text-sm">
                      <div class="benefit-item p-3 bg-card border border-border rounded-lg">
                        <div class="font-medium text-green-600 mb-1">Better User Experience</div>
                        <div class="text-muted-foreground">Faster, more responsive interfaces lead to higher user satisfaction</div>
                      </div>
                      <div class="benefit-item p-3 bg-card border border-border rounded-lg">
                        <div class="font-medium text-blue-600 mb-1">Improved SEO Rankings</div>
                        <div class="text-muted-foreground">Google uses Core Web Vitals as ranking factors</div>
                      </div>
                      <div class="benefit-item p-3 bg-card border border-border rounded-lg">
                        <div class="font-medium text-purple-600 mb-1">Higher Conversion Rates</div>
                        <div class="text-muted-foreground">Better performance directly correlates with business metrics</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CLS Section -->
              <div class="optimization-section mb-12">
                <h2 class="text-2xl font-bold text-foreground mb-6">Cumulative Layout Shift (CLS) Optimization</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="technique-list">
                    <h3 class="text-lg font-semibold mb-4">Optimization Techniques</h3>
                    <div class="space-y-3">
                      <div class="technique-item flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                        <div>
                          <div class="font-medium">Image Dimension Reservation</div>
                          <div class="text-sm text-muted-foreground">Always specify width and height attributes</div>
                        </div>
                      </div>
                      <div class="technique-item flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                        <div>
                          <div class="font-medium">Skeleton Loading States</div>
                          <div class="text-sm text-muted-foreground">Show placeholders while content loads</div>
                        </div>
                      </div>
                      <div class="technique-item flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                        <div>
                          <div class="font-medium">Font Loading Optimization</div>
                          <div class="text-sm text-muted-foreground">Use font-display: swap and preload critical fonts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="metrics-info">
                    <h3 class="text-lg font-semibold mb-4">Target Metrics</h3>
                    <div class="space-y-4">
                      <div class="metric-range">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Good</span>
                          <span class="text-green-600 font-bold">≤ 0.1</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-green-500 h-2 rounded-full" style="width: 33%"></div>
                        </div>
                      </div>
                      <div class="metric-range">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Needs Improvement</span>
                          <span class="text-orange-600 font-bold">0.1 - 0.25</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-orange-500 h-2 rounded-full" style="width: 66%"></div>
                        </div>
                      </div>
                      <div class="metric-range">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Poor</span>
                          <span class="text-red-600 font-bold">> 0.25</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-red-500 h-2 rounded-full" style="width: 100%"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- FID Section -->
              <div class="optimization-section mb-12">
                <h2 class="text-2xl font-bold text-foreground mb-6">First Input Delay (FID) Optimization</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="technique-list">
                    <h3 class="text-lg font-semibold mb-4">Optimization Techniques</h3>
                    <div class="space-y-3">
                      <div class="technique-item flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                        <div>
                          <div class="font-medium">OnPush Change Detection</div>
                          <div class="text-sm text-muted-foreground">Reduce unnecessary change detection cycles</div>
                        </div>
                      </div>
                      <div class="technique-item flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                        <div>
                          <div class="font-medium">Task Scheduling</div>
                          <div class="text-sm text-muted-foreground">Break up long-running JavaScript tasks</div>
                        </div>
                      </div>
                      <div class="technique-item flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                        <div>
                          <div class="font-medium">Event Optimization</div>
                          <div class="text-sm text-muted-foreground">Use delegation and throttling for better responsiveness</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="metrics-info">
                    <h3 class="text-lg font-semibold mb-4">Target Metrics</h3>
                    <div class="space-y-4">
                      <div class="metric-range">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Good</span>
                          <span class="text-green-600 font-bold">≤ 100ms</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-green-500 h-2 rounded-full" style="width: 33%"></div>
                        </div>
                      </div>
                      <div class="metric-range">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Needs Improvement</span>
                          <span class="text-orange-600 font-bold">100 - 300ms</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-orange-500 h-2 rounded-full" style="width: 66%"></div>
                        </div>
                      </div>
                      <div class="metric-range">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium">Poor</span>
                          <span class="text-red-600 font-bold">> 300ms</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-red-500 h-2 rounded-full" style="width: 100%"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Implementation Guide -->
              <div class="implementation-guide">
                <h2 class="text-2xl font-bold text-foreground mb-6">Implementation Guide</h2>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div class="guide-step bg-card border border-border rounded-lg p-6">
                    <div class="step-number w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-4">1</div>
                    <h3 class="text-lg font-semibold mb-3">Measure Current Performance</h3>
                    <p class="text-sm text-muted-foreground mb-4">
                      Use our monitoring components to establish baseline metrics for your application.
                    </p>
                    <ul class="text-xs space-y-1">
                      <li>• Install monitoring services</li>
                      <li>• Collect baseline metrics</li>
                      <li>• Identify problem areas</li>
                    </ul>
                  </div>
                  
                  <div class="guide-step bg-card border border-border rounded-lg p-6">
                    <div class="step-number w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-4">2</div>
                    <h3 class="text-lg font-semibold mb-3">Apply Optimizations</h3>
                    <p class="text-sm text-muted-foreground mb-4">
                      Implement the optimization techniques demonstrated in our components.
                    </p>
                    <ul class="text-xs space-y-1">
                      <li>• Add skeleton loading states</li>
                      <li>• Optimize image loading</li>
                      <li>• Implement task scheduling</li>
                    </ul>
                  </div>
                  
                  <div class="guide-step bg-card border border-border rounded-lg p-6">
                    <div class="step-number w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-4">3</div>
                    <h3 class="text-lg font-semibold mb-3">Monitor & Iterate</h3>
                    <p class="text-sm text-muted-foreground mb-4">
                      Continuously monitor performance and make iterative improvements.
                    </p>
                    <ul class="text-xs space-y-1">
                      <li>• Track metrics over time</li>
                      <li>• A/B test optimizations</li>
                      <li>• Refine based on data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .performance-demo-page {
      min-height: 100vh;
      background: hsl(var(--background));
    }

    .container {
      max-width: 1200px;
    }

    .stat-card {
      text-align: center;
    }

    .demo-navigation {
      backdrop-filter: blur(8px);
    }

    .tab-panel {
      min-height: calc(100vh - 200px);
    }

    .overview-content {
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .technique-item {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .technique-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .guide-step {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .guide-step:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .step-number {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .page-header {
        padding: 2rem 0;
      }

      .page-header h1 {
        font-size: 2rem;
      }

      .page-header p {
        font-size: 1rem;
      }

      .grid.grid-cols-3 {
        grid-template-columns: 1fr;
      }

      .demo-navigation .flex {
        flex-direction: column;
        space-x: 0;
      }

      .demo-navigation button {
        text-align: left;
        border-bottom: 1px solid hsl(var(--border));
        border-left: none;
        border-right: none;
        border-top: none;
        border-radius: 0;
      }
    }

    /* Dark mode adjustments */
    .dark .stat-card {
      background: rgba(255, 255, 255, 0.1);
    }

    .dark .technique-item:hover {
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
    }

    .dark .guide-step:hover {
      box-shadow: 0 8px 24px rgba(255, 255, 255, 0.1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceDemoComponent {
  activeTab: 'cls' | 'fid' | 'overview' = 'overview';

  getTabClasses(tab: string): string {
    const baseClasses = 'border-transparent text-muted-foreground hover:text-foreground hover:border-border';
    const activeClasses = 'border-primary text-primary';
    
    return this.activeTab === tab ? activeClasses : baseClasses;
  }
}