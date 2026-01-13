import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';

/**
 * RTL Directive for automatic right-to-left layout support
 * 
 * Usage:
 * <div appRtl>Content</div>
 * <div appRtl="force-ltr">Always LTR content</div>
 * <div appRtl="force-rtl">Always RTL content</div>
 * <div appRtl="auto">Auto-detect based on content</div>
 */
@Directive({
  selector: '[appRtl]',
  standalone: true
})
export class RtlDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private translationService = inject(TranslationService);
  private destroy$ = new Subject<void>();

  @Input('appRtl') mode: 'auto' | 'force-ltr' | 'force-rtl' | '' = 'auto';

  ngOnInit(): void {
    // Subscribe to RTL changes
    this.translationService.isRTL$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isRTL => {
        this.updateDirection(isRTL);
      });

    // Initial setup
    const currentIsRTL = this.translationService.isCurrentLanguageRTL();
    this.updateDirection(currentIsRTL);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateDirection(isGlobalRTL: boolean): void {
    const element = this.elementRef.nativeElement;
    
    let shouldBeRTL = false;

    switch (this.mode) {
      case 'force-rtl':
        shouldBeRTL = true;
        break;
      case 'force-ltr':
        shouldBeRTL = false;
        break;
      case 'auto':
        // Auto-detect based on content
        shouldBeRTL = this.detectContentDirection(element) || isGlobalRTL;
        break;
      default:
        // Default behavior - follow global RTL setting
        shouldBeRTL = isGlobalRTL;
        break;
    }

    // Apply direction
    this.renderer.setAttribute(element, 'dir', shouldBeRTL ? 'rtl' : 'ltr');
    
    // Add CSS classes for styling
    if (shouldBeRTL) {
      this.renderer.addClass(element, 'rtl-layout');
      this.renderer.removeClass(element, 'ltr-layout');
    } else {
      this.renderer.addClass(element, 'ltr-layout');
      this.renderer.removeClass(element, 'rtl-layout');
    }

    // Add data attribute for CSS selectors
    this.renderer.setAttribute(element, 'data-direction', shouldBeRTL ? 'rtl' : 'ltr');
  }

  /**
   * Detect if content should be RTL based on text content
   */
  private detectContentDirection(element: HTMLElement): boolean {
    const text = element.textContent || '';
    
    // Simple RTL detection based on Arabic characters
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    const arabicChars = (text.match(arabicRegex) || []).length;
    const totalChars = text.replace(/\s/g, '').length;
    
    // If more than 30% of characters are Arabic, consider it RTL
    return totalChars > 0 && (arabicChars / totalChars) > 0.3;
  }
}