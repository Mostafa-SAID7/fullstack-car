import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface StatCard {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string;
  description?: string;
}

export interface StatsCardsProps {
  stats: StatCard[];
  loading?: boolean;
  className?: string;
  cardClassName?: string;
  columns?: 1 | 2 | 3 | 4;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  loading = false,
  className = '',
  cardClassName = '',
  columns = 4
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
        {[...Array(columns)].map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
              <div className="w-12 h-12 bg-muted rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group ${cardClassName}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-foreground mb-2">
                {stat.value}
              </p>
              
              {stat.description && (
                <p className="text-xs text-muted-foreground mb-2">
                  {stat.description}
                </p>
              )}
              
              {stat.change && (
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === 'positive'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : stat.changeType === 'negative'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              )}
            </div>
            
            <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 ${
              stat.color 
                ? `bg-gradient-to-br ${stat.color}/10 ${stat.color}/20` 
                : 'bg-gradient-to-br from-primary/10 to-primary/20'
            }`}>
              <stat.icon className={`w-7 h-7 ${
                stat.color || 'text-primary'
              }`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;