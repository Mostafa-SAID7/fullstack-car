import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import type { SiteAnalytics as SiteAnalyticsType } from '../../services/analyticsService';
import { analyticsService } from '../../services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';
import { AreaChart, PieChart } from '../../components/charts';
import { StatsSkeleton, ChartSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../hooks/useToast';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  loading = false
}) => {
  if (loading) {
    return <StatsSkeleton count={1} />;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  change > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(change)}% {changeLabel || 'vs last period'}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onDateChange
}) => {
  const [customRange, setCustomRange] = useState(false);

  const presetRanges = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'Last year', days: 365 },
    { label: 'Custom', custom: true }
  ];

  const handlePresetSelect = (preset: typeof presetRanges[0]) => {
    if (preset.custom) {
      setCustomRange(true);
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - (preset.days || 7));
      onDateChange(
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      );
      setCustomRange(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Date Range:</span>
      </div>

      <div className="flex items-center gap-2">
        {presetRanges.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => handlePresetSelect(preset)}
            className="text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {customRange && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onDateChange(e.target.value, endDate)}
            className="px-3 py-1 border border-border rounded text-sm"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onDateChange(startDate, e.target.value)}
            className="px-3 py-1 border border-border rounded text-sm"
          />
        </div>
      )}
    </div>
  );
};

