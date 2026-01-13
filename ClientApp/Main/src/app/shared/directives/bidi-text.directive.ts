import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges, inject, Renderer2 } from '@angular/core';
import { RtlService } from '../../core/services/rtl.service';

/**
 * Bidirectional Text Directive
 * 
 * Automatically handles bidirectional text rendering for mixed LTR/RTL content
 * 
 * Usage:
 * <p appBidiText>Mixed English and العربية text</p>
 * <div appBidiText [bidiText]="dynamicText">Content</div>
 * <span appBidiText="force-auto">Auto-detect direction</span>
 */
@Directive({
  selector: '[appBidiText]',
  standalone: true
})
export class BidiTextDirective implements OnInit, OnChanges {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private rtlService = inject(RtlService);

  @Input('appBidiText') mode: 'auto' | 'force-auto' | 'isolate' | '' = 'auto';
  @Input() bidiText: string = '';

  ngOnInit(): void {
    this.applyBidirectionalHandling();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bidiText'] || changes['mode']) {
      this.applyBidirectionalHandling();
    }
  }

  private applyBidirectionalHandling(): void {
    const element = this.elementRef.nativeElement;
    const textContent = this.bidiText || element.textContent || '';

    if (!textContent.trim()) return;

    switch (this.mode) {
      case 'force-auto':
        this.applyAutoDirection(element, textContent);
        break;
      case 'isolate':
        this.applyIsolation(element, textContent);
        break;
      case 'auto':
      default:
        this.applySmartBidiHandling(element, textContent);
        break;
    }
  }

  /**
   * Apply automatic direction detection
   */
  private applyAutoDirection(element: HTMLElement, text: string): void {
    const detectedDirection = this.rtlService.detectTextDirection(text);
    
    if (detectedDirection !== 'auto') {
      this.renderer.setAttribute(element, 'dir', detectedDirection);
      this.renderer.addClass(element, `bidi-${detectedDirection}`);
    }
  }

  /**
   * Apply Unicode bidirectional isolation
   */
  private applyIsolation(element: HTMLElement, text: string): void {
    this.renderer.setStyle(element, 'unicode-bidi', 'isolate');
    this.renderer.addClass(element, 'bidi-isolate');
    
    // Also apply direction if detectable
    const detectedDirection = this.rtlService.detectTextDirection(text);
    if (detectedDirection !== 'auto') {
      this.renderer.setAttribute(element, 'dir', detectedDirection);
    }
  }

  /**
   * Apply smart bidirectional handling with mixed content support
   */
  private applySmartBidiHandling(element: HTMLElement, text: string): void {
    const hasMixedContent = this.hasMixedDirectionalContent(text);
    
    if (hasMixedContent) {
      // For mixed content, use isolation and embed directional marks
      this.renderer.setStyle(element, 'unicode-bidi', 'isolate');
      this.renderer.addClass(element, 'bidi-mixed');
      
      // Process text with directional marks
      const processedText = this.addDirectionalMarks(text);
      if (processedText !== text) {
        element.innerHTML = processedText;
      }
    } else {
      // For uniform content, just set direction
      const detectedDirection = this.rtlService.detectTextDirection(text);
      if (detectedDirection !== 'auto') {
        this.renderer.setAttribute(element, 'dir', detectedDirection);
        this.renderer.addClass(element, `bidi-${detectedDirection}`);
      }
    }

    // Add general bidi class
    this.renderer.addClass(element, 'bidi-text');
  }

  /**
   * Check if text contains mixed directional content
   */
  private hasMixedDirectionalContent(text: string): boolean {
    const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
    const ltrRegex = /[A-Za-z0-9]/;
    
    return rtlRegex.test(text) && ltrRegex.test(text);
  }

  /**
   * Add Unicode directional marks to mixed content
   */
  private addDirectionalMarks(text: string): string {
    // This is a simplified implementation
    // In a production environment, you might want to use a more sophisticated
    // bidirectional text processing library
    
    const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]+/g;
    const ltrRegex = /[A-Za-z0-9]+/g;
    
    // Add Right-to-Left Mark (RLM) after RTL sequences
    let processedText = text.replace(rtlRegex, (match) => match + '\u200F');
    
    // Add Left-to-Right Mark (LRM) after LTR sequences
    processedText = processedText.replace(ltrRegex, (match) => match + '\u200E');
    
    return processedText;
  }
}