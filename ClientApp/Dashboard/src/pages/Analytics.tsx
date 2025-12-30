import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Eye } from 'lucide-react';

export const Analytics = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Analytics</h1>
        <p className="text-muted-foreground/80 font-medium text-lg">Detailed insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold">Page Views</h3>
          </div>
          <p className="text-2xl font-bold">125,432</p>
          <p className="text-sm text-green-500 font-medium">+12.5% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold">Active Users</h3>
          </div>
          <p className="text-2xl font-bold">8,234</p>
          <p className="text-sm text-green-500 font-medium">+8.2% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-semibold">Conversion Rate</h3>
          </div>
          <p className="text-2xl font-bold">3.24%</p>
          <p className="text-sm text-red-500 font-medium">-0.5% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <BarChart2 className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-semibold">Bounce Rate</h3>
          </div>
          <p className="text-2xl font-bold">42.1%</p>
          <p className="text-sm text-green-500 font-medium">-2.1% from last month</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/40 backdrop-blur-md rounded-3xl border border-border/50 p-8"
      >
        <h3 className="font-bold text-xl mb-6">Traffic Analytics</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <p>Analytics chart would go here</p>
        </div>
      </motion.div>
    </motion.div>
  );
};