/**
 * AdminMetricCard Component
 * Specialized metric display card for administrative dashboards
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './Card';

// Metric card props
interface AdminMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  loading?: boolean;
  className?: string;
}

// Color configurations
const COLOR_CONFIGS = {
  blue: {
    icon: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    trend: 'text-blue-600 dark:text-blue-400'
  },
  green: {
    icon: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    trend: 'text-green-600 dark:text-green-400'
  },
  red: {
    icon: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
    trend: 'text-red-600 dark:text-red-400'
  },
  yellow: {
    icon: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
    trend: 'text-yellow-600 dark:text-yellow-400'
  },
  purple: {
    icon: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
    trend: 'text-purple-600 dark:text-purple-400'
  },
  indigo: {
    icon: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20',
    trend: 'text-indigo-600 dark:text-indigo-400'
  }
};

/**
 * AdminMetricCard Component
 * 
 * Displays key metrics with icons, trends, and loading states
 * optimized for administrative dashboards.
 */
export const AdminMetricCard: React.FC<AdminMetricCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'blue',
  loading = false,
  className = ''
}) => {
  const colorConfig = COLOR_CONFIGS[color];

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="mt-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mt-2"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`
                text-sm font-medium
                ${trend.isPositive !== false ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
              `}>
                {trend.isPositive !== false ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        
        <div className={`
          p-3 rounded-lg
          ${colorConfig.icon}
        `}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default AdminMetricCard;