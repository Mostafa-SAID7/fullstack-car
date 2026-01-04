import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'orange' | 'pink' | 'cyan' | 'emerald';
  loading?: boolean;
  description?: string;
  prefix?: string;
  suffix?: string;
}

const colorClasses = {
  blue: 'text-blue-500 bg-blue-500/10',
  green: 'text-green-500 bg-green-500/10',
  red: 'text-red-500 bg-red-500/10',
  yellow: 'text-yellow-500 bg-yellow-500/10',
  purple: 'text-purple-500 bg-purple-500/10',
  indigo: 'text-indigo-500 bg-indigo-500/10',
  orange: 'text-orange-500 bg-orange-500/10',
  pink: 'text-pink-500 bg-pink-500/10',
  cyan: 'text-cyan-500 bg-cyan-500/10',
  emerald: 'text-emerald-500 bg-emerald-500/10'
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = 'blue',
  loading = false,
  description,
  prefix = '',
  suffix = ''
}) => {
  if (loading) {
    return (
      <div className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-10 w-10 bg-muted rounded-xl"></div>
          </div>
          <div className="h-8 bg-muted rounded w-32"></div>
          <div className="h-3 bg-muted rounded w-20"></div>
        </div>
      </div>
    );
  }

  const formatValue = () => {
    const numValue = typeof value === 'number' ? value : parseFloat(value.toString());
    if (isNaN(numValue)) return value;
    
    return `${prefix}${numValue.toLocaleString()}${suffix}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-5 blur-2xl transition-opacity group-hover:opacity-10",
        colorClasses[color].split(' ')[1]
      )} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-muted-foreground/70 mt-1">
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
            colorClasses[color]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>

        {/* Value */}
        <div className="space-y-2">
          <p className="text-2xl lg:text-3xl font-bold text-foreground">
            {formatValue()}
          </p>
          
          {change !== undefined && (
            <div className="flex items-center gap-2">
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                change >= 0 
                  ? "bg-green-500/10 text-green-600" 
                  : "bg-red-500/10 text-red-600"
              )}>
                <span className="text-xs">
                  {change >= 0 ? '↗' : '↘'}
                </span>
                {Math.abs(change)}%
              </span>
              {changeLabel && (
                <span className="text-xs text-muted-foreground">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
