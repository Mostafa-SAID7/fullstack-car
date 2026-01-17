import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface RenderBlockingResource {
  url: string;
  type: 'css' | 'js' | 'font';
  blocking: boolean;
  critical: boolean;
  size?: number;
  loadTime?: number;
}

export interface CriticalCSS {
  selector: string;
  rules: string;
  priority: number;
}

export interface OptimizationStrategy {
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  implementation: string[];
}

/**
 * Render Blocking Optimizer Service
 * 
 * Minimizes render-blocking resources to improve LCP and FCP
 */
@Injectable({
  providedIn: 'root'
})
export class RenderBlockingOptimizerService {
  private document = inject(DOCUMENT);
  
  private _renderBlockingResources = signal<Map<string, RenderBlockingResource>>(new Map());
  private _criticalCSS = signal<CriticalCSS[]>([]);
  private _optimizationStrategies = signal<OptimizationStrategy[]>([]);

  readonly renderBlockingResources = computed(() => Array.from(this._renderBlockingResources().values()));
  readonly criticalCSS = this._criticalCSS.asReadonly();
  readonly optimizationStrategies = this._optimizationStrategies.asReadonly();
  
  readonly blockingResourceCount = computed(() => 
    this.renderBlockingResources().filter(r => r.blocking).length
  );
  
  readonly totalBlockingSize = computed(() => 
    this.renderBlockingResources()
      .filter(r => r.blocking && r.size)
      .reduce((total, r) => total + (r.size || 0), 0)
  );

  constructor() {
    this.initializeOptimizationStrategies();
    this.analyzeRenderBlockingResources();
  }

  /**
   * Register a render-blocking resource
   */
  registerRenderBlockingResource(resource: RenderBlockingResource): void {
    this._renderBlockingResources.update(resources => {
      const newResources = new Map(resources);
      newResources.set(resource.url, resource);
      return newResources;
    });
  }

  /**
   * Add critical CSS rules
   */
  addCriticalCSS(css: CriticalCSS): void {
    this._criticalCSS.update(current => [...current, css]);
  }

  /**
   * Inline critical CSS in document head
   */
  inlineCriticalCSS(): void {
    const criticalCSS = this.criticalCSS();
    if (criticalCSS.length === 0) return;

    // Sort by priority
    const sortedCSS = criticalCSS.sort((a, b) => b.priority - a.priority);
    
    // Generate CSS string
    const cssString = sortedCSS
      .map(css => `${css.selector} { ${css.rules} }`)
      .join('\n');

    // Create style element
    const styleElement = this.document.createElement('style');
    styleElement.textContent = cssString;
    styleElement.setAttribute('data-critical', 'true');
    
    // Insert at the beginning of head
    const firstChild = this.document.head.firstChild;
    if (firstChild) {
      this.document.head.insertBefore(styleElement, firstChild);
    } else {
      this.document.head.appendChild(styleElement);
    }
  }

  /**
   * Defer non-critical CSS loading
   */
  deferNonCriticalCSS(cssUrls: string[]): void {
    cssUrls.forEach(url => {
      this.loadCSSAsync(url);
    });
  }

  /**
   * Optimize font loading to reduce render blocking
   */
  optimizeFontLoading(): void {
    // Add font-display: swap to existing fonts
    this.addFontDisplaySwap();
    
    // Preload critical fonts
    this.preloadCriticalFonts();
    
    // Add fallback fonts
    this.setupFontFallbacks();
  }

  /**
   * Remove unused CSS rules
   */
  removeUnusedCSS(usedSelectors: string[]): string {
    // This would typically integrate with a CSS purging tool
    // For now, we'll simulate the process
    const allCSS = this.extractAllCSS();
    const usedCSS = this.filterUsedCSS(allCSS, usedSelectors);
    
    return usedCSS;
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    const blockingCount = this.blockingResourceCount();
    const totalSize = this.totalBlockingSize();

    if (blockingCount > 3) {
      recommendations.push(`Reduce render-blocking resources (currently ${blockingCount})`);
    }

    if (totalSize > 100000) { // 100KB
      recommendations.push(`Optimize render-blocking resource size (currently ${this.formatBytes(totalSize)})`);
    }

    const resources = this.renderBlockingResources();
    const cssResources = resources.filter(r => r.type === 'css' && r.blocking);
    const jsResources = resources.filter(r => r.type === 'js' && r.blocking);

    if (cssResources.length > 2) {
      recommendations.push('Consider inlining critical CSS and deferring non-critical stylesheets');
    }

    if (jsResources.length > 1) {
      recommendations.push('Defer non-critical JavaScript execution');
    }

    // Font-specific recommendations
    const fontResources = resources.filter(r => r.type === 'font');
    if (fontResources.length > 0) {
      recommendations.push('Use font-display: swap for better font loading performance');
      recommendations.push('Preload critical fonts to reduce layout shift');
    }

    return recommendations;
  }

  /**
   * Generate critical CSS from above-the-fold content
   */
  generateCriticalCSS(viewportHeight: number = 800): CriticalCSS[] {
    const criticalSelectors = this.identifyAboveFoldElements(viewportHeight);
    const criticalCSS: CriticalCSS[] = [];

    criticalSelectors.forEach((selector, index) => {
      const rules = this.extractCSSRules(selector);
      if (rules) {
        criticalCSS.push({
          selector,
          rules,
          priority: 100 - index // Higher priority for earlier elements
        });
      }
    });

    return criticalCSS;
  }

