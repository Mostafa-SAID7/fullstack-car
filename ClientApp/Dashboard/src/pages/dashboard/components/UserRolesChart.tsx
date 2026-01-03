import React from 'react';
import { ChartCard } from './ChartCard';
import { PieChart } from '../../../components/charts/PieChart';
import { CHART_COLORS } from '../../../services/chartTheme';

interface UserRolesChartProps {
    data: any[];
    loading: boolean;
}

export const UserRolesChart: React.FC<UserRolesChartProps> = ({ data, loading }) => {
    return (
        <ChartCard
            title="User Roles"
            description="Distribution by user type"
            loading={loading}
        >
            <PieChart
                data={data || []}
                dataKey="count"
                nameKey="role"
                height={250}
                colors={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning, CHART_COLORS.danger]}
            />
        </ChartCard>
    );
};
