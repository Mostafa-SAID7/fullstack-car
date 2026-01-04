import React from 'react';
import { ChartCard } from './ChartCard';
import { PieChart } from '../../../components/charts/PieChart';
import { CHART_COLORS } from '../../../services/chartTheme';

interface SystemHealthChartProps {
    data: any;
    loading: boolean;
}

export const SystemHealthChart: React.FC<SystemHealthChartProps> = ({ data, loading }) => {
    const chartData = data?.labels.map((label: string, index: number) => ({
        component: label,
        usage: data.datasets[0].data[index]
    })) || [];

    return (
        <ChartCard
            title="System Health"
            description="Resource usage overview"
            loading={loading}
        >
            <PieChart
                data={chartData}
                dataKey="usage"
                nameKey="component"
                height={300}
                colors={[CHART_COLORS.danger, CHART_COLORS.warning, CHART_COLORS.success, CHART_COLORS.primary]}
            />
        </ChartCard>
    );
};
