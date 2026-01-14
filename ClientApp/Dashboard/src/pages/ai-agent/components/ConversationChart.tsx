// Conversation Chart Component - Display conversation trends over time

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { analyticsService } from '../../../services/ai-agent';

interface ConversationChartProps {
  dateRange: string;
}

export const ConversationChart: React.FC<ConversationChartProps> = ({ dateRange }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = getDateRangeParams();
      const result = await analyticsService.getConversationTrends(params);
      setData(result);
    } catch (error) {
      console.error('Error loading conversation trends:', error);
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

  const getTrend = () => {
    if (!data || !data.counts || data.counts.length < 2) return 0;
    const recent = data.counts.slice(-7).reduce((a: number, b: number) => a + b, 0) / 7;
    const previous = data.counts.slice(-14, -7).reduce((a: number, b: number) => a + b, 0) / 7;
    return ((recent - previous) / previous) * 100;
  };

  const trend = getTrend();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Conversation Trends</h3>
            <p className="text-sm text-muted-foreground">Daily conversation volume</p>
          </div>
        </div>
        {!loading && trend !== 0 && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            trend > 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
          }`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : data && data.dates && data.counts ? (
        <div className="h-64">
          {/* Simple bar chart visualization */}
          <div className="flex items-end justify-between h-full gap-1">
            {data.counts.map((count: number, index: number) => {
              const maxCount = Math.max(...data.counts);
              const height = (count / maxCount) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.02 }}
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer relative group"
                      title={`${count} conversations`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {count} conversations
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
      ) : (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      )}

      {/* Stats */}
      {!loading && data && (
        <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Conversations</p>
            <p className="text-xl font-bold">
              {data.counts.reduce((a: number, b: number) => a + b, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
            <p className="text-xl font-bold">
              {data.averageResponseTime ? `${data.averageResponseTime.toFixed(0)}ms` : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
