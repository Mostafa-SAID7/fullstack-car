import { Injectable, signal, computed } from '@angular/core';

export interface BundleInfo {
  name: string;
  size: number;
  gzipSize?: number;
  modules: string[];
  loadTime?: number;
  cached: boolean;
}

export interface OptimizationMetrics {
  totalBundleSize: number;
  gzippedSize: number;
  unusedCode: number;
  duplicateModules: string[];
  largestBundles: BundleInfo[];
  optimizationSuggestions: string[];
}

/**
 * Bundle Optimizer Service
 * 
 * Analyzes and optimizes bundle sizes with tree shaking and dead code elimination
 */
@Injectable({
  providedIn: 'root'
})
export class BundleOptimizerService {
  private _bundles = signal<Map<string, BundleInfo>>(new Map());
  private _optimizationMetrics = signal<OptimizationMetrics>({
    totalBundleSize: 0,
    gzippedSize: 0,
    unusedCode: 0,
    duplicateModules: [],
    largestBundles: [],
    optimizationSuggestions: []
  });

  readonly bundles = computed(() => Array.from(this._bundles().values()));
  readonly metrics = this._optimizationMetrics.asReadonly();
  readonly totalSize = computed(() => 
    this.bundles().reduce((total, bundle) => total + bundle.size, 0)
  );
  readonly averageBundleSize = computed(() => {
    const bundles = this.bundles();
    return bundles.length > 0 ? this.totalSize() / bundles.length : 0;
  });

  /**
   * Register a bundle for analysis
   */
  registerBundle(bundle: BundleInfo): void {
    this._bundles.update(bundles => {
      const newBundles = new Map(bundles);
      newBundles.set(bundle.name, bundle);
      return newBundles;
    });
    this.updateMetrics();
  }

  /**
   * Analyze bundle composition and suggest optimizations
   */
  analyzeBundles(): OptimizationMetrics {
    const bundles = this.bundles();
    const suggestions: string[] = [];
    const duplicateModules: string[] = [];
    
    // Find duplicate modules across bundles
    const moduleMap = new Map<string, string[]>();
    bundles.forEach(bundle => {
      bundle.modules.forEach(module => {
        if (!moduleMap.has(module)) {
          moduleMap.set(module, []);
        }
        moduleMap.get(module)!.push(bundle.name);
      });
    });

    // Identify duplicates
    moduleMap.forEach((bundleNames, module) => {
      if (bundleNames.length > 1) {
        duplicateModules.push(module);
      }
    });

    // Generate optimization suggestions
    if (duplicateModules.length > 0) {
      suggestions.push(`Found ${duplicateModules.length} duplicate modules that could be moved to a shared chunk`);
    }

    const largeBundles = bundles.filter(b => b.size > 250000); // > 250KB
    if (largeBundles.length > 0) {
      suggestions.push(`${largeBundles.length} bundles are larger than 250KB and could benefit from code splitting`);
    }

    const totalSize = this.totalSize();
    const estimatedGzipSize = Math.floor(totalSize * 0.3); // Rough estimate

    if (totalSize > 2000000) { // > 2MB
      suggestions.push('Total bundle size exceeds 2MB - consider implementing more aggressive lazy loading');
    }

    const metrics: OptimizationMetrics = {
      totalBundleSize: totalSize,
      gzippedSize: estimatedGzipSize,
      unusedCode: this.estimateUnusedCode(),
      duplicateModules,
      largestBundles: bundles.sort((a, b) => b.size - a.size).slice(0, 5),
      optimizationSuggestions: suggestions
    };

    this._optimizationMetrics.set(metrics);
    return metrics;
  }

  /**
   * Get tree shaking opportunities
   */
  getTreeShakingOpportunities(): string[] {
    const opportunities: string[] = [];
    const bundles = this.bundles();

    bundles.forEach(bundle => {
      // Check for common tree-shaking opportunities
      const hasLodash = bundle.modules.some(m => m.includes('lodash'));
      const hasMoment = bundle.modules.some(m => m.includes('moment'));
      const hasRxjs = bundle.modules.some(m => m.includes('rxjs'));

      if (hasLodash) {
        opportunities.push(`Bundle "${bundle.name}" includes Lodash - consider using lodash-es or individual imports`);
      }

      if (hasMoment) {
        opportunities.push(`Bundle "${bundle.name}" includes Moment.js - consider switching to date-fns or day.js`);
      }

      if (hasRxjs && bundle.size > 100000) {
        opportunities.push(`Bundle "${bundle.name}" has large RxJS footprint - ensure only used operators are imported`);
      }
    });

    return opportunities;
  }

