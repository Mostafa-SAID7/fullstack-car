import React, { useState } from 'react';
import {
  BarChart3,
  Activity,
  Search,
  Settings,
  Zap,
  Eye,
  RefreshCw,
  Download
} from 'lucide-react';
import { PageHeader, type PageStat, type PageAction } from '../../../components/shared/PageHeader';
import { TabNavigation, TabContent } from '../../../components/shared/TabNavigation';
import type { TabItem } from '../../../components/shared/TabNavigation';
import { SiteAnalytics } from './SiteAnalytics';
import { PerformanceMonitoring } from './PerformanceMonitoring';
import { SEOAnalysis } from './SEOAnalysis';
import { OnePageAnalytics } from './OnePageAnalytics';
import { AnalyticsSettings } from './AnalyticsSettings';

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('site-analytics');

  // Page header configuration
  const stats: PageStat[] = [
    {
      label: 'Total Visitors',
      value: '154.2K',
      icon: Eye,
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      label: 'Performance Score',
      value: '87%',
      icon: Activity,
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'SEO Score',
      value: '82%',
      icon: Search,
      change: '+3%',
      changeType: 'positive'
    },
    {
      label: 'Active Sessions',
      value: '1,247',
      icon: RefreshCw,
      change: '+8%',
      changeType: 'positive'
    }
  ];

  const actions: PageAction[] = [
    {
      label: 'Refresh',
      icon: RefreshCw,
      onClick: () => console.log('Refresh analytics'),
      variant: 'secondary',
      hideOnMobile: true
    },
    {
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export analytics'),
      variant: 'secondary',
      hideOnMobile: true
    }
  ];

  const tabs: TabItem[] = [
    {
      id: 'site-analytics',
      label: 'Site Analytics',
      icon: <BarChart3 />
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: <Activity />
    },
    {
      id: 'seo',
      label: 'SEO Analysis',
      icon: <Search />
    },
    {
      id: 'onepage',
      label: 'OnePage Analytics',
      icon: <Zap />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings />
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
      <PageHeader
        title="Site Analytics"
        description="Comprehensive analytics and performance monitoring dashboard"
        icon={BarChart3}
        iconGradient={{ from: 'from-purple-500', to: 'to-purple-600' }}
        titleGradient={{ from: 'from-blue-600', to: 'to-purple-600' }}
        stats={stats}
        actions={actions}
        activeIndicator={{ value: '1,247', label: 'Active Sessions' }}
      />

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