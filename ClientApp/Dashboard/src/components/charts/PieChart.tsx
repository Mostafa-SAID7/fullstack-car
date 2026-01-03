import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { COMMON_CHART_PROPS, CHART_PALETTE } from '../../services/chartTheme';

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  title?: string;
  colors?: string[];
  height?: number;
}

const colorsPalette = CHART_PALETTE;

export const PieChart: React.FC<PieChartProps> = ({
  data,
  dataKey,
  nameKey,
  title,
  colors = colorsPalette,
  height = 300
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip {...COMMON_CHART_PROPS.tooltip} />
          <Legend iconType="circle" />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};