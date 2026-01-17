import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FontLoadingMetrics {
  fontFamily: string;
  loadTime: number;
  status: 'loading' | 'loaded' | 'error';
  timestamp: number;
}

export interface FontOptimizationConfig {
  enableFontDisplay: boolean;
  enablePreload: boolean;
  enableFallbacks: boolean;
  fontDisplayValue: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preloadFonts: string[];
  fallbackFonts: Record<string, string[]>;
  enableMetrics: boolean;
}

/**
 * Font Optimization Service
 * 
 * Prevents CLS caused by font loading by:
 * - Adding font-display: swap to prevent invisible text
 * - Preloading critical fonts
 * - Managing font fallbacks
 * - Monitoring font loading performance
 * - Optimizing web font delivery
 */
@Injectable({
  providedIn: 'root'
})
export class FontOptimizationService {
  private document = inject(DOCUMENT);
  
  private config: FontOptimizationConfig = {
    enableFontDisplay: true,
    enablePreload: true,
    enableFallbacks: true,
    fontDisplayValue: 'swap',
    preloadFonts: [
      'Inter-Regular.woff2',
      'Inter-Medium.woff2',
      'Inter-SemiBold.woff2'
    ],
    fallbackFonts: {
      'Inter': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      'JetBrains Mono': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace']
    },
    enableMetrics: true
  };

  private fontsLoadedSubject = new BehaviorSubject<boolean>(false);
  private fontMetricsSubject = new BehaviorSubject<FontLoadingMetrics[]>([]);
  private loadedFonts = new Set<string>();
  private fontLoadStartTimes = new Map<string, number>();

  public readonly fontsLoaded$ = this.fontsLoadedSubject.asObservable();
  public readonly fontMetrics$ = this.fontMetricsSubject.asObservable();

  constructor() {
    this.initializeFontOptimization();
  }

  /**
   * Initialize font optimization
   */
  private initializeFontOptimization(): void {
    if (this.config.enableFontDisplay) {
      this.optimizeFontDisplay();
    }

    if (this.config.enablePreload) {
      this.preloadCriticalFonts();
    }

    if (this.config.enableFallbacks) {
      this.setupFontFallbacks();
    }

    this.setupFontLoadingMonitoring();
  }

  /**
   * Add font-display: swap to existing font links
   */
  private optimizeFontDisplay(): void {
    const doc = this.document as Document;
    // Handle Google Fonts links
    const googleFontLinks = doc.querySelectorAll('link[href*="fonts.googleapis.com"]');
    
    googleFontLinks.forEach((link: Element) => {
      const href = link.getAttribute('href');
      if (href && !href.includes('display=')) {
        const separator = href.includes('?') ? '&' : '?';
        const newHref = `${href}${separator}display=${this.config.fontDisplayValue}`;
        link.setAttribute('href', newHref);
        
        console.log(`🔤 Added font-display: ${this.config.fontDisplayValue} to Google Fonts`);
      }
    });

    // Handle CSS @font-face rules
    this.addFontDisplayToStylesheets();
  }

  /**
   * Add font-display to existing stylesheets
   */
  private addFontDisplayToStylesheets(): void {
    try {
      const doc = this.document as Document;
      const stylesheets = Array.from(doc.styleSheets);
      
      stylesheets.forEach((stylesheet) => {
        try {
          const rules = Array.from((stylesheet as CSSStyleSheet).cssRules || []);
          
          rules.forEach((rule) => {
            if (rule instanceof CSSFontFaceRule) {
              const fontDisplayValue = rule.style.getPropertyValue('font-display');
              
              if (!fontDisplayValue) {
                rule.style.setProperty('font-display', this.config.fontDisplayValue);
                console.log(`🔤 Added font-display: ${this.config.fontDisplayValue} to @font-face rule`);
              }
            }
          });
        } catch (error) {
          // Cross-origin stylesheets may throw errors
          console.warn('Cannot access stylesheet rules (likely cross-origin):', error);
        }
      });
    } catch (error) {
      console.warn('Error optimizing font-display in stylesheets:', error);
    }
  }

  /**
   * Preload critical fonts
   */
  private preloadCriticalFonts(): void {
    const doc = this.document as Document;
    this.config.preloadFonts.forEach((fontUrl) => {
      const link = doc.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      
      doc.head.appendChild(link);
      
      console.log(`🔤 Preloading font: ${fontUrl}`);
    });
  }

  /**
   * Setup font fallbacks in CSS
   */
  private setupFontFallbacks(): void {
    const doc = this.document as Document;
    const style = doc.createElement('style');
    style.textContent = this.generateFallbackCSS();
    doc.head.appendChild(style);
    
    console.log('🔤 Font fallbacks configured');
  }

  /**
   * Generate CSS for font fallbacks
   */
  private generateFallbackCSS(): string {
    let css = '';
    
    Object.entries(this.config.fallbackFonts).forEach(([primaryFont, fallbacks]) => {
      const fontStack = [primaryFont, ...fallbacks].join(', ');
      
      css += `
        .font-${primaryFont.toLowerCase().replace(/\s+/g, '-')} {
          font-family: ${fontStack};
        }
        
        /* Fallback font metrics adjustment */
        .font-${primaryFont.toLowerCase().replace(/\s+/g, '-')}-loading {
          font-family: ${fallbacks.join(', ')};
          font-size: 1.05em; /* Adjust for size differences */
          letter-spacing: 0.01em; /* Adjust for spacing differences */
        }
      `;
    });

    return css;
  }

