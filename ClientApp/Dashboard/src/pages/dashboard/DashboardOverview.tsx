import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, BarChart3, TrendingUp, Brain, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { DashboardCharts } from './components/DashboardCharts';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { DashboardActions } from './components/DashboardActions';
import { ModelTraining } from './components/ModelTraining';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';

export const DashboardOverview = () => {
  const { user } = useAuth();
  const {
    stats,
    userAnalytics,
    contentAnalytics,
    systemAnalytics,
    revenueAnalytics,
    loading
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'ai-training', label: 'AI Training', icon: Brain },
    { id: 'actions', label: 'Actions', icon: Zap }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <DashboardStats stats={stats} loading={loading} />

            <DashboardCharts
              userAnalytics={userAnalytics}
              revenueAnalytics={revenueAnalytics}
              contentAnalytics={contentAnalytics}
              systemAnalytics={systemAnalytics}
              loading={loading}
            />
          </div>
        );
      case 'analytics':
        return (
          <DashboardAnalytics
            userAnalytics={userAnalytics}
            contentAnalytics={contentAnalytics}
            revenueAnalytics={revenueAnalytics}
            loading={loading}
          />
        );
      case 'ai-training':
        return <ModelTraining />;
      case 'actions':
        return <DashboardActions />;
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
      <DashboardHeader user={user} />

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