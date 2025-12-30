import { MainLayout } from './components/layout/MainLayout';
import {
  TrendingUp,
  Users,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
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

function App() {
  return (
    <MainLayout>
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
            <p className="text-muted-foreground/80 font-medium text-lg">Welcome back, <span className="text-primary font-bold">Admin</span>. Here's what's happening today.</p>
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
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1%"
            trend="up"
            icon={CreditCard}
            index={0}
          />
          <StatCard
            title="Active Users"
            value="+2,350"
            change="+180.1%"
            trend="up"
            icon={Users}
            index={1}
          />
          <StatCard
            title="Sales"
            value="+12,234"
            change="+19%"
            trend="up"
            icon={TrendingUp}
            index={2}
          />
          <StatCard
            title="Active Groups"
            value="573"
            change="+201"
            trend="up"
            icon={Activity}
            index={3}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          {/* Main Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card/40 backdrop-blur-md rounded-3xl border border-border/50 p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-xl">Revenue Growth</h3>
              <select className="bg-muted/50 text-xs font-bold px-4 py-2 rounded-xl border-none outline-none focus:ring-2 ring-primary/20">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="h-72 flex items-end justify-between gap-3 px-2">
              {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + (i * 0.05), type: "spring", stiffness: 100 }}
                  className="flex-1 bg-gradient-to-t from-primary/10 to-primary/40 hover:to-primary transition-all rounded-t-lg relative group cursor-pointer"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs font-bold px-2 py-1 rounded-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    {h}%
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-[11px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/40 backdrop-blur-md rounded-3xl border border-border/50 p-8 shadow-sm"
          >
            <h3 className="font-bold text-xl mb-8">Recent Activity</h3>
            <div className="space-y-8">
              {[
                { name: 'Sarah Connor', action: 'joined the community', time: '2m ago' },
                { name: 'John Doe', action: 'posted in Off-road group', time: '15m ago' },
                { name: 'Mike Ross', action: 'liked your comment', time: '1h ago' },
                { name: 'Harvey Specter', action: 'started a new group', time: '3h ago' },
                { name: 'Donna Paulsen', action: 'updated profile', time: '5h ago' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="flex gap-4 items-center group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex-shrink-0 flex items-center justify-center text-sm font-black text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">
                      <span className="font-bold hover:text-primary transition-colors">{item.name}</span> <span className="text-muted-foreground/80">{item.action}</span>
                    </p>
                    <p className="text-xs font-bold text-primary/60 mt-1 uppercase tracking-wider">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-10 py-4 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all border-2 border-primary/20 uppercase tracking-widest shadow-lg shadow-primary/5"
            >
              View All Activity
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default App
