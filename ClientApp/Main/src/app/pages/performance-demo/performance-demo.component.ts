import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Performance Demo Page
 * 
 * Showcases all Core Web Vitals optimization features:
 * - CLS (Cumulative Layout Shift) optimization
 * - FID (First Input Delay) optimization
 * - Performance monitoring and metrics
 * - Interactive demonstrations
 */
@Component({
  selector: 'app-performance-demo',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './performance-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceDemoComponent {
  activeTab: 'cls' | 'fid' | 'overview' = 'overview';

  getTabClasses(tab: string): string {
    const baseClasses = 'border-transparent text-muted-foreground hover:text-foreground hover:border-border';
    const activeClasses = 'border-primary text-primary';

    return this.activeTab === tab ? activeClasses : baseClasses;
  }
}