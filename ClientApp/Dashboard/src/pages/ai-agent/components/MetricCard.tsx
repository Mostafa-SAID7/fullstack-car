// MetricCard Component - Displays a single metric with icon and trend

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  delay?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  trend,
  loading = false,
  delay = 0
}) => {
  if (loading) {
    return (
      <div className="bg-card border border-border/50 rounded-3xl p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${iconBgColor}`}>
            <div className="w-6 h-6 bg-muted rounded" />
          </div>
        </div>
        <div className="h-8 bg-muted rounded mb-2 w-24" />
        <div className="h-4 bg-muted rounded w-32" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            trend.isPositive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-muted-foreground text-sm">{title}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
};
