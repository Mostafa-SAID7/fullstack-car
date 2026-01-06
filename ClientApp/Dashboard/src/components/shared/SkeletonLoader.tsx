import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-muted';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could be enhanced with custom wave animation
    none: ''
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Predefined skeleton components for common use cases
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-card border border-border rounded-lg overflow-hidden">
    {/* Header */}
    <div className="bg-muted/50 p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} height="1rem" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="p-4 border-t border-border">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, colIndex) => (
            <Skeleton key={colIndex} height="1rem" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(count)].map((_, index) => (
      <div key={index} className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton height="1rem" width="60%" className="mb-2" />
            <Skeleton height="2rem" width="80%" className="mb-2" />
            <Skeleton height="0.75rem" width="40%" />
          </div>
          <Skeleton variant="circular" width="3rem" height="3rem" />
        </div>
      </div>
    ))}
  </div>
);

export const PageHeaderSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <Skeleton variant="circular" width="4rem" height="4rem" />
          <div>
            <Skeleton height="2.5rem" width="20rem" className="mb-2" />
            <Skeleton height="1rem" width="6rem" className="mb-3" />
            <Skeleton height="1.25rem" width="30rem" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton height="2.5rem" width="6rem" variant="rounded" />
          <Skeleton height="2.5rem" width="6rem" variant="rounded" />
          <Skeleton height="2.5rem" width="8rem" variant="rounded" />
        </div>
      </div>
    </div>

    {/* Stats Cards */}
    <CardSkeleton count={4} />
  </div>
);

export const SearchFiltersSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row gap-4">
      <Skeleton height="2.5rem" className="flex-1" variant="rounded" />
      <Skeleton height="2.5rem" width="6rem" variant="rounded" />
    </div>
  </div>
);

export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 6 }) => (
  <div className="space-y-6">
    {[...Array(fields)].map((_, index) => (
      <div key={index}>
        <Skeleton height="1rem" width="8rem" className="mb-2" />
        <Skeleton height="2.5rem" variant="rounded" />
      </div>
    ))}
    <div className="flex gap-3 pt-4">
      <Skeleton height="2.5rem" width="6rem" variant="rounded" />
      <Skeleton height="2.5rem" width="6rem" variant="rounded" />
    </div>
  </div>
);

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="space-y-4">
    {[...Array(items)].map((_, index) => (
      <div key={index} className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
        <Skeleton variant="circular" width="3rem" height="3rem" />
        <div className="flex-1">
          <Skeleton height="1.25rem" width="60%" className="mb-2" />
          <Skeleton height="1rem" width="40%" />
        </div>
        <Skeleton height="2rem" width="5rem" variant="rounded" />
      </div>
    ))}
  </div>
);

export default Skeleton;