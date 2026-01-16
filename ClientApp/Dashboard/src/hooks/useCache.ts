import { useState, useEffect } from 'react';
import { cacheService } from '../services/cache';

interface CacheMetrics {
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  totalSize: number;
  entryCount: number;
  oldestEntry: number | null;
  newestEntry: number | null;
}

interface CacheStats {
  size: number;
  keys: string[];
}

interface TopEntry {
  key: string;
  hits: number;
  size: number;
}

/**
 * Hook for accessing cache metrics and operations
 */
export function useCache() {
  const [metrics, setMetrics] = useState<CacheMetrics | null>(null);
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [topEntries, setTopEntries] = useState<TopEntry[]>([]);

  const refreshMetrics = () => {
    setMetrics(cacheService.getMetrics());
    setStats(cacheService.getStats());
    setTopEntries(cacheService.getTopEntries(10));
  };

  useEffect(() => {
    // Initial load
    refreshMetrics();

    // Refresh every 10 seconds
    const interval = setInterval(refreshMetrics, 10000);

    return () => clearInterval(interval);
  }, []);

  const clearCache = () => {
    cacheService.clear();
    refreshMetrics();
  };

  const invalidatePattern = (pattern: string) => {
    cacheService.invalidatePattern(pattern);
    refreshMetrics();
  };

  const resetMetrics = () => {
    cacheService.resetMetrics();
    refreshMetrics();
  };

  return {
    metrics,
    stats,
    topEntries,
    refreshMetrics,
    clearCache,
    invalidatePattern,
    resetMetrics
  };
}
