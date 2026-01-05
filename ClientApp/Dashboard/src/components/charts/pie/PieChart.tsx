import React from 'react';
import { cn } from '../../../lib/utils';

export interface PieDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieDataPoint[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  colors?: string[];
  className?: string;
  title?: string;
}

const defaultColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 300,
  height = 300,
  showLabels = false,
  showLegend = true,
  colors = defaultColors,
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

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;

  let currentAngle = -Math.PI / 2; // Start from top

  const slices = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 2 * Math.PI;

    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Calculate path for the slice
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    // Calculate label position
    const labelAngle = startAngle + angle / 2;
    const labelX = centerX + (radius + 20) * Math.cos(labelAngle);
    const labelY = centerY + (radius + 20) * Math.sin(labelAngle);

    currentAngle = endAngle;

    return {
      ...item,
      pathData,
      percentage,
      labelX,
      labelY,
      color: item.color || colors[index % colors.length]
    };
  });

  return (
    <div className={cn('relative', className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}

      <div className="flex flex-col items-center">
        <svg width={width} height={height} className="overflow-visible">
          {slices.map((slice, index) => (
            <g key={`slice-${index}`}>
              {/* Pie slice */}
              <path
                d={slice.pathData}
                fill={slice.color}
                stroke="white"
                strokeWidth={2}
                className="transition-all hover:opacity-80 cursor-pointer"
              />

              {/* Label */}
              {showLabels && slice.percentage > 0.05 && (
                <text
                  x={slice.labelX}
                  y={slice.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm fill-foreground font-medium"
                >
                  {`${(slice.percentage * 100).toFixed(1)}%`}
                </text>
              )}
            </g>
          ))}

          {/* Center circle for donut effect */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.3}
            fill="white"
            stroke="#e5e7eb"
            strokeWidth={2}
          />
        </svg>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {slices.map((slice, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {slice.label} ({(slice.percentage * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;

