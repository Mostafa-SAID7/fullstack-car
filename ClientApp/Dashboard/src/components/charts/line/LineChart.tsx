import React from 'react';
import { cn } from '../../../lib/utils';

export interface DataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  showDots?: boolean;
  className?: string;
  title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 400,
  height = 200,
  color = '#3b82f6',
  strokeWidth = 2,
  showGrid = true,
  showDots = true,
  className,
  title
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ width, height }}>
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const padding = 20;

  const xScale = (width - 2 * padding) / (data.length - 1);
  const yScale = (height - 2 * padding) / (maxY - minY || 1);

  const points = data.map((point, index) => {
    const { x: _x, y: _y, ...rest } = point as any;
    return {
      ...rest,
      x: padding + index * xScale,
      y: height - padding - ((point.y - minY) * yScale)
    };
  });

  const pathData = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className={cn('relative', className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}

      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && (
          <>
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <line
                key={`h-${index}`}
                x1={padding}
                y1={padding + ratio * (height - 2 * padding)}
                x2={width - padding}
                y2={padding + ratio * (height - 2 * padding)}
                stroke="#e5e7eb"
                strokeWidth={1}
                strokeDasharray="2,2"
              />
            ))}

            {/* Vertical grid lines */}
            {data.map((_, index) => (
              <line
                key={`v-${index}`}
                x1={padding + index * xScale}
                y1={padding}
                x2={padding + index * xScale}
                y2={height - padding}
                stroke="#e5e7eb"
                strokeWidth={1}
                strokeDasharray="2,2"
              />
            ))}
          </>
        )}

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots && points.map((point, index) => (
          <circle
            key={`dot-${index}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
            className="hover:r-6 transition-all cursor-pointer"
          />
        ))}
      </svg>
    </div>
  );
};

export default LineChart;
