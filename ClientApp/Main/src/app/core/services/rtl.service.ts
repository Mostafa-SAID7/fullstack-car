import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { TranslationService } from './translation.service';

export interface RTLConfig {
  enabled: boolean;
  autoDetect: boolean;
  mirrorIcons: boolean;
  mirrorImages: boolean;
  customMirrorSelectors: string[];
}

export interface LayoutDirection {
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  textAlign: 'left' | 'right';
  floatDirection: 'left' | 'right';
  marginStart: 'margin-left' | 'margin-right';
  marginEnd: 'margin-right' | 'margin-left';
  paddingStart: 'padding-left' | 'padding-right';
  paddingEnd: 'padding-right' | 'padding-left';
  borderStart: 'border-left' | 'border-right';
  borderEnd: 'border-right' | 'border-left';
}

/**
 * RTL Service for comprehensive right-to-left layout management
 */
@Injectable({
  providedIn: 'root'
})
export class RtlService {
  private translationService = inject(TranslationService);

  private configSubject = new BehaviorSubject<RTLConfig>({
    enabled: true,
    autoDetect: true,
    mirrorIcons: true,
    mirrorImages: false,
    customMirrorSelectors: ['.mirror-rtl', '[data-mirror="true"]']
  });

  public config$ = this.configSubject.asObservable();
  public isRTL$ = this.translationService.isRTL$;
  public currentLanguage$ = this.translationService.currentLanguage$;

  /**
   * Combined layout direction information
   */
  public layoutDirection$: Observable<LayoutDirection> = combineLatest([
    this.isRTL$,
    this.config$
  ]).pipe(
    map(([isRTL, config]) => this.createLayoutDirection(isRTL && config.enabled)),
    distinctUntilChanged((prev, curr) => prev.isRTL === curr.isRTL)
  );

  constructor() {
    // Initialize RTL support
    this.initializeRTLSupport();
  }

  /**
   * Initialize RTL support with document-level changes
   */
  private initializeRTLSupport(): void {
    this.layoutDirection$.subscribe(layout => {
      this.updateDocumentDirection(layout);
      this.updateCustomProperties(layout);
      this.handleIconMirroring(layout);
    });
  }

  /**
   * Create layout direction object
   */
  private createLayoutDirection(isRTL: boolean): LayoutDirection {
    return {
      isRTL,
      direction: isRTL ? 'rtl' : 'ltr',
      textAlign: isRTL ? 'right' : 'left',
      floatDirection: isRTL ? 'right' : 'left',
      marginStart: isRTL ? 'margin-right' : 'margin-left',
      marginEnd: isRTL ? 'margin-left' : 'margin-right',
      paddingStart: isRTL ? 'padding-right' : 'padding-left',
      paddingEnd: isRTL ? 'padding-left' : 'padding-right',
      borderStart: isRTL ? 'border-right' : 'border-left',
      borderEnd: isRTL ? 'border-left' : 'border-right'
    };
  }

  /**
   * Update document-level direction
   */
  private updateDocumentDirection(layout: LayoutDirection): void {
    document.documentElement.dir = layout.direction;
    document.documentElement.setAttribute('data-direction', layout.direction);
    
    // Update body classes
    document.body.classList.toggle('rtl-layout', layout.isRTL);
    document.body.classList.toggle('ltr-layout', !layout.isRTL);
  }

  /**
   * Update CSS custom properties for RTL support
   */
  private updateCustomProperties(layout: LayoutDirection): void {
    const root = document.documentElement;
    
    root.style.setProperty('--text-align', layout.textAlign);
    root.style.setProperty('--float-direction', layout.floatDirection);
    root.style.setProperty('--margin-start', layout.isRTL ? '0 0 0 auto' : '0 auto 0 0');
    root.style.setProperty('--margin-end', layout.isRTL ? '0 auto 0 0' : '0 0 0 auto');
    root.style.setProperty('--transform-scale-x', layout.isRTL ? '-1' : '1');
    root.style.setProperty('--border-radius-start', layout.isRTL ? '0 0.5rem 0.5rem 0' : '0.5rem 0 0 0.5rem');
    root.style.setProperty('--border-radius-end', layout.isRTL ? '0.5rem 0 0 0.5rem' : '0 0.5rem 0.5rem 0');
  }