export const SiteAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<SiteAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const { success, error: toastError } = useToast();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'acquisition', label: 'Acquisition', icon: Globe },
    { id: 'behavior', label: 'Behavior', icon: Eye },
    { id: 'realtime', label: 'Realtime', icon: RefreshCw }
  ];

  useEffect(() => {
    loadAnalytics();
  }, [startDate, endDate]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getSiteAnalytics(startDate, endDate);
      setAnalytics(data);
    } catch (err) {
      toastError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const exportData = () => {
    if (!analytics) return;

    const csvData = [
      ['Metric', 'Value'],
      ['Total Visitors', analytics.visitors.total],
      ['Unique Visitors', analytics.visitors.unique],
      ['Bounce Rate', `${analytics.visitors.bounceRate}%`],
      ['Average Session Duration', `${Math.round(analytics.pageviews.averageDuration / 60)} min`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${startDate}-to-${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    success('Analytics data exported successfully!');
  };

  const renderOverviewTab = () => {
    if (loading || !analytics) {
      return (
        <div className="space-y-6">
          <StatsSkeleton count={4} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton showTitle showLegend />
            <ChartSkeleton showTitle showLegend />
          </div>
        </div>
      );
    }

    // Prepare chart data
    const visitorData = [
      { name: 'Mon', visitors: 1200, pageviews: 2400 },
      { name: 'Tue', visitors: 1400, pageviews: 2800 },
      { name: 'Wed', visitors: 1100, pageviews: 2200 },
      { name: 'Thu', visitors: 1600, pageviews: 3200 },
      { name: 'Fri', visitors: 1800, pageviews: 3600 },
      { name: 'Sat', visitors: 900, pageviews: 1800 },
      { name: 'Sun', visitors: 1000, pageviews: 2000 }
    ];

    const deviceData = analytics.traffic.devices.map(device => ({
      name: device.device,
      value: device.sessions,
      percentage: device.percentage
    }));

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Visitors"
            value={analytics.visitors.total.toLocaleString()}
            change={12.5}
            icon={<Users className="w-6 h-6 text-blue-500" />}
          />
          <MetricCard
            title="Unique Visitors"
            value={analytics.visitors.unique.toLocaleString()}
            change={8.3}
            icon={<Eye className="w-6 h-6 text-green-500" />}
          />
          <MetricCard
            title="Bounce Rate"
            value={`${analytics.visitors.bounceRate}%`}
            change={-5.2}
            changeLabel="improvement"
            icon={<TrendingDown className="w-6 h-6 text-orange-500" />}
          />
          <MetricCard
            title="Avg. Session Duration"
            value={`${Math.round(analytics.pageviews.averageDuration / 60)} min`}
            change={15.7}
            icon={<Clock className="w-6 h-6 text-purple-500" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                data={visitorData}
                dataKey="visitors"
                xAxisKey="name"
                height={300}
                color="#3b82f6"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={deviceData}
                dataKey="value"
                nameKey="name"
                height={300}
              />
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.pageviews.topPages.slice(0, 5).map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{page.path}</p>
                      <p className="text-sm text-muted-foreground">
                        {page.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.round(page.averageTime / 60)} min
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {page.bounceRate}% bounce
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAudienceTab = () => {
    if (loading || !analytics) {
      return (
        <div className="space-y-6">
          <ChartSkeleton showTitle />
          <ChartSkeleton showTitle />
          <ChartSkeleton showTitle />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.geography.countries.slice(0, 10).map((country) => (
                  <div key={country.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-muted rounded text-xs flex items-center justify-center font-medium">
                        {country.code}
                      </div>
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{country.sessions.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{country.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.traffic.devices.map((device) => {
                  const Icon = device.device === 'Desktop' ? Monitor :
                              device.device === 'Mobile' ? Smartphone : Tablet;
                  return (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{device.sessions.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{device.percentage}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Returning vs New Visitors */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {analytics.visitors.new.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">New Visitors</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((analytics.visitors.new / analytics.visitors.total) * 100)}% of total
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {analytics.visitors.returning.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Returning Visitors</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((analytics.visitors.returning / analytics.visitors.total) * 100)}% of total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAcquisitionTab = () => {
    if (loading || !analytics) {
      return (
        <div className="space-y-6">
          <ChartSkeleton showTitle />
          <ChartSkeleton showTitle />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.traffic.sources.slice(0, 8).map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-medium capitalize">{source.source}</p>
                      <p className="text-sm text-muted-foreground">{source.medium}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{source.sessions.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{source.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.traffic.channels.map((channel) => (
                <div key={channel.channel} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    <span className="font-medium">{channel.channel}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{channel.sessions.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{channel.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBehaviorTab = () => {
    if (loading || !analytics) {
      return (
        <div className="space-y-6">
          <ChartSkeleton showTitle />
          <ChartSkeleton showTitle />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Page Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Page Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.pageviews.topPages.map((page) => (
                <div key={page.path} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{page.path}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{page.views.toLocaleString()} views</span>
                      <span>{page.uniqueViews.toLocaleString()} unique</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{Math.round(page.averageTime / 60)} min</p>
                    <p className={`text-sm ${page.bounceRate < 30 ? 'text-green-500' : page.bounceRate < 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {page.bounceRate}% bounce
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {analytics.pageviews.total.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Total Pageviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {Math.round(analytics.pageviews.averageDuration / 60)} min
                </div>
                <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {analytics.visitors.bounceRate}%
                </div>
                <p className="text-sm text-muted-foreground">Bounce Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderRealtimeTab = () => {
    const [realtimeData, setRealtimeData] = useState<SiteAnalyticsType['realtime'] | null>(null);
    const [realtimeLoading, setRealtimeLoading] = useState(true);

    useEffect(() => {
      const loadRealtime = async () => {
        try {
          const data = await analyticsService.getRealtimeAnalytics();
          setRealtimeData(data);
        } catch (err) {
          console.error('Failed to load realtime data:', err);
        } finally {
          setRealtimeLoading(false);
        }
      };

      loadRealtime();
      const interval = setInterval(loadRealtime, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }, []);

    if (realtimeLoading || !realtimeData) {
      return <ChartSkeleton showTitle />;
    }

    return (
      <div className="space-y-6">
        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {realtimeData.activeUsers}
                </div>
                <p className="text-sm text-muted-foreground">Active Users (now)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {realtimeData.currentPageViews}
                </div>
                <p className="text-sm text-muted-foreground">Current Pageviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {realtimeData.topActivePages.length}
                </div>
                <p className="text-sm text-muted-foreground">Active Pages</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Active Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Active Pages (Real-time)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {realtimeData.topActivePages.map((page, _index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <p className="font-medium">{page.path}</p>
                      <p className="text-sm text-muted-foreground">
                        {page.pageViews} pageviews
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{page.activeUsers} active</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'audience':
        return renderAudienceTab();
      case 'acquisition':
        return renderAcquisitionTab();
      case 'behavior':
        return renderBehaviorTab();
      case 'realtime':
        return renderRealtimeTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Site Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive website analytics and insights
          </p>
        </div>

        <div className="flex items-center gap-4">
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />

          <Button variant="outline" onClick={loadAnalytics} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content */}
      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>
    </div>
  );
};
