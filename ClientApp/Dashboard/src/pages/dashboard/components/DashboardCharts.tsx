import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import { LineChart } from '../../../components/charts/LineChart';
import { BarChart } from '../../../components/charts/BarChart';
import { AreaChart } from '../../../components/charts/AreaChart';
import { PieChart as PieChartComponent } from '../../../components/charts/PieChart';
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

export const DashboardCharts: React.FC<DashboardChartsProps> = React.memo(({
  userAnalytics,
  contentAnalytics,
  systemAnalytics,
  revenueAnalytics,
  loading
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'pie'>('line');
  const [showChartTypeSelector, setShowChartTypeSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowChartTypeSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to transform Chart.js style data to Recharts format
  const transformData = (data: any) => {
    if (!data || !data.labels || !data.datasets?.[0]?.data) return [];

    return data.labels.map((label: string, index: number) => ({
      label,
      value: data.datasets[0].data[index]
    }));
  };

  const chartTypeOptions = useMemo(() => [
    { id: 'line', label: 'Line Chart', icon: TrendingUp, description: 'Trend visualization' },
    { id: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Comparison view' },
    { id: 'area', label: 'Area Chart', icon: Activity, description: 'Filled trend view' },
    { id: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Proportion view' }
  ], []);

  const currentChartType = useMemo(() =>
    chartTypeOptions.find(option => option.id === chartType),
    [chartTypeOptions, chartType]
  );

  // Helper to render the selected chart type
  const renderChart = useCallback((data: any, _title: string, color: string, height: number = 300) => {
    const transformedData = transformData(data);

    switch (chartType) {
      case 'bar':
        return (
          <BarChart
            data={transformedData}
            dataKey="value"
            xAxisKey="label"
            color={color}
            height={height}
          />
        );
      case 'area':
        return (
          <AreaChart
            data={transformedData}
            dataKey="value"
            xAxisKey="label"
            color={color}
            height={height}
          />
        );
      case 'pie':
        return (
          <PieChartComponent
            data={transformedData}
            dataKey="value"
            nameKey="label"
            colors={[color]}
            height={height}
          />
        );
      default:
        return (
          <LineChart
            data={transformedData}
            dataKey="value"
            xAxisKey="label"
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
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Chart Visualization</h3>
          <p className="text-sm text-muted-foreground">Choose your preferred chart type for data display</p>
        </div>

        {/* Chart Type Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowChartTypeSelector(!showChartTypeSelector)}
            className="inline-flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-xl hover:bg-muted/50 transition-all"
          >
            {currentChartType && <currentChartType.icon className="w-4 h-4 text-primary" />}
            <span className="font-medium text-sm">{currentChartType?.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showChartTypeSelector ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showChartTypeSelector && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              >
                {chartTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setChartType(option.id as any);
                      setShowChartTypeSelector(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                      chartType === option.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <option.icon className="w-5 h-5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs opacity-70 truncate">{option.description}</div>
                    </div>
                    {chartType === option.id && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={`grid gap-6 ${
        availableCharts.length === 1
          ? 'grid-cols-1'
          : 'grid-cols-1 lg:grid-cols-2'
      }`}>
        {availableCharts}
      </div>
    </div>
  );
});
