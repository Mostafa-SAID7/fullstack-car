import { Injectable, signal, computed } from '@angular/core';

export interface LibraryInfo {
  name: string;
  version: string;
  size: number;
  treeshakeable: boolean;
  alternatives?: string[];
  optimizationTips: string[];
}

export interface OptimizationStrategy {
  library: string;
  currentSize: number;
  optimizedSize: number;
  strategy: string;
  implementation: string[];
}

/**
 * Library Optimizer Service
 * 
 * Optimizes third-party library imports and suggests alternatives
 */
@Injectable({
  providedIn: 'root'
})
export class LibraryOptimizerService {
  private _libraries = signal<Map<string, LibraryInfo>>(new Map());
  private _optimizationStrategies = signal<OptimizationStrategy[]>([]);

  readonly libraries = computed(() => Array.from(this._libraries().values()));
  readonly strategies = this._optimizationStrategies.asReadonly();
  readonly totalLibrarySize = computed(() => 
    this.libraries().reduce((total, lib) => total + lib.size, 0)
  );

  constructor() {
    this.initializeKnownLibraries();
  }

  /**
   * Register a library for optimization analysis
   */
  registerLibrary(library: LibraryInfo): void {
    this._libraries.update(libraries => {
      const newLibraries = new Map(libraries);
      newLibraries.set(library.name, library);
      return newLibraries;
    });
    this.generateOptimizationStrategies();
  }

  /**
   * Get optimization strategies for all registered libraries
   */
  getOptimizationStrategies(): OptimizationStrategy[] {
    return this.strategies();
  }

  /**
   * Get specific optimization for a library
   */
  getLibraryOptimization(libraryName: string): OptimizationStrategy | null {
    return this.strategies().find(s => s.library === libraryName) || null;
  }

  /**
   * Generate bundle splitting recommendations
   */
  getBundleSplittingRecommendations(): string[] {
    const recommendations: string[] = [];
    const libraries = this.libraries();

    // Large libraries that should be in separate chunks
    const largeLibraries = libraries.filter(lib => lib.size > 100000); // > 100KB
    if (largeLibraries.length > 0) {
      recommendations.push('Split large libraries into separate chunks:');
      largeLibraries.forEach(lib => {
        recommendations.push(`  - ${lib.name} (${this.formatBytes(lib.size)})`);
      });
    }

    // Framework libraries
    const angularLibs = libraries.filter(lib => lib.name.includes('@angular'));
    if (angularLibs.length > 0) {
      recommendations.push('Group Angular framework libraries into "angular" chunk');
    }

    // UI libraries
    const uiLibs = libraries.filter(lib => 
      lib.name.includes('material') || 
      lib.name.includes('bootstrap') || 
      lib.name.includes('tailwind')
    );
    if (uiLibs.length > 0) {
      recommendations.push('Group UI libraries into "ui" chunk');
    }

    return recommendations;
  }

  /**
   * Get tree shaking recommendations
   */
  getTreeShakingRecommendations(): Record<string, string[]> {
    const recommendations: Record<string, string[]> = {};
    const libraries = this.libraries();

    libraries.forEach(lib => {
      if (!lib.treeshakeable && lib.alternatives) {
        recommendations[lib.name] = [
          `${lib.name} is not tree-shakeable`,
          'Consider alternatives:',
          ...lib.alternatives.map(alt => `  - ${alt}`),
          ...lib.optimizationTips
        ];
      } else if (lib.treeshakeable) {
        recommendations[lib.name] = lib.optimizationTips;
      }
    });

    return recommendations;
  }

  /**
   * Generate webpack configuration for optimal library loading
   */
  generateWebpackConfig(): any {
    const libraries = this.libraries();
    
    return {
      optimization: {
        splitChunks: {
          cacheGroups: {
            // Angular framework
            angular: {
              test: /[\\/]node_modules[\\/]@angular[\\/]/,
              name: 'angular',
              chunks: 'all',
              priority: 30
            },
            
            // Large third-party libraries
            vendor: {
              test: /[\\/]node_modules[\\/](lodash|moment|rxjs|@ngrx)[\\/]/,
              name: 'vendor',
              chunks: 'all',
              priority: 20
            },
            
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@angular\/material|@angular\/cdk|tailwindcss)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 25
            },
            
            // Utilities
            utils: {
              test: /[\\/]node_modules[\\/](date-fns|validator|uuid)[\\/]/,
              name: 'utils',
              chunks: 'all',
              priority: 15
            }
          }
        }
      },
      