  /**
   * Handle icon mirroring for RTL layouts
   */
  private handleIconMirroring(layout: LayoutDirection): void {
    const config = this.configSubject.value;
    
    if (!config.mirrorIcons) return;

    // Icons that should be mirrored in RTL
    const mirrorableIcons = [
      '.fa-arrow-left', '.fa-arrow-right',
      '.fa-chevron-left', '.fa-chevron-right',
      '.fa-angle-left', '.fa-angle-right',
      '.fa-caret-left', '.fa-caret-right',
      '.fa-long-arrow-left', '.fa-long-arrow-right',
      '.fa-hand-point-left', '.fa-hand-point-right',
      '.fa-indent', '.fa-outdent',
      '.fa-quote-left', '.fa-quote-right'
    ];

    mirrorableIcons.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (layout.isRTL) {
          element.classList.add('rtl-mirror');
        } else {
          element.classList.remove('rtl-mirror');
        }
      });
    });

    // Handle custom mirror selectors
    config.customMirrorSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (layout.isRTL) {
          element.classList.add('rtl-mirror');
        } else {
          element.classList.remove('rtl-mirror');
        }
      });
    });
  }

  /**
   * Get current layout direction
   */
  getCurrentLayoutDirection(): LayoutDirection {
    const isRTL = this.translationService.isCurrentLanguageRTL();
    const config = this.configSubject.value;
    return this.createLayoutDirection(isRTL && config.enabled);
  }

  /**
   * Check if current layout is RTL
   */
  isCurrentLayoutRTL(): boolean {
    return this.getCurrentLayoutDirection().isRTL;
  }

  /**
   * Update RTL configuration
   */
  updateConfig(config: Partial<RTLConfig>): void {
    const currentConfig = this.configSubject.value;
    const newConfig = { ...currentConfig, ...config };
    this.configSubject.next(newConfig);
  }

  /**
   * Get current RTL configuration
   */
  getConfig(): RTLConfig {
    return this.configSubject.value;
  }

  /**
   * Enable RTL support
   */
  enableRTL(): void {
    this.updateConfig({ enabled: true });
  }

  /**
   * Disable RTL support
   */
  disableRTL(): void {
    this.updateConfig({ enabled: false });
  }

  /**
   * Toggle RTL support
   */
  toggleRTL(): void {
    const config = this.configSubject.value;
    this.updateConfig({ enabled: !config.enabled });
  }

  /**
   * Get CSS class for RTL-aware positioning
   */
  getPositionClass(baseClass: string): string {
    const layout = this.getCurrentLayoutDirection();
    
    // Convert common positioning classes
    const classMap: Record<string, string> = {
      'text-left': layout.isRTL ? 'text-right' : 'text-left',
      'text-right': layout.isRTL ? 'text-left' : 'text-right',
      'float-left': layout.isRTL ? 'float-right' : 'float-left',
      'float-right': layout.isRTL ? 'float-left' : 'float-right',
      'ml-auto': layout.isRTL ? 'mr-auto' : 'ml-auto',
      'mr-auto': layout.isRTL ? 'ml-auto' : 'mr-auto',
      'pl-4': layout.isRTL ? 'pr-4' : 'pl-4',
      'pr-4': layout.isRTL ? 'pl-4' : 'pr-4',
      'border-l': layout.isRTL ? 'border-r' : 'border-l',
      'border-r': layout.isRTL ? 'border-l' : 'border-r',
      'rounded-l': layout.isRTL ? 'rounded-r' : 'rounded-l',
      'rounded-r': layout.isRTL ? 'rounded-l' : 'rounded-r'
    };

    return classMap[baseClass] || baseClass;
  }

  /**
   * Get inline styles for RTL-aware positioning
   */
  getPositionStyles(styles: Record<string, string>): Record<string, string> {
    const layout = this.getCurrentLayoutDirection();
    const rtlStyles: Record<string, string> = {};

    Object.entries(styles).forEach(([property, value]) => {
      switch (property) {
        case 'textAlign':
          rtlStyles[property] = value === 'left' ? layout.textAlign : 
                               value === 'right' ? (layout.isRTL ? 'left' : 'right') : value;
          break;
        case 'float':
          rtlStyles[property] = value === 'left' ? layout.floatDirection :
                               value === 'right' ? (layout.isRTL ? 'left' : 'right') : value;
          break;
        case 'marginLeft':
          rtlStyles[layout.marginStart.replace('margin-', '')] = value;
          break;
        case 'marginRight':
          rtlStyles[layout.marginEnd.replace('margin-', '')] = value;
          break;
        case 'paddingLeft':
          rtlStyles[layout.paddingStart.replace('padding-', '')] = value;
          break;
        case 'paddingRight':
          rtlStyles[layout.paddingEnd.replace('padding-', '')] = value;
          break;
        default:
          rtlStyles[property] = value;
      }
    });

    return rtlStyles;
  }

  /**
   * Detect text direction from content
   */
  detectTextDirection(text: string): 'ltr' | 'rtl' | 'auto' {
    if (!text || text.trim().length === 0) return 'auto';

    // Arabic, Hebrew, and other RTL scripts
    const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
    const ltrRegex = /[A-Za-z]/;

    const rtlChars = (text.match(rtlRegex) || []).length;
    const ltrChars = (text.match(ltrRegex) || []).length;
    const totalChars = rtlChars + ltrChars;

    if (totalChars === 0) return 'auto';

    // If more than 50% RTL characters, consider it RTL
    return (rtlChars / totalChars) > 0.5 ? 'rtl' : 'ltr';
  }

  /**
   * Apply bidirectional text handling to an element
   */
  applyBidirectionalText(element: HTMLElement, text?: string): void {
    const textToAnalyze = text || element.textContent || '';
    const detectedDirection = this.detectTextDirection(textToAnalyze);
    
    if (detectedDirection !== 'auto') {
      element.setAttribute('dir', detectedDirection);
      element.classList.add(`text-${detectedDirection}`);
    } else {
      // Use global direction
      const layout = this.getCurrentLayoutDirection();
      element.setAttribute('dir', layout.direction);
      element.classList.add(`text-${layout.direction}`);
    }

    // Add bidi isolation for mixed content
    if (this.hasMixedContent(textToAnalyze)) {
      element.style.unicodeBidi = 'isolate';
    }
  }

  /**
   * Check if text has mixed LTR/RTL content
   */
  private hasMixedContent(text: string): boolean {
    const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
    const ltrRegex = /[A-Za-z]/;
    
    return rtlRegex.test(text) && ltrRegex.test(text);
  }
}