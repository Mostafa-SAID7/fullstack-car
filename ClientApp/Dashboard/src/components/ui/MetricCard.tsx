import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from './Card';
import { StatsSkeleton } from './Skeleton';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color?: string;
  status?: 'good' | 'warning' | 'critical';
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon,
  color = 'blue',
  status,
  loading = false
}) => {
  if (loading) {
    return <StatsSkeleton count={1} />;
  }

  // Color classes for different themes
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-50',
    green: 'text-green-500 bg-green-50',
    purple: 'text-purple-500 bg-purple-50',
    orange: 'text-orange-500 bg-orange-50',
    red: 'text-red-500 bg-red-50'
  };

  const statusColors = {
    good: 'text-green-500 bg-green-50',
    warning: 'text-yellow-500 bg-yellow-50',
    critical: 'text-red-500 bg-red-50'
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Determine which layout to use based on props
  const isPerformanceCard = status !== undefined;
  const isOnePageCard = color !== 'blue' && !status;

  return (
    <Card>
      <CardContent className="pt-4 sm:pt-6">
        {isPerformanceCard ? (
          // Performance Monitoring Layout
          <>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-full ${statusColors[status!]}`}>
                {icon}
              </div>
              {getStatusIcon()}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold mt-1">
                {value}{unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
              </p>
              {change !== undefined && (
                <div className="flex items-center gap-1 mt-2">
                  {change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {Math.abs(change)}% vs last period
                  </span>
                </div>
              )}
            </div>
          </>
        ) : isOnePageCard ? (
          // OnePage Analytics Layout
          <>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
                {icon}
              </div>
              {change !== undefined && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  change > 0 ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                  {Math.abs(change)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold mt-1">
                {value}{unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
              </p>
            </div>
          </>
        ) : (
          // Default/Site Analytics Layout
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">{value}</p>
              {change !== undefined && (
                <div className="flex items-center gap-1 mt-1">
                  {change > 0 ? (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs sm:text-sm font-medium ${
                    change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {Math.abs(change)}% {changeLabel || 'vs last period'}
                  </span>
                </div>
              )}
            </div>
            <div className="p-2 sm:p-3 bg-primary/10 rounded-full flex-shrink-0 ml-2">
              {icon}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