      // Module resolution optimizations
      resolve: {
        alias: this.generateAliases()
      }
    };
  }

  /**
   * Initialize known library optimizations
   */
  private initializeKnownLibraries(): void {
    const knownLibraries: LibraryInfo[] = [
      {
        name: 'lodash',
        version: '4.x',
        size: 528000, // ~528KB
        treeshakeable: false,
        alternatives: ['lodash-es', 'ramda', 'native ES6 methods'],
        optimizationTips: [
          'Use lodash-es for ES6 modules and better tree shaking',
          'Import individual functions: import debounce from "lodash-es/debounce"',
          'Consider native ES6 methods where possible'
        ]
      },
      {
        name: 'moment',
        version: '2.x',
        size: 232000, // ~232KB
        treeshakeable: false,
        alternatives: ['date-fns', 'dayjs', 'luxon'],
        optimizationTips: [
          'Switch to date-fns for modular date utilities',
          'Use dayjs for moment.js-like API with smaller size',
          'Consider native Date API for simple operations'
        ]
      },
      {
        name: 'rxjs',
        version: '7.x',
        size: 180000, // ~180KB
        treeshakeable: true,
        optimizationTips: [
          'Import operators from rxjs/operators',
          'Use pipeable operators for better tree shaking',
          'Avoid importing entire rxjs library'
        ]
      },
      {
        name: '@angular/material',
        version: '17.x',
        size: 400000, // ~400KB
        treeshakeable: true,
        optimizationTips: [
          'Import individual modules only',
          'Use MatButtonModule instead of MatModule',
          'Consider custom UI components for simple cases'
        ]
      },
      {
        name: 'chart.js',
        version: '4.x',
        size: 200000, // ~200KB
        treeshakeable: true,
        alternatives: ['lightweight-charts', 'd3.js (modular)', 'recharts'],
        optimizationTips: [
          'Register only needed chart types',
          'Use tree-shakeable imports',
          'Consider lighter alternatives for simple charts'
        ]
      }
    ];

    knownLibraries.forEach(lib => this.registerLibrary(lib));
  }

  /**
   * Generate optimization strategies based on registered libraries
   */
  private generateOptimizationStrategies(): void {
    const strategies: OptimizationStrategy[] = [];
    const libraries = this.libraries();

    libraries.forEach(lib => {
      let strategy: OptimizationStrategy | null = null;

      switch (lib.name) {
        case 'lodash':
          strategy = {
            library: lib.name,
            currentSize: lib.size,
            optimizedSize: lib.size * 0.3, // ~70% reduction with lodash-es
            strategy: 'Switch to lodash-es and use individual imports',
            implementation: [
              'npm uninstall lodash',
              'npm install lodash-es',
              'Replace: import _ from "lodash"',
              'With: import { debounce, throttle } from "lodash-es"',
              'Or: import debounce from "lodash-es/debounce"'
            ]
          };
          break;

        case 'moment':
          strategy = {
            library: lib.name,
            currentSize: lib.size,
            optimizedSize: lib.size * 0.25, // ~75% reduction with date-fns
            strategy: 'Replace with date-fns for modular date handling',
            implementation: [
              'npm uninstall moment',
              'npm install date-fns',
              'Replace: import moment from "moment"',
              'With: import { format, parseISO } from "date-fns"',
              'Update date operations to use date-fns functions'
            ]
          };
          break;

        case 'rxjs':
          if (lib.size > 150000) { // If using too much of RxJS
            strategy = {
              library: lib.name,
              currentSize: lib.size,
              optimizedSize: lib.size * 0.6, // ~40% reduction with proper imports
              strategy: 'Optimize RxJS imports for better tree shaking',
              implementation: [
                'Import operators from rxjs/operators',
                'Use: import { map, filter } from "rxjs/operators"',
                'Avoid: import { Observable } from "rxjs/Rx"',
                'Use pipeable operators consistently'
              ]
            };
          }
          break;

        case '@angular/material':
          strategy = {
            library: lib.name,
            currentSize: lib.size,
            optimizedSize: lib.size * 0.4, // ~60% reduction with selective imports
            strategy: 'Import only needed Material modules',
            implementation: [
              'Replace: import { MatModule } from "@angular/material"',
              'With individual imports:',
              'import { MatButtonModule } from "@angular/material/button"',
              'import { MatCardModule } from "@angular/material/card"',
              'Create a shared material module with only needed components'
            ]
          };
          break;
      }

      if (strategy) {
        strategies.push(strategy);
      }
    });

    this._optimizationStrategies.set(strategies);
  }

  /**
   * Generate webpack aliases for optimized imports
   */
  private generateAliases(): Record<string, string> {
    return {
      // Optimize lodash imports
      'lodash': 'lodash-es',
      
      // Optimize RxJS imports
      'rxjs/Rx': 'rxjs',
      
      // Optimize Angular Material
      '@angular/material': '@angular/material/index'
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}