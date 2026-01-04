import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { COMMON_CHART_PROPS } from '../../services/chartTheme';

interface AreaChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  title?: string;
  color?: string;
  height?: number;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  title,
  color = '#8b5cf6',
  height = 300
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid {...COMMON_CHART_PROPS.grid} />
          <XAxis
            {...COMMON_CHART_PROPS.xAxis}
            dataKey={xAxisKey}
          />
          <YAxis {...COMMON_CHART_PROPS.yAxis} />
          <Tooltip {...COMMON_CHART_PROPS.tooltip} />
          <Legend iconType="circle" />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`${color}33`}
            strokeWidth={3}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};