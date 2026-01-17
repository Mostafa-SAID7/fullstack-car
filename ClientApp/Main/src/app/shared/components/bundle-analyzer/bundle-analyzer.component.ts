import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BundleOptimizerService } from '../../../core/services/bundle-optimizer.service';
import { LibraryOptimizerService } from '../../../core/services/library-optimizer.service';
import { ChunkSplittingService } from '../../../core/services/chunk-splitting.service';

/**
 * Bundle Analyzer Component
 * 
 * Provides visual analysis of bundle sizes, optimization opportunities,
 * and performance recommendations
 */
@Component({
  selector: 'app-bundle-analyzer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bundle-analyzer p-6 max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-center">📊 Bundle Analysis & Optimization</h2>
      
      <!-- Bundle Overview -->
      <div class="overview-cards grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stat-card bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div class="text-3xl font-bold text-blue-600">{{ formatBytes(bundleMetrics().totalBundleSize) }}</div>
          <div class="text-sm text-blue-800 mt-2">Total Bundle Size</div>
        </div>
        
        <div class="stat-card bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div class="text-3xl font-bold text-green-600">{{ formatBytes(bundleMetrics().gzippedSize) }}</div>
          <div class="text-sm text-green-800 mt-2">Gzipped Size</div>
        </div>
        
        <div class="stat-card bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div class="text-3xl font-bold text-yellow-600">{{ bundleMetrics().duplicateModules.length }}</div>
          <div class="text-sm text-yellow-800 mt-2">Duplicate Modules</div>
        </div>
        
        <div class="stat-card bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <div class="text-3xl font-bold text-purple-600">{{ formatBytes(bundleMetrics().unusedCode) }}</div>
          <div class="text-sm text-purple-800 mt-2">Estimated Unused</div>
        </div>
      </div>

      <!-- Optimization Strategies -->
      <div class="optimization-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">🚀 Optimization Strategies</h3>
        
        <div class="strategies-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
          @for (strategy of optimizationStrategies(); track strategy.library) {
            <div class="strategy-card bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold">{{ strategy.library }}</h4>
                <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  -{{ formatBytes(strategy.currentSize - strategy.optimizedSize) }}
                </span>
              </div>
              
              <div class="mb-4">
                <div class="text-sm text-gray-600 mb-2">{{ strategy.strategy }}</div>
                <div class="flex justify-between text-sm">
                  <span>Current: {{ formatBytes(strategy.currentSize) }}</span>
                  <span class="text-green-600">Optimized: {{ formatBytes(strategy.optimizedSize) }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    class="bg-green-500 h-2 rounded-full transition-all duration-300"
                    [style.width.%]="(strategy.optimizedSize / strategy.currentSize) * 100">
                  </div>
                </div>
              </div>
              
              <div class="implementation-steps">
                <div class="text-sm font-medium text-gray-700 mb-2">Implementation:</div>
                <ul class="text-xs text-gray-600 space-y-1">
                  @for (step of strategy.implementation; track step) {
                    <li class="flex items-start">
                      <span class="text-green-500 mr-2">•</span>
                      <span>{{ step }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Tree Shaking Opportunities -->
      <div class="tree-shaking-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">🌳 Tree Shaking Opportunities</h3>
        
        <div class="opportunities-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
          @for (opportunity of treeShakingOpportunities(); track opportunity) {
            <div class="opportunity-card bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-start">
                <div class="text-yellow-500 mr-3 mt-1">⚠️</div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-yellow-800">{{ opportunity }}</div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Chunk Analysis -->
      <div class="chunk-analysis-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">📦 Chunk Distribution Analysis</h3>
        
        <div class="chunk-stats bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-800">{{ chunkAnalysis().totalChunks }}</div>
              <div class="text-sm text-gray-600">Total Chunks</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-800">{{ formatBytes(chunkAnalysis().averageChunkSize) }}</div>
              <div class="text-sm text-gray-600">Average Size</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-800">{{ chunkAnalysis().distribution.critical }}</div>
              <div class="text-sm text-gray-600">Critical Chunks</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-800">{{ chunkAnalysis().distribution.high + chunkAnalysis().distribution.medium }}</div>
              <div class="text-sm text-gray-600">Async Chunks</div>
            </div>
          </div>
        </div>

        <!-- Chunk Recommendations -->
        @if (chunkAnalysis().recommendations.length > 0) {
          <div class="recommendations bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-800 mb-4">💡 Recommendations</h4>
            <ul class="space-y-2">
              @for (recommendation of chunkAnalysis().recommendations; track recommendation) {
                <li class="flex items-start text-sm text-blue-700">
                  <span class="text-blue-500 mr-2">•</span>
                  <span>{{ recommendation }}</span>
                </li>
              }
            </ul>
          </div>
        }
      </div>

      <!-- Optimization Actions -->
      <div class="actions-section mb-8">
        <h3 class="text-2xl font-semibold mb-6">⚡ Quick Actions</h3>
        
        <div class="actions-grid grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            (click)="generateBundleReport()"
            class="action-btn bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            📄 Generate Report
          </button>
          
          <button 
            (click)="analyzeTreeShaking()"
            class="action-btn bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            🌳 Analyze Tree Shaking
          </button>
          
          <button 
            (click)="optimizeChunks()"
            class="action-btn bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            📦 Optimize Chunks
          </button>
        </div>
      </div>

      <!-- Generated Report -->
      @if (generatedReport()) {
        <div class="report-section">
          <h3 class="text-2xl font-semibold mb-6">📋 Analysis Report</h3>
          <div class="report-content bg-gray-50 border border-gray-200 rounded-lg p-6">
            <pre class="text-sm text-gray-800 whitespace-pre-wrap font-mono">{{ generatedReport() }}</pre>
          </div>
        </div>
      }

      <!-- Webpack Configuration Preview -->
      <div class="webpack-config-section mt-8">
        <h3 class="text-2xl font-semibold mb-6">⚙️ Optimized Webpack Configuration</h3>
        
        <div class="config-tabs mb-4">
          <div class="flex space-x-2">
            <button 
              (click)="setConfigTab('performance')"
              [class]="configTab() === 'performance' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
              class="px-4 py-2 rounded-lg transition-colors">
              Performance
            </button>
            <button 
              (click)="setConfigTab('cache')"
              [class]="configTab() === 'cache' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
              class="px-4 py-2 rounded-lg transition-colors">
              Cache Optimized
            </button>
            <button 
              (click)="setConfigTab('balanced')"
              [class]="configTab() === 'balanced' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
              class="px-4 py-2 rounded-lg transition-colors">
              Balanced
            </button>
          </div>
        </div>
        
        <div class="config-preview bg-gray-900 text-green-400 rounded-lg p-6 overflow-x-auto">
          <pre class="text-sm font-mono">{{ getWebpackConfigPreview() }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bundle-analyzer {
      font-family: system-ui, -apple-system, sans-serif;
    }
    
    .stat-card {
      transition: transform 0.2s ease-in-out;
    }
    
    .stat-card:hover {
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
    
    .config-preview {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .config-preview::-webkit-scrollbar {
      width: 8px;
    }
    
    .config-preview::-webkit-scrollbar-track {
      background: #374151;
    }
    
    .config-preview::-webkit-scrollbar-thumb {
      background: #6b7280;
      border-radius: 4px;
    }
  `]
})
export class BundleAnalyzerComponent implements OnInit {
  private bundleOptimizer = inject(BundleOptimizerService);
  private libraryOptimizer = inject(LibraryOptimizerService);
  private chunkSplitting = inject(ChunkSplittingService);

  // Signals for component state
  private _generatedReport = signal<string>('');
  private _configTab = signal<'performance' | 'cache' | 'balanced'>('balanced');

  // Computed values
  readonly bundleMetrics = computed(() => this.bundleOptimizer.metrics());
  readonly optimizationStrategies = computed(() => this.libraryOptimizer.getOptimizationStrategies());
  readonly treeShakingOpportunities = computed(() => this.bundleOptimizer.getTreeShakingOpportunities());
  readonly chunkAnalysis = computed(() => this.chunkSplitting.analyzeChunkDistribution());
  readonly generatedReport = this._generatedReport.asReadonly();
  readonly configTab = this._configTab.asReadonly();

  ngOnInit(): void {
    this.initializeSampleData();
  }

  /**
   * Generate comprehensive bundle analysis report
   */
  generateBundleReport(): void {
    const report = this.bundleOptimizer.generateBundleReport();
    this._generatedReport.set(report);
  }

  /**
   * Analyze tree shaking opportunities
   */
  analyzeTreeShaking(): void {
    const opportunities = this.bundleOptimizer.getTreeShakingOpportunities();
    const optimizedImports = this.bundleOptimizer.getOptimizedImports();
    
    let report = '# Tree Shaking Analysis\n\n';
    report += '## Opportunities Found:\n';
    opportunities.forEach(op => {
      report += `- ${op}\n`;
    });
    
    report += '\n## Optimized Import Suggestions:\n';
    Object.entries(optimizedImports).forEach(([lib, suggestions]) => {
      report += `\n### ${lib}:\n`;
      suggestions.forEach(suggestion => {
        report += `${suggestion}\n`;
      });
    });

    this._generatedReport.set(report);
  }

  /**
   * Optimize chunk configuration
   */
  optimizeChunks(): void {
    const recommendations = this.chunkSplitting.getLoadingRecommendations();
    const config = this.chunkSplitting.getOptimalSplittingConfig();
    
    let report = '# Chunk Optimization Analysis\n\n';
    report += '## Recommendations:\n';
    recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    
    report += '\n## Optimized Configuration:\n';
    report += '```javascript\n';
    report += JSON.stringify(config, null, 2);
    report += '\n```';

    this._generatedReport.set(report);
  }

  /**
   * Set active configuration tab
   */
  setConfigTab(tab: 'performance' | 'cache' | 'balanced'): void {
    this._configTab.set(tab);
  }

  /**
   * Get webpack configuration preview for selected tab
   */
  getWebpackConfigPreview(): string {
    const config = this.chunkSplitting.generateWebpackConfig(this.configTab());
    return JSON.stringify(config, null, 2);
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
   * Initialize sample data for demonstration
   */
  private initializeSampleData(): void {
    // Register sample bundles
    this.bundleOptimizer.registerBundle({
      name: 'main',
      size: 450000,
      gzipSize: 135000,
      modules: ['@angular/core', '@angular/common', 'src/app/app.component'],
      cached: true
    });

    this.bundleOptimizer.registerBundle({
      name: 'vendor',
      size: 680000,
      gzipSize: 204000,
      modules: ['lodash', 'moment', 'rxjs'],
      cached: false
    });

    this.bundleOptimizer.registerBundle({
      name: 'angular',
      size: 320000,
      gzipSize: 96000,
      modules: ['@angular/core', '@angular/common', '@angular/router'],
      cached: true
    });

    // Register sample chunks
    this.chunkSplitting.registerChunk({
      name: 'main',
      size: 450000,
      modules: ['app.component', 'main.ts'],
      priority: 'critical',
      cacheHit: true
    });

    this.chunkSplitting.registerChunk({
      name: 'vendor',
      size: 680000,
      modules: ['lodash', 'moment', 'chart.js'],
      priority: 'high',
      cacheHit: false
    });

    this.chunkSplitting.registerChunk({
      name: 'feature-media',
      size: 280000,
      modules: ['media.module', 'video-player.component'],
      priority: 'medium',
      cacheHit: true
    });

    // Trigger analysis
    this.bundleOptimizer.analyzeBundles();
  }
}