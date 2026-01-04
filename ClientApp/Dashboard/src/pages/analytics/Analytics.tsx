import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, BarChart3, FileBarChart, TrendingUp, Settings } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { AnalyticsMetrics } from './components/AnalyticsMetrics';
import { AnalyticsOverview } from './components/AnalyticsOverview';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';

export const Analytics = () => {
  const { data, loading, period, setPeriod } = useAnalytics();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <AnalyticsMetrics data={data} />
            <AnalyticsOverview data={data} />
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-12">
            <FileBarChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Reports Coming Soon</h3>
            <p className="text-muted-foreground">Detailed analytics reports and export functionality will be available here.</p>
          </div>
        );
      case 'insights':
        return (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">AI Insights Coming Soon</h3>
            <p className="text-muted-foreground">Advanced AI-powered insights and recommendations will be available here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Settings</h3>
            <p className="text-muted-foreground">Configure your analytics preferences and data collection settings.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <AnalyticsHeader period={period} setPeriod={setPeriod} />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>
    </motion.div>
  );
};