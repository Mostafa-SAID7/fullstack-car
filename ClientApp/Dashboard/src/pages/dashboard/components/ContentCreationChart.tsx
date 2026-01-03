import React from 'react';
import { ChartCard } from './ChartCard';
import { BarChart } from '../../../components/charts/BarChart';
import { CHART_COLORS } from '../../../services/chartTheme';

interface ContentCreationChartProps {
    data: any;
    loading: boolean;
}

export const ContentCreationChart: React.FC<ContentCreationChartProps> = ({ data, loading }) => {
    const chartData = data?.labels.map((label: string, index: number) => ({
        month: label,
        posts: data.datasets[0].data[index]
    })) || [];

    return (
        <ChartCard
            title="Content Creation"
            subtitle="Posts created per month"
            loading={loading}
        >
            <BarChart
                data={chartData}
                dataKey="posts"
                xAxisKey="month"
                color={CHART_COLORS.secondary}
                height={300}
            />
        </ChartCard>
    );
};
