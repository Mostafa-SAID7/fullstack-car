import React from 'react';
import { cn } from '../../../lib/utils';
import { Skeleton } from './Skeleton';

interface StatsSkeletonProps {
  count?: number;
  variant?: 'card' | 'list' | 'grid';
  className?: string;
}

export const StatsSkeleton: React.FC<StatsSkeletonProps> = ({
  count = 4,
  variant = 'card',
  className
}) => {
  if (variant === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-card rounded-lg border">
            <Skeleton width={48} height={48} className="rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton width="60%" height={16} />
              <Skeleton width="40%" height={12} />
            </div>
            <Skeleton width={80} height={24} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <Skeleton width={32} height={32} className="rounded" />
              <Skeleton width={16} height={16} className="rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton width="70%" height={20} />
              <Skeleton width="50%" height={16} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card variant
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <Skeleton width={40} height={40} className="rounded-lg" />
            <Skeleton width={20} height={20} className="rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton width="80%" height={24} />
            <Skeleton width="60%" height={16} />
            <div className="flex items-center space-x-2">
              <Skeleton width={16} height={16} className="rounded" />
              <Skeleton width="40%" height={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSkeleton;

