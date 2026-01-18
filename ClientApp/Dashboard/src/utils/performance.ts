/**
 * Performance Utilities
 * Tools for measuring and optimizing performance
 */

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string, callback: () => void): void {
  const start = performance.now();
  callback();
  const end = performance.now();
  const duration = end - start;

  if (duration > 16) { // More than one frame (60fps)
    console.warn(`[Performance] ${componentName} took ${duration.toFixed(2)}ms to render`);
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: any | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize function results
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Request Idle Callback wrapper
 */
export function runWhenIdle(callback: () => void, timeout: number = 2000): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Batch updates to reduce re-renders
 */
export function batchUpdates<T>(
  updates: Array<() => void>,
  delay: number = 0
): void {
  if (delay === 0) {
    updates.forEach(update => update());
  } else {
    setTimeout(() => {
      updates.forEach(update => update());
    }, delay);
  }
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Lazy load images
 */
export function lazyLoadImage(img: HTMLImageElement): void {
  const src = img.dataset.src;
  if (!src) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        img.src = src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  observer.observe(img);
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  fps: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  timing: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
  };
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  const timing = performance.timing;
  const navigationStart = timing.navigationStart;

  const metrics: PerformanceMetrics = {
    fps: 0,
    timing: {
      domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
      loadComplete: timing.loadEventEnd - navigationStart
    }
  };

  // Get paint timing
  const paintEntries = performance.getEntriesByType('paint');
  paintEntries.forEach(entry => {
    if (entry.name === 'first-paint') {
      metrics.timing.firstPaint = entry.startTime;
    } else if (entry.name === 'first-contentful-paint') {
      metrics.timing.firstContentfulPaint = entry.startTime;
    }
  });

  // Get memory info (Chrome only)
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    metrics.memory = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    };
  }

  return metrics;
}

/**
 * Monitor FPS
 */
export function monitorFPS(callback: (fps: number) => void): () => void {
  let lastTime = performance.now();
  let frames = 0;
  let animationId: number;

  const measureFPS = () => {
    frames++;
    const currentTime = performance.now();

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      callback(fps);
      frames = 0;
      lastTime = currentTime;
    }

    animationId = requestAnimationFrame(measureFPS);
  };

  animationId = requestAnimationFrame(measureFPS);

  return () => cancelAnimationFrame(animationId);
}

/**
 * Log performance warning
 */
export function logPerformanceWarning(
  operation: string,
  duration: number,
  threshold: number = 100
): void {
  if (duration > threshold) {
    console.warn(
      `[Performance Warning] ${operation} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
    );
  }
}

/**
 * Measure async operation
 */
export async function measureAsync<T>(
  operation: string,
  callback: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await callback();
    const duration = performance.now() - start;
    logPerformanceWarning(operation, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance] ${operation} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Create performance observer
 */
export function observePerformance(
  entryTypes: string[],
  callback: (entries: PerformanceEntry[]) => void
): PerformanceObserver | null {
  if (!('PerformanceObserver' in window)) {
    return null;
  }

  const observer = new PerformanceObserver((list) => {
    callback(list.getEntries());
  });

  try {
    observer.observe({ entryTypes });
    return observer;
  } catch (error) {
    console.error('[Performance] Failed to observe performance:', error);
    return null;
  }
}
