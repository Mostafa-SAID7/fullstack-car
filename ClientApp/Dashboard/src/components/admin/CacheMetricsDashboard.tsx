import React from 'react';
import { motion } from 'framer-motion';
import { Database, TrendingUp, Clock, HardDrive, RefreshCw, Trash2 } from 'lucide-react';
import { useCache } from '../../hooks/useCache';

export const CacheMetricsDashboard: React.FC = () => {
  const { metrics, stats, topEntries, refreshMetrics, clearCache, resetMetrics } = useCache();

  if (!metrics || !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading cache metrics...</div>
      </div>
    );
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number | null): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cache Metrics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor cache performance and usage
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshMetrics}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={resetMetrics}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Reset Metrics
          </button>
          <button
            onClick={clearCache}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cache
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hit Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {metrics.hitRate.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.totalHits} hits / {metrics.totalMisses} misses
                </p>
              </div>
              <TrendingUp className={`w-8 h-8 ${
                metrics.hitRate >= 70 ? 'text-success' : 
                metrics.hitRate >= 50 ? 'text-warning' : 
                'text-destructive'
              }`} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cache Entries</p>
                <p className="text-2xl font-bold text-foreground">
                  {metrics.entryCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total cached items
                </p>
              </div>
              <Database className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cache Size</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatBytes(metrics.totalSize)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Memory usage
                </p>
              </div>
              <HardDrive className="w-8 h-8 text-info" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold text-foreground">
                  {metrics.totalHits + metrics.totalMisses}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cache lookups
                </p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Cache Age Info */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Cache Age</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Oldest Entry</p>
              <p className="text-sm text-foreground">{formatDate(metrics.oldestEntry)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Newest Entry</p>
              <p className="text-sm text-foreground">{formatDate(metrics.newestEntry)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Accessed Entries */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Top Accessed Entries</h3>
          <p className="text-sm text-muted-foreground">Most frequently accessed cache entries</p>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Cache Key
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Hits
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Size
                  </th>
                </tr>
              </thead>
              <tbody>
                {topEntries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-muted-foreground">
                      No cache entries yet
                    </td>
                  </tr>
                ) : (
                  topEntries.map((entry, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm text-foreground font-mono truncate max-w-md">
                        {entry.key}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground text-right">
                        {entry.hits}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground text-right">
                        {formatBytes(entry.size)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* All Cache Keys */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">All Cache Keys</h3>
          <p className="text-sm text-muted-foreground">
            {stats.size} total keys
          </p>
        </div>
        <div className="card-body">
          <div className="max-h-96 overflow-y-auto">
            {stats.keys.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No cache keys found
              </p>
            ) : (
              <div className="space-y-1">
                {stats.keys.map((key, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-muted/50 rounded text-sm font-mono text-foreground truncate"
                  >
                    {key}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
