import { useEffect, useState, useCallback, useRef } from 'react';
import { getPerformanceMetrics, monitorFPS, PerformanceMetrics } from '../utils/performance';

/**
 * Hook to monitor component render performance
 */
export function useRenderPerformance(componentName: string, enabled: boolean = true) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    renderCount.current++;
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    lastRenderTime.current = currentTime;

    if (renderCount.current > 1 && timeSinceLastRender < 16) {
      console.warn(
        `[Performance] ${componentName} re-rendered ${renderCount.current} times. ` +
        `Last render was ${timeSinceLastRender.toFixed(2)}ms ago.`
      );
    }
  });

  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current
  };
}

/**
 * Hook to get performance metrics
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Wait for page to fully load
    if (document.readyState === 'complete') {
      setMetrics(getPerformanceMetrics());
    } else {
      window.addEventListener('load', () => {
        setMetrics(getPerformanceMetrics());
      });
    }
  }, []);

  return metrics;
}

/**
 * Hook to monitor FPS
 */
export function useFPS() {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const stopMonitoring = monitorFPS(setFps);
    return stopMonitoring;
  }, []);

  return fps;
}

/**
 * Hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttled callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook for intersection observer (lazy loading)
 */
export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement | null>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

/**
 * Hook for lazy loading images
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLElement>(null);

  const { hasIntersected } = useIntersectionObserver(imgRef, {
    rootMargin: '50px'
  });

  useEffect(() => {
    if (hasIntersected && !isLoaded) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
    }
  }, [hasIntersected, src, isLoaded]);

  return { imgRef, imageSrc, isLoaded };
}

/**
 * Hook for measuring component mount time
 */
export function useMountTime(componentName: string) {
  const mountTime = useRef(performance.now());

  useEffect(() => {
    const duration = performance.now() - mountTime.current;
    if (duration > 100) {
      console.warn(
        `[Performance] ${componentName} took ${duration.toFixed(2)}ms to mount`
      );
    }
  }, [componentName]);
}

/**
 * Hook for idle callback
 */
export function useIdleCallback(callback: () => void, deps: any[] = []) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(callback);
      return () => cancelIdleCallback(id);
    } else {
      const timeout = setTimeout(callback, 1);
      return () => clearTimeout(timeout);
    }
  }, deps);
}

/**
 * Hook for memory usage monitoring (Chrome only)
 */
export function useMemoryUsage() {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    if (!('memory' in performance)) {
      return;
    }

    const updateMemory = () => {
      const memory = (performance as any).memory;
      setMemoryUsage({
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      });
    };

    updateMemory();
    const interval = setInterval(updateMemory, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryUsage;
}
