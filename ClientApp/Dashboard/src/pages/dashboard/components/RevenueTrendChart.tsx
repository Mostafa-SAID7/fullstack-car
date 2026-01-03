import React from 'react';
import { ChartCard } from './ChartCard';
import { AreaChart } from '../../../components/charts/AreaChart';
import { CHART_COLORS } from '../../../services/chartTheme';

interface RevenueTrendChartProps {
    data: any;
    loading: boolean;
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data, loading }) => {
    const chartData = data?.labels.map((label: string, index: number) => ({
        month: label,
        revenue: data.datasets[0].data[index]
    })) || [];

    return (
        <ChartCard
            title="Revenue Trend"
            subtitle="Monthly revenue performance"
            loading={loading}
        >
            <AreaChart
                data={chartData}
                dataKey="revenue"
                xAxisKey="month"
                color={CHART_COLORS.success}
                height={300}
            />
        </ChartCard>
    );
};
