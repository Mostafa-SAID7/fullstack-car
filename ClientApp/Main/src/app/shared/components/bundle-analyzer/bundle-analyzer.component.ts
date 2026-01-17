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
  templateUrl: './bundle-analyzer.component.html',
  styleUrls: ['./bundle-analyzer.component.scss']
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