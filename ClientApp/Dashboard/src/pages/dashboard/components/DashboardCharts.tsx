import React from 'react';
import { motion } from 'framer-motion';
import { LineChart } from '../../../components/charts/LineChart';
import { ChartCard } from './ChartCard';
import type {
  UserAnalytics,
  ContentAnalytics,
  SystemAnalytics,
  RevenueAnalytics
} from '../../../services/dashboardService';

interface DashboardChartsProps {
  userAnalytics: UserAnalytics | null;
  contentAnalytics: ContentAnalytics | null;
  systemAnalytics: SystemAnalytics | null;
  revenueAnalytics: RevenueAnalytics | null;
  loading: boolean;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  userAnalytics,
  contentAnalytics,
  systemAnalytics,
  revenueAnalytics,
  loading
}) => {
  // Helper to transform Chart.js style data to Recharts format
  const transformData = (data: any) => {
    if (!data || !data.labels || !data.datasets?.[0]?.data) return [];

    return data.labels.map((label: string, index: number) => ({
      label,
      value: data.datasets[0].data[index]
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ChartCard
          title="User Growth"
          description="New user registrations over time"
          loading={loading}
        >
          <LineChart
            data={transformData(userAnalytics?.userGrowthData)}
            dataKey="value"
            xAxisKey="label"
            color="#3b82f6"
            height={300}
          />
        </ChartCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChartCard
          title="Revenue Trends"
          description="Monthly revenue and growth patterns"
          loading={loading}
        >
          <LineChart
            data={transformData(revenueAnalytics?.revenueData)}
            dataKey="value"
            xAxisKey="label"
            color="#10b981"
            height={300}
          />
        </ChartCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <ChartCard
          title="Content Activity"
          description="Posts, comments, and engagement metrics"
          loading={loading}
        >
          <LineChart
            data={transformData(contentAnalytics?.contentGrowthData)}
            dataKey="value"
            xAxisKey="label"
            color="#8b5cf6"
            height={300}
          />
        </ChartCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <ChartCard
          title="System Performance"
          description="Server metrics and response times"
          loading={loading}
        >
          <LineChart
            data={transformData(systemAnalytics?.performanceData)}
            dataKey="value"
            xAxisKey="label"
            color="#f59e0b"
            height={300}
          />
        </ChartCard>
      </motion.div>
    </div>
  );
};
