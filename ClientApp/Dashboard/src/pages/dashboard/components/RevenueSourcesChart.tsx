import React from 'react';
import { ChartCard } from './ChartCard';
import { PieChart } from '../../../components/charts/PieChart';
import { CHART_COLORS } from '../../../services/chartTheme';

interface RevenueSourcesChartProps {
    data: any[];
    loading: boolean;
}

export const RevenueSourcesChart: React.FC<RevenueSourcesChartProps> = ({ data, loading }) => {
    return (
        <ChartCard
            title="Revenue Sources"
            subtitle="Income by source"
            loading={loading}
        >
            <PieChart
                data={data || []}
                dataKey="amount"
                nameKey="source"
                height={250}
                colors={[CHART_COLORS.success, CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning]}
            />
        </ChartCard>
    );
};
