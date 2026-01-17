import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptimizedImageComponent } from '../optimized-image/optimized-image.component';
import { LazyMediaDirective, LazyBackgroundDirective } from '../../directives/lazy-media.directive';
import { ImageOptimizationService } from '../../../core/services/image-optimization.service';
import { ResponsiveImageUtil } from '../../../core/utils/responsive-image.util';

/**
 * Image Optimization Demo Component
 * 
 * Demonstrates various image optimization techniques:
 * - WebP/AVIF format optimization
 * - Lazy loading with intersection observer
 * - Responsive image sizing
 * - Progressive loading with placeholders
 * - Performance monitoring
 */
@Component({
  selector: 'app-image-optimization-demo',
  standalone: true,
  imports: [
    CommonModule,
    OptimizedImageComponent,
    LazyMediaDirective,
    LazyBackgroundDirective
  ],
  template: `
    <div class="image-optimization-demo p-6 max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-center">🖼️ Image Optimization Demo</h2>
      
      <!-- Performance Overview -->
      <div class="performance-overview mb-8">
        <h3 class="text-2xl font-semibold mb-6">📊 Performance Metrics</h3>
        
        <div class="metrics-grid grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="metric-card bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-blue-600">{{ performanceAnalysis().totalImages }}</div>
            <div class="text-sm text-blue-800 mt-2">Total Images</div>
          </div>
          
          <div class="metric-card bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-green-600">{{ performanceAnalysis().averageLoadTime.toFixed(0) }}ms</div>
            <div class="text-sm text-green-800 mt-2">Avg Load Time</div>
          </div>
          
          <div class="metric-card bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-purple-600">{{ (performanceAnalysis().averageCompressionRatio * 100).toFixed(0) }}%</div>
            <div class="text-sm text-purple-800 mt-2">Compression Ratio</div>
          </div>
          
          <div class="metric-card bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <div class="text-3xl font-bold text-orange-600">{{ formatBytes(performanceAnalysis().totalSizeSaved) }}</div>
            <div class="text-sm text-orange-800 mt-2">Size Saved</div>
          </div>
        </div>

        <!-- Format Support -->
        <div class="format-support bg-white border border-gray-200 rounded-lg p-6">
          <h4 class="text-lg font-semibold mb-4">🎨 Format Support</h4>
          <div class="flex flex-wrap gap-4">
            @for (format of supportedFormats(); track format.name) {
              <div class="format-badge flex items-center space-x-2 px-3 py-2 rounded-full"
                   [class]="format.supported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                <span [class]="format.supported ? 'text-green-500' : 'text-red-500'">
                  {{ format.supported ? '✓' : '✗' }}
                </span>
                <span class="font-medium">{{ format.name.toUpperCase() }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Optimized Image Component Demo -->
      <div class="optimized-image-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">🚀 Optimized Image Component</h3>
        
        <div class="demo-grid grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- High Priority Image -->
          <div class="demo-item">
            <h4 class="text-lg font-semibold mb-4">High Priority (Above the fold)</h4>
            <div class="image-container border border-gray-300 rounded-lg overflow-hidden">
              <app-optimized-image
                [src]="sampleImages.hero"
                alt="Hero image with high priority loading"
                width="100%"
                height="300px"
                [config]="{
                  enableWebP: true,
                  enableAVIF: true,
                  enableLazyLoading: false,
                  enableProgressiveLoading: true,
                  quality: 85,
                  sizes: ['640w', '1024w', '1920w'],
                  placeholder: 'blur',
                  priority: 'high'
                }"
                [showMetrics]="true"
                (imageLoad)="onImageLoad($event)">
              </app-optimized-image>
            </div>
          </div>

          <!-- Lazy Loaded Image -->
          <div class="demo-item">
            <h4 class="text-lg font-semibold mb-4">Lazy Loaded (Below the fold)</h4>
            <div class="image-container border border-gray-300 rounded-lg overflow-hidden">
              <app-optimized-image
                [src]="sampleImages.content"
                alt="Content image with lazy loading"
                width="100%"
                height="300px"
                [config]="{
                  enableWebP: true,
                  enableAVIF: true,
                  enableLazyLoading: true,
                  enableProgressiveLoading: true,
                  quality: 80,
                  sizes: ['320w', '640w', '1024w'],
                  placeholder: 'skeleton',
                  priority: 'medium'
                }"
                [showMetrics]="true"
                (imageLoad)="onImageLoad($event)">
              </app-optimized-image>
            </div>
          </div>
        </div>
      </div>

      <!-- Responsive Images Demo -->
      <div class="responsive-images-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">📱 Responsive Images</h3>
        
        <div class="responsive-demo">
          <h4 class="text-lg font-semibold mb-4">Art Direction Example</h4>
          <div class="art-direction-container border border-gray-300 rounded-lg overflow-hidden mb-6">
            <picture class="w-full">
              <!-- Large screens: landscape image -->
              <source 
                media="(min-width: 1024px)" 
                [srcset]="responsiveImageSet.desktop.srcset"
                [sizes]="responsiveImageSet.desktop.sizes">
              
              <!-- Medium screens: square image -->
              <source 
                media="(min-width: 768px)" 
                [srcset]="responsiveImageSet.tablet.srcset"
                [sizes]="responsiveImageSet.tablet.sizes">
              
              <!-- Small screens: portrait image -->
              <source 
                media="(max-width: 767px)" 
                [srcset]="responsiveImageSet.mobile.srcset"
                [sizes]="responsiveImageSet.mobile.sizes">
              
              <!-- Fallback -->
              <img 
                [src]="responsiveImageSet.fallback"
                alt="Responsive image with art direction"
                class="w-full h-64 object-cover"
                loading="lazy">
            </picture>
          </div>

          <!-- Responsive Grid -->
          <h4 class="text-lg font-semibold mb-4">Responsive Grid</h4>
          <div class="responsive-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (image of gridImages(); track image.id) {
              <div class="grid-item">
                <app-optimized-image
                  [src]="image.src"
                  [alt]="image.alt"
                  width="100%"
                  height="200px"
                  [config]="{
                    enableWebP: true,
                    enableAVIF: true,
                    enableLazyLoading: true,
                    enableProgressiveLoading: true,
                    quality: 75,
                    sizes: ['320w', '640w'],
                    placeholder: 'skeleton',
                    priority: 'low'
                  }"
                  (imageLoad)="onImageLoad($event)">
                </app-optimized-image>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Lazy Loading Directive Demo -->
      <div class="lazy-directive-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">⏳ Lazy Loading Directives</h3>
        
        <div class="directive-demos grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Lazy Media Directive -->
          <div class="demo-item">
            <h4 class="text-lg font-semibold mb-4">Lazy Media Directive</h4>
            <div class="space-y-4">
              @for (lazyImage of lazyImages(); track lazyImage.id) {
                <div class="lazy-image-container border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    [lazyMedia]="lazyImage.src"
                    [alt]="lazyImage.alt"
                    [lazyConfig]="{
                      rootMargin: '100px 0px',
                      threshold: 0.1,
                      enableRetry: true,
                      maxRetries: 3
                    }"
                    class="w-full h-48 object-cover"
                    (lazyLoad)="onLazyLoad($event)"
                    (lazyError)="onLazyError($event)">
                </div>
              }
            </div>
          </div>

          <!-- Lazy Background Directive -->
          <div class="demo-item">
            <h4 class="text-lg font-semibold mb-4">Lazy Background Directive</h4>
            <div class="space-y-4">
              @for (bgImage of backgroundImages(); track bgImage.id) {
                <div 
                  [lazyBackground]="bgImage.src"
                  [lazyBackgroundConfig]="{
                    rootMargin: '50px 0px',
                    threshold: 0.2
                  }"
                  class="lazy-bg-container w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-white font-semibold"
                  (backgroundLoad)="onBackgroundLoad($event)">
                  <span class="bg-black bg-opacity-50 px-4 py-2 rounded">{{ bgImage.title }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Recommendations -->
      <div class="recommendations-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">💡 Optimization Recommendations</h3>
        
        <div class="recommendations-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Global Recommendations -->
          <div class="recommendations-card bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-800 mb-4">Global Recommendations</h4>
            <ul class="space-y-2">
              @for (recommendation of performanceAnalysis().recommendations; track recommendation) {
                <li class="flex items-start text-sm text-blue-700">
                  <span class="text-blue-500 mr-2">•</span>
                  <span>{{ recommendation }}</span>
                </li>
              }
            </ul>
          </div>

          <!-- Format Distribution -->
          <div class="format-distribution-card bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-green-800 mb-4">Format Distribution</h4>
            <div class="space-y-3">
              @for (format of formatDistribution(); track format.name) {
                <div class="format-stat">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-green-700">{{ format.name.toUpperCase() }}</span>
                    <span class="text-sm text-green-600">{{ format.count }} images</span>
                  </div>
                  <div class="w-full bg-green-200 rounded-full h-2">
                    <div 
                      class="bg-green-500 h-2 rounded-full transition-all duration-300"
                      [style.width.%]="format.percentage">
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-section">
        <h3 class="text-2xl font-semibold mb-6">🎛️ Controls</h3>
        
        <div class="controls-grid grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            (click)="clearMetrics()"
            class="control-btn bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            🗑️ Clear Metrics
          </button>
          
          <button 
            (click)="generateReport()"
            class="control-btn bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            📊 Generate Report
          </button>
          
          <button 
            (click)="testFormats()"
            class="control-btn bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            🧪 Test Formats
          </button>
        </div>
      </div>

      <!-- Generated Report -->
      @if (generatedReport()) {
        <div class="report-section mt-8">
          <h3 class="text-2xl font-semibold mb-6">📋 Performance Report</h3>
          <div class="report-content bg-gray-50 border border-gray-200 rounded-lg p-6">
            <pre class="text-sm text-gray-800 whitespace-pre-wrap font-mono">{{ generatedReport() }}</pre>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .image-optimization-demo {
      font-family: system-ui, -apple-system, sans-serif;
    }
    
    .metric-card {
      transition: transform 0.2s ease-in-out;
    }
    
    .metric-card:hover {
      transform: translateY(-2px);
    }
    
    .demo-item {
      transition: all 0.2s ease-in-out;
    }
    
    .image-container {
      position: relative;
      overflow: hidden;
    }
    
    .lazy-bg-container {
      transition: all 0.3s ease-in-out;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    
    .lazy-bg-container.lazy-loaded {
      transform: scale(1.02);
    }
    
    .control-btn {
      transition: all 0.2s ease-in-out;
      font-weight: 500;
    }
    
    .control-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .format-badge {
      transition: all 0.2s ease-in-out;
    }
    
    .format-badge:hover {
      transform: scale(1.05);
    }
    
    .responsive-grid .grid-item {
      transition: transform 0.2s ease-in-out;
    }
    
    .responsive-grid .grid-item:hover {
      transform: scale(1.02);
    }
  `]
})
export class ImageOptimizationDemoComponent implements OnInit {
  private imageOptimizationService = inject(ImageOptimizationService);

