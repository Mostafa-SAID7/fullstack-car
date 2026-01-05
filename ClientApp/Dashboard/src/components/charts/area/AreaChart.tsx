import React from 'react';
import { cn } from '../../../lib/utils';

export interface AreaDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface AreaChartProps {
  data: AreaDataPoint[];
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  showGrid?: boolean;
  showDots?: boolean;
  className?: string;
  title?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  width = 400,
  height = 200,
  color = '#3b82f6',
  fillOpacity = 0.3,
  strokeWidth = 2,
  showGrid = true,
  showDots = false,
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

  // Create area path
  const linePath = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

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

        {/* Area fill */}
        <path
          d={areaPath}
          fill={color}
          fillOpacity={fillOpacity}
        />

        {/* Line */}
        <path
          d={linePath}
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
            r={3}
            fill={color}
            stroke="white"
            strokeWidth={2}
            className="hover:r-4 transition-all cursor-pointer"
          />
        ))}
      </svg>
    </div>
  );
};

export default AreaChart;

