import React from 'react';
import { cn } from '../../../lib/utils';
import { Skeleton } from './Skeleton';

interface ChartSkeletonProps {
  variant?: 'line' | 'bar' | 'pie' | 'area';
  width?: number;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  variant = 'line',
  width = 400,
  height = 200,
  className,
  showLegend = true
}) => {
  const renderLineChartSkeleton = () => (
    <div className={cn('space-y-2', className)} style={{ width, height }}>
      {/* Chart area */}
      <div className="flex-1 bg-muted/30 rounded-lg p-4">
        {/* Y-axis labels */}
        <div className="flex justify-between items-end h-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-end space-y-2">
              <Skeleton width={20} height={8} />
              <div className="w-px h-full bg-muted-foreground/20" />
            </div>
          ))}
        </div>

        {/* Chart lines */}
        <div className="relative mt-4">
          <svg width="100%" height="120" className="overflow-visible">
            {/* Grid lines */}
            {Array.from({ length: 4 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 30}
                x2="100%"
                y2={i * 30}
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground/20"
              />
            ))}

            {/* Animated line path */}
            <path
              d="M0,80 Q25,60 50,70 T100,50 Q125,40 150,45 T200,35 Q225,30 250,40 T300,25 Q325,20 350,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary/30 animate-pulse"
            />

            {/* Data points */}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={i}
                cx={i * 45}
                cy={40 + Math.sin(i) * 20}
                r="3"
                className="fill-primary/30 animate-pulse"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex justify-center gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton width={12} height={12} className="rounded-full" />
              <Skeleton width={40} height={8} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBarChartSkeleton = () => (
    <div className={cn('space-y-2', className)} style={{ width, height }}>
      <div className="bg-muted/30 rounded-lg p-4 h-full flex flex-col">
        {/* Bars */}
        <div className="flex-1 flex items-end justify-between gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <Skeleton
                width="100%"
                height={`${40 + Math.random() * 60}%`}
                className="animate-pulse"
              />
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} width={24} height={8} />
          ))}
        </div>
      </div>

      {showLegend && (
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <Skeleton width={12} height={12} className="rounded-full" />
            <Skeleton width={50} height={8} />
          </div>
        </div>
      )}
    </div>
  );

  const renderPieChartSkeleton = () => (
    <div className={cn('flex flex-col items-center space-y-4', className)} style={{ width, height }}>
      {/* Pie chart */}
      <div className="relative">
        <svg width={Math.min(width * 0.6, 200)} height={Math.min(width * 0.6, 200)} className="animate-pulse">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="none"
            stroke="currentColor"
            strokeWidth="20"
            className="text-muted-foreground/30"
            strokeDasharray="60 40"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="none"
            stroke="currentColor"
            strokeWidth="20"
            className="text-primary/30"
            strokeDasharray="40 60"
          />
        </svg>

        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton width={40} height={40} className="rounded-full" />
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton width={12} height={12} className="rounded-full" />
              <Skeleton width={50} height={8} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAreaChartSkeleton = () => (
    <div className={cn('space-y-2', className)} style={{ width, height }}>
      <div className="bg-muted/30 rounded-lg p-4">
        {/* Area fill */}
        <div className="relative h-32">
          <svg width="100%" height="100%" className="overflow-visible">
            {/* Grid */}
            {Array.from({ length: 4 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 25}
                x2="100%"
                y2={i * 25}
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground/20"
              />
            ))}

            {/* Area path */}
            <path
              d="M0,80 L0,80 Q20,70 40,75 T80,65 Q100,60 120,70 T160,55 Q180,50 200,60 T240,45 Q260,40 280,55 T320,35 Q340,30 360,45 L360,120 L0,120 Z"
              fill="currentColor"
              className="text-primary/20 animate-pulse"
            />

            {/* Line */}
            <path
              d="M0,80 Q20,70 40,75 T80,65 Q100,60 120,70 T160,55 Q180,50 200,60 T240,45 Q260,40 280,55 T320,35 Q340,30 360,45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary/40"
            />
          </svg>
        </div>
      </div>

      {showLegend && (
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <Skeleton width={12} height={12} className="rounded-full" />
            <Skeleton width={40} height={8} />
          </div>
        </div>
      )}
    </div>
  );

  switch (variant) {
    case 'bar':
      return renderBarChartSkeleton();
    case 'pie':
      return renderPieChartSkeleton();
    case 'area':
      return renderAreaChartSkeleton();
    default:
      return renderLineChartSkeleton();
  }
};

export default ChartSkeleton;

