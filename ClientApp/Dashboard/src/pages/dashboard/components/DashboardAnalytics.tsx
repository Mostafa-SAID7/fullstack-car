import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { 
  UserAnalytics, 
  ContentAnalytics, 
  RevenueAnalytics 
} from '../../../services/dashboardService';

interface DashboardAnalyticsProps {
  userAnalytics: UserAnalytics | null;
  contentAnalytics: ContentAnalytics | null;
  revenueAnalytics: RevenueAnalytics | null;
  loading: boolean;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  userAnalytics,
  contentAnalytics,
  revenueAnalytics,
  loading
}) => {
  const getTrendIcon = (change: number) => {
    if (change > 0) return ArrowUpRight;
    if (change < 0) return ArrowDownRight;
    return Minus;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const analyticsData = [
    {
      title: 'User Engagement',
      metrics: [
        {
          label: 'Daily Active Users',
          value: userAnalytics?.dailyActiveUsers || 0,
          change: userAnalytics?.dauChange || 0,
          icon: Users
        },
        {
          label: 'Session Duration',
          value: `${userAnalytics?.avgSessionDuration || 0}m`,
          change: userAnalytics?.sessionChange || 0,
          icon: TrendingUp
        },
        {
          label: 'Bounce Rate',
          value: `${userAnalytics?.bounceRate || 0}%`,
          change: userAnalytics?.bounceChange || 0,
          icon: TrendingUp,
          inverse: true
        }
      ]
    },
    {
      title: 'Content Performance',
      metrics: [
        {
          label: 'Posts per Day',
          value: contentAnalytics?.postsPerDay || 0,
          change: contentAnalytics?.postsChange || 0,
          icon: MessageSquare
        },
        {
          label: 'Engagement Rate',
          value: `${contentAnalytics?.engagementRate || 0}%`,
          change: contentAnalytics?.engagementChange || 0,
          icon: TrendingUp
        },
        {
          label: 'Comments per Post',
          value: contentAnalytics?.commentsPerPost || 0,
          change: contentAnalytics?.commentsChange || 0,
          icon: MessageSquare
        }
      ]
    },
    {
      title: 'Revenue Insights',
      metrics: [
        {
          label: 'Monthly Revenue',
          value: `$${revenueAnalytics?.monthlyRevenue?.toLocaleString() || 0}`,
          change: revenueAnalytics?.revenueChange || 0,
          icon: DollarSign
        },
        {
          label: 'Average Order Value',
          value: `$${revenueAnalytics?.avgOrderValue || 0}`,
          change: revenueAnalytics?.aovChange || 0,
          icon: DollarSign
        },
        {
          label: 'Conversion Rate',
          value: `${revenueAnalytics?.conversionRate || 0}%`,
          change: revenueAnalytics?.conversionChange || 0,
          icon: TrendingUp
        }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-muted rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {analyticsData.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + sectionIndex * 0.1 }}
          className="bg-card rounded-2xl p-6 border border-border/50 hover:border-border transition-all duration-300"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            {section.title}
          </h3>
          
          <div className="space-y-4">
            {section.metrics.map((metric, metricIndex) => {
              const Icon = metric.icon;
              const TrendIcon = getTrendIcon(metric.change);
              const trendColor = getTrendColor(metric.inverse ? -metric.change : metric.change);
              
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + sectionIndex * 0.1 + metricIndex * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{metric.label}</p>
                      <p className="text-lg font-bold text-foreground">{metric.value}</p>
                    </div>
                  </div>
                  
                  <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
};