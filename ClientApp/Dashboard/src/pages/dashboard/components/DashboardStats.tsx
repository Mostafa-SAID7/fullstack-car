import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Car,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Activity,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { StatCard } from './StatCard';
import { StatsSkeleton } from '../../../components/ui/Skeleton';
import type { DashboardStats as StatsType } from '../../../services/dashboardService';

interface DashboardStatsProps {
  stats: StatsType | null;
  loading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return <StatsSkeleton count={4} />;
  }
  const statsConfig: Array<{
    title: string;
    value: number;
    change: number;
    icon: any;
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'orange' | 'pink' | 'cyan' | 'emerald';
    description: string;
    prefix?: string;
    suffix?: string;
  }> = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: stats?.userGrowth || 0,
      icon: Users,
      color: 'blue' as const,
      description: 'Active community members'
    },
    {
      title: 'Active Listings',
      value: stats?.activeListings || 0,
      change: stats?.listingGrowth || 0,
      icon: Car,
      color: 'green',
      description: 'Cars available for sale'
    },
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      change: stats?.postGrowth || 0,
      icon: MessageSquare,
      color: 'purple',
      description: 'Community discussions'
    },
    {
      title: 'Revenue',
      value: stats?.totalRevenue || 0,
      change: stats?.revenueGrowth || 0,
      icon: DollarSign,
      color: 'emerald',
      description: 'Monthly earnings',
      prefix: '$'
    },
    {
      title: 'Active Sessions',
      value: stats?.activeSessions || 0,
      change: stats?.sessionGrowth || 0,
      icon: Activity,
      color: 'orange',
      description: 'Current online users'
    },
    {
      title: 'Verified Users',
      value: stats?.verifiedUsers || 0,
      change: stats?.verificationGrowth || 0,
      icon: UserCheck,
      color: 'cyan',
      description: 'Identity verified members'
    },
    {
      title: 'Pending Reviews',
      value: stats?.pendingReviews || 0,
      change: stats?.reviewGrowth || 0,
      icon: AlertTriangle,
      color: 'red',
      description: 'Content awaiting moderation'
    },
    {
      title: 'Growth Rate',
      value: stats?.overallGrowth || 0,
      change: stats?.growthTrend || 0,
      icon: TrendingUp,
      color: 'pink',
      description: 'Platform expansion rate',
      suffix: '%'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            description={stat.description}
            prefix={stat.prefix}
            suffix={stat.suffix}
          />
        </motion.div>
      ))}
    </div>
  );
};