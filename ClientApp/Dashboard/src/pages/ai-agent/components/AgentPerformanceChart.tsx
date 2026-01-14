// Agent Performance Chart Component - Compare agent performance

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { analyticsService } from '../../../services/ai-agent';
import { AgentType } from '../../../types/ai-agent';

interface AgentPerformanceChartProps {
  dateRange: string;
}

const agentConfig = {
  [AgentType.GENERAL]: { color: 'bg-blue-500', label: 'General', icon: '💬' },
  [AgentType.MECHANIC]: { color: 'bg-orange-500', label: 'Mechanic', icon: '🔧' },
  [AgentType.BUYER_GUIDE]: { color: 'bg-green-500', label: "Buyer's Guide", icon: '🚗' },
  [AgentType.SELLER_ASSISTANT]: { color: 'bg-purple-500', label: 'Seller', icon: '💰' },
  [AgentType.MODIFICATION_EXPERT]: { color: 'bg-red-500', label: 'Modification', icon: '⚙️' },
  [AgentType.COMMUNITY_HELPER]: { color: 'bg-cyan-500', label: 'Community', icon: '👥' }
};

export const AgentPerformanceChart: React.FC<AgentPerformanceChartProps> = ({ dateRange }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = getDateRangeParams();
      const result = await analyticsService.getAgentPerformance(params);
      setData(result);
    } catch (error) {
      console.error('Error loading agent performance:', error);
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

  const maxConversations = data.length > 0 ? Math.max(...data.map(d => d.totalConversations)) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card border border-border/50 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <BarChart3 className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Agent Performance</h3>
          <p className="text-sm text-muted-foreground">Comparison by conversation volume</p>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : data.length > 0 ? (
        <div className="space-y-4">
          {data.map((agent, index) => {
            const config = agentConfig[agent.agentType as keyof typeof agentConfig];
            const percentage = (agent.totalConversations / maxConversations) * 100;
            
            return (
              <motion.div
                key={agent.agentType}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{config?.icon}</span>
                    <span className="font-medium">{config?.label || agent.agentType}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{agent.totalConversations} conversations</span>
                    <span>{agent.averageSatisfaction.toFixed(1)}% satisfaction</span>
                  </div>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    className={`h-full ${config?.color || 'bg-gray-500'} flex items-center justify-end px-3`}
                  >
                    {percentage > 20 && (
                      <span className="text-xs font-medium text-white">
                        {agent.totalConversations}
                      </span>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      )}

      {/* Summary Stats */}
      {!loading && data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total</p>
            <p className="text-lg font-bold">
              {data.reduce((sum, d) => sum + d.totalConversations, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Satisfaction</p>
            <p className="text-lg font-bold">
              {(data.reduce((sum, d) => sum + d.averageSatisfaction, 0) / data.length).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Response</p>
            <p className="text-lg font-bold">
              {(data.reduce((sum, d) => sum + d.averageResponseTime, 0) / data.length).toFixed(0)}ms
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
