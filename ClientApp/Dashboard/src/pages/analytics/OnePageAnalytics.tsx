import React, { useState, useEffect } from 'react';
import {
  Zap,
  Eye,
  MousePointer,
  Monitor,
  Target,
  TrendingUp,
  BarChart3,
  Activity,
  Code,
  Layers,
  Shield,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';
import type { OnePageMetrics as OnePageMetricsType } from '../../services/analyticsService';
import { analyticsService } from '../../services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle, Button, Progress, Badge, Input, ChartSkeleton, StatsSkeleton, MetricCard } from '../../components/ui';
import { useToast } from '../../hooks/useToast';


interface ScrollDepthChartProps {
  data: { [key: string]: number };
}

const ScrollDepthChart: React.FC<ScrollDepthChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([depth, percentage]) => ({
    depth: depth.replace('%', ''),
    percentage,
    label: `${depth} Scroll Depth`
  }));

  return (
    <div className="space-y-4">
      {chartData.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="w-16 text-sm font-medium">{item.depth}%</div>
          <div className="flex-1">
            <Progress value={item.percentage} className="h-3" />
          </div>
          <div className="w-12 text-sm text-muted-foreground text-right">
            {item.percentage}%
          </div>
        </div>
      ))}
    </div>
  );
};

export const OnePageAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<OnePageMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(window.location.origin);
  const [isTracking, setIsTracking] = useState(false);
  const [journeyData, setJourneyData] = useState<any[]>([]);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadMetrics();
  }, [url]);

  useEffect(() => {
    let interval: number;
    if (isTracking) {
      interval = setInterval(() => {
        // Simulate real-time updates
        if (metrics) {
          setMetrics(prev => prev ? {
            ...prev,
            userExperience: {
              ...prev.userExperience,
              engagementRate: Math.min(100, prev.userExperience.engagementRate + Math.random() * 2 - 1),
              timeOnPage: prev.userExperience.timeOnPage + Math.random() * 10
            }
          } : null);
        }
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, metrics]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getOnePageMetrics(url);
      setMetrics(data);

      // Load user journey data
      const journey = await analyticsService.trackUserJourney('session-123');
      setJourneyData(journey);
    } catch (err) {
      toastError('Failed to load OnePage metrics');
      console.error('OnePage metrics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    success(isTracking ? 'Real-time tracking stopped' : 'Real-time tracking started');
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
          <h1 className="text-3xl font-bold">OnePage Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive analytics for single-page applications and landing pages
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Input
              value={url}
              onChange={(value: string) => setUrl(value)}
              placeholder="Enter page URL"
              className="w-64"
            />
            <Button variant="outline" onClick={loadMetrics} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Analyze
            </Button>
          </div>

          <Button
            variant={isTracking ? 'primary' : 'outline'}
            onClick={toggleTracking}
          >
            {isTracking ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="First Contentful Paint"
          value={metrics.performance.firstContentfulPaint}
          unit="s"
          icon={<Zap className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Largest Contentful Paint"
          value={metrics.performance.largestContentfulPaint}
          unit="s"
          icon={<Activity className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Cumulative Layout Shift"
          value={metrics.performance.cumulativeLayoutShift}
          icon={<BarChart3 className="w-5 h-5" />}
          color="orange"
        />
        <MetricCard
          title="Interaction to Next Paint"
          value={metrics.performance.interactionToNextPaint}
          unit="ms"
          icon={<MousePointer className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* User Experience Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {Math.round(metrics.userExperience.engagementRate)}%
                </div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                {isTracking && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-500">Live</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {Math.round(metrics.userExperience.timeOnPage)}s
                </div>
                <p className="text-sm text-muted-foreground">Avg. Time on Page</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-3">Scroll Depth Analysis</h4>
              <ScrollDepthChart data={metrics.userExperience.scrollDepth} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Conversion Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-500 mb-2">
                  {metrics.userExperience.conversionRate}%
                </div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Primary Goal Completions</span>
                  <span className="text-sm font-medium">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Secondary Goals</span>
                  <span className="text-sm font-medium">834</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Form Submissions</span>
                  <span className="text-sm font-medium">456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Click-through Rate</span>
                  <span className="text-sm font-medium">3.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Content Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Sections</span>
                <span className="text-sm font-medium">{metrics.content.totalSections}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Visible Sections</span>
                <span className="text-sm font-medium text-green-500">{metrics.content.visibleSections}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Interactive Elements</span>
                <span className="text-sm font-medium">{metrics.content.interactiveElements}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Media Elements</span>
                <span className="text-sm font-medium">{metrics.content.mediaElements}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Text Blocks</span>
                <span className="text-sm font-medium">{metrics.content.textBlocks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Accessibility Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">
                  {metrics.accessibility.wcagCompliance.aaa}%
                </div>
                <p className="text-xs text-muted-foreground">WCAG AAA Compliant</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AA Compliance</span>
                  <span className="text-sm font-medium">{metrics.accessibility.wcagCompliance.aa}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">A Compliance</span>
                  <span className="text-sm font-medium">{metrics.accessibility.wcagCompliance.a}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alt Text Coverage</span>
                  <span className="text-sm font-medium">{metrics.accessibility.altTextCoverage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Keyboard Navigation</span>
                  <Badge variant={metrics.accessibility.keyboardNavigation ? 'default' : 'destructive'}>
                    {metrics.accessibility.keyboardNavigation ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Technical Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Bundle Size</span>
                <span className="text-sm font-medium">{metrics.technical.bundleSize} MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dependencies</span>
                <span className="text-sm font-medium">{metrics.technical.dependencies}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Unused Dependencies</span>
                <span className="text-sm font-medium text-orange-500">{metrics.technical.unusedDependencies}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Code Splitting</span>
                  <Badge variant={metrics.technical.codeSplitting ? 'default' : 'secondary'}>
                    {metrics.technical.codeSplitting ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Lazy Loading</span>
                  <Badge variant={metrics.technical.lazyLoading ? 'default' : 'secondary'}>
                    {metrics.technical.lazyLoading ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Service Worker</span>
                  <Badge variant={metrics.technical.serviceWorker ? 'default' : 'secondary'}>
                    {metrics.technical.serviceWorker ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Journey Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>User Journey Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journeyData.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    {event.action === 'click' && <MousePointer className="w-4 h-4 text-primary" />}
                    {event.action === 'scroll' && <Eye className="w-4 h-4 text-blue-500" />}
                    {event.action === 'view' && <Monitor className="w-4 h-4 text-green-500" />}
                    {event.action === 'form_submit' && <Target className="w-4 h-4 text-purple-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">{event.action.replace('_', ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm">{event.element} on {event.page}</p>
                  {event.metadata && (
                    <p className="text-xs text-muted-foreground">
                      Duration: {event.metadata.duration}ms
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.performance.firstContentfulPaint > 2 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Zap className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">
                    Optimize First Contentful Paint
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your FCP is {metrics.performance.firstContentfulPaint}s. Consider optimizing images, reducing render-blocking resources, and improving server response time.
                  </p>
                </div>
              </div>
            )}

            {metrics.userExperience.scrollDepth['100%'] < 50 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Eye className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-800">
                    Improve Content Engagement
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    Only {metrics.userExperience.scrollDepth['100%']}% of users scroll to the bottom. Consider improving content flow and adding more engaging elements.
                  </p>
                </div>
              </div>
            )}

            {metrics.technical.unusedDependencies > 5 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <Code className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">
                    Reduce Bundle Size
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    You have {metrics.technical.unusedDependencies} unused dependencies. Consider tree-shaking and removing unnecessary packages.
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
