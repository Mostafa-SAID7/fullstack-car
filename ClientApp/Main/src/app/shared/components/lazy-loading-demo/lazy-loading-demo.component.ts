import { Component, signal, computed, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadingService } from '../../../core/services/lazy-loading.service';
import { ComponentLoader } from '../../../core/utils/component-loader.util';
import { LazyLoadDirective, LazyLoadTriggerDirective } from '../../directives/lazy-load.directive';

/**
 * Heavy Component for Lazy Loading Demo
 * Simulates a component that takes time to load
 */
@Component({
  selector: 'app-heavy-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="heavy-component p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
      <h3 class="text-xl font-bold mb-4">🚀 Heavy Component Loaded!</h3>
      <p class="mb-4">This component was loaded lazily and took {{ loadTime }}ms to load.</p>
      <div class="grid grid-cols-2 gap-4">
        @for (item of demoData(); track item.id) {
          <div class="bg-white/20 p-3 rounded">
            <h4 class="font-semibold">{{ item.title }}</h4>
            <p class="text-sm opacity-90">{{ item.description }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class HeavyComponent {
  loadTime = Math.random() * 1000 + 500; // Simulate load time
  
  demoData = signal([
    { id: 1, title: 'Feature A', description: 'Advanced functionality' },
    { id: 2, title: 'Feature B', description: 'Enhanced user experience' },
    { id: 3, title: 'Feature C', description: 'Performance optimizations' },
    { id: 4, title: 'Feature D', description: 'Modern UI components' }
  ]);
}

/**
 * Lazy Loading Demo Component
 * 
 * Demonstrates various lazy loading techniques with Angular 19
 */
@Component({
  selector: 'app-lazy-loading-demo',
  standalone: true,
  imports: [
    CommonModule,
    LazyLoadDirective,
    LazyLoadTriggerDirective
  ],
  template: `
    <div class="lazy-loading-demo p-6 max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-center">🔄 Lazy Loading Demo</h2>
      
      <!-- Loading Statistics -->
      <div class="stats-card bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 class="text-xl font-semibold mb-4">📊 Loading Statistics</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="stat-item text-center">
            <div class="text-2xl font-bold text-blue-600">{{ stats().total }}</div>
            <div class="text-sm text-gray-600">Total Modules</div>
          </div>
          <div class="stat-item text-center">
            <div class="text-2xl font-bold text-green-600">{{ stats().loaded }}</div>
            <div class="text-sm text-gray-600">Loaded</div>
          </div>
          <div class="stat-item text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ stats().loading }}</div>
            <div class="text-sm text-gray-600">Loading</div>
          </div>
          <div class="stat-item text-center">
            <div class="text-2xl font-bold text-red-600">{{ stats().failed }}</div>
            <div class="text-sm text-gray-600">Failed</div>
          </div>
        </div>
        @if (stats().averageLoadTime > 0) {
          <div class="mt-4 text-center">
            <span class="text-sm text-gray-600">Average Load Time: </span>
            <span class="font-semibold">{{ stats().averageLoadTime.toFixed(2) }}ms</span>
          </div>
        }
      </div>

      <!-- Manual Loading -->
      <div class="demo-section mb-8">
        <h3 class="text-xl font-semibold mb-4">🎯 Manual Component Loading</h3>
        <div class="flex gap-4 mb-4">
          <button 
            (click)="loadHeavyComponent()"
            [disabled]="isLoading()"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            @if (isLoading()) {
              <span class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            } @else {
              Load Heavy Component
            }
          </button>
          
          <button 
            (click)="clearComponents()"
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
            Clear Components
          </button>
          
          <button 
            (click)="preloadComponent()"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Preload Component
          </button>
        </div>
        
        <!-- Dynamic Component Container -->
        <div #dynamicContainer class="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4">
          @if (!hasLoadedComponent() && !isLoading()) {
            <div class="text-center text-gray-500 py-8">
              Click "Load Heavy Component" to dynamically load content
            </div>
          }
        </div>
      </div>

      <!-- Intersection Observer Loading -->
      <div class="demo-section mb-8">
        <h3 class="text-xl font-semibold mb-4">👁️ Viewport-Based Loading</h3>
        <p class="text-gray-600 mb-4">Scroll down to trigger lazy loading when the component enters the viewport:</p>
        
        <div class="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
          <div class="h-64 bg-gradient-to-b from-gray-200 to-gray-300 rounded mb-4 flex items-center justify-center">
            <span class="text-gray-600">Scroll down to see lazy loading in action...</span>
          </div>
          
          <div class="h-64 bg-gradient-to-b from-gray-300 to-gray-400 rounded mb-4 flex items-center justify-center">
            <span class="text-gray-600">Keep scrolling...</span>
          </div>
          
          <!-- This will trigger when it comes into view -->
          <div 
            *lazyLoadTrigger="{ threshold: 0.5 }"
            (onVisible)="onComponentVisible()"
            class="h-64 border-2 border-dashed border-blue-400 rounded flex items-center justify-center">
            @if (viewportTriggered()) {
              <div class="text-center">
                <div class="text-green-600 text-xl font-semibold mb-2">✅ Viewport Trigger Activated!</div>
                <div class="text-sm text-gray-600">Component would be loaded here</div>
              </div>
            } @else {
              <div class="text-center text-gray-500">
                <div class="text-lg mb-2">🎯 Lazy Load Trigger Zone</div>
                <div class="text-sm">This will activate when 50% visible</div>
              </div>
            }
          </div>
          
          <div class="h-64 bg-gradient-to-b from-gray-400 to-gray-500 rounded mt-4 flex items-center justify-center">
            <span class="text-white">End of scrollable content</span>
          </div>
        </div>
      </div>

      <!-- Batch Loading -->
      <div class="demo-section mb-8">
        <h3 class="text-xl font-semibold mb-4">📦 Batch Component Loading</h3>
        <button 
          (click)="loadComponentsBatch()"
          [disabled]="isBatchLoading()"
          class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4">
          @if (isBatchLoading()) {
            Loading Multiple Components...
          } @else {
            Load 3 Components in Parallel
          }
        </button>
        
        <div #batchContainer class="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[200px]">
          @if (!hasBatchLoaded() && !isBatchLoading()) {
            <div class="col-span-full text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
              Click "Load 3 Components in Parallel" to see batch loading
            </div>
          }
        </div>
      </div>

      <!-- Module Information -->
      <div class="module-info bg-gray-50 rounded-lg p-6">
        <h3 class="text-xl font-semibold mb-4">📋 Loaded Modules</h3>
        @if (modules().length === 0) {
          <p class="text-gray-600">No modules loaded yet. Try the demos above!</p>
        } @else {
          <div class="space-y-2">
            @for (module of modules(); track module.name) {
              <div class="flex items-center justify-between p-3 bg-white rounded border">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 rounded-full" 
                       [class]="getModuleStatusClass(module)"></div>
                  <span class="font-medium">{{ module.name }}</span>
                </div>
                <div class="text-sm text-gray-600">
                  @if (module.loaded && module.loadTime) {
                    {{ module.loadTime.toFixed(2) }}ms
                  } @else if (module.loading) {
                    Loading...
                  } @else if (module.error) {
                    Error: {{ module.error }}
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .lazy-loading-demo {
      font-family: system-ui, -apple-system, sans-serif;
    }
    
    .stats-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .stats-card .stat-item .text-2xl {
      color: white;
    }
    
    .demo-section {
      border-left: 4px solid #3b82f6;
      padding-left: 1rem;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class LazyLoadingDemoComponent {
  private lazyLoadingService = inject(LazyLoadingService);
  private componentLoader = new ComponentLoader();

  @ViewChild('dynamicContainer', { read: ViewContainerRef }) dynamicContainer!: ViewContainerRef;
  @ViewChild('batchContainer', { read: ViewContainerRef }) batchContainer!: ViewContainerRef;

  // Signals for component state
  private _isLoading = signal(false);
  private _hasLoadedComponent = signal(false);
  private _isBatchLoading = signal(false);
  private _hasBatchLoaded = signal(false);
  private _viewportTriggered = signal(false);

  // Computed values
  readonly isLoading = this._isLoading.asReadonly();
  readonly hasLoadedComponent = this._hasLoadedComponent.asReadonly();
  readonly isBatchLoading = this._isBatchLoading.asReadonly();
  readonly hasBatchLoaded = this._hasBatchLoaded.asReadonly();
  readonly viewportTriggered = this._viewportTriggered.asReadonly();

  readonly modules = computed(() => this.lazyLoadingService.modules());
  readonly stats = computed(() => this.lazyLoadingService.getLoadingStats());

  /**
   * Load a heavy component dynamically
   */
  async loadHeavyComponent(): Promise<void> {
    if (this._isLoading() || this._hasLoadedComponent()) return;

    this._isLoading.set(true);

    try {
      await this.componentLoader.loadComponent(
        this.dynamicContainer,
        () => Promise.resolve({ HeavyComponent }),
        'HeavyComponent',
        'heavy-component-demo',
        {
          showLoadingIndicator: false // We handle loading state with signals
        }
      );

      this._hasLoadedComponent.set(true);
    } catch (error) {
      console.error('Failed to load heavy component:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Preload component without rendering
   */
  async preloadComponent(): Promise<void> {
    try {
      await this.componentLoader.preloadComponent(
        () => Promise.resolve({ HeavyComponent }),
        'heavy-component-preload'
      );
      
      // Show success message
      console.log('✅ Component preloaded successfully!');
    } catch (error) {
      console.error('Failed to preload component:', error);
    }
  }

  /**
   * Load multiple components in parallel
   */
  async loadComponentsBatch(): Promise<void> {
    if (this._isBatchLoading() || this._hasBatchLoaded()) return;

    this._isBatchLoading.set(true);

    try {
      const components = [
        {
          importFn: () => Promise.resolve({ HeavyComponent }),
          componentName: 'HeavyComponent',
          moduleName: 'batch-component-1'
        },
        {
          importFn: () => Promise.resolve({ HeavyComponent }),
          componentName: 'HeavyComponent',
          moduleName: 'batch-component-2'
        },
        {
          importFn: () => Promise.resolve({ HeavyComponent }),
          componentName: 'HeavyComponent',
          moduleName: 'batch-component-3'
        }
      ];

      await this.componentLoader.loadComponentsBatch(
        this.batchContainer,
        components,
        {
          showLoadingIndicator: false
        }
      );

      this._hasBatchLoaded.set(true);
    } catch (error) {
      console.error('Failed to load components batch:', error);
    } finally {
      this._isBatchLoading.set(false);
    }
  }

  /**
   * Clear all dynamically loaded components
   */
  clearComponents(): void {
    this.dynamicContainer?.clear();
    this.batchContainer?.clear();
    this._hasLoadedComponent.set(false);
    this._hasBatchLoaded.set(false);
    this.lazyLoadingService.clearModules();
  }

  /**
   * Handle viewport trigger
   */
  onComponentVisible(): void {
    this._viewportTriggered.set(true);
    console.log('🎯 Component entered viewport - would trigger lazy loading here');
  }

  /**
   * Get CSS class for module status indicator
   */
  getModuleStatusClass(module: any): string {
    if (module.loaded) return 'bg-green-500';
    if (module.loading) return 'bg-yellow-500 animate-pulse';
    if (module.error) return 'bg-red-500';
    return 'bg-gray-400';
  }
}