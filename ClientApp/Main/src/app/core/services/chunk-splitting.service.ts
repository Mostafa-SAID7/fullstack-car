import { Injectable, signal, computed } from '@angular/core';

export interface ChunkInfo {
  name: string;
  size: number;
  modules: string[];
  loadTime?: number;
  cacheHit: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface SplittingStrategy {
  name: string;
  description: string;
  chunks: ChunkConfig[];
  expectedSavings: number;
  implementation: string[];
}

export interface ChunkConfig {
  name: string;
  test: string;
  priority: number;
  chunks: 'all' | 'async' | 'initial';
  minChunks?: number;
  maxSize?: number;
  cacheGroups?: boolean;
}

/**
 * Chunk Splitting Service
 * 
 * Manages efficient chunk splitting strategies for optimal loading performance
 */
@Injectable({
  providedIn: 'root'
})
export class ChunkSplittingService {
  private _chunks = signal<Map<string, ChunkInfo>>(new Map());
  private _strategies = signal<SplittingStrategy[]>([]);

  readonly chunks = computed(() => Array.from(this._chunks().values()));
  readonly strategies = this._strategies.asReadonly();
  readonly totalChunkSize = computed(() => 
    this.chunks().reduce((total, chunk) => total + chunk.size, 0)
  );
  readonly criticalChunks = computed(() => 
    this.chunks().filter(chunk => chunk.priority === 'critical')
  );

  constructor() {
    this.initializeStrategies();
  }

  /**
   * Register a chunk for analysis
   */
  registerChunk(chunk: ChunkInfo): void {
    this._chunks.update(chunks => {
      const newChunks = new Map(chunks);
      newChunks.set(chunk.name, chunk);
      return newChunks;
    });
  }

  /**
   * Get optimal chunk splitting configuration
   */
  getOptimalSplittingConfig(): any {
    return {
      splitChunks: {
        chunks: 'all',
        minSize: 20000, // 20KB minimum
        maxSize: 250000, // 250KB maximum
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000, // 50KB
        
        cacheGroups: {
          // Critical runtime chunk
          runtime: {
            name: 'runtime',
            chunks: 'all',
            test: /[\\/]webpack[\\/]runtime/,
            priority: 100,
            enforce: true
          },

          // Angular framework - highest priority
          angular: {
            name: 'angular',
            test: /[\\/]node_modules[\\/]@angular[\\/]/,
            chunks: 'all',
            priority: 90,
            reuseExistingChunk: true,
            enforce: true
          },

          // Angular CDK and Material
          angularUI: {
            name: 'angular-ui',
            test: /[\\/]node_modules[\\/]@angular[\\/](cdk|material)[\\/]/,
            chunks: 'all',
            priority: 85,
            reuseExistingChunk: true
          },

          // RxJS - separate chunk for reactive programming
          rxjs: {
            name: 'rxjs',
            test: /[\\/]node_modules[\\/]rxjs[\\/]/,
            chunks: 'all',
            priority: 80,
            reuseExistingChunk: true
          },

          // Large third-party libraries
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/](lodash|moment|chart\.js|d3)[\\/]/,
            chunks: 'all',
            priority: 70,
            reuseExistingChunk: true
          },

          // UI and styling libraries
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/](tailwindcss|@headlessui|@heroicons)[\\/]/,
            chunks: 'all',
            priority: 65,
            reuseExistingChunk: true
          },

          // Utility libraries
          utils: {
            name: 'utils',
            test: /[\\/]node_modules[\\/](date-fns|validator|uuid|crypto-js)[\\/]/,
            chunks: 'all',
            priority: 60,
            reuseExistingChunk: true
          },

          // Translation libraries
          i18n: {
            name: 'i18n',
            test: /[\\/]node_modules[\\/](@ngx-translate|@angular[\\/]localize)[\\/]/,
            chunks: 'all',
            priority: 55,
            reuseExistingChunk: true
          },

          // Core application services
          core: {
            name: 'core',
            test: /[\\/]src[\\/]app[\\/]core[\\/]/,
            chunks: 'all',
            priority: 50,
            minChunks: 2,
            reuseExistingChunk: true
          },