  /**
   * Measure render-blocking impact
   */
  measureRenderBlockingImpact(): any {
    const resources = this.renderBlockingResources();
    const blockingResources = resources.filter(r => r.blocking);
    
    const impact = {
      totalResources: resources.length,
      blockingResources: blockingResources.length,
      blockingPercentage: (blockingResources.length / resources.length) * 100,
      estimatedDelay: this.calculateEstimatedDelay(blockingResources),
      recommendations: this.getOptimizationRecommendations()
    };

    return impact;
  }

  private initializeOptimizationStrategies(): void {
    const strategies: OptimizationStrategy[] = [
      {
        name: 'Inline Critical CSS',
        description: 'Inline above-the-fold CSS to eliminate render-blocking requests',
        impact: 'high',
        implementation: [
          'Identify critical above-the-fold styles',
          'Extract and inline critical CSS in <head>',
          'Load remaining CSS asynchronously',
          'Use tools like Critical or Critters for automation'
        ]
      },
      {
        name: 'Defer Non-Critical JavaScript',
        description: 'Defer JavaScript that doesn\'t affect initial render',
        impact: 'high',
        implementation: [
          'Add defer attribute to non-critical scripts',
          'Use dynamic imports for feature-specific code',
          'Implement script loading prioritization',
          'Consider using web workers for heavy computations'
        ]
      },
      {
        name: 'Optimize Font Loading',
        description: 'Reduce font-related render blocking',
        impact: 'medium',
        implementation: [
          'Use font-display: swap for web fonts',
          'Preload critical fonts',
          'Implement font fallback strategies',
          'Consider variable fonts to reduce requests'
        ]
      },
      {
        name: 'Resource Prioritization',
        description: 'Prioritize critical resources using resource hints',
        impact: 'medium',
        implementation: [
          'Use preload for critical resources',
          'Implement fetchpriority for important resources',
          'Use preconnect for external domains',
          'Add dns-prefetch for third-party resources'
        ]
      },
      {
        name: 'CSS Optimization',
        description: 'Optimize CSS delivery and reduce unused styles',
        impact: 'medium',
        implementation: [
          'Remove unused CSS rules',
          'Minify and compress CSS files',
          'Use CSS containment for better rendering',
          'Implement CSS-in-JS for component-specific styles'
        ]
      }
    ];

    this._optimizationStrategies.set(strategies);
  }

  private analyzeRenderBlockingResources(): void {
    // Analyze current page resources
    if (typeof window === 'undefined') return;

    // Analyze stylesheets
    const stylesheets = this.document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach((link: any) => {
      this.registerRenderBlockingResource({
        url: link.href,
        type: 'css',
        blocking: !link.media || link.media === 'all',
        critical: this.isCriticalResource(link.href)
      });
    });

    // Analyze scripts
    const scripts = this.document.querySelectorAll('script[src]');
    scripts.forEach((script: any) => {
      this.registerRenderBlockingResource({
        url: script.src,
        type: 'js',
        blocking: !script.defer && !script.async,
        critical: this.isCriticalResource(script.src)
      });
    });
  }

  private loadCSSAsync(url: string): void {
    const link = this.document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = url;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    this.document.head.appendChild(link);
  }

  private addFontDisplaySwap(): void {
    const style = this.document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    this.document.head.appendChild(style);
  }

  private preloadCriticalFonts(): void {
    const criticalFonts = [
      '/assets/fonts/inter-var.woff2',
      '/assets/fonts/inter-bold.woff2'
    ];

    criticalFonts.forEach(font => {
      const link = this.document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font;
      this.document.head.appendChild(link);
    });
  }

  private setupFontFallbacks(): void {
    const style = this.document.createElement('style');
    style.textContent = `
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    `;
    this.document.head.appendChild(style);
  }

  private extractAllCSS(): string {
    // This would extract all CSS from stylesheets
    // For demo purposes, return empty string
    return '';
  }

  private filterUsedCSS(allCSS: string, usedSelectors: string[]): string {
    // This would filter CSS based on used selectors
    // For demo purposes, return the input
    return allCSS;
  }

  private identifyAboveFoldElements(viewportHeight: number): string[] {
    if (typeof window === 'undefined') return [];

    const elements = this.document.querySelectorAll('*');
    const aboveFoldSelectors: string[] = [];

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // Element is above the fold
        const selector = this.generateSelector(element);
        if (selector) {
          aboveFoldSelectors.push(selector);
        }
      }
    });

    return aboveFoldSelectors.slice(0, 20); // Limit to top 20 elements
  }

  private generateSelector(element: Element): string {
    // Generate a CSS selector for the element
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        return `.${classes[0]}`;
      }
    }
    
    return element.tagName.toLowerCase();
  }

  private extractCSSRules(selector: string): string {
    // This would extract actual CSS rules for the selector
    // For demo purposes, return basic styles
    const commonStyles: Record<string, string> = {
      'body': 'margin: 0; padding: 0; font-family: system-ui, sans-serif;',
      'h1': 'font-size: 2rem; font-weight: bold; margin: 0 0 1rem 0;',
      'h2': 'font-size: 1.5rem; font-weight: bold; margin: 0 0 0.75rem 0;',
      'p': 'margin: 0 0 1rem 0; line-height: 1.5;',
      '.container': 'max-width: 1200px; margin: 0 auto; padding: 0 1rem;'
    };

    return commonStyles[selector] || '';
  }

  private isCriticalResource(url: string): boolean {
    // Determine if a resource is critical based on URL patterns
    const criticalPatterns = [
      '/critical',
      '/above-fold',
      '/hero',
      '/main',
      'bootstrap',
      'tailwind'
    ];

    return criticalPatterns.some(pattern => url.includes(pattern));
  }

  private calculateEstimatedDelay(resources: RenderBlockingResource[]): number {
    // Estimate delay caused by render-blocking resources
    const avgLoadTime = 200; // Average load time per resource in ms
    return resources.length * avgLoadTime;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}