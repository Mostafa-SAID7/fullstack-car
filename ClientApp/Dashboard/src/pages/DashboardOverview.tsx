import {
  TrendingUp,
  Users,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CheckCircle2,
  Shield,
  Smartphone,
  Key,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { DashboardStats, RecentActivity } from '../services/adminService';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  index: number;
}

const StatCard = ({ title, value, change, trend, icon: Icon, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2.5 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className={cn(
        "flex items-center text-xs font-bold px-2.5 py-1 rounded-full",
        trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
      )}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change}
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-muted-foreground/80 uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-black tracking-tight">{value}</p>
    </div>
  </motion.div>
);

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentActivity(5)
        ]);
        setStats(statsData);
        setActivities(activityData.activities);
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Post Created': return CheckCircle2;
      case 'User Registered': return Users;
      case 'Alert': return ShieldAlert;
      case 'Auth': return Shield;
      default: return Activity;
    }
  };

  const getActivityStatus = (type: string) => {
    switch (type) {
      case 'Post Created': return 'success';
      case 'User Registered': return 'info';
      case 'Alert': return 'warning';
      case 'Auth': return 'info';
      default: return 'success';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground/80 font-medium text-lg">Welcome back, <span className="text-primary font-bold">{user?.firstName || 'Admin'}</span>. Here's what's happening today.</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Create Report
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          change="+12.5%"
          trend="up"
          icon={Users}
          index={0}
        />
        <StatCard
          title="Total Posts"
          value={stats?.totalPosts || 0}
          change="+8.2%"
          trend="up"
          icon={TrendingUp}
          index={1}
        />
        <StatCard
          title="Total Groups"
          value={stats?.totalGroups || 0}
          change="+5.1%"
          trend="up"
          icon={Activity}
          index={2}
        />
        <StatCard
          title="Total Reviews"
          value={stats?.totalReviews || 0}
          change="+15.3%"
          trend="up"
          icon={CreditCard}
          index={3}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Enhanced Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card/40 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="font-black text-xl tracking-tight">Revenue Growth</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Monthly performance insights</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-muted/50 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-none outline-none focus:ring-2 ring-primary/20 appearance-none cursor-pointer">
                <option>Last 30 days</option>
                <option>Last 6 months</option>
                <option>Year to date</option>
              </select>
            </div>
          </div>
          <div className="h-72 flex items-end justify-between gap-3 px-2 relative z-10">
            {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 100].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + (i * 0.05), type: "spring", stiffness: 100 }}
                className="flex-1 bg-gradient-to-t from-primary/5 to-primary/30 hover:to-primary transition-all rounded-t-xl relative group cursor-pointer"
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-black px-2 py-1.5 rounded-lg border border-border opacity-0 group-hover:opacity-100 transition-all shadow-2xl scale-90 group-hover:scale-100 whitespace-nowrap z-20">
                  ${(h * 1.5).toFixed(1)}k
                </div>
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity rounded-t-xl" />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-8 text-[9px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-60">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>

          {/* Decorative background blur */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>

        {/* Security Activity Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl tracking-tight">Security</h3>
            <div className="p-2 bg-primary/10 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {activities.map((item, i) => {
              const Icon = getActivityIcon(item.type);
              const status = getActivityStatus(item.type);
              const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="flex gap-4 items-start group cursor-default"
                >
                  <div className={cn(
                    "w-9 h-9 rounded-2xl border border-border flex-shrink-0 flex items-center justify-center transition-all group-hover:scale-105",
                    status === 'success' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    status === 'warning' && "bg-orange-500/10 text-orange-500 border-orange-500/20",
                    status === 'info' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none">{item.type}</p>
                      <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">{time}</span>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground/90 leading-tight line-clamp-2">{item.title} ({item.user})</p>
                  </div>
                </motion.div>
              );
            })}
            {activities.length === 0 && (
              <div className="flex items-center justify-center h-32 text-muted-foreground italic text-sm">
                No recent activity
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'var(--primary)', color: 'white' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/settings')}
            className="w-full mt-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 rounded-2xl transition-all border border-primary/20 shadow-lg shadow-primary/5"
          >
            Manage Security
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};