  /**
   * Setup font loading monitoring
   */
  private setupFontLoadingMonitoring(): void {
    const doc = this.document as Document;
    if (!('fonts' in doc)) {
      console.warn('Font Loading API not supported');
      return;
    }

    // Monitor when all fonts are loaded
    doc.fonts.ready.then(() => {
      this.fontsLoadedSubject.next(true);
      console.log('🔤 All fonts loaded successfully');
    });

    // Monitor individual font loading
    doc.fonts.addEventListener('loadingdone', (event: any) => {
      const fontFace = event.fontface;
      if (fontFace) {
        this.onFontLoaded(fontFace);
      }
    });

    doc.fonts.addEventListener('loadingerror', (event: any) => {
      const fontFace = event.fontface;
      if (fontFace) {
        this.onFontError(fontFace);
      }
    });

    // Start monitoring font loading
    this.startFontLoadingMetrics();
  }

  /**
   * Start collecting font loading metrics
   */
  private startFontLoadingMetrics(): void {
    if (!this.config.enableMetrics) return;

    const doc = this.document as Document;
    // Track loading start times
    doc.fonts.forEach((fontFace: any) => {
      if (fontFace.status === 'loading') {
        this.fontLoadStartTimes.set(fontFace.family, performance.now());
      }
    });
  }

  /**
   * Handle successful font loading
   */
  private onFontLoaded(fontFace: FontFace): void {
    const fontFamily = fontFace.family;
    const startTime = this.fontLoadStartTimes.get(fontFamily);
    const loadTime = startTime ? performance.now() - startTime : 0;

    this.loadedFonts.add(fontFamily);

    if (this.config.enableMetrics) {
      const metrics: FontLoadingMetrics = {
        fontFamily,
        loadTime,
        status: 'loaded',
        timestamp: Date.now()
      };

      const currentMetrics = this.fontMetricsSubject.value;
      this.fontMetricsSubject.next([...currentMetrics, metrics]);

      console.log(`🔤 Font loaded: ${fontFamily} (${loadTime.toFixed(2)}ms)`);
    }

    // Remove loading class if it exists
    this.removeLoadingClass(fontFamily);
  }

  /**
   * Handle font loading error
   */
  private onFontError(fontFace: FontFace): void {
    const fontFamily = fontFace.family;
    const startTime = this.fontLoadStartTimes.get(fontFamily);
    const loadTime = startTime ? performance.now() - startTime : 0;

    if (this.config.enableMetrics) {
      const metrics: FontLoadingMetrics = {
        fontFamily,
        loadTime,
        status: 'error',
        timestamp: Date.now()
      };

      const currentMetrics = this.fontMetricsSubject.value;
      this.fontMetricsSubject.next([...currentMetrics, metrics]);

      console.warn(`🚨 Font loading error: ${fontFamily}`);
    }

    // Ensure fallback fonts are used
    this.applyFallbackFont(fontFamily);
  }

  /**
   * Remove loading class from elements
   */
  private removeLoadingClass(fontFamily: string): void {
    const doc = this.document as Document;
    const className = `font-${fontFamily.toLowerCase().replace(/\s+/g, '-')}-loading`;
    const elements = doc.querySelectorAll(`.${className}`);
    
    elements.forEach((element) => {
      element.classList.remove(className);
    });
  }

  /**
   * Apply fallback font when primary font fails
   */
  private applyFallbackFont(fontFamily: string): void {
    const fallbacks = this.config.fallbackFonts[fontFamily];
    if (!fallbacks) return;

    const doc = this.document as Document;
    const className = `font-${fontFamily.toLowerCase().replace(/\s+/g, '-')}`;
    const elements = doc.querySelectorAll(`.${className}`);
    
    elements.forEach((element) => {
      (element as HTMLElement).style.fontFamily = fallbacks.join(', ');
    });
  }

  /**
   * Public API: Check if fonts are loaded
   */
  areFontsLoaded(): boolean {
    return this.fontsLoadedSubject.value;
  }

  /**
   * Public API: Get font loading metrics
   */
  getFontMetrics(): FontLoadingMetrics[] {
    return this.fontMetricsSubject.value;
  }

  /**
   * Public API: Check if specific font is loaded
   */
  isFontLoaded(fontFamily: string): boolean {
    return this.loadedFonts.has(fontFamily);
  }

  /**
   * Public API: Load a specific font
   */
  async loadFont(fontFamily: string, fontUrl: string): Promise<void> {
    try {
      const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
      
      this.fontLoadStartTimes.set(fontFamily, performance.now());
      
      await fontFace.load();
      const doc = this.document as Document;
      (doc.fonts as any).add(fontFace);
      
      this.onFontLoaded(fontFace);
    } catch (error) {
      console.error(`Failed to load font ${fontFamily}:`, error);
      this.onFontError({ family: fontFamily } as FontFace);
    }
  }

  /**
   * Public API: Update configuration
   */
  updateConfig(newConfig: Partial<FontOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Re-initialize with new config
    this.initializeFontOptimization();
  }

  /**
   * Public API: Get current configuration
   */
  getConfig(): FontOptimizationConfig {
    return { ...this.config };
  }

  /**
   * Public API: Add font preload
   */
  addFontPreload(fontUrl: string): void {
    if (!this.config.preloadFonts.includes(fontUrl)) {
      this.config.preloadFonts.push(fontUrl);
      
      const link = this.document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      
      this.document.head.appendChild(link);
      
      console.log(`🔤 Added font preload: ${fontUrl}`);
    }
  }

  /**
   * Public API: Get font loading observable
   */
  getFontLoadingObservable(): Observable<boolean> {
    return this.fontsLoaded$;
  }

  /**
   * Public API: Get font metrics observable
   */
  getFontMetricsObservable(): Observable<FontLoadingMetrics[]> {
    return this.fontMetrics$;
  }
}