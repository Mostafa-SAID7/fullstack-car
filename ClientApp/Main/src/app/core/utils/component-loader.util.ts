import { ComponentRef, ViewContainerRef, Type, inject } from '@angular/core';
import { LazyLoadingService } from '../services/lazy-loading.service';

export interface ComponentLoaderConfig {
  showLoadingIndicator?: boolean;
  loadingTemplate?: string;
  errorTemplate?: string;
  retryOnError?: boolean;
}

/**
 * Component Loader Utility
 * 
 * Provides utilities for dynamically loading components with lazy loading support
 */
export class ComponentLoader {
  private lazyLoadingService = inject(LazyLoadingService);

  /**
   * Load and create a component dynamically
   */
  async loadComponent<T>(
    viewContainer: ViewContainerRef,
    importFn: () => Promise<{ [key: string]: Type<T> }>,
    componentName: string,
    moduleName: string,
    config: ComponentLoaderConfig = {}
  ): Promise<ComponentRef<T>> {
    const {
      showLoadingIndicator = true,
      loadingTemplate = '<div class="loading-spinner">Loading...</div>',
      errorTemplate = '<div class="error-message">Failed to load component</div>',
      retryOnError = true
    } = config;

    // Clear existing content
    viewContainer.clear();

    // Show loading indicator
    if (showLoadingIndicator) {
      this.showLoadingIndicator(viewContainer, loadingTemplate);
    }

    try {
      // Load the module using lazy loading service
      const moduleExports = await this.lazyLoadingService.loadComponent(importFn, moduleName);
      
      // Get the component from module exports
      const ComponentClass = moduleExports[componentName] as Type<T>;
      
      if (!ComponentClass) {
        throw new Error(`Component ${componentName} not found in module ${moduleName}`);
      }

      // Clear loading indicator and create component
      viewContainer.clear();
      const componentRef = viewContainer.createComponent(ComponentClass);
      
      return componentRef;
    } catch (error) {
      viewContainer.clear();
      
      if (retryOnError) {
        this.showErrorWithRetry(viewContainer, errorTemplate, () => 
          this.loadComponent(viewContainer, importFn, componentName, moduleName, config)
        );
      } else {
        this.showError(viewContainer, errorTemplate);
      }
      
      throw error;
    }
  }

  /**
   * Load multiple components in parallel
   */
  async loadComponentsBatch<T>(
    viewContainer: ViewContainerRef,
    components: Array<{
      importFn: () => Promise<{ [key: string]: Type<T> }>;
      componentName: string;
      moduleName: string;
    }>,
    config: ComponentLoaderConfig = {}
  ): Promise<ComponentRef<T>[]> {
    const { showLoadingIndicator = true, loadingTemplate = '<div class="loading-spinner">Loading components...</div>' } = config;

    // Show loading indicator
    if (showLoadingIndicator) {
      this.showLoadingIndicator(viewContainer, loadingTemplate);
    }

    try {
      // Load all modules in parallel
      const modulePromises = components.map(({ importFn, moduleName }) =>
        this.lazyLoadingService.loadComponent(importFn, moduleName)
      );

      const modules = await Promise.all(modulePromises);
      
      // Clear loading indicator
      viewContainer.clear();
      
      // Create all components
      const componentRefs = components.map(({ componentName }, index) => {
        const ComponentClass = modules[index][componentName] as Type<T>;
        if (!ComponentClass) {
          throw new Error(`Component ${componentName} not found`);
        }
        return viewContainer.createComponent(ComponentClass);
      });

      return componentRefs;
    } catch (error) {
      viewContainer.clear();
      this.showError(viewContainer, config.errorTemplate || '<div class="error-message">Failed to load components</div>');
      throw error;
    }
  }

  /**
   * Check if a component module is already loaded
   */
  isComponentLoaded(moduleName: string): boolean {
    return this.lazyLoadingService.isModuleLoaded(moduleName);
  }

  /**
   * Preload a component module for better performance
   */
  async preloadComponent(
    importFn: () => Promise<any>,
    moduleName: string
  ): Promise<void> {
    try {
      await this.lazyLoadingService.loadComponent(importFn, moduleName);
    } catch (error) {
      console.warn(`Failed to preload component module ${moduleName}:`, error);
    }
  }

  private showLoadingIndicator(viewContainer: ViewContainerRef, template: string): void {
    const div = document.createElement('div');
    div.innerHTML = template;
    div.className = 'component-loading-indicator';
    
    // Create a simple component to hold the loading template
    const loadingElement = viewContainer.element.nativeElement;
    loadingElement.appendChild(div);
  }

  private showError(viewContainer: ViewContainerRef, template: string): void {
    const div = document.createElement('div');
    div.innerHTML = template;
    div.className = 'component-error-indicator';
    
    const errorElement = viewContainer.element.nativeElement;
    errorElement.appendChild(div);
  }

  private showErrorWithRetry(
    viewContainer: ViewContainerRef, 
    template: string, 
    retryFn: () => Promise<any>
  ): void {
    const div = document.createElement('div');
    div.innerHTML = `
      ${template}
      <button class="retry-button" style="margin-top: 8px; padding: 4px 8px; cursor: pointer;">
        Retry
      </button>
    `;
    div.className = 'component-error-indicator';
    
    const retryButton = div.querySelector('.retry-button');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        retryFn().catch(console.error);
      });
    }
    
    const errorElement = viewContainer.element.nativeElement;
    errorElement.appendChild(div);
  }
}

/**
 * Factory function to create a ComponentLoader instance
 */
export function createComponentLoader(): ComponentLoader {
  return new ComponentLoader();
}