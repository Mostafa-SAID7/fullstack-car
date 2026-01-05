import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { LineChart } from '../../../components/charts/line/LineChart';
import { BarChart } from '../../../components/charts/bar/BarChart';
import { AreaChart } from '../../../components/charts/area/AreaChart';
import { PieChart } from '../../../components/charts/pie/PieChart';
import { ChartCard } from './ChartCard';
import type {
  UserAnalytics,
  ContentAnalytics,
  SystemAnalytics,
  RevenueAnalytics
} from '../../../types/dashboard';

interface DashboardChartsProps {
  userAnalytics: UserAnalytics | null;
  contentAnalytics: ContentAnalytics | null;
  systemAnalytics: SystemAnalytics | null;
  revenueAnalytics: RevenueAnalytics | null;
  loading: boolean;
  chartType?: 'line' | 'bar' | 'area' | 'pie';
}

export const DashboardCharts: React.FC<DashboardChartsProps> = React.memo(({
  userAnalytics,
  contentAnalytics,
  systemAnalytics,
  revenueAnalytics,
  loading,
  chartType = 'line'
}) => {

  // Helper to transform Chart.js style data to simplified chart format
  const transformToXY = (data: any) => {
    if (!data || !data.labels || !data.datasets?.[0]?.data) return [];

    return data.labels.map((label: string, index: number) => ({
      x: label,
      y: data.datasets[0].data[index]
    }));
  };

  const transformToPie = (data: any) => {
    if (!data || !data.labels || !data.datasets?.[0]?.data) return [];

    return data.labels.map((label: string, index: number) => ({
      label,
      value: data.datasets[0].data[index]
    }));
  };


  // Helper to render the selected chart type
  const renderChart = useCallback((data: any, _title: string, color: string, height: number = 300) => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart
            data={transformToXY(data)}
            color={color}
            height={height}
          />
        );
      case 'area':
        return (
          <AreaChart
            data={transformToXY(data)}
            color={color}
            height={height}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={transformToPie(data)}
            colors={[color]}
            height={height}
          />
        );
      default:
        return (
          <LineChart
            data={transformToXY(data)}
            color={color}
            height={height}
          />
        );
    }
  }, [chartType]);

  // Collect available charts based on provided data
  const availableCharts = [];

  if (userAnalytics) {
    availableCharts.push(
      <motion.div
        key="user-growth"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ChartCard
          title="User Growth"
          description="New user registrations over time"
          loading={loading}
        >
          {renderChart(userAnalytics.userGrowthData, "User Growth", "#3b82f6", 300)}
        </ChartCard>
      </motion.div>
    );
  }

  if (revenueAnalytics) {
    availableCharts.push(
      <motion.div
        key="revenue-trends"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChartCard
          title="Revenue Trends"
          description="Monthly revenue and growth patterns"
          loading={loading}
        >
          {renderChart(revenueAnalytics.revenueData, "Revenue Trends", "#10b981", 300)}
        </ChartCard>
      </motion.div>
    );
  }

  if (contentAnalytics) {
    availableCharts.push(
      <motion.div
        key="content-activity"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <ChartCard
          title="Content Activity"
          description="Posts, comments, and engagement metrics"
          loading={loading}
        >
          {renderChart(contentAnalytics.contentGrowthData, "Content Activity", "#8b5cf6", 300)}
        </ChartCard>
      </motion.div>
    );
  }

  if (systemAnalytics) {
    availableCharts.push(
      <motion.div
        key="system-performance"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <ChartCard
          title="System Performance"
          description="Server metrics and response times"
          loading={loading}
        >
          {renderChart(systemAnalytics.performanceData, "System Performance", "#f59e0b", 300)}
        </ChartCard>
      </motion.div>
    );
  }

  return (
    <div className={`grid gap-6 ${availableCharts.length === 1
        ? 'grid-cols-1'
        : 'grid-cols-1 lg:grid-cols-2'
      }`}>
      {availableCharts}
    </div>
  );
});