  // Signals for component state
  private _generatedReport = signal<string>('');

  // Sample image data
  readonly sampleImages = {
    hero: 'https://picsum.photos/1920/800?random=1',
    content: 'https://picsum.photos/1024/600?random=2'
  };

  readonly responsiveImageSet = {
    desktop: ResponsiveImageUtil.generateResponsiveImageSet(
      'https://picsum.photos/1920/600?random=3',
      { breakpoints: ResponsiveImageUtil.BREAKPOINTS.filter(bp => bp.minWidth >= 1024) }
    ),
    tablet: ResponsiveImageUtil.generateResponsiveImageSet(
      'https://picsum.photos/1024/1024?random=4',
      { breakpoints: ResponsiveImageUtil.BREAKPOINTS.filter(bp => bp.minWidth >= 768 && bp.minWidth < 1024) }
    ),
    mobile: ResponsiveImageUtil.generateResponsiveImageSet(
      'https://picsum.photos/600/800?random=5',
      { breakpoints: ResponsiveImageUtil.BREAKPOINTS.filter(bp => bp.minWidth < 768) }
    ),
    fallback: 'https://picsum.photos/1024/600?random=6'
  };

  // Computed values
  readonly performanceAnalysis = computed(() => this.imageOptimizationService.getPerformanceAnalysis());
  readonly generatedReport = this._generatedReport.asReadonly();

