import React from 'react';
import { ChartCard } from './ChartCard';
import { AreaChart } from '../../../components/charts/area/AreaChart';
import { CHART_COLORS } from '../../../components/services/chart-theme';

interface RevenueTrendChartProps {
    data: any;
    loading: boolean;
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data, loading }) => {
    const chartData = data?.labels.map((label: string, index: number) => ({
        x: label,
        y: data.datasets[0].data[index]
    })) || [];

    return (
        <ChartCard
            title="Revenue Trend"
            description="Monthly revenue performance"
            loading={loading}
        >
            <AreaChart
                data={chartData}
                color={CHART_COLORS.success}
                height={300}
            />
        </ChartCard>
    );
};
