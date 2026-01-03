import { motion } from 'framer-motion';
import { Users, TrendingUp, BarChart2, Eye } from 'lucide-react';
import type { AdvancedAnalytics } from '../../../services/adminService';

interface AnalyticsMetricsProps {
  data: AdvancedAnalytics | null;
}

export const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ data }) => {
  const metrics = [
    {
      title: 'Total Users',
      value: data?.users.totalUsers || 0,
      change: `${(data?.users.userGrowthRate || 0) >= 0 ? '+' : ''}${data?.users.userGrowthRate}% growth rate`,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'User Growth',
      value: data?.users.newUsersToday || 0,
      change: 'New registrations today',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Post Activity',
      value: data?.content.totalPosts || 0,
      change: `${(data?.content.contentGrowthRate || 0) >= 0 ? '+' : ''}${data?.content.contentGrowthRate}% growth rate`,
      icon: BarChart2,
      color: 'purple'
    },
    {
      title: 'Recent Posts',
      value: data?.content.totalComments || 0,
      change: 'Total comments',
      icon: Eye,
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 bg-${metric.color}-500/10 rounded-lg`}>
              <metric.icon className={`w-5 h-5 text-${metric.color}-500`} />
            </div>
            <h3 className="font-semibold">{metric.title}</h3>
          </div>
          <p className="text-2xl font-bold">{metric.value}</p>
          <p className={`text-sm font-medium ${
            metric.change.includes('+') ? 'text-green-500' : 
            metric.change.includes('-') ? 'text-red-500' : 
            'text-muted-foreground/60'
          }`}>
            {metric.change}
          </p>
        </motion.div>
      ))}
    </div>
  );
};