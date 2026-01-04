import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw
} from 'lucide-react';
import type { SiteAnalytics as SiteAnalyticsType } from '../../services/analyticsService';
import { analyticsService } from '../../services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle, Button, TabContent, StatsSkeleton, ChartSkeleton, MetricCard } from '../../components/ui';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, PieChart } from '../../components/charts';
import { useToast } from '../../hooks/useToast';
import { AnalyticsHeader } from './components/AnalyticsHeader';



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
  const [showTabDropdown, setShowTabDropdown] = useState(false);
  const tabDropdownRef = useRef<HTMLDivElement>(null);
  const { success, error: toastError } = useToast();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabDropdownRef.current && !tabDropdownRef.current.contains(event.target as Node)) {
        setShowTabDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="space-y-4 sm:space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <AreaChart
                  data={visitorData}
                  dataKey="visitors"
                  xAxisKey="name"
                  height={250}
                  color="#3b82f6"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <PieChart
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  height={250}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {analytics.pageviews.topPages.slice(0, 5).map((page, index) => (
                <div key={page.path} className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{page.path}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {page.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium">
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
      <div className="space-y-4 sm:space-y-6">
        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {analytics.geography.countries.slice(0, 10).map((country) => (
                  <div key={country.code} className="flex items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-6 h-4 sm:w-8 sm:h-6 bg-muted rounded text-xs flex items-center justify-center font-medium flex-shrink-0">
                        {country.code}
                      </div>
                      <span className="font-medium text-sm sm:text-base truncate">{country.country}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-sm sm:text-base">{country.sessions.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{country.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Device Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {analytics.traffic.devices.map((device) => {
                  const Icon = device.device === 'Desktop' ? Monitor :
                              device.device === 'Mobile' ? Smartphone : Tablet;
                  return (
                    <div key={device.device} className="flex items-center justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base">{device.device}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-medium text-sm sm:text-base">{device.sessions.toLocaleString()}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{device.percentage}%</p>
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
            <CardTitle className="text-base sm:text-lg">Visitor Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-2">
                  {analytics.visitors.new.toLocaleString()}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">New Visitors</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((analytics.visitors.new / analytics.visitors.total) * 100)}% of total
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">
                  {analytics.visitors.returning.toLocaleString()}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Returning Visitors</p>
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
      <div className="space-y-4 sm:space-y-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {analytics.traffic.sources.slice(0, 8).map((source) => (
                <div key={source.source} className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base capitalize truncate">{source.source}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{source.medium}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-sm sm:text-base">{source.sessions.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{source.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Traffic Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {analytics.traffic.channels.map((channel) => (
                <div key={channel.channel} className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-secondary rounded-full flex-shrink-0"></div>
                    <span className="font-medium text-sm sm:text-base truncate">{channel.channel}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-sm sm:text-base">{channel.sessions.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{channel.percentage}%</p>
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
      <div className="space-y-4 sm:space-y-6">
        {/* Page Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Page Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {analytics.pageviews.topPages.map((page) => (
                <div key={page.path} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{page.path}</p>
                    <div className="flex items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                      <span>{page.views.toLocaleString()} views</span>
                      <span>{page.uniqueViews.toLocaleString()} unique</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="font-medium text-sm sm:text-base">{Math.round(page.averageTime / 60)} min</p>
                    <p className={`text-xs sm:text-sm ${page.bounceRate < 30 ? 'text-green-500' : page.bounceRate < 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {page.bounceRate}% bounce
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-2">
                  {analytics.pageviews.total.toLocaleString()}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Pageviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">
                  {Math.round(analytics.pageviews.averageDuration / 60)} min
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Avg. Session Duration</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">
                  {analytics.visitors.bounceRate}%
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Bounce Rate</p>
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
      <div className="space-y-4 sm:space-y-6">
        {/* Real-time Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">
                  {realtimeData.activeUsers}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Users (now)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-2">
                  {realtimeData.currentPageViews}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Current Pageviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-500 mb-2">
                  {realtimeData.topActivePages.length}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Pages</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Active Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Top Active Pages (Real-time)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {realtimeData.topActivePages.map((page, _index) => (
                <div key={page.path} className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{page.path}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {page.pageViews} pageviews
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-sm sm:text-base">{page.activeUsers} active</p>
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

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <AnalyticsHeader
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        onRefresh={loadAnalytics}
        onExport={exportData}
        loading={loading}
      />

      {/* Inner Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="relative" ref={tabDropdownRef}>
          <Button
            variant="outline"
            onClick={() => setShowTabDropdown(!showTabDropdown)}
            className="flex items-center gap-2"
          >
            {currentTab && (
              <>
                <currentTab.icon className="w-4 h-4" />
                <span>{currentTab.label}</span>
              </>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showTabDropdown ? 'rotate-180' : ''}`} />
          </Button>
          <AnimatePresence>
            {showTabDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowTabDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                        activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium text-sm">{tab.label}</span>
                      {activeTab === tab.id && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>
    </div>
  );
};
