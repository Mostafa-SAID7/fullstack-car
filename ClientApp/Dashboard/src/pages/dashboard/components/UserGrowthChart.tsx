import React from 'react';
import { ChartCard } from './ChartCard';
import { LineChart } from '../../../components/charts/LineChart';
import { CHART_COLORS } from '../../../services/chartTheme';

interface UserGrowthChartProps {
    data: any;
    loading: boolean;
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data, loading }) => {
    const chartData = data?.labels.map((label: string, index: number) => ({
        month: label,
        users: data.datasets[0].data[index]
    })) || [];

    return (
        <ChartCard
            title="User Growth"
            description="Monthly new user registrations"
            loading={loading}
        >
            <LineChart
                data={chartData}
                dataKey="users"
                xAxisKey="month"
                color={CHART_COLORS.primary}
                height={300}
            />
        </ChartCard>
    );
};
