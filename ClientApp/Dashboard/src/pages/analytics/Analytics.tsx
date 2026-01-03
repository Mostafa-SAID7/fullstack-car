import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Eye, Loader2 } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { AnalyticsMetrics } from './components/AnalyticsMetrics';
import { AnalyticsOverview } from './components/AnalyticsOverview';

export const Analytics = () => {
  const { data, loading, period, setPeriod } = useAnalytics();

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
      className="space-y-8"
    >
      <AnalyticsHeader period={period} setPeriod={setPeriod} />
      <AnalyticsMetrics data={data} />
      <AnalyticsOverview data={data} />
    </motion.div>
  );
};