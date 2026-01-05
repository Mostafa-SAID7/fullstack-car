import React from 'react';
import { cn } from '../../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'rectangular' | 'text';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  width,
  height,
  animation = 'pulse',
  style,
  ...props
}) => {
  const variants = {
    default: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    text: 'rounded-sm'
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-muted-foreground/10 before:to-transparent',
    none: ''
  };

  const customWidth = typeof width === 'number' ? `${width}px` : width;
  const customHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        'bg-muted',
        variants[variant],
        animations[animation],
        className
      )}
      style={{
        width: customWidth,
        height: customHeight,
        ...style
      }}
      {...props}
    />
  );
};

// Preset skeleton components for common use cases
export const SkeletonText: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="text" height="1em" {...props} />
);

export const SkeletonAvatar: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="circular" width={40} height={40} {...props} />
);

export const SkeletonButton: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="default" height={40} width={120} {...props} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-3 p-4 border border-border rounded-lg', className)}>
    <SkeletonText width="60%" />
    <SkeletonText width="80%" />
    <SkeletonText width="40%" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 4,
  className
}) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className="flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonText key={`header-${i}`} width={`${60 + Math.random() * 40}%`} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex gap-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonText key={`cell-${rowIndex}-${colIndex}`} width={`${50 + Math.random() * 50}%`} />
        ))}
      </div>
    ))}
  </div>
);

// Additional skeleton components
export const StatsSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 4,
  className
}) => (
  <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const ChartSkeleton: React.FC<{
  showTitle?: boolean;
  showLegend?: boolean;
  className?: string;
}> = ({
  showTitle = false,
  showLegend = false,
  className
}) => (
    <div className={cn('p-6 border border-border rounded-lg', className)}>
      {showTitle && <SkeletonText width="200px" className="mb-4" />}
      <Skeleton height="300px" className="mb-4" />
      {showLegend && (
        <div className="flex justify-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton width="12px" height="12px" variant="circular" />
              <SkeletonText width="60px" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

export default Skeleton;

