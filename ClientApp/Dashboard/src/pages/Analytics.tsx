import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Eye, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { AnalyticsData } from '../services/adminService';

export const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const analytics = await adminService.getAnalytics(period);
        setData(analytics);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Analytics</h1>
          <p className="text-muted-foreground/80 font-medium text-lg">Detailed insights and performance metrics</p>
        </div>
        <div className="flex gap-2 bg-muted/50 p-1 rounded-xl">
          {['day', 'week', 'month'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${period === p
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'text-muted-foreground hover:bg-muted'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold">Total Users</h3>
          </div>
          <p className="text-2xl font-bold">{data?.userGrowth.current || 0}</p>
          <p className={`text-sm font-medium ${(data?.userGrowth.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {(data?.userGrowth.change || 0) >= 0 ? '+' : ''}{data?.userGrowth.change}% from last {period}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold">User Growth</h3>
          </div>
          <p className="text-2xl font-bold">{data?.userGrowth.growth || 0}</p>
          <p className="text-sm text-muted-foreground/60 font-medium">New {period} registrations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BarChart2 className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-semibold">Post Activity</h3>
          </div>
          <p className="text-2xl font-bold">{data?.postActivity.activity || 0}</p>
          <p className={`text-sm font-medium ${(data?.postActivity.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {(data?.postActivity.change || 0) >= 0 ? '+' : ''}{data?.postActivity.change}% from last {period}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Eye className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-semibold">Recent Posts</h3>
          </div>
          <p className="text-2xl font-bold">{data?.recentActivities.length || 0}</p>
          <p className="text-sm text-muted-foreground/60 font-medium">Latest updates</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/40 backdrop-blur-md rounded-3xl border border-border/50 p-8"
      >
        <h3 className="font-bold text-xl mb-6">Recent Activity Analysis</h3>
        <div className="space-y-4">
          {data?.recentActivities.map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-black uppercase tracking-wider">{activity.type}</p>
                  <p className="text-xs text-muted-foreground font-medium">{activity.title}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(activity.timestamp).toLocaleString()}</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-tighter">{activity.user}</p>
              </div>
            </div>
          ))}
          {(!data?.recentActivities || data.recentActivities.length === 0) && (
            <div className="h-32 flex items-center justify-center text-muted-foreground font-medium italic">
              No recent activity recorded for this period
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
