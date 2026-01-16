import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Zap, TrendingUp, Clock } from 'lucide-react';
import { usePerformanceMetrics, useFPS, useMemoryUsage } from '../../hooks/usePerformance';

export const PerformanceMonitor: React.FC = () => {
  const metrics = usePerformanceMetrics();
  const fps = useFPS();
  const memoryUsage = useMemoryUsage();
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility with keyboard shortcut (Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
        title="Show Performance Monitor (Ctrl+Shift+P)"
      >
        <Activity className="w-5 h-5" />
      </button>
    );
  }

  const formatBytes = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getFPSColor = (fps: number): string => {
    if (fps >= 55) return 'text-success';
    if (fps >= 30) return 'text-warning';
    return 'text-destructive';
  };

  const getMemoryColor = (used: number, limit: number): string => {
    const percentage = (used / limit) * 100;
    if (percentage < 70) return 'text-success';
    if (percentage < 85) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 w-80 bg-card border border-border rounded-lg shadow-xl z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Performance Monitor</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ×
        </button>
      </div>

      {/* Metrics */}
      <div className="p-4 space-y-4">
        {/* FPS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">FPS</span>
          </div>
          <span className={`text-lg font-bold ${getFPSColor(fps)}`}>
            {fps}
          </span>
        </div>

        {/* Memory Usage */}
        {memoryUsage && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Memory</span>
              </div>
              <span className={`text-sm font-medium ${getMemoryColor(memoryUsage.used, memoryUsage.limit)}`}>
                {formatBytes(memoryUsage.used)} / {formatBytes(memoryUsage.limit)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  getMemoryColor(memoryUsage.used, memoryUsage.limit).replace('text-', 'bg-')
                }`}
                style={{
                  width: `${Math.min((memoryUsage.used / memoryUsage.limit) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Load Timing */}
        {metrics && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">DOM Ready</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatTime(metrics.timing.domContentLoaded)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Load Complete</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatTime(metrics.timing.loadComplete)}
              </span>
            </div>

            {metrics.timing.firstContentfulPaint && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">First Paint</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {formatTime(metrics.timing.firstContentfulPaint)}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/50">
        <p className="text-xs text-muted-foreground text-center">
          Press <kbd className="px-1 py-0.5 bg-background rounded text-foreground">Ctrl+Shift+P</kbd> to toggle
        </p>
      </div>
    </motion.div>
  );
};
