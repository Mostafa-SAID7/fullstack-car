import React from 'react';
import { ChartCard } from './ChartCard';
import { PieChart } from '../../../components/charts/pie/PieChart';
import { CHART_COLORS } from '../../../services/theme/chart-theme';

interface RevenueSourcesChartProps {
    data: any;
    loading: boolean;
}

export const RevenueSourcesChart: React.FC<RevenueSourcesChartProps> = ({ data, loading }) => {
    const chartData = data?.labels.map((label: string, index: number) => ({
        label: label,
        value: data.datasets[0].data[index]
    })) || [];

    return (
        <ChartCard
            title="Revenue Sources"
            description="Distribution by income stream"
            loading={loading}
        >
            <PieChart
                data={chartData}
                height={300}
                colors={[CHART_COLORS.success, CHART_COLORS.primary, CHART_COLORS.warning, CHART_COLORS.info]}
            />
        </ChartCard>
    );
};
