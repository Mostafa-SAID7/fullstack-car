export const CHART_COLORS = {
    primary: '#3b82f6', // blue-500
    secondary: '#8b5cf6', // purple-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
    info: '#06b6d4', // cyan-500
    indigo: '#6366f1', // indigo-500
};

export const CHART_PALETTE = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.danger,
    CHART_COLORS.info,
    CHART_COLORS.indigo,
];

export const COMMON_CHART_PROPS = {
    tooltip: {
        contentStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            fontSize: '12px',
        },
        itemStyle: {
            paddingTop: '2px',
            paddingBottom: '2px',
        }
    },
    grid: {
        strokeDasharray: '3 3',
        className: 'opacity-30',
        vertical: false,
    },
    xAxis: {
        className: 'text-[10px] text-gray-500',
        tickLine: false,
        axisLine: false,
    },
    yAxis: {
        className: 'text-[10px] text-gray-500',
        tickLine: false,
        axisLine: false,
    },
};
