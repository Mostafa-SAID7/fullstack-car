import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
import { StatsSkeleton } from '../../../components/feedback/skeletons/Skeleton';
import type { DashboardStatsProps } from '../../../types/pages/dashboard/main';


export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  const { t } = useTranslation('dashboard');

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
        title: t('total_users'),
        value: stats?.totalUsers || 0,
        change: stats?.userGrowth || 0,
        icon: Users,
        color: 'blue' as const,
        description: t('active_community_members')
      },
      {
        title: t('active_listings'),
        value: stats?.activeListings || 0,
        change: stats?.listingGrowth || 0,
        icon: Car,
        color: 'green',
        description: t('cars_available_sale')
      },
      {
        title: t('total_posts'),
        value: stats?.totalPosts || 0,
        change: stats?.postGrowth || 0,
        icon: MessageSquare,
        color: 'purple',
        description: t('community_discussions')
      },
      {
        title: t('revenue'),
        value: stats?.totalRevenue || 0,
        change: stats?.revenueGrowth || 0,
        icon: DollarSign,
        color: 'emerald',
        description: t('monthly_earnings'),
        prefix: '$'
      },
      {
        title: t('active_sessions'),
        value: stats?.activeSessions || 0,
        change: stats?.sessionGrowth || 0,
        icon: Activity,
        color: 'orange',
        description: t('current_online_users')
      },
      {
        title: t('verified_users'),
        value: stats?.verifiedUsers || 0,
        change: stats?.verificationGrowth || 0,
        icon: UserCheck,
        color: 'cyan',
        description: t('identity_verified_members')
      },
      {
        title: t('pending_reviews'),
        value: stats?.pendingReviews || 0,
        change: stats?.reviewGrowth || 0,
        icon: AlertTriangle,
        color: 'red',
        description: t('content_awaiting_moderation')
      },
      {
        title: t('growth_rate'),
        value: stats?.overallGrowth || 0,
        change: stats?.growthTrend || 0,
        icon: TrendingUp,
        color: 'pink',
        description: t('platform_expansion_rate'),
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