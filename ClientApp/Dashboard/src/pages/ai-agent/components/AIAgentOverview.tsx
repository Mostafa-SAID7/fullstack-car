import { motion } from 'framer-motion';
import {
  Bot,
  Target,
  Zap,
  MessageSquare,
  Cpu,
  HardDrive,
  Network,
  Users
} from 'lucide-react';
import type { ModelMetrics } from '../../../types/models';
import { generateMockChartData } from '../utils/helpers';

interface AIAgentOverviewProps {
  isAIEnabled: boolean;
  metrics: ModelMetrics;
}

export const AIAgentOverview: React.FC<AIAgentOverviewProps> = ({
  isAIEnabled,
  metrics
}) => {
  const chartData = generateMockChartData('accuracy', 24);

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div className={`w-3 h-3 rounded-full ${isAIEnabled ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold">{isAIEnabled ? 'Active' : 'Offline'}</h3>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isAIEnabled
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
              }`}>
              <div className={`w-2 h-2 rounded-full ${isAIEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              {isAIEnabled ? 'Online' : 'Offline'}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Agent Status</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-green-500/10">
              <Target className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">{metrics.accuracy}%</h3>
          <p className="text-muted-foreground text-sm">Model Accuracy</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/10">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">{metrics.responseTime}s</h3>
          <p className="text-muted-foreground text-sm">Avg Response Time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-purple-500/10">
              <MessageSquare className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">{metrics.throughput}</h3>
          <p className="text-muted-foreground text-sm">Requests/min</p>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Performance Metrics</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-muted rounded-lg">24h</button>
            <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-lg">7d</button>
            <button className="px-3 py-1 text-xs bg-muted rounded-lg">30d</button>
          </div>
        </div>

        <div className="h-64 flex items-end gap-2">
          {chartData.datasets[0].data.map((height: number, i: number) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary/20 to-primary/60 rounded-t-sm hover:from-primary/30 hover:to-primary/80 transition-all cursor-pointer"
              style={{ height: `${height}%` }}
              title={`Hour ${i}: ${Math.round(height)}% performance`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center text-xs mt-4 text-muted-foreground">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:59</span>
        </div>
      </motion.div>

      {/* System Resources & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
        >
          <h3 className="font-bold text-lg mb-6">System Resources</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <span className="text-sm font-bold">{metrics.cpuUsage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.cpuUsage}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Memory Usage</span>
              </div>
              <span className="text-sm font-bold">{metrics.memoryUsage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.memoryUsage}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Network className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">Network I/O</span>
              </div>
              <span className="text-sm font-bold">2.4 MB/s</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full w-3/4 transition-all duration-300" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
        >
          <h3 className="font-bold text-lg mb-6">Recent Activity</h3>

          <div className="space-y-4">
            {[
              { user: 'User #1247', query: 'Toyota Camry maintenance schedule', time: '2m ago', status: 'success' },
              { user: 'User #1248', query: 'Best electric SUV 2024', time: '5m ago', status: 'success' },
              { user: 'User #1249', query: 'Car insurance comparison', time: '8m ago', status: 'success' },
              { user: 'User #1250', query: 'Sell my Honda Civic', time: '12m ago', status: 'error' }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-xs text-muted-foreground truncate">"{activity.query}"</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};