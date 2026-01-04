import React, { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  HardDrive,
  Server,
  AlertTriangle,
  Activity,
  Cpu,
  BarChart3,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';
import type { PerformanceMetrics as PerformanceMetricsType } from '../../services/analyticsService';
import { analyticsService } from '../../services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle, Button, Progress, Badge, ChartSkeleton, StatsSkeleton, MetricCard } from '../../components/ui';
import { useToast } from '../../hooks/useToast';


interface PerformanceScoreProps {
  score: number;
  label: string;
  maxScore?: number;
}

const PerformanceScore: React.FC<PerformanceScoreProps> = ({
  score,
  label,
  maxScore = 100
}) => {
  const percentage = (score / maxScore) * 100;
  const getScoreColor = () => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };


  return (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-2">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${percentage}, 100`}
            className="text-muted"
          />
          <path
            d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={getScoreColor()}
            strokeDasharray="100, 100"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${getScoreColor()}`}>
            {Math.round(percentage)}
          </span>
        </div>
      </div>
      <p className="text-sm font-medium">{label}</p>
      <Badge variant={percentage >= 90 ? 'default' : percentage >= 50 ? 'secondary' : 'destructive'} className="mt-1">
        {percentage >= 90 ? 'Good' : percentage >= 50 ? 'Needs Work' : 'Poor'}
      </Badge>
    </div>
  );
};

export const PerformanceMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadMetrics();
  }, [deviceType]);

  useEffect(() => {
    let interval: number;
    if (autoRefresh) {
      interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getPerformanceMetrics(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
        deviceType
      );
      setMetrics(data);
    } catch (err) {
      toastError('Failed to load performance metrics');
      console.error('Performance metrics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async () => {
    try {
      const result = await analyticsService.runPerformanceAudit(window.location.origin);
      setMetrics(result);
      success('Performance audit completed successfully!');
    } catch (err) {
      toastError('Failed to run performance audit');
    }
  };

  const getStatusForMetric = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'critical';
  };

  if (loading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>
        <StatsSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton showTitle />
          <ChartSkeleton showTitle />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your website's performance metrics and Core Web Vitals
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Device Type Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Device:</span>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value as any)}
              className="px-3 py-1 border border-border rounded text-sm bg-background"
            >
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>

          {/* Auto Refresh Toggle */}
          <Button
            variant={autoRefresh ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Auto Refresh
          </Button>

          <Button variant="outline" onClick={runAudit}>
            <Activity className="w-4 h-4 mr-2" />
            Run Audit
          </Button>

          <Button variant="outline" onClick={loadMetrics} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Core Web Vitals Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <PerformanceScore
              score={100 - (metrics.coreWebVitals.lcp * 10)} // Convert to score out of 100
              label="LCP"
              maxScore={100}
            />
            <PerformanceScore
              score={100 - (metrics.coreWebVitals.fid * 2)}
              label="FID"
              maxScore={100}
            />
            <PerformanceScore
              score={100 - (metrics.coreWebVitals.cls * 100)}
              label="CLS"
              maxScore={100}
            />
            <PerformanceScore
              score={100 - ((metrics.coreWebVitals.fcp - 1) * 20)}
              label="FCP"
              maxScore={100}
            />
            <PerformanceScore
              score={100 - ((metrics.coreWebVitals.ttfb - 0.5) * 50)}
              label="TTFB"
              maxScore={100}
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Largest Contentful Paint"
          value={metrics.coreWebVitals.lcp}
          unit="s"
          status={getStatusForMetric(metrics.coreWebVitals.lcp, { good: 2.5, warning: 4.0 })}
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          title="First Input Delay"
          value={metrics.coreWebVitals.fid}
          unit="ms"
          status={getStatusForMetric(metrics.coreWebVitals.fid, { good: 100, warning: 300 })}
          icon={<Activity className="w-5 h-5" />}
        />
        <MetricCard
          title="Cumulative Layout Shift"
          value={metrics.coreWebVitals.cls}
          status={getStatusForMetric(metrics.coreWebVitals.cls, { good: 0.1, warning: 0.25 })}
          icon={<BarChart3 className="w-5 h-5" />}
        />
        <MetricCard
          title="Server Response Time"
          value={metrics.server.responseTime}
          unit="s"
          status={getStatusForMetric(metrics.server.responseTime, { good: 0.8, warning: 1.5 })}
          icon={<Server className="w-5 h-5" />}
        />
      </div>

      {/* Loading Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">
                {metrics.loading.domContentLoaded}s
              </div>
              <p className="text-sm text-muted-foreground">DOM Content Loaded</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">
                {metrics.loading.loadComplete}s
              </div>
              <p className="text-sm text-muted-foreground">Load Complete</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">
                {metrics.loading.firstPaint}s
              </div>
              <p className="text-sm text-muted-foreground">First Paint</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500 mb-1">
                {metrics.loading.firstContentfulPaint}s
              </div>
              <p className="text-sm text-muted-foreground">First Contentful Paint</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Resource Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Size</span>
                <span className="text-sm font-bold">{metrics.resources.totalSize} MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Requests</span>
                <span className="text-sm font-bold">{metrics.resources.requests}</span>
              </div>

              <div className="space-y-2 mt-4">
                {metrics.resources.byType.map((resource) => (
                  <div key={resource.type} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{resource.type}</span>
                        <span className="text-sm text-muted-foreground">
                          {resource.size} MB ({resource.requests} req)
                        </span>
                      </div>
                      <Progress value={resource.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              JavaScript Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl font-bold text-blue-500 mb-1">
                    {metrics.javascript.executionTime}ms
                  </div>
                  <p className="text-xs text-muted-foreground">Execution Time</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl font-bold text-orange-500 mb-1">
                    {metrics.javascript.unusedJs} MB
                  </div>
                  <p className="text-xs text-muted-foreground">Unused JS</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Code Coverage</span>
                  <span className="text-sm font-medium">{metrics.javascript.coverage}%</span>
                </div>
                <Progress value={metrics.javascript.coverage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Server Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Server Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {metrics.server.uptime}%
              </div>
              <p className="text-sm text-muted-foreground">Uptime (24h)</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {metrics.server.errors}
              </div>
              <p className="text-sm text-muted-foreground">Server Errors</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Status Codes</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {Object.entries(metrics.server.statusCodes).map(([code, count]) => (
                  <div key={code} className="p-2 bg-muted/30 rounded">
                    <div className="text-lg font-bold">{code}</div>
                    <div className="text-xs text-muted-foreground">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.coreWebVitals.lcp > 2.5 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50  rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 ">
                    Improve Largest Contentful Paint (LCP)
                  </p>
                  <p className="text-sm text-yellow-700  mt-1">
                    Your LCP is {metrics.coreWebVitals.lcp}s. Consider optimizing images, reducing server response time, and removing render-blocking resources.
                  </p>
                </div>
              </div>
            )}

            {metrics.coreWebVitals.cls > 0.1 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-800 ">
                    Reduce Cumulative Layout Shift (CLS)
                  </p>
                  <p className="text-sm text-orange-700  mt-1">
                    Your CLS score is {metrics.coreWebVitals.cls}. Include size attributes on images and avoid inserting content above existing content.
                  </p>
                </div>
              </div>
            )}

            {metrics.javascript.unusedJs > 0.5 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 ">
                    Reduce Unused JavaScript
                  </p>
                  <p className="text-sm text-blue-700  mt-1">
                    You have {metrics.javascript.unusedJs} MB of unused JavaScript. Consider code splitting and removing unused dependencies.
                  </p>
                </div>
              </div>
            )}

            {metrics.images.unoptimizedImages > 0 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 ">
                    Optimize Images
                  </p>
                  <p className="text-sm text-green-700  mt-1">
                    {metrics.images.unoptimizedImages} out of {metrics.images.totalImages} images are not optimized. Use modern formats like WebP and compress images.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
