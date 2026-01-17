import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SSRMetrics {
  isServer: boolean;
  isBrowser: boolean;
  renderTime?: number;
  hydrationTime?: number;
  initialLoadTime?: number;
  serverRenderStart?: number;
  serverRenderEnd?: number;
}

/**
 * Server-Side Rendering Service
 * 
 * Manages SSR-specific functionality:
 * - Platform detection (server vs browser)
 * - Hydration management
 * - SSR performance monitoring
 * - Server-specific optimizations
 * - Client-server state synchronization
 */
@Injectable({
  providedIn: 'root'
})
export class SSRService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  private ssrMetrics = new BehaviorSubject<SSRMetrics>({
    isServer: isPlatformServer(this.platformId),
    isBrowser: isPlatformBrowser(this.platformId)
  });

  private hydrationComplete = new BehaviorSubject<boolean>(false);
  private serverData = new BehaviorSubject<any>(null);

  public readonly ssrMetrics$ = this.ssrMetrics.asObservable();
  public readonly hydrationComplete$ = this.hydrationComplete.asObservable();
  public readonly serverData$ = this.serverData.asObservable();

  constructor() {
    this.initializeSSR();
  }

  /**
   * Initialize SSR functionality
   */
  private initializeSSR(): void {
    if (this.isServer()) {
      this.initializeServerRendering();
    } else if (this.isBrowser()) {
      this.initializeClientHydration();
    }
  }

  /**
   * Initialize server-side rendering
   */
  private initializeServerRendering(): void {
    const metrics = this.ssrMetrics.value;
    metrics.serverRenderStart = performance.now();
    this.ssrMetrics.next(metrics);

    console.log('🖥️ Server-side rendering initialized');

    // Set up server-side completion tracking
    setTimeout(() => {
      const updatedMetrics = this.ssrMetrics.value;
      updatedMetrics.serverRenderEnd = performance.now();
      updatedMetrics.renderTime = updatedMetrics.serverRenderEnd - (updatedMetrics.serverRenderStart || 0);
      this.ssrMetrics.next(updatedMetrics);

      console.log(`🖥️ Server rendering completed in ${updatedMetrics.renderTime?.toFixed(2)}ms`);
    }, 0);
  }

  /**
   * Initialize client-side hydration
   */
  private initializeClientHydration(): void {
    const hydrationStart = performance.now();

    // Wait for Angular to complete hydration
    setTimeout(() => {
      const hydrationEnd = performance.now();
      const hydrationTime = hydrationEnd - hydrationStart;

      const metrics = this.ssrMetrics.value;
      metrics.hydrationTime = hydrationTime;
      metrics.initialLoadTime = hydrationEnd;
      this.ssrMetrics.next(metrics);

      this.hydrationComplete.next(true);

      console.log(`🌊 Client hydration completed in ${hydrationTime.toFixed(2)}ms`);

      // Transfer server data if available
      this.transferServerData();
    }, 100);
  }

  /**
   * Transfer server data to client
   */
  private transferServerData(): void {
    try {
      const serverDataScript = this.document.getElementById('server-data');
      if (serverDataScript) {
        const data = JSON.parse(serverDataScript.textContent || '{}');
        this.serverData.next(data);
        console.log('📦 Server data transferred to client');
      }
    } catch (error) {
      console.warn('Failed to transfer server data:', error);
    }
  }

  /**
   * Check if running on server
   */
  isServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  /**
   * Check if running on browser
   */
  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Check if hydration is complete
   */
  isHydrationComplete(): boolean {
    return this.hydrationComplete.value;
  }

  /**
   * Get SSR metrics
   */
  getSSRMetrics(): SSRMetrics {
    return this.ssrMetrics.value;
  }

  /**
   * Get SSR metrics observable
   */
  getSSRMetricsObservable(): Observable<SSRMetrics> {
    return this.ssrMetrics$;
  }

  /**
   * Set server data (called from server)
   */
  setServerData(data: any): void {
    if (this.isServer()) {
      this.serverData.next(data);

      // Inject data into HTML for client transfer
      const script = this.document.createElement('script');
      script.id = 'server-data';
      script.type = 'application/json';
      script.textContent = JSON.stringify(data);
      this.document.head.appendChild(script);

      console.log('📦 Server data prepared for transfer');
    }
  }

  /**
   * Get server data
   */
  getServerData(): any {
    return this.serverData.value;
  }

  /**
   * Safe DOM access (only on browser)
   */
  safelyAccessDOM<T>(callback: () => T, fallback?: T): T | undefined {
    if (this.isBrowser()) {
      try {
        return callback();
      } catch (error) {
        console.warn('DOM access error:', error);
        return fallback;
      }
    }
    return fallback;
  }

  /**
   * Safe window access
   */
  safelyAccessWindow<T>(callback: () => T, fallback?: T): T | undefined {
    if (this.isBrowser() && typeof window !== 'undefined') {
      try {
        return callback();
      } catch (error) {
        console.warn('Window access error:', error);
        return fallback;
      }
    }
    return fallback;
  }

  /**
   * Safe localStorage access
   */
  safelyAccessLocalStorage(key: string, defaultValue?: string): string | null {
    const result = this.safelyAccessWindow(() => {
      return localStorage.getItem(key);
    }, defaultValue || null);
    return result === undefined ? (defaultValue || null) : result;
  }

  /**
   * Safe localStorage set
   */
  safelySetLocalStorage(key: string, value: string): boolean {
    return this.safelyAccessWindow(() => {
      localStorage.setItem(key, value);
      return true;
    }, false) || false;
  }

  /**
   * Safe sessionStorage access
   */
  safelyAccessSessionStorage(key: string, defaultValue?: string): string | null {
    const result = this.safelyAccessWindow(() => {
      return sessionStorage.getItem(key);
    }, defaultValue || null);
    return result === undefined ? (defaultValue || null) : result;
  }

  /**
   * Safe sessionStorage set
   */
  safelySetSessionStorage(key: string, value: string): boolean {
    return this.safelyAccessWindow(() => {
      sessionStorage.setItem(key, value);
      return true;
    }, false) || false;
  }

  /**
   * Preload critical resources (server-side)
   */
  preloadCriticalResources(resources: Array<{ href: string; as: string; type?: string }>): void {
    if (this.isServer()) {
      resources.forEach(resource => {
        const link = this.document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) {
          link.type = resource.type;
        }
        this.document.head.appendChild(link);
      });

      console.log(`🚀 Preloaded ${resources.length} critical resources`);
    }
  }

  /**
   * Add critical CSS (server-side)
   */
  addCriticalCSS(css: string): void {
    if (this.isServer()) {
      const style = this.document.createElement('style');
      style.textContent = css;
      style.setAttribute('data-critical', 'true');
      this.document.head.appendChild(style);

      console.log('🎨 Critical CSS added');
    }
  }

  /**
   * Set cache headers (server-side)
   */
  setCacheHeaders(maxAge: number = 3600): void {
    if (this.isServer()) {
      // This would typically be handled by the server framework
      // but we can set meta tags for cache hints
      const meta = this.document.createElement('meta');
      meta.httpEquiv = 'Cache-Control';
      meta.content = `public, max-age=${maxAge}`;
      this.document.head.appendChild(meta);

      console.log(`⏰ Cache headers set: max-age=${maxAge}`);
    }
  }

  /**
   * Generate prerender data for static routes
   */
  generatePrerenderData(route: string): any {
    const routeData: Record<string, any> = {
      '/': {
        title: 'Home - Community Car',
        description: 'Discover trending content and connect with our vibrant community.',
        lastModified: new Date().toISOString(),
        priority: 1.0
      },
      '/media': {
        title: 'Media Library - Community Car',
        description: 'Browse our extensive collection of videos, podcasts, and media content.',
        lastModified: new Date().toISOString(),
        priority: 0.9
      },
      '/community': {
        title: 'Community - Community Car',
        description: 'Join discussions, share content, and connect with fellow community members.',
        lastModified: new Date().toISOString(),
        priority: 0.8
      },
      '/marketplace': {
        title: 'Marketplace - Community Car',
        description: 'Discover and purchase amazing products from our community marketplace.',
        lastModified: new Date().toISOString(),
        priority: 0.7
      }
    };

    return routeData[route] || {
      title: 'Community Car',
      description: 'Community-driven media streaming platform',
      lastModified: new Date().toISOString(),
      priority: 0.5
    };
  }

  /**
   * Optimize images for SSR
   */
  optimizeImageForSSR(src: string, width?: number, height?: number): string {
    if (this.isServer()) {
      // Add optimization parameters
      const url = new URL(src, 'https://communitycar.com');
      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      url.searchParams.set('f', 'webp');
      url.searchParams.set('q', '80');
      return url.toString();
    }
    return src;
  }

  /**
   * Handle SSR errors gracefully
   */
  handleSSRError(error: any, context: string): void {
    console.error(`SSR Error in ${context}:`, error);

    // Log error for monitoring (in production, send to error tracking service)
    if (this.isServer()) {
      // Server-side error logging
      console.error('Server-side error:', {
        context,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    } else {
      // Client-side error logging
      console.error('Client-side hydration error:', {
        context,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get performance metrics for monitoring
   */
  getPerformanceMetrics(): any {
    const metrics = this.ssrMetrics.value;

    return {
      platform: metrics.isServer ? 'server' : 'browser',
      renderTime: metrics.renderTime,
      hydrationTime: metrics.hydrationTime,
      initialLoadTime: metrics.initialLoadTime,
      isHydrationComplete: this.isHydrationComplete(),
      timestamp: new Date().toISOString()
    };
  }
}