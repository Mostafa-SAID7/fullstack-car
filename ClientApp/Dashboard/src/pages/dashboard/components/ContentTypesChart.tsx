import React from 'react';
import { ChartCard } from './ChartCard';
import { PieChart } from '../../../components/charts/pie/PieChart';
import { CHART_COLORS } from '../../../components/services/chart-theme';

interface ContentTypesChartProps {
    data: any;
    loading: boolean;
}

export const ContentTypesChart: React.FC<ContentTypesChartProps> = ({ data, loading }) => {
    const chartData = data?.labels.map((label: string, index: number) => ({
        label: label,
        value: data.datasets[0].data[index]
    })) || [];

    return (
        <ChartCard
            title="Content Distribution"
            description="Content types and popularity"
            loading={loading}
        >
            <PieChart
                data={chartData}
                height={300}
                colors={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.success, CHART_COLORS.warning]}
            />
        </ChartCard>
    );
};