          // Shared components
          shared: {
            name: 'shared',
            test: /[\\/]src[\\/]app[\\/]shared[\\/]/,
            chunks: 'all',
            priority: 45,
            minChunks: 2,
            reuseExistingChunk: true
          },

          // Feature modules - async loading
          features: {
            name(module: any) {
              const featureName = module.context?.match(/[\\/]features[\\/]([^[\\/]]*)/);
              return featureName ? `feature-${featureName[1]}` : 'features';
            },
            test: /[\\/]src[\\/]app[\\/]features[\\/]/,
            chunks: 'async',
            priority: 40,
            minChunks: 1,
            reuseExistingChunk: true
          },

          // Layout components
          layout: {
            name: 'layout',
            test: /[\\/]src[\\/]app[\\/]layout[\\/]/,
            chunks: 'all',
            priority: 35,
            minChunks: 1,
            reuseExistingChunk: true
          },

          // Common vendor libraries
          common: {
            name: 'common',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 20,
            minChunks: 2,
            maxSize: 200000, // 200KB max
            reuseExistingChunk: true
          },

          // Default chunk for remaining modules
          default: {
            name: 'default',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            maxSize: 150000 // 150KB max
          }
        }
      }
    };
  }

  /**
   * Get performance-optimized splitting strategy
   */
  getPerformanceStrategy(): SplittingStrategy {
    return {
      name: 'Performance-First',
      description: 'Optimizes for fastest initial load and best Core Web Vitals',
      chunks: [
        {
          name: 'critical',
          test: '/[\\/](main|polyfills|runtime)[\\/]/',
          priority: 100,
          chunks: 'initial'
        },
        {
          name: 'framework',
          test: '/[\\/]node_modules[\\/]@angular[\\/]/',
          priority: 90,
          chunks: 'all',
          maxSize: 200000
        },
        {
          name: 'vendor',
          test: '/[\\/]node_modules[\\/]/',
          priority: 50,
          chunks: 'async',
          maxSize: 150000
        }
      ],
      expectedSavings: 35,
      implementation: [
        'Prioritize critical path resources',
        'Defer non-essential vendor libraries',
        'Implement aggressive code splitting for features',
        'Use resource hints for preloading'
      ]
    };
  }

  /**
   * Get cache-optimized splitting strategy
   */
  getCacheStrategy(): SplittingStrategy {
    return {
      name: 'Cache-Optimized',
      description: 'Maximizes cache efficiency and reduces re-downloads',
      chunks: [
        {
          name: 'stable',
          test: '/[\\/]node_modules[\\/]@angular[\\/]/',
          priority: 90,
          chunks: 'all'
        },
        {
          name: 'vendor',
          test: '/[\\/]node_modules[\\/]/',
          priority: 70,
          chunks: 'all',
          minChunks: 2
        },
        {
          name: 'app',
          test: '/[\\/]src[\\/]app[\\/]/',
          priority: 50,
          chunks: 'all',
          minChunks: 1
        }
      ],
      expectedSavings: 25,
      implementation: [
        'Separate stable framework code',
        'Group frequently changing application code',
        'Optimize for long-term caching',
        'Minimize cache invalidation'
      ]
    };
  }

  /**
   * Analyze current chunk distribution
   */
  analyzeChunkDistribution(): any {
    const chunks = this.chunks();
    const totalSize = this.totalChunkSize();
    
    const analysis = {
      totalChunks: chunks.length,
      totalSize: totalSize,
      averageChunkSize: chunks.length > 0 ? totalSize / chunks.length : 0,
      largestChunk: chunks.reduce((max, chunk) => chunk.size > max.size ? chunk : max, chunks[0]),
      smallestChunk: chunks.reduce((min, chunk) => chunk.size < min.size ? chunk : min, chunks[0]),
      distribution: {
        critical: chunks.filter(c => c.priority === 'critical').length,
        high: chunks.filter(c => c.priority === 'high').length,
        medium: chunks.filter(c => c.priority === 'medium').length,
        low: chunks.filter(c => c.priority === 'low').length
      },
      recommendations: this.generateRecommendations(chunks)
    };

    return analysis;
  }

  /**
   * Generate chunk loading recommendations
   */
  getLoadingRecommendations(): string[] {
    const chunks = this.chunks();
    const recommendations: string[] = [];

    // Check for oversized chunks
    const largeChunks = chunks.filter(chunk => chunk.size > 250000);
    if (largeChunks.length > 0) {
      recommendations.push(`Split ${largeChunks.length} oversized chunks (>250KB)`);
    }

    // Check for too many small chunks
    const smallChunks = chunks.filter(chunk => chunk.size < 20000);
    if (smallChunks.length > 5) {
      recommendations.push(`Consider merging ${smallChunks.length} small chunks (<20KB)`);
    }

    // Check critical path optimization
    const criticalChunks = this.criticalChunks();
    const criticalSize = criticalChunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (criticalSize > 150000) {
      recommendations.push('Critical path chunks exceed 150KB - consider further splitting');
    }

    // Check for cache optimization
    const cacheHitRate = chunks.filter(c => c.cacheHit).length / chunks.length;
    if (cacheHitRate < 0.7) {
      recommendations.push('Low cache hit rate - optimize chunk splitting for better caching');
    }

    return recommendations;
  }

  /**
   * Generate webpack configuration for chunk splitting
   */
  generateWebpackConfig(strategy: 'performance' | 'cache' | 'balanced' = 'balanced'): any {
    switch (strategy) {
      case 'performance':
        return this.getPerformanceOptimizedConfig();
      case 'cache':
        return this.getCacheOptimizedConfig();
      default:
        return this.getOptimalSplittingConfig();
    }
  }

  private initializeStrategies(): void {
    const strategies: SplittingStrategy[] = [
      this.getPerformanceStrategy(),
      this.getCacheStrategy(),
      {
        name: 'Balanced',
        description: 'Balances performance and cache efficiency',
        chunks: [
          {
            name: 'runtime',
            test: '/runtime/',
            priority: 100,
            chunks: 'all'
          },
          {
            name: 'framework',
            test: '/[\\/]@angular[\\/]/',
            priority: 80,
            chunks: 'all'
          },
          {
            name: 'vendor',
            test: '/[\\/]node_modules[\\/]/',
            priority: 60,
            chunks: 'all'
          },
          {
            name: 'app',
            test: '/[\\/]src[\\/]/',
            priority: 40,
            chunks: 'all'
          }
        ],
        expectedSavings: 30,
        implementation: [
          'Balance initial load performance with cache efficiency',
          'Moderate chunk splitting for optimal user experience',
          'Consider both first-time and returning users'
        ]
      }
    ];

    this._strategies.set(strategies);
  }

  private generateRecommendations(chunks: ChunkInfo[]): string[] {
    const recommendations: string[] = [];
    
    if (chunks.length > 20) {
      recommendations.push('Too many chunks - consider consolidating similar modules');
    }
    
    if (chunks.length < 5) {
      recommendations.push('Too few chunks - consider more aggressive splitting');
    }

    const avgSize = chunks.reduce((sum, c) => sum + c.size, 0) / chunks.length;
    if (avgSize > 200000) {
      recommendations.push('Average chunk size is large - implement more granular splitting');
    }

    return recommendations;
  }

  private getPerformanceOptimizedConfig(): any {
    return {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 3, // Limit initial requests for faster load
        maxAsyncRequests: 5,
        cacheGroups: {
          critical: {
            name: 'critical',
            test: /[\\/](main|polyfills)[\\/]/,
            priority: 100,
            chunks: 'initial',
            enforce: true
          },
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/]@angular[\\/]/,
            priority: 90,
            chunks: 'all',
            maxSize: 200000
          }
        }
      }
    };
  }

  private getCacheOptimizedConfig(): any {
    return {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          stable: {
            name: 'stable',
            test: /[\\/]node_modules[\\/](@angular|rxjs)[\\/]/,
            priority: 90,
            chunks: 'all',
            enforce: true
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 70,
            chunks: 'all',
            minChunks: 2
          }
        }
      }
    };
  }
}