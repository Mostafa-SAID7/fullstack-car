import React, { useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  title?: string;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  animationDuration?: number;
}

// Enhanced color palette with gradients
const ENHANCED_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#ec4899', // pink
  '#84cc16', // lime
  '#f97316', // orange
];

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const percentage = ((data.value / data.payload.total) * 100).toFixed(1);

    return (
      <div className="bg-card border border-border rounded-xl shadow-xl p-4 min-w-[200px]">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-foreground">{data.name}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Value:</span>
            <span className="font-medium text-foreground">{data.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Percentage:</span>
            <span className="font-medium text-foreground">{percentage}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom legend component
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-muted-foreground">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
  dataKey,
  nameKey,
  title,
  colors = ENHANCED_COLORS,
  height = 400,
  showLegend = true,
  showTooltip = true,
  innerRadius = 70,
  outerRadius = 120,
  animationDuration = 1000
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="w-full">
      {title && (
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-foreground mb-2">
            {title}
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto"></div>
        </div>
      )}

      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        </div>

        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <defs>
              {/* Gradient definitions for enhanced visual appeal */}
              {colors.map((color, index) => (
                <radialGradient key={`gradient-${index}`} id={`pieGradient${index}`}>
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="70%" stopColor={color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                </radialGradient>
              ))}

              {/* Shadow filter */}
              <filter id="pieShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.1)" />
              </filter>
            </defs>

            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={activeIndex !== null ? outerRadius + 10 : outerRadius}
              paddingAngle={2}
              dataKey={dataKey}
              nameKey={nameKey}
              animationBegin={0}
              animationDuration={animationDuration}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              filter="url(#pieShadow)"
            >
              {data.map((_, index) => {
                const isActive = activeIndex === index;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#pieGradient${index % colors.length})`}
                    stroke={isActive ? colors[index % colors.length] : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isActive ? 3 : 1}
                    style={{
                      filter: isActive ? 'brightness(1.1) saturate(1.2)' : 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  />
                );
              })}
            </Pie>

            {showTooltip && (
              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
              />
            )}

            {showLegend && (
              <Legend
                content={<CustomLegend />}
                verticalAlign="bottom"
                height={60}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              {total.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Total
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {data.slice(0, 4).map((item, index) => {
          const percentage = ((item[dataKey] / total) * 100).toFixed(1);
          return (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {percentage}%
                </span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {item[nameKey]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};