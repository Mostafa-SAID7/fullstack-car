import React from 'react';
import { ChartCard } from './ChartCard';
import { BarChart } from '../../../components/charts/bar/BarChart';
import { CHART_COLORS } from '../../../services/theme/chart-theme';

interface ContentCreationChartProps {
    data: any;
    loading: boolean;
}

export const ContentCreationChart: React.FC<ContentCreationChartProps> = ({ data, loading }) => {
    const chartData = data?.labels.map((label: string, index: number) => ({
        x: label,
        y: data.datasets[0].data[index]
    })) || [];

    return (
        <ChartCard
            title="Content Creation"
            description="Posts created per month"
            loading={loading}
        >
            <BarChart
                data={chartData}
                color={CHART_COLORS.secondary}
                height={300}
            />
        </ChartCard>
    );
};
