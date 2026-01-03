import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';
import type { PerformanceMetric, ErrorDistribution } from '../../../types/monitoring';
import { generateMockChartData } from '../utils/helpers';

export const AIAgentMonitoring: React.FC = () => {
  const metrics: PerformanceMetric[] = [
    { label: 'Active Users', value: '1,247', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Requests/min', value: '156', change: '+8%', icon: TrendingUp, color: 'green' },
    { label: 'Error Rate', value: '2.1%', change: '-5%', icon: AlertTriangle, color: 'red' },
    { label: 'Avg Response', value: '1.2s', change: '-15%', icon: Clock, color: 'purple' }
  ];

  const errorDistribution: ErrorDistribution[] = [
    { type: 'Timeout Errors', count: 12, percentage: 45 },
    { type: 'Model Errors', count: 8, percentage: 30 },
    { type: 'Input Validation', count: 4, percentage: 15 },
    { type: 'Other', count: 3, percentage: 10 }
  ];

  const responseTimeData = generateMockChartData(20);

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="dashboard-card rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${metric.color}-500/10`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-500`} />
              </div>
              <span className={`text-sm font-medium ${
                metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold">{metric.value}</h3>
            <p className="text-muted-foreground text-sm">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="dashboard-card rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Performance Dashboard</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-muted rounded-lg">Live</button>
            <button className="px-3 py-1 text-xs bg-muted rounded-lg">1h</button>
            <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-lg">24h</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Response Time Trend</h4>
            <div className="h-48 flex items-end gap-1">
              {responseTimeData.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-500/20 to-blue-500/60 rounded-t-sm"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Error Distribution</h4>
            <div className="space-y-3">
              {errorDistribution.map((error, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{error.type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${error.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-8">{error.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};