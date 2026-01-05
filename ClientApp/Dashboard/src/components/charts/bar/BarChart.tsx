import React from 'react';
import { cn } from '../../../lib/utils';

export interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarDataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showValues?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  title?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 400,
  height = 200,
  color = '#3b82f6',
  showValues = false,
  orientation = 'vertical',
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

  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 40;
  const barPadding = 4;

  if (orientation === 'horizontal') {
    const barHeight = (height - 2 * padding) / data.length;
    const scale = (width - 2 * padding - 60) / maxValue;

    return (
      <div className={cn('relative', className)}>
        {title && (
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
        )}

        <svg width={width} height={height}>
          {data.map((item, index) => {
            const barWidth = item.value * scale;
            const y = padding + index * barHeight;

            return (
              <g key={`bar-${index}`}>
                {/* Background bar */}
                <rect
                  x={padding + 60}
                  y={y + barPadding / 2}
                  width={width - 2 * padding - 60}
                  height={barHeight - barPadding}
                  fill="#f3f4f6"
                  rx={2}
                />

                {/* Data bar */}
                <rect
                  x={padding + 60}
                  y={y + barPadding / 2}
                  width={barWidth}
                  height={barHeight - barPadding}
                  fill={item.color || color}
                  rx={2}
                  className="transition-all hover:opacity-80"
                />

                {/* Label */}
                <text
                  x={padding + 50}
                  y={y + barHeight / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-sm fill-muted-foreground"
                >
                  {item.label}
                </text>

                {/* Value */}
                {showValues && (
                  <text
                    x={padding + 60 + barWidth + 8}
                    y={y + barHeight / 2}
                    dominantBaseline="middle"
                    className="text-sm fill-foreground font-medium"
                  >
                    {item.value}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // Vertical orientation
  const barWidth = (width - 2 * padding) / data.length;
  const scale = (height - 2 * padding - 40) / maxValue;

  return (
    <div className={cn('relative', className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}

      <svg width={width} height={height}>
        {data.map((item, index) => {
          const barHeight = item.value * scale;
          const x = padding + index * barWidth;

          return (
            <g key={`bar-${index}`}>
              {/* Data bar */}
              <rect
                x={x + barPadding / 2}
                y={height - padding - barHeight}
                width={barWidth - barPadding}
                height={barHeight}
                fill={item.color || color}
                rx={2}
                className="transition-all hover:opacity-80"
              />

              {/* Value */}
              {showValues && barHeight > 20 && (
                <text
                  x={x + barWidth / 2}
                  y={height - padding - barHeight + 15}
                  textAnchor="middle"
                  className="text-xs fill-white font-medium"
                >
                  {item.value}
                </text>
              )}

              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 15}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {item.label.length > 8 ? `${item.label.substring(0, 8)}...` : item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;

