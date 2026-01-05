import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from './Card';
import { cn } from '../../../lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  status?: 'good' | 'warning' | 'critical';
  loading?: boolean;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  changeLabel = 'vs last period',
  icon,
  color = 'blue',
  status,
  loading = false,
  className
}) => {
  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
            <div className="h-12 w-12 bg-muted rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Color classes
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
    gray: 'text-gray-600 bg-gray-50'
  };

  const statusColors = {
    good: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    critical: 'text-red-600 bg-red-50'
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <Minus className="w-4 h-4 text-yellow-600" />;
      case 'critical':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getChangeIcon = () => {
    if (change === undefined) return null;

    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatChange = (changeValue: number) => {
    const sign = changeValue > 0 ? '+' : '';
    return `${sign}${changeValue.toFixed(1)}%`;
  };

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <div className="flex items-baseline space-x-1 mt-1">
              <p className="text-2xl font-bold">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {unit && (
                <span className="text-sm text-muted-foreground">{unit}</span>
              )}
            </div>

            {change !== undefined && (
              <div className="flex items-center space-x-1 mt-2">
                {getChangeIcon()}
                <span className={cn(
                  'text-sm font-medium',
                  change > 0 ? 'text-green-600' :
                  change < 0 ? 'text-red-600' : 'text-gray-600'
                )}>
                  {formatChange(change)} {changeLabel}
                </span>
              </div>
            )}
          </div>

          <div className={cn(
            'flex-shrink-0 p-3 rounded-lg',
            status ? statusColors[status] : colorClasses[color]
          )}>
            {status ? getStatusIcon() : icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;

