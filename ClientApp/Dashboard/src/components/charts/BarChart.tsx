import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { COMMON_CHART_PROPS } from '../../services/chartTheme';

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  title?: string;
  color?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  title,
  color = '#10b981',
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
        <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid {...COMMON_CHART_PROPS.grid} />
          <XAxis
            {...COMMON_CHART_PROPS.xAxis}
            dataKey={xAxisKey}
          />
          <YAxis {...COMMON_CHART_PROPS.yAxis} />
          <Tooltip {...COMMON_CHART_PROPS.tooltip} />
          <Legend iconType="circle" />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};