  readonly supportedFormats = computed(() => [
    { name: 'avif', supported: this.imageOptimizationService.isFormatSupported('avif') },
    { name: 'webp', supported: this.imageOptimizationService.isFormatSupported('webp') },
    { name: 'jpeg', supported: this.imageOptimizationService.isFormatSupported('jpeg') },
    { name: 'png', supported: this.imageOptimizationService.isFormatSupported('png') }
  ]);

  readonly formatDistribution = computed(() => {
    const analysis = this.performanceAnalysis();
    const total = analysis.totalImages || 1;
    
    return Object.entries(analysis.formatDistribution || {}).map(([name, count]) => ({
      name,
      count: count as number,
      percentage: ((count as number) / total) * 100
    }));
  });

  readonly gridImages = signal([
    { id: 1, src: 'https://picsum.photos/400/300?random=10', alt: 'Grid image 1' },
    { id: 2, src: 'https://picsum.photos/400/300?random=11', alt: 'Grid image 2' },
    { id: 3, src: 'https://picsum.photos/400/300?random=12', alt: 'Grid image 3' },
    { id: 4, src: 'https://picsum.photos/400/300?random=13', alt: 'Grid image 4' },
    { id: 5, src: 'https://picsum.photos/400/300?random=14', alt: 'Grid image 5' },
    { id: 6, src: 'https://picsum.photos/400/300?random=15', alt: 'Grid image 6' }
  ]);