  /**
   * Optimize import statements for better tree shaking
   */
  getOptimizedImports(): Record<string, string[]> {
    return {
      'lodash': [
        '// Instead of: import _ from "lodash"',
        '// Use: import { debounce, throttle } from "lodash-es"',
        '// Or: import debounce from "lodash-es/debounce"'
      ],
      'rxjs': [
        '// Instead of: import { Observable } from "rxjs"',
        '// Use: import { map, filter } from "rxjs/operators"',
        '// Import only what you need from rxjs/operators'
      ],
      'angular-material': [
        '// Instead of: import { MatModule } from "@angular/material"',
        '// Use: import { MatButtonModule } from "@angular/material/button"',
        '// Import individual modules only'
      ],
      'date-libraries': [
        '// Instead of: import moment from "moment"',
        '// Use: import { format } from "date-fns"',
        '// Or: import dayjs from "dayjs"'
      ]
    };
  }

  /**
   * Generate webpack bundle analyzer report
   */
  generateBundleReport(): string {
    const bundles = this.bundles();
    const metrics = this.metrics();
    
    let report = '# Bundle Analysis Report\n\n';
    report += `## Summary\n`;
    report += `- Total Bundle Size: ${this.formatBytes(metrics.totalBundleSize)}\n`;
    report += `- Estimated Gzipped: ${this.formatBytes(metrics.gzippedSize)}\n`;
    report += `- Number of Bundles: ${bundles.length}\n`;
    report += `- Average Bundle Size: ${this.formatBytes(this.averageBundleSize())}\n\n`;

    report += `## Largest Bundles\n`;
    metrics.largestBundles.forEach((bundle, index) => {
      report += `${index + 1}. ${bundle.name}: ${this.formatBytes(bundle.size)}\n`;
    });

    report += `\n## Optimization Suggestions\n`;
    metrics.optimizationSuggestions.forEach(suggestion => {
      report += `- ${suggestion}\n`;
    });

    if (metrics.duplicateModules.length > 0) {
      report += `\n## Duplicate Modules\n`;
      metrics.duplicateModules.slice(0, 10).forEach(module => {
        report += `- ${module}\n`;
      });
    }

    const treeShakingOps = this.getTreeShakingOpportunities();
    if (treeShakingOps.length > 0) {
      report += `\n## Tree Shaking Opportunities\n`;
      treeShakingOps.forEach(op => {
        report += `- ${op}\n`;
      });
    }

    return report;
  }

  /**
   * Clear all bundle data
   */
  clearBundles(): void {
    this._bundles.set(new Map());
    this.updateMetrics();
  }

  private estimateUnusedCode(): number {
    // Rough estimation based on common patterns
    const totalSize = this.totalSize();
    return Math.floor(totalSize * 0.15); // Estimate 15% unused code
  }

  private updateMetrics(): void {
    // Trigger metrics recalculation
    this.analyzeBundles();
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

/**
 * Tree Shaking Utility
 * 
 * Provides utilities for optimizing imports and reducing bundle size
 */
export class TreeShakingUtil {
  /**
   * Analyze import statements for optimization opportunities
   */
  static analyzeImports(sourceCode: string): string[] {
    const suggestions: string[] = [];
    const lines = sourceCode.split('\n');

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Check for barrel imports
      if (trimmed.includes('import {') && trimmed.includes('} from')) {
        const importMatch = trimmed.match(/import\s*{([^}]+)}\s*from\s*['"]([^'"]+)['"]/);
        if (importMatch) {
          const imports = importMatch[1].split(',').map(i => i.trim());
          const module = importMatch[2];

          // Suggest specific imports for large libraries
          if (module.includes('lodash') && !module.includes('lodash-es')) {
            suggestions.push(`Line ${index + 1}: Consider using 'lodash-es' for better tree shaking`);
          }

          if (module.includes('@angular/material') && imports.length > 5) {
            suggestions.push(`Line ${index + 1}: Consider splitting Material imports across multiple lines`);
          }

          if (module.includes('rxjs') && !module.includes('operators')) {
            suggestions.push(`Line ${index + 1}: Import RxJS operators from 'rxjs/operators' for better tree shaking`);
          }
        }
      }

      // Check for default imports of large libraries
      if (trimmed.includes('import') && !trimmed.includes('{')) {
        if (trimmed.includes('moment')) {
          suggestions.push(`Line ${index + 1}: Consider using date-fns or dayjs instead of moment for smaller bundle size`);
        }
        
        if (trimmed.includes('lodash')) {
          suggestions.push(`Line ${index + 1}: Use specific lodash imports instead of default import`);
        }
      }
    });

    return suggestions;
  }

  /**
   * Generate optimized import suggestions
   */
  static getOptimizedImportSuggestions(module: string): string[] {
    const suggestions: Record<string, string[]> = {
      'lodash': [
        "import { debounce } from 'lodash-es/debounce';",
        "import { throttle } from 'lodash-es/throttle';",
        "// Use individual imports for better tree shaking"
      ],
      'moment': [
        "import { format } from 'date-fns';",
        "import { parseISO } from 'date-fns';",
        "// Consider date-fns for smaller bundle size"
      ],
      'rxjs': [
        "import { map, filter } from 'rxjs/operators';",
        "import { Observable } from 'rxjs';",
        "// Import operators separately for better tree shaking"
      ]
    };

    return suggestions[module] || [];
  }
}