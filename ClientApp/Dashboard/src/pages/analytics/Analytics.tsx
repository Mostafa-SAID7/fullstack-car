import React, { useState } from 'react';
import {
  BarChart3,
  Activity,
  Search,
  Settings,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react';
import { TabNavigation, TabContent, Input, Button, Card, CardContent } from '../../components/ui';
import { SiteAnalytics } from './SiteAnalytics';
import { PerformanceMonitoring } from './PerformanceMonitoring';
import { SEOAnalysis } from './SEOAnalysis';
import { OnePageAnalytics } from './OnePageAnalytics';
import { AnalyticsSettings } from './AnalyticsSettings';

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('site-analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const tabs = [
    {
      id: 'site-analytics',
      label: 'Site Analytics',
      icon: BarChart3,
      description: 'Google Analytics-like insights'
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Activity,
      description: 'Core Web Vitals & monitoring'
    },
    {
      id: 'seo',
      label: 'SEO Analysis',
      icon: Search,
      description: 'Search engine optimization'
    },
    {
      id: 'onepage',
      label: 'OnePage Analytics',
      icon: Zap,
      description: 'Single-page application metrics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Configure analytics tools'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'site-analytics':
        return <SiteAnalytics />;
      case 'performance':
        return <PerformanceMonitoring />;
      case 'seo':
        return <SEOAnalysis />;
      case 'onepage':
        return <OnePageAnalytics />;
      case 'settings':
        return <AnalyticsSettings />;
      default:
        return <SiteAnalytics />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Site Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <Input
              type="text"
              placeholder="Search analytics..."
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
              className="w-64"
            />
          )}
          <Button
            variant="outline"
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                <p className="text-2xl font-bold mt-1">154.2K</p>
                <p className="text-xs text-green-500 mt-1">+12.5% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance Score</p>
                <p className="text-2xl font-bold mt-1">87%</p>
                <p className="text-xs text-muted-foreground mt-1">Core Web Vitals</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SEO Score</p>
                <p className="text-2xl font-bold mt-1">82%</p>
                <p className="text-xs text-muted-foreground mt-1">Search rankings</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Search className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold mt-1">1,247</p>
                <p className="text-xs text-muted-foreground mt-1">Real-time users</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <RefreshCw className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
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