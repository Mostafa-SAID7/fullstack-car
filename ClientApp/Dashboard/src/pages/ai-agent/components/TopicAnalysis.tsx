// Topic Analysis Component - Display topic distribution

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';
import { analyticsService } from '../../../services/ai-agent';

interface TopicAnalysisProps {
  dateRange: string;
}

const topicColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-yellow-500'
];

export const TopicAnalysis: React.FC<TopicAnalysisProps> = ({ dateRange }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = getDateRangeParams();
      const result = await analyticsService.getTopicAnalysis(params);
      setData(result);
    } catch (error) {
      console.error('Error loading topic analysis:', error);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border/50 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-green-500/10">
          <PieChart className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Topic Analysis</h3>
          <p className="text-sm text-muted-foreground">Most discussed topics</p>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : data && data.topics && data.topics.length > 0 ? (
        <div className="space-y-3">
          {data.topics.slice(0, 8).map((topic: any, index: number) => (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize">{topic.name}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{topic.count} mentions</span>
                  <span className="font-medium">{topic.percentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className={`h-full ${topicColors[index % topicColors.length]}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      )}

      {/* Total */}
      {!loading && data && data.topics && data.topics.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground mb-1">Total Topics Analyzed</p>
          <p className="text-2xl font-bold">
            {data.topics.reduce((sum: number, t: any) => sum + t.count, 0).toLocaleString()}
          </p>
        </div>
      )}
    </motion.div>
  );
};
