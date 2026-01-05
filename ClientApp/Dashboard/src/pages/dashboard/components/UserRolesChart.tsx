import React from 'react';
import { ChartCard } from './ChartCard';
import { PieChart } from '../../../components/charts/pie/PieChart';
import { CHART_COLORS } from '../../../components/services/chart-theme';

interface UserRolesChartProps {
    data: any[];
    loading: boolean;
}

export const UserRolesChart: React.FC<UserRolesChartProps> = ({ data, loading }) => {
    const chartData = data?.map(item => ({
        label: item.role,
        value: item.count
    })) || [];

    return (
        <ChartCard
            title="User Roles"
            description="Distribution by user type"
            loading={loading}
        >
            <PieChart
                data={chartData}
                height={250}
                colors={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning, CHART_COLORS.danger]}
            />
        </ChartCard>
    );
};
