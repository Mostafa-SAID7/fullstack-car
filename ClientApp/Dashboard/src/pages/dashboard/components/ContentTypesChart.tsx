import React from 'react';
import { ChartCard } from './ChartCard';
import { PieChart } from '../../../components/charts/PieChart';
import { CHART_COLORS } from '../../../services/chartTheme';

interface ContentTypesChartProps {
    data: any[];
    loading: boolean;
}

export const ContentTypesChart: React.FC<ContentTypesChartProps> = ({ data, loading }) => {
    return (
        <ChartCard
            title="Content Types"
            subtitle="Posts by content type"
            loading={loading}
        >
            <PieChart
                data={data || []}
                dataKey="count"
                nameKey="type"
                height={250}
                colors={[CHART_COLORS.success, CHART_COLORS.primary, CHART_COLORS.warning, CHART_COLORS.danger]}
            />
        </ChartCard>
    );
};
