import React from 'react';
import { cn } from '../../lib/utils';

// Base Skeleton component
export const Skeleton: React.FC<{
  className?: string;
  variant?: 'default' | 'rounded' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  enhanced?: boolean;
  style?: React.CSSProperties;
}> = ({
  className,
  variant = 'default',
  animation = 'pulse',
  enhanced = false,
  style
}) => {
  const baseClasses = enhanced ? 'skeleton-enhanced' : 'bg-muted animate-pulse';

  const variantClasses = {
    default: '',
    rounded: 'rounded-md',
    circular: 'rounded-full'
  };

  const animationClasses = {
    pulse: enhanced ? '' : 'animate-pulse',
    wave: enhanced ? '' : 'animate-pulse', // Enhanced uses CSS animation
    none: ''
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
};

// Card Skeleton
export const CardSkeleton: React.FC<{
  className?: string;
  showAvatar?: boolean;
  showActions?: boolean;
  lines?: number;
}> = ({
  className,
  showAvatar = false,
  showActions = false,
  lines = 3
}) => (
  <div className={cn("bg-card border border-border rounded-2xl p-6", className)}>
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3 flex-1">
        {showAvatar && <Skeleton className="w-10 h-10" variant="circular" enhanced />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" enhanced />
          <Skeleton className="h-4 w-1/2" enhanced />
        </div>
      </div>
      {showActions && <Skeleton className="w-8 h-8" variant="circular" enhanced />}
    </div>

    {/* Content */}
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
          enhanced
        />
      ))}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
      <Skeleton className="h-8 w-20" enhanced />
      <Skeleton className="h-8 w-16" enhanced />
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className
}) => (
  <div className={cn("bg-card border border-border rounded-2xl overflow-hidden", className)}>
    {/* Header */}
    {showHeader && (
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    )}

    {/* Table Header */}
    <div className="border-b border-border bg-muted/30 px-6 py-3">
      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>

    {/* Table Rows */}
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Avatar/Status */}
            <Skeleton className="w-8 h-8" variant="circular" />

            {/* Text columns */}
            {Array.from({ length: columns - 2 }).map((_, colIndex) => (
              <div key={colIndex} className="space-y-1">
                <Skeleton className="h-4 w-full" />
                {colIndex === 0 && <Skeleton className="h-3 w-2/3" />}
              </div>
            ))}

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              <Skeleton className="w-6 h-6" variant="circular" />
              <Skeleton className="w-6 h-6" variant="circular" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="border-t border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  </div>
);

// Chart Skeleton
export const ChartSkeleton: React.FC<{
  className?: string;
  showTitle?: boolean;
  showLegend?: boolean;
  variant?: 'line' | 'bar' | 'pie' | 'area';
}> = ({
  className,
  showTitle = true,
  showLegend = true,
  variant = 'line'
}) => (
  <div className={cn("bg-card border border-border rounded-2xl p-6", className)}>
    {/* Title */}
    {showTitle && (
      <div className="mb-6">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    )}

    {/* Chart Area */}
    <div className="relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>

      {/* Chart content */}
      <div className="ml-12 mr-4">
        {variant === 'pie' ? (
          // Pie chart skeleton
          <div className="relative flex items-center justify-center h-64">
            <Skeleton className="w-32 h-32" variant="circular" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        ) : (
          // Line/Bar/Area chart skeleton
          <div className="h-64 space-y-2">
            {/* Grid lines */}
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-px w-full opacity-20" />
            ))}

            {/* Chart bars/lines */}
            <div className="flex items-end justify-between h-full pb-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  {variant === 'bar' ? (
                    <Skeleton
                      className="w-8 mb-2"
                      style={{ height: `${Math.random() * 60 + 20}%` }}
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      {/* Simulated line chart */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                        <Skeleton className="w-2 h-2" variant="circular" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* X-axis labels */}
      <div className="mt-4 flex justify-between ml-12 mr-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>

    {/* Legend */}
    {showLegend && (
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-3 h-3" variant="circular" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    )}
  </div>
);

// Stats Cards Skeleton
export const StatsSkeleton: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 4, className }) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-10 h-10" variant="circular" enhanced />
          <Skeleton className="w-12 h-6" variant="rounded" enhanced />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-16" enhanced />
          <Skeleton className="h-4 w-24" enhanced />
        </div>
      </div>
    ))}
  </div>
);