  readonly lazyImages = signal([
    { id: 1, src: 'https://picsum.photos/600/300?random=20', alt: 'Lazy image 1' },
    { id: 2, src: 'https://picsum.photos/600/300?random=21', alt: 'Lazy image 2' },
    { id: 3, src: 'https://picsum.photos/600/300?random=22', alt: 'Lazy image 3' }
  ]);

  readonly backgroundImages = signal([
    { id: 1, src: 'https://picsum.photos/600/300?random=30', title: 'Background 1' },
    { id: 2, src: 'https://picsum.photos/600/300?random=31', title: 'Background 2' },
    { id: 3, src: 'https://picsum.photos/600/300?random=32', title: 'Background 3' }
  ]);

  ngOnInit(): void {
    this.initializeSampleMetrics();
  }

  /**
   * Handle image load events
   */
  onImageLoad(event: any): void {
    this.imageOptimizationService.recordOptimization({
      originalSize: 500000, // Simulated
      optimizedSize: Math.round(500000 * 0.7), // Simulated 30% reduction
      compressionRatio: 0.7,
      formatUsed: event.format || 'jpeg',
      loadTime: event.loadTime
    });
  }

  /**
   * Handle lazy load events
   */
  onLazyLoad(event: any): void {
    console.log('🖼️ Lazy loaded:', event);
    this.onImageLoad(event);
  }

  /**
   * Handle lazy load errors
   */
  onLazyError(event: any): void {
    console.warn('❌ Lazy load error:', event);
  }

  /**
   * Handle background load events
   */
  onBackgroundLoad(event: any): void {
    console.log('🎨 Background loaded:', event);
    this.onImageLoad(event);
  }

  /**
   * Clear performance metrics
   */
  clearMetrics(): void {
    this.imageOptimizationService.clearMetrics();
    this._generatedReport.set('');
  }

  /**
   * Generate performance report
   */
  generateReport(): void {
    const analysis = this.performanceAnalysis();
    
    let report = '# Image Optimization Performance Report\n\n';
    report += `## Summary\n`;
    report += `- Total Images: ${analysis.totalImages}\n`;
    report += `- Average Load Time: ${analysis.averageLoadTime.toFixed(2)}ms\n`;
    report += `- Average Compression Ratio: ${(analysis.averageCompressionRatio * 100).toFixed(1)}%\n`;
    report += `- Total Size Saved: ${this.formatBytes(analysis.totalSizeSaved)}\n\n`;

    report += `## Format Distribution\n`;
    Object.entries(analysis.formatDistribution || {}).forEach(([format, count]) => {
      report += `- ${format.toUpperCase()}: ${count} images\n`;
    });

    report += `\n## Recommendations\n`;
    analysis.recommendations.forEach((rec: string) => {
      report += `- ${rec}\n`;
    });

    report += `\n## Browser Support\n`;
    this.supportedFormats().forEach(format => {
      report += `- ${format.name.toUpperCase()}: ${format.supported ? '✓ Supported' : '✗ Not Supported'}\n`;
    });

    this._generatedReport.set(report);
  }

  /**
   * Test format support
   */
  testFormats(): void {
    const formats = ['avif', 'webp', 'jpeg', 'png'];
    
    let report = '# Format Support Test Results\n\n';
    
    formats.forEach(format => {
      const supported = this.imageOptimizationService.isFormatSupported(format);
      const bestFormat = this.imageOptimizationService.getBestFormat();
      
      report += `## ${format.toUpperCase()}\n`;
      report += `- Supported: ${supported ? '✓ Yes' : '✗ No'}\n`;
      report += `- Best Format: ${bestFormat === format ? '✓ Recommended' : '○ Alternative'}\n\n`;
    });

    report += `## Optimization Recommendations\n`;
    const sampleRecommendations = this.imageOptimizationService.getOptimizationRecommendations(this.sampleImages.hero);
    sampleRecommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });

    this._generatedReport.set(report);
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Initialize sample metrics for demonstration
   */
  private initializeSampleMetrics(): void {
    // Simulate some initial metrics
    const sampleMetrics = [
      {
        originalSize: 800000,
        optimizedSize: 560000,
        compressionRatio: 0.7,
        formatUsed: 'webp',
        loadTime: 450
      },
      {
        originalSize: 1200000,
        optimizedSize: 600000,
        compressionRatio: 0.5,
        formatUsed: 'avif',
        loadTime: 320
      },
      {
        originalSize: 600000,
        optimizedSize: 480000,
        compressionRatio: 0.8,
        formatUsed: 'jpeg',
        loadTime: 280
      }
    ];

    sampleMetrics.forEach(metrics => {
      this.imageOptimizationService.recordOptimization(metrics);
    });
  }
}