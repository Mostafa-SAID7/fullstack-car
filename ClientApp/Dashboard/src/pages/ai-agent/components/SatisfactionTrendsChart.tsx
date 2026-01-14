// Satisfaction Trends Chart Component - Display satisfaction over time

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Smile, Meh, Frown } from 'lucide-react';
import { analyticsService } from '../../../services/ai-agent';

interface SatisfactionTrendsChartProps {
  dateRange: string;
}

export const SatisfactionTrendsChart: React.FC<SatisfactionTrendsChartProps> = ({ dateRange }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = getDateRangeParams();
      const result = await analyticsService.getSatisfactionTrends(params);
      setData(result);
    } catch (error) {
      console.error('Error loading satisfaction trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeParams = () => {
    const endDate = new Date().toISOString();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case 'all':
        return {};
    }
    
    return {
      startDate: startDate.toISOString(),
      endDate
    };
  };

  const getSatisfactionIcon = (score: number) => {
    if (score >= 80) return <Smile className="w-5 h-5 text-green-500" />;
    if (score >= 60) return <Meh className="w-5 h-5 text-yellow-500" />;
    return <Frown className="w-5 h-5 text-red-500" />;
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border/50 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Satisfaction Trends</h3>
            <p className="text-sm text-muted-foreground">User satisfaction over time</p>
          </div>
        </div>
        {!loading && data && data.average && (
          <div className="flex items-center gap-2">
            {getSatisfactionIcon(data.average)}
            <span className={`text-lg font-bold ${getSatisfactionColor(data.average)}`}>
              {data.average.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : data && data.dates && data.scores ? (
        <div className="h-64">
          {/* Line chart visualization */}
          <div className="relative h-full">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Chart area */}
            <div className="ml-12 h-full flex items-end justify-between gap-1">
              {data.scores.map((score: number, index: number) => {
                const height = score;
                const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.02 }}
                        className={`w-full ${color} rounded-t-lg hover:opacity-80 transition-opacity cursor-pointer relative group`}
                        title={`${score.toFixed(1)}% satisfaction`}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {score.toFixed(1)}%
                        </div>
                      </motion.div>
                    </div>
                    {index % Math.ceil(data.dates.length / 7) === 0 && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(data.dates[index]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      )}

      {/* Stats */}
      {!loading && data && data.scores && (
        <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Average</p>
            <p className={`text-xl font-bold ${getSatisfactionColor(data.average)}`}>
              {data.average.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Highest</p>
            <p className="text-xl font-bold text-green-600">
              {Math.max(...data.scores).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Lowest</p>
            <p className="text-xl font-bold text-red-600">
              {Math.min(...data.scores).toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
