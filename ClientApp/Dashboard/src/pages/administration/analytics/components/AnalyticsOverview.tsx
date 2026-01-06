import { motion } from 'framer-motion';
import type { AdvancedAnalytics } from '../../../../services/admin';

interface AnalyticsOverviewProps {
  data: AdvancedAnalytics | null;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-3xl border border-border/50 p-8"
    >
      <h3 className="font-bold text-xl mb-6">Analytics Overview</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-black uppercase tracking-wider">User Engagement</p>
              <p className="text-xs text-muted-foreground font-medium">Average session: {data?.engagement.averageSessionDuration || 0} minutes</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Engagement Rate</p>
            <p className="text-[10px] font-black text-primary uppercase tracking-tighter">{data?.engagement.engagementRate || 0}%</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-black uppercase tracking-wider">System Performance</p>
              <p className="text-xs text-muted-foreground font-medium">Response time: {data?.performance.averageResponseTime || 0}ms</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Availability</p>
            <p className="text-[10px] font-black text-green-500 uppercase tracking-tighter">{Math.max(0, 100 - (data?.performance.errorRate || 0))}%</p>
          </div>
        </div>

        {(!data) && (
          <div className="h-32 flex items-center justify-center text-muted-foreground font-medium italic">
            No analytics data available
          </div>
        )}
      </div>
    </motion.div>
  );
};