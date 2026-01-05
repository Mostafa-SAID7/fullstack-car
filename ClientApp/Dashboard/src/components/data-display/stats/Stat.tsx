import React from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../layout/cards/Card';

export interface StatProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
    direction?: 'up' | 'down' | 'neutral';
  };
  variant?: 'default' | 'compact' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface StatGroupProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Stat: React.FC<StatProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  variant = 'default',
  size = 'md',
  className
}) => {
  const getTrendColor = (direction?: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (direction?: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  const sizes = {
    sm: {
      title: 'text-sm',
      value: 'text-lg',
      description: 'text-xs',
      icon: 'w-4 h-4'
    },
    md: {
      title: 'text-sm',
      value: 'text-2xl',
      description: 'text-sm',
      icon: 'w-5 h-5'
    },
    lg: {
      title: 'text-base',
      value: 'text-3xl',
      description: 'text-sm',
      icon: 'w-6 h-6'
    }
  };

  const currentSize = sizes[size];

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3 p-3 rounded-lg border bg-card', className)}>
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <div className={cn('text-primary', currentSize.icon)}>
                {icon}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-muted-foreground truncate', currentSize.title)}>
            {title}
          </p>
          <p className={cn('font-bold text-foreground', currentSize.value)}>
            {value}
          </p>
        </div>

        {trend && (
          <div className={cn('flex items-center gap-1 text-sm', getTrendColor(trend.direction))}>
            <span>{getTrendIcon(trend.direction)}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className={cn('text-muted-foreground', currentSize.title)}>
              {title}
            </CardTitle>
            {icon && (
              <div className={cn('text-muted-foreground', currentSize.icon)}>
                {icon}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className={cn('font-bold text-foreground', currentSize.value)}>
              {value}
            </div>

            {description && (
              <p className={cn('text-muted-foreground', currentSize.description)}>
                {description}
              </p>
            )}

            {trend && (
              <div className={cn('flex items-center gap-1 text-sm', getTrendColor(trend.direction))}>
                <span>{getTrendIcon(trend.direction)}</span>
                <span>{Math.abs(trend.value)}% {trend.label || 'from last period'}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={cn('text-muted-foreground font-medium', currentSize.title)}>
              {title}
            </p>
            <p className={cn('font-bold text-foreground', currentSize.value)}>
              {value}
            </p>
            {description && (
              <p className={cn('text-muted-foreground', currentSize.description)}>
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {icon && (
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <div className={cn('text-primary', currentSize.icon)}>
                  {icon}
                </div>
              </div>
            )}

            {trend && (
              <div className={cn('flex items-center gap-1 text-sm', getTrendColor(trend.direction))}>
                <span>{getTrendIcon(trend.direction)}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatGroup: React.FC<StatGroupProps> = ({
  children,
  columns = 1,
  gap = 'md',
  className
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gaps = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={cn(
      'grid',
      gridCols[columns],
      gaps[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Preset stat components for common metrics
export const UserStat: React.FC<Omit<StatProps, 'icon' | 'title'>> = (props) => (
  <Stat
    icon={<UserIcon />}
    title="Total Users"
    {...props}
  />
);

export const RevenueStat: React.FC<Omit<StatProps, 'icon' | 'title'>> = (props) => (
  <Stat
    icon={<DollarIcon />}
    title="Revenue"
    {...props}
  />
);

export const OrderStat: React.FC<Omit<StatProps, 'icon' | 'title'>> = (props) => (
  <Stat
    icon={<ShoppingIcon />}
    title="Orders"
    {...props}
  />
);

export const ConversionStat: React.FC<Omit<StatProps, 'icon' | 'title'>> = (props) => (
  <Stat
    icon={<TrendingIcon />}
    title="Conversion Rate"
    {...props}
  />
);

// Icon components
const UserIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DollarIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const ShoppingIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const TrendingIcon = () => (
  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default Stat;
