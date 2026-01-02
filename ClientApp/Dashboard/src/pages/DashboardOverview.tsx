import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  MessageSquare,
  Video,
  Headphones,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  Plus,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dashboardService, DashboardStats } from '../services/dashboardService';
import { StatCard } from '../components/dashboard/StatCard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { AreaChart } from '../components/charts/AreaChart';

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [contentAnalytics, setContentAnalytics] = useState<any>(null);
  const [systemAnalytics, setSystemAnalytics] = useState<any>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          statsData,
          userData,
          contentData,
          systemData,
          revenueData
        ] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getUserAnalytics(),
          dashboardService.getContentAnalytics(),
          dashboardService.getSystemAnalytics(),
          dashboardService.getRevenueAnalytics()
        ]);

        setStats(statsData);
        setUserAnalytics(userData);
        setContentAnalytics(contentData);
        setSystemAnalytics(systemData);
        setRevenueAnalytics(revenueData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Transform data for charts
  const userGrowthData = userAnalytics?.userGrowthData.labels.map((label: string, index: number) => ({
    month: label,
    users: userAnalytics.userGrowthData.datasets[0].data[index]
  })) || [];

  const contentGrowthData = contentAnalytics?.contentGrowthData.labels.map((label: string, index: number) => ({
    month: label,
    posts: contentAnalytics.contentGrowthData.datasets[0].data[index]
  })) || [];

  const revenueData = revenueAnalytics?.revenueData.labels.map((label: string, index: number) => ({
    month: label,
    revenue: revenueAnalytics.revenueData.datasets[0].data[index]
  })) || [];

  const systemHealthData = systemAnalytics?.systemHealthData.labels.map((label: string, index: number) => ({
    component: label,
    usage: systemAnalytics.systemHealthData.datasets[0].data[index]
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground/80 font-medium text-lg">
            Welcome back, <span className="text-primary font-bold">{user?.firstName || 'Admin'}</span>. 
            Here's your platform analytics.
          </p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/analytics')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          View Full Analytics
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          change={stats?.userGrowthRate}
          changeLabel="this month"
          icon={Users}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Total Posts"
          value={stats?.totalPosts || 0}
          change={15.3}
          changeLabel="this week"
          icon={FileText}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Total Comments"
          value={stats?.totalComments || 0}
          change={8.7}
          changeLabel="this week"
          icon={MessageSquare}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Revenue"
          value={`$${stats?.revenue?.toLocaleString() || 0}`}
          change={12.4}
          changeLabel="this month"
          icon={DollarSign}
          color="green"
          loading={loading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          change={stats?.engagementRate}
          changeLabel="engagement rate"
          icon={Activity}
          color="indigo"
          loading={loading}
        />
        <StatCard
          title="Videos"
          value={stats?.totalVideos || 0}
          change={22.1}
          changeLabel="this month"
          icon={Video}
          color="red"
          loading={loading}
        />
        <StatCard
          title="Podcasts"
          value={stats?.totalPodcasts || 0}
          change={18.5}
          changeLabel="this month"
          icon={Headphones}
          color="yellow"
          loading={loading}
        />
        <StatCard
          title="Bookings"
          value={stats?.totalBookings || 0}
          change={9.2}
          changeLabel="this week"
          icon={ShoppingBag}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <ChartCard
          title="User Growth"
          subtitle="Monthly new user registrations"
          loading={loading}
        >
          <LineChart
            data={userGrowthData}
            dataKey="users"
            xAxisKey="month"
            color="#3b82f6"
            height={300}
          />
        </ChartCard>

        {/* Revenue Chart */}
        <ChartCard
          title="Revenue Trend"
          subtitle="Monthly revenue performance"
          loading={loading}
        >
          <AreaChart
            data={revenueData}
            dataKey="revenue"
            xAxisKey="month"
            color="#10b981"
            height={300}
          />
        </ChartCard>

        {/* Content Growth */}
        <ChartCard
          title="Content Creation"
          subtitle="Posts created per month"
          loading={loading}
        >
          <BarChart
            data={contentGrowthData}
            dataKey="posts"
            xAxisKey="month"
            color="#8b5cf6"
            height={300}
          />
        </ChartCard>

        {/* System Health */}
        <ChartCard
          title="System Health"
          subtitle="Resource usage overview"
          loading={loading}
        >
          <PieChart
            data={systemHealthData}
            dataKey="usage"
            nameKey="component"
            height={300}
            colors={['#ef4444', '#f59e0b', '#10b981', '#3b82f6']}
          />
        </ChartCard>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Roles Distribution */}
        <ChartCard
          title="User Roles"
          subtitle="Distribution by user type"
          loading={loading}
        >
          <PieChart
            data={userAnalytics?.usersByRole || []}
            dataKey="count"
            nameKey="role"
            height={250}
            colors={['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']}
          />
        </ChartCard>

        {/* Content Types */}
        <ChartCard
          title="Content Types"
          subtitle="Posts by content type"
          loading={loading}
        >
          <PieChart
            data={contentAnalytics?.contentByType || []}
            dataKey="count"
            nameKey="type"
            height={250}
            colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']}
          />
        </ChartCard>

        {/* Revenue Sources */}
        <ChartCard
          title="Revenue Sources"
          subtitle="Income by source"
          loading={loading}
        >
          <PieChart
            data={revenueAnalytics?.revenueBySource || []}
            dataKey="amount"
            nameKey="source"
            height={250}
            colors={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']}
          />
        </ChartCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/users')}
          className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
        >
          <Users className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Manage Users</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">View and manage user accounts</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/content')}
          className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
        >
          <Shield className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Content Moderation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Review and moderate content</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/system')}
          className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
        >
          <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">System Health</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Monitor system performance</p>
        </motion.button>
      </div>
    </motion.div>
  );
};