// Form Skeleton
export const FormSkeleton: React.FC<{
  fields?: number;
  showButtons?: boolean;
  className?: string;
}> = ({
  fields = 4,
  showButtons = true,
  className
}) => (
  <div className={cn("bg-card border border-border rounded-2xl p-6 space-y-6", className)}>
    {/* Title */}
    <div className="space-y-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>

    {/* Form Fields */}
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" variant="rounded" />
        </div>
      ))}
    </div>

    {/* Buttons */}
    {showButtons && (
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-24" variant="rounded" />
        <Skeleton className="h-10 w-20" variant="rounded" />
      </div>
    )}
  </div>
);

// List Skeleton
export const ListSkeleton: React.FC<{
  items?: number;
  showAvatars?: boolean;
  className?: string;
}> = ({
  items = 5,
  showAvatars = true,
  className
}) => (
  <div className={cn("bg-card border border-border rounded-2xl divide-y divide-border", className)}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="p-4 flex items-center gap-4">
        {showAvatars && <Skeleton className="w-10 h-10" variant="circular" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="w-16 h-6" variant="rounded" />
      </div>
    ))}
  </div>
);

// Profile Skeleton
export const ProfileSkeleton: React.FC<{
  className?: string;
  showCover?: boolean;
}> = ({
  className,
  showCover = false
}) => (
  <div className={cn("bg-card border border-border rounded-2xl overflow-hidden", className)}>
    {/* Cover */}
    {showCover && <Skeleton className="h-32 w-full" />}

    <div className="p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Skeleton className="w-20 h-20" variant="circular" />

        <div className="flex-1 space-y-3">
          {/* Name and title */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <Skeleton className="h-6 w-8 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="text-center">
              <Skeleton className="h-6 w-8 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="text-center">
              <Skeleton className="h-6 w-8 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Skeleton className="h-9 w-20" variant="rounded" />
        <Skeleton className="h-9 w-24" variant="rounded" />
      </div>
    </div>
  </div>
);

// Media Grid Skeleton
export const MediaGridSkeleton: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 12, className }) => (
  <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4", className)}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="aspect-square bg-card border border-border rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    ))}
  </div>
);

// Content Skeleton
export const ContentSkeleton: React.FC<{
  className?: string;
  showAuthor?: boolean;
  showImage?: boolean;
}> = ({
  className,
  showAuthor = true,
  showImage = true
}) => (
  <div className={cn("bg-card border border-border rounded-2xl overflow-hidden", className)}>
    {/* Image */}
    {showImage && <Skeleton className="w-full h-48" />}

    <div className="p-6">
      {/* Title */}
      <Skeleton className="h-6 w-3/4 mb-3" />

      {/* Content */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Author */}
      {showAuthor && (
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Skeleton className="w-8 h-8" variant="circular" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-8 w-20" variant="rounded" />
      </div>
    </div>
  </div>
);

// Dashboard Overview Skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-32" variant="rounded" />
    </div>

    {/* Stats Cards */}
    <StatsSkeleton />

    {/* Analytics Controls */}
    <div className="bg-card/50 border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32" variant="rounded" />
          <Skeleton className="h-10 w-32" variant="rounded" />
        </div>
      </div>
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton showTitle showLegend variant="bar" />
      <ChartSkeleton showTitle showLegend variant="line" />
    </div>
  </div>
);

// Page Skeleton (generic page layout)
export const PageSkeleton: React.FC<{
  title?: boolean;
  subtitle?: boolean;
  actions?: boolean;
  content?: 'table' | 'cards' | 'form' | 'dashboard';
}> = ({
  title = true,
  subtitle = true,
  actions = true,
  content = 'table'
}) => (
  <div className="space-y-6">
    {/* Header */}
    {(title || subtitle || actions) && (
      <div className="flex items-center justify-between">
        <div>
          {title && <Skeleton className="h-8 w-64 mb-2" />}
          {subtitle && <Skeleton className="h-4 w-96" />}
        </div>
        {actions && <Skeleton className="h-10 w-32" variant="rounded" />}
      </div>
    )}

    {/* Content */}
    {content === 'table' && <TableSkeleton />}
    {content === 'cards' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )}
    {content === 'form' && <FormSkeleton />}
    {content === 'dashboard' && <DashboardSkeleton />}
  </div>
);
