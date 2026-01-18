import React from 'react';
import { ChartCard } from './ChartCard';
import { LineChart } from '../../../components/charts/line/LineChart';
import { CHART_COLORS } from '../../../services/theme/chart-theme';

interface UserGrowthChartProps {
    data: any;
    loading: boolean;
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data, loading }) => {
    const chartData = data?.labels.map((label: string, index: number) => ({
        x: label,
        y: data.datasets[0].data[index]
    })) || [];

    return (
        <ChartCard
            title="User Growth"
            description="Monthly new user registrations"
            loading={loading}
        >
            <LineChart
                data={chartData}
                color={CHART_COLORS.primary}
                height={300}
            />
        </ChartCard>
    );
};
