import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { COMMON_CHART_PROPS } from '../../services/chartTheme';

interface LineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  title?: string;
  color?: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  title,
  color = '#3b82f6',
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
        <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid {...COMMON_CHART_PROPS.grid} />
          <XAxis
            {...COMMON_CHART_PROPS.xAxis}
            dataKey={xAxisKey}
          />
          <YAxis {...COMMON_CHART_PROPS.yAxis} />
          <Tooltip {...COMMON_CHART_PROPS.tooltip} />
          <Legend iconType="circle" />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};