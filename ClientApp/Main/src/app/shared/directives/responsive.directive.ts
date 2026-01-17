import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { DesignSystemService } from '@core/services/design-system.service';

/**
 * Responsive Show Directive
 * 
 * Shows content only on specified breakpoints
 * 
 * Usage:
 * <div *appShowOn="'mobile'">Mobile only</div>
 * <div *appShowOn="'desktop'">Desktop only</div>
 */
@Directive({
  selector: '[appShowOn]',
  standalone: true
})
export class ShowOnDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private designSystem = inject(DesignSystemService);

  @Input() set appShowOn(breakpoint: 'mobile' | 'tablet' | 'desktop') {
    effect(() => {
      const shouldShow = this.shouldShow(breakpoint);
      
      if (shouldShow && this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (!shouldShow && this.viewContainer.length > 0) {
        this.viewContainer.clear();
      }
    });
  }

  private shouldShow(breakpoint: 'mobile' | 'tablet' | 'desktop'): boolean {
    switch (breakpoint) {
      case 'mobile':
        return this.designSystem.isMobile();
      case 'tablet':
        return this.designSystem.isTablet();
      case 'desktop':
        return this.designSystem.isDesktop();
      default:
        return true;
    }
  }
}

/**
 * Responsive Hide Directive
 * 
 * Hides content on specified breakpoints
 * 
 * Usage:
 * <div *appHideOn="'mobile'">Hidden on mobile</div>
 * <div *appHideOn="'desktop'">Hidden on desktop</div>
 */
@Directive({
  selector: '[appHideOn]',
  standalone: true
})
export class HideOnDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private designSystem = inject(DesignSystemService);

  @Input() set appHideOn(breakpoint: 'mobile' | 'tablet' | 'desktop') {
    effect(() => {
      const shouldHide = this.shouldHide(breakpoint);
      
      if (!shouldHide && this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (shouldHide && this.viewContainer.length > 0) {
        this.viewContainer.clear();
      }
    });
  }

  private shouldHide(breakpoint: 'mobile' | 'tablet' | 'desktop'): boolean {
    switch (breakpoint) {
      case 'mobile':
        return this.designSystem.isMobile();
      case 'tablet':
        return this.designSystem.isTablet();
      case 'desktop':
        return this.designSystem.isDesktop();
      default:
        return false;
    }
  }
}
