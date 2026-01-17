import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { debounceTime, throttleTime, map } from 'rxjs/operators';

export interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  timestamp: number;
}

export interface OptimizationConfig {
  enableResourceHints: boolean;
  enableImageOptimization: boolean;
  enableFontOptimization: boolean;
  enableCriticalCSS: boolean;
  enableLazyLoading: boolean;
  enableServiceWorker: boolean;
  enableCompression: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceOptimizationService {
  private document = inject(DOCUMENT);

  private config = signal<OptimizationConfig>({
    enableResourceHints: true,
    enableImageOptimization: true,
    enableFontOptimization: true,
    enableCriticalCSS: true,
    enableLazyLoading: true,
    enableServiceWorker: true,
    enableCompression: true
  });

  readonly currentConfig = this.config.asReadonly();

  constructor() { }

  updateConfig(config: Partial<OptimizationConfig>): void {
    this.config.update(c => ({ ...c, ...config }));
  }
}
