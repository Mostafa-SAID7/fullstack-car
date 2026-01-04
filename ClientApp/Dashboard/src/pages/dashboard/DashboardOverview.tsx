import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { DashboardCharts } from './components/DashboardCharts';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { DashboardActions } from './components/DashboardActions';
import { ModelTraining } from './components/ModelTraining';

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

      <DashboardStats stats={stats} loading={loading} />

      <DashboardCharts
        userAnalytics={userAnalytics}
        revenueAnalytics={revenueAnalytics}
        contentAnalytics={contentAnalytics}
        systemAnalytics={systemAnalytics}
        loading={loading}
      />

      <DashboardAnalytics
        userAnalytics={userAnalytics}
        contentAnalytics={contentAnalytics}
        revenueAnalytics={revenueAnalytics}
        loading={loading}
      />

      <ModelTraining />

      <DashboardActions />
    </motion.div>
  